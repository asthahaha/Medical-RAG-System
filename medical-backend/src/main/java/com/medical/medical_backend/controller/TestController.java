package com.medical.medical_backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

    @GetMapping("/doctor/test")
    public Map<String, Object> doctorTest(
            Authentication authentication) {

        return Map.of(
                "message", "Doctor API accessed successfully",
                "email", authentication.getName(),
                "role", "DOCTOR"
        );
    }

    @GetMapping("/patient/test")
    public Map<String, Object> patientTest(
            Authentication authentication) {

        return Map.of(
                "message", "Patient API accessed successfully",
                "email", authentication.getName(),
                "role", "PATIENT"
        );
    }
}