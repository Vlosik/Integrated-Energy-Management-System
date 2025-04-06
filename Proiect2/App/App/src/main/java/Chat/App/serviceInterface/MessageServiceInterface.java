package Chat.App.serviceInterface;

import Chat.App.data.ChatData;
import Chat.App.dto.MessageDTO;
import Chat.App.data.MessageData;
import Chat.App.dto.UserDTO;

import java.util.List;

public interface MessageServiceInterface {
    void addMessage(MessageDTO messageDTO);
    List<MessageData> getChatForUser(UserDTO userDTO);
    List<ChatData> getChatForAdmin();
    void seeAConversation(UserDTO userDTO);
    void seeAConversationAdmin(UserDTO userDTO);
}
