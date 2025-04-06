import React, {Component} from "react";
import './HomeClient.css';
import axiosInstance from "../../axios";
import axiosDevice from "../../axiosDevice";
import {Link} from "react-router-dom";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axiosSimulator from "../../axiosSimulator";
import history from "../../history";
import axiosSimulator2 from "../../axiosSimulator2";
import {FaComments} from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import axiosChat from "../../axiosChat";

class HomeClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            devices: [],
            username: localStorage.getItem('client'),
            token: localStorage.getItem("token"),
            notifications: [],
            chatVisible: false,
            chatMessages: [],
            currentMessage: ""
        };
        this.stompClient = null;
        this.stompChat = null;
        this.chatMessagesEndRef = React.createRef();
    }

    componentDidMount() {
        this.getID();
        this.getChat();
        this.setupWebSocket();
        this.setupWebSocketChat();
    }

    setupWebSocketChat() {
        const stompChat = new Client({
            webSocketFactory: () => new SockJS("http://chat.localhost:8071/ws"),
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                stompChat.subscribe("/topic/messages/user", (message) => {
                    if (message.body) {
                        try {
                            const { username } = this.state;

                            const chatData = JSON.parse(message.body);

                            if (chatData.user === username) {
                                const chatMessages = chatData.messages;
                                this.setState({ chatMessages }, () => {
                                    this.scrollToBottom();
                                });
                                this.seenConversation(this.state.username);
                                console.log(this.state.username);
                            } else {
                                console.warn('User-ul nu corespunde, mesaje ignorate.');
                            }
                        } catch (error) {
                            console.error("Error parsing JSON:", error);
                        }
                    }
                });

                stompChat.subscribe("/topic/messages/typing", (response) => {
                    const { username } = this.state;
                    const stringWithoutQuotes = response.body.replace(/^"|"$/g, '');

                    const isEqual = stringWithoutQuotes === username;

                    if (isEqual) {
                        const notification = "Admin start typing";
                        this.setState({notifications: [notification]});
                    }
                });

                stompChat.subscribe("/topic/messages/notTyping", (response) => {
                    const { username } = this.state;
                    const stringWithoutQuotes = response.body.replace(/^"|"$/g, '');

                    const isEqual = stringWithoutQuotes === username;

                    if (isEqual) {
                        const notification = "Admin stop typing";
                        this.setState({notifications: [notification]});
                    }
                });

            },
            onStompError: (error) => {
                console.error("STOMP error:", error);
                this.reconnectWebSocketChat();
            },
        });

        stompChat.activate();
        this.stompChat = stompChat;
    }

    reconnectWebSocketChat() {
        console.log('Reconnecting to WebSocket...');
        setTimeout(() => {
            this.setupWebSocketChat();
        }, 5000);
    }

    componentWillUnmount() {
        if (this.stompClient) {
            this.stompClient.deactivate();
        }
        if (this.stompChat) {
            this.stompChat.deactivate();
        }
    }

    seenConversation = (user) => {
        if (this.stompChat && this.stompChat.connected) {
            this.stompChat.publish({
                destination: "/app/send/seen/user",
                body: JSON.stringify({
                    username: user,
                }),
            });
        } else {
            console.error("Nu există o conexiune WebSocket activă.");
        }
    };

    sendMessage = (message) => {
        if (this.stompChat && this.stompChat.connected) {
            const { username } = this.state;
            this.stompChat.publish({
                destination: '/app/send/admin',
                body: JSON.stringify({
                    from: username,
                    to: "Admin",
                    text: message,
                    seen: false
                }),
            });
            console.log("Mesaj trimis:", message);

        } else {
            console.error("Nu există o conexiune WebSocket activă.");
        }
    };

    getID() {
        const { username } = this.state;
        const get = {username};

        axiosInstance.post("user/getID", get, {
            headers: {
                Authorization: `Bearer ${this.state.token}`,
            },
        }).then((response) => {
            if (response.data !== null) {
                this.setState({userId: response.data}, () => {
                    this.getDevices();
                });
            }
        }).catch((error) => {
            console.error("Error fetching user ID:", error);
        });
    }

    getDevices() {
        const {userId} = this.state;
        const get = {userId};

        axiosDevice.post("device/getByUser", get, {
            headers: {
                Authorization: `Bearer ${this.state.token}`,
            },
        }).then((response) => {
            if (response.data !== null) {
                this.setState({devices: response.data});
            }
        }).catch((error) => {
            console.error("Error fetching devices:", error);
        });
    }

    getChat() {
        const { username } = this.state;
        const get = {username};
        axiosChat.post("chat/user", get).then((response) => {
            if (response.data !== null) {
                this.setState({chatMessages: response.data});
            }
        }).catch((error) => {
            console.error("Error fetching user ID:", error);
        });
    }

    setupWebSocket() {
        const stompClient = new Client({
            webSocketFactory: () => new SockJS("http://monitoring-device.localhost:8092/ws"),
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                stompClient.subscribe("/topic/notifications", (message) => {
                    if (message.body) {
                        const [userNotify, notification] = message.body.split("/", 2);
                        if (String(userNotify) === String(this.state.userId)) {
                            this.setState({notifications: [notification]});
                        }
                    }
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
        console.log('Reconnecting to WebSocket...');
        setTimeout(() => {
            this.setupWebSocket();
        }, 5000);
    }

    handleActivate = (deviceId) => {
        const send = {
            id: deviceId
        };
        if (this.state.userId % 2 === 0) {
            axiosSimulator2.post("producer/activate", send).then(response => {
                console.log('Device activated:', response);
            }).catch(error => {
                console.error('Error activating device:', error);
            });
        } else {
            axiosSimulator.post("producer/activate", send).then(response => {
                console.log('Device activated:', response);
            }).catch(error => {
                console.error('Error activating device:', error);
            });
        }
    };

    handleDeactivate = (deviceId) => {
        const send = {
            id: deviceId
        };
        if (this.state.userId % 2 === 0) {
            axiosSimulator2.post("producer/deactivate", send).then(response => {
                console.log('Device activated:', response);
            }).catch(error => {
                console.error('Error activating device:', error);
            });
        } else {
            axiosSimulator.post("producer/deactivate", send).then(response => {
                console.log('Device activated:', response);
            }).catch(error => {
                console.error('Error activating device:', error);
            });
        }
    };

    typing = () => {
        if (this.stompChat && this.stompChat.connected) {
            this.stompChat.publish({
                destination: "/app/send/user/typing",
                body: JSON.stringify({
                    username: this.state.username,
                }),
            });
        } else {
            console.error("Nu există o conexiune WebSocket activă.");
        }
    };

    notTyping = () => {
        if (this.stompChat && this.stompChat.connected) {
            this.stompChat.publish({
                destination: "/app/send/user/notTyping",
                body: JSON.stringify({
                    username: this.state.username,
                }),
            });
        } else {
            console.error("Nu există o conexiune WebSocket activă.");
        }
    };

    handleShowCharts = (deviceId) => {
        localStorage.setItem('deviceId', deviceId);
        history.push("/client/charts");
        window.location.reload();
    };

    toggleChat = () => {
        const chatMessages = this.state.chatMessages;
        this.setState({ chatMessages }, () => {
            this.scrollToBottom();
        });
        this.setState((prevState) => ({chatVisible: !prevState.chatVisible}));

        if(this.state.chatVisible){
            console.log(this.state.username);
            this.seenConversation(this.state.username);
        }
    };

    scrollToBottom = () => {
        if (this.chatMessagesEndRef.current) {
            this.chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };



    renderChatWindow() {
        const { chatMessages} = this.state;
        return (
            <div className="UserChat">
                <div>
                    <span className="UserName"><RiAdminLine/></span>
                </div>
                <div className="MessagesContainer">
                    <div className="Messages">
                        {chatMessages.map((message, index) => (
                            <div
                                key={index}
                                className={message.sender === "Admin" ? "Message Admin" : "Message User"}
                            >
                                <span>{message.text}</span>
                                {index === chatMessages.length - 1 && message.sender !== "Admin" && message.seen && (
                                    <div className="SeenText">Seen</div>
                                )}
                            </div>
                        ))}
                        <div ref={this.chatMessagesEndRef} />
                    </div>
                </div>
                <div className="ChatInput">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value = {this.state.currentMessage}
                        onChange={(e) => this.setState({currentMessage: e.target.value})}
                        onFocus={() => this.typing()}
                        onBlur={() => this.notTyping()}
                    />
                    <button onClick={() => {
                        this.updateChatMessages();
                        this.sendMessage(this.state.currentMessage)
                    }}>
                        Send
                    </button>
                </div>
            </div>
        );
    }

    updateChatMessages = () => {
        const { username } = this.state;
        const newMessage = { sender: username , text: this.state.currentMessage };
        console.log(newMessage)
        const updatedMessages = [
            ...this.state.chatMessages,
            newMessage,
        ];
        this.setState({ chatMessages: updatedMessages, currentMessage: ""}, () => {
            this.scrollToBottom();
        });
    };

    render() {
        const {devices, notifications, chatVisible} = this.state;
        return (
            <div className="HomeClient">
                <div className="table">
                    <table>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Description</th>
                            <th>Address</th>
                            <th>Consumption</th>
                            <th>Activate Simulator</th>
                            <th>Deactivate Simulator</th>
                            <th>Charts with consumptions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {devices.length ? devices.map((device, index) => (
                            <tr key={index}>
                                <td>{device.id}</td>
                                <td>{device.description}</td>
                                <td>{device.address}</td>
                                <td>{device.consumption}</td>
                                <td><button onClick={() => this.handleActivate(device.id)}>Activate</button></td>
                                <td><button onClick={() => this.handleDeactivate(device.id)}>Deactivate</button></td>
                                <td><button onClick={() => this.handleShowCharts(device.id)}>Show Charts</button></td>
                            </tr>
                        )) : <tr><td colSpan="7">No devices found</td></tr>}
                        </tbody>
                    </table>
                </div>

                <div className="notifications">
                    <h2>Notifications</h2>
                    {notifications.length === 0 ? <p>No notifications available</p> : <ul><li>{notifications[0]}</li></ul>}
                </div>

                <div className="logout">
                    <Link to="/" className="link">Log out</Link>
                </div>

                <div className="ChatIcon" onClick={this.toggleChat}>
                    <FaComments />
                </div>

                {chatVisible && this.renderChatWindow()}
            </div>
        );
    }
}

export default HomeClient;
