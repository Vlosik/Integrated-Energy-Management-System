package Chat.App.service;

import Chat.App.data.ChatData;
import Chat.App.dto.MessageDTO;
import Chat.App.data.MessageData;
import Chat.App.dto.UserDTO;
import Chat.App.model.Message;
import Chat.App.serviceInterface.MessageServiceInterface;
import Chat.App.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MessageService implements MessageServiceInterface {
    private MessageRepository repo;
    public MessageService(MessageRepository repo){
        this.repo = repo;
    }

    @Override
    public void addMessage(MessageDTO messageDTO) {
        Message message = new Message();

        message.setSender(messageDTO.getFrom());
        message.setReceiver(messageDTO.getTo());
        message.setSeen(messageDTO.isSeen());
        message.setSentDate(new Date());
        message.setMessage(messageDTO.getText());

        this.repo.save(message);
    }

    @Override
    public List<MessageData> getChatForUser(UserDTO userDTO) {
        List<Message> messagesList = this.repo.findAll();
        List<MessageData> chat = new ArrayList<>();
        for(Message message : messagesList){
            if(message.getSender().equals(userDTO.getUsername())){
                MessageData messageData = new MessageData();
                messageData.setSender(userDTO.getUsername());
                messageData.setText(message.getMessage());
                messageData.setSeen(message.getSeen());
                chat.add(messageData);
            }
            if(message.getReceiver().equals(userDTO.getUsername())){
                MessageData messageData = new MessageData();
                messageData.setSender(message.getSender());
                messageData.setText(message.getMessage());
                messageData.setSeen(message.getSeen());
                chat.add(messageData);
            }
        }
        return chat;
    }

    @Override
    public List<ChatData> getChatForAdmin() {
        List<Message> messagesList = this.repo.findAll();
        List<ChatData> chatAdmin = new ArrayList<>();
        HashMap<String,List<MessageData>> chatsByUser = new HashMap<>();
        for(Message message : messagesList){
            if(message.getSender().equals("Admin")){
                String user = message.getReceiver();
                List<MessageData> chatUser = new ArrayList<>();
                if(chatsByUser.containsKey(user)){
                    chatUser = chatsByUser.get(user);
                }
                MessageData messageData = new MessageData();
                messageData.setSender("Admin");
                messageData.setText(message.getMessage());
                messageData.setSeen(message.getSeen());
                chatUser.add(messageData);
                chatsByUser.put(user,chatUser);
            }
            if(message.getReceiver().equals("Admin")){
                String user = message.getSender();
                List<MessageData> chatUser = new ArrayList<>();
                if(chatsByUser.containsKey(user)){
                    chatUser = chatsByUser.get(user);
                }
                MessageData messageData = new MessageData();
                messageData.setSender(message.getSender());
                messageData.setText(message.getMessage());
                messageData.setSeen(message.getSeen());
                chatUser.add(messageData);
                chatsByUser.put(user,chatUser);
            }
        }
        int counter = 1;
        for(Map.Entry<String,List<MessageData>> entry: chatsByUser.entrySet()){
            ChatData chatData = new ChatData();
            chatData.setId(counter);
            chatData.setUser(entry.getKey());
            chatData.setMessages(entry.getValue());
            counter++;
            chatAdmin.add(chatData);
        }
        return chatAdmin;
    }

    @Override
    public void seeAConversation(UserDTO userDTO) {
        System.out.println(userDTO.getUsername());
        List<Message> messagesLists = this.repo.findAll();
        List<MessageData> chat = new ArrayList<>();
        for(Message message : messagesLists){
            if(message.getReceiver().equals(userDTO.getUsername())){
                System.out.println(message.getMessage());
                System.out.println(message.getReceiver());
                message.setSeen(true);
                this.repo.save(message);
            }
        }
    }

    @Override
    public void seeAConversationAdmin(UserDTO userDTO) {
        List<Message> messagesLists = this.repo.findAll();
        List<MessageData> chat = new ArrayList<>();
        for(Message message : messagesLists){
            if(message.getSender().equals(userDTO.getUsername())){
                System.out.println(message.getMessage());
                System.out.println(message.getReceiver());
                message.setSeen(true);
                this.repo.save(message);
            }
        }
    }


}
