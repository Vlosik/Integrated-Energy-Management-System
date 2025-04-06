import axios from "axios"

const axiosSimulator = axios.create({
    baseURL: "http://simulator.local/",
    headers: {
        post: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
                "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
        }
    }
});


export default axiosSimulator;