package com.medical.medical_backend.dto;

public class PatientLoginRequest {

    private String email;
    private String password;

    public PatientLoginRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}