import axios from "axios";

const axiosChat = axios.create({
    baseURL: "http://chat.localhost:8071/",
    headers: {
        post: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
                "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
        }
    }
});


export default axiosChat;