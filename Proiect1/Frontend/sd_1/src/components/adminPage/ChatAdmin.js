import React, { Component } from "react";
import "./ChatAdmin.css";
import { BiSolidUserPin } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axiosChat from "../../axiosChat";

class ChatContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeConversation: null,
            currentMessage: "",
            conversations: [],
            notifications: [],
        };
        this.messagesEndRef = React.createRef();
        this.stompClient = null;
    }

    componentDidMount() {
        this.getChatAdmin();
        this.setupWebSocket();
    }

    getChatAdmin() {
        axiosChat.get("chat/admin").then((response) => {
            if (response.data !== null) {
                this.setState({ conversations: response.data });
            }
        }).catch((error) => {
            console.error("Error fetching user ID:", error);
        });
    }

    setupWebSocket() {
        const stompClient = new Client({
            webSocketFactory: () => new SockJS("http://chat.localhost:8071/ws"),
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                stompClient.subscribe("/topic/messages/admin", (message) => {
                    if (message.body) {
                        const newConversations = JSON.parse(message.body);
                        this.setState({ conversations: newConversations });

                        const { activeConversation } = this.state;
                        if (activeConversation) {
                            const activeConversationUpdated = newConversations.find(
                                (conv) => conv.id === activeConversation.id
                            );
                            if (activeConversationUpdated) {
                                console.log(activeConversationUpdated.user);
                                this.seenConversation(activeConversationUpdated.user);
                                this.setState({
                                    activeConversation: activeConversationUpdated
                                }, () => {
                                    this.scrollToBottom();
                                });
                            }
                        }
                    }
                });

                stompClient.subscribe("/topic/messages/user/typing", (response) => {
                    const username = JSON.parse(response.body);
                    const message = `${username.username} start typing`;
                    console.log(message);
                    this.setState({notifications: [message]});
                });

                stompClient.subscribe("/topic/messages/user/notTyping", (response) => {
                    const username = JSON.parse(response.body);
                    const message = `${username.username} stop typing`;
                    console.log(message);
                    this.setState({notifications: [message]});
                });
            },
            onStompError: (error) => {
                console.error("STOMP error:", error);
                this.reconnectWebSocket();
            },
        });

        stompClient.activate();
        this.stompClient = stompClient;
    }

    reconnectWebSocket() {
        console.log("Reconnecting to WebSocket...");
        setTimeout(() => {
            this.setupWebSocket();
        }, 5000);
    }

    componentWillUnmount() {
        if (this.stompClient) {
            this.stompClient.deactivate();
        }
    }

    sendMessage = (message, user) => {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: "/app/send/user",
                body: JSON.stringify({
                    from: "Admin",
                    to: user,
                    text: message,
                    seen: false,
                }),
            });
        } else {
            console.error("Nu există o conexiune WebSocket activă.");
        }
    };

    seenConversation = (user) => {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: "/app/send/seen/admin",
                body: JSON.stringify({
                    username: user,
                }),
            });
        } else {
            console.error("Nu există o conexiune WebSocket activă.");
        }
    };

    typing = () => {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: "/app/send/typing",
                body: JSON.stringify(this.state.activeConversation.user),
            });
        } else {
            console.error("Nu există o conexiune WebSocket activă.");
        }
    };

    notTyping = () => {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: "/app/send/notTyping",
                body: JSON.stringify(this.state.activeConversation.user),
            });
            console.log(this.state.activeConversation.user);
        } else {
            console.error("Nu există o conexiune WebSocket activă.");
        }
    };

    selectConversation = (conversationId) => {
        const selectedConversation = this.state.conversations.find(
            (conv) => conv.id === conversationId
        );

        this.setState({ activeConversation: selectedConversation }, () => {
            this.scrollToBottom();
        });
        this.seenConversation(selectedConversation.user);
    };

    scrollToBottom = () => {
        if (this.messagesEndRef.current) {
            this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    updateActiveConversationMessages = () => {
        const updatedMessages = [
            ...this.state.activeConversation.messages,
            { sender: "Admin", text: this.state.currentMessage },
        ];

        this.setState(
            (prevState) => {
                const updatedActiveConversation = {
                    ...prevState.activeConversation,
                    messages: updatedMessages,
                };

                const updatedConversations = prevState.conversations.map((conversation) =>
                    conversation.id === updatedActiveConversation.id
                        ? updatedActiveConversation
                        : conversation
                );

                return {
                    activeConversation: updatedActiveConversation,
                    conversations: updatedConversations,
                    currentMessage: "",
                };
            },
            () => {
                this.scrollToBottom();
            }
        );
    };


    render() {
        const { activeConversation, conversations, notifications } = this.state;

        return (
            <div className="chatAdmin">
                <div className="notify">
                        {notifications.length === 0 ? <p>No notifications available</p> : <ul>
                        <li>{notifications[0]}</li>
                    </ul>}
                </div>
                <div className="ChatContainer">
                    <div className="BackButton">
                        <Link to="/admin" className="BackLink">
                            <FaArrowLeft/>
                        </Link>
                    </div>
                    <div className="Conversations">
                        {conversations.length > 0 ? (
                            conversations.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    className="Conversation"
                                    onClick={() => this.selectConversation(conversation.id)}
                                >
                                <span className="UserName">
                                    {conversation.user}
                                </span>
                                    <span className="LastMessage">
                                    {conversation.messages[conversation.messages.length - 1].text}
                                </span>
                                </div>
                            ))
                        ) : (
                            <div className="NoConversations">Nu sunt conversații.</div>
                        )}
                    </div>
                    <div className="ChatBox">
                        {activeConversation ? (
                            <div className="ChatWindow">
                                <div className="ChatHeader">
                                    <span className="UserName"><BiSolidUserPin/>{activeConversation.user}</span>
                                </div>
                                <div className="MessagesContainer">
                                    <div className="Messages">
                                        {activeConversation.messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={message.sender === "Admin" ? "Message Admin" : "Message User"}
                                            >
                                                <span>{message.text}</span>
                                                {index === activeConversation.messages.length - 1 && message.sender === "Admin" && message.seen && (
                                                    <div className="SeenText">Seen</div>
                                                )}
                                            </div>
                                        ))}
                                        <div ref={this.messagesEndRef}/>
                                    </div>
                                </div>
                                <div className="ChatInput">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={this.state.currentMessage}
                                        onChange={(e) => this.setState({currentMessage: e.target.value})}
                                        onFocus={() => this.typing()}
                                        onBlur={() => this.notTyping()}
                                    />
                                    <button onClick={() => {
                                        this.sendMessage(this.state.currentMessage, activeConversation.user);
                                        this.updateActiveConversationMessages();
                                    }}>
                                        Send
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="EmptyState">No conversation selected.</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatContainer;
