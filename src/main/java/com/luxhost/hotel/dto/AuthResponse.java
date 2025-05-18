package com.luxhost.hotel.dto;

public class AuthResponse {
    private String token;
    private String email;
    private String role;
    private String username;

    public AuthResponse(String token, String email, String role, String username) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.username = username;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }

    public void setToken(String token) { this.token = token; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
