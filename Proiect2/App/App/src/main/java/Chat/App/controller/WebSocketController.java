package Chat.App.controller;

import Chat.App.data.ChatData;
import Chat.App.data.MessageData;
import Chat.App.dto.MessageDTO;
import Chat.App.dto.UserDTO;
import Chat.App.service.MessageService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.catalina.User;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

@Controller
public class WebSocketController {
    private MessageService service;
    public WebSocketController(MessageService service){
        this.service = service;
    }

    @MessageMapping("/send/user")
    @SendTo("/topic/messages/user")
    public ChatData handleMessageUser(String message) {
        List<MessageData> messageData = new ArrayList<>();
        ChatData chatData = new ChatData();
        chatData.setId(0);
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            MessageDTO messageDTO = objectMapper.readValue(message, MessageDTO.class);
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(messageDTO.getTo());
            this.service.addMessage(messageDTO);
            messageData = this.service.getChatForUser(userDTO);
            chatData.setUser(userDTO.getUsername());
            chatData.setMessages(messageData);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return chatData;
    }

    @MessageMapping("/send/admin")
    @SendTo("/topic/messages/admin")
    public List<ChatData> handleMessageAdmin(String message) {
        List<ChatData> messageData = new ArrayList<>();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            MessageDTO messageDTO = objectMapper.readValue(message, MessageDTO.class);
            this.service.addMessage(messageDTO);
            messageData = this.service.getChatForAdmin();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return messageData;
    }

    @MessageMapping("/send/typing")
    @SendTo("/topic/messages/typing")
    public String handleTyping(String message) {
        return message;
    }

    @MessageMapping("/send/notTyping")
    @SendTo("/topic/messages/notTyping")
    public String handleNotTyping(String message) {
       return message;
    }

    @MessageMapping("/send/user/typing")
    @SendTo("/topic/messages/user/typing")
    public UserDTO handleTypingUser(String message) {
        ObjectMapper objectMapper = new ObjectMapper();
        UserDTO userDTO = new UserDTO();
        try {
            userDTO = objectMapper.readValue(message, UserDTO.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return userDTO;
    }

    @MessageMapping("/send/user/notTyping")
    @SendTo("/topic/messages/user/notTyping")
    public UserDTO handleNotTypingUser(String message) {
        ObjectMapper objectMapper = new ObjectMapper();
        UserDTO userDTO = new UserDTO();
        try {
            userDTO = objectMapper.readValue(message, UserDTO.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return userDTO;
    }

    @MessageMapping("/send/seen/admin")
    @SendTo("/topic/messages/user")
    public ChatData seenConversation(String message) {
        List<MessageData> messageData = new ArrayList<>();
        ChatData chatData = new ChatData();
        chatData.setId(0);
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            UserDTO messageDTO = objectMapper.readValue(message, UserDTO.class);
            this.service.seeAConversationAdmin(messageDTO);
            messageData = this.service.getChatForUser(messageDTO);
            chatData.setUser(messageDTO.getUsername());
            chatData.setMessages(messageData);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return chatData;
    }

    @MessageMapping("/send/seen/user")
    @SendTo("/topic/messages/admin")
    public List<ChatData> seenConversationAdmin(String message) {
        List<ChatData> messageData = new ArrayList<>();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            UserDTO messageDTO = objectMapper.readValue(message, UserDTO.class);
            this.service.seeAConversation(messageDTO);
            messageData = this.service.getChatForAdmin();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return messageData;
    }
}
