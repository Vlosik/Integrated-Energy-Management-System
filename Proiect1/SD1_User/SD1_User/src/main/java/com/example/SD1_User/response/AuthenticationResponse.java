package com.example.SD1_User.response;

public class AuthenticationResponse {
    public String getToken() {
        return token;
    }

    public AuthenticationResponse(String token){
        this.token = token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    private String token;

}
