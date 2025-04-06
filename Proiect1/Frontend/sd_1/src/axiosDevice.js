import axios from "axios"

const axiosDevice = axios.create({
    baseURL: "http://device.localhost/",
    headers: {
        post: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
                "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
        }
    }
});


export default axiosDevice;