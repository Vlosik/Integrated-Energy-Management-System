package Chat.App.controller;

import Chat.App.data.ChatData;
import Chat.App.data.MessageData;
import Chat.App.dto.UserDTO;
import Chat.App.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class MessagesController {
    private MessageService service;
    public MessagesController(MessageService service){
        this.service = service;
    }

    @PostMapping("/user")
    public List<MessageData> getUserChat(@RequestBody UserDTO userDTO){
        return this.service.getChatForUser(userDTO);
    }

    @GetMapping("/admin")
    public List<ChatData> getAdminChat(){
        return this.service.getChatForAdmin();
    }
}
