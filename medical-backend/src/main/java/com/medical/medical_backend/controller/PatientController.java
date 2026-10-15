package com.medical.medical_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medical.medical_backend.entity.Patient;
import com.medical.medical_backend.repository.PatientRepository;
import com.medical.medical_backend.security.JwtService;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public PatientController(
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================
    // PATIENT REGISTRATION
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Patient patient) {

        if (patientRepository
                .findByEmail(patient.getEmail())
                .isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Patient email already exists"
                    ));
        }

        patient.setPassword(
                passwordEncoder.encode(
                        patient.getPassword()
                )
        );

        Patient savedPatient =
                patientRepository.save(patient);

        savedPatient.setPassword(null);

        return ResponseEntity.ok(savedPatient);
    }

    // =========================
    // PATIENT LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> loginRequest) {

        String email =
                loginRequest.get("email");

        String password =
                loginRequest.get("password");

        if (email == null || password == null) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Email and password are required"
                    ));
        }

        Patient patient =
                patientRepository
                        .findByEmail(email)
                        .orElse(null);

        if (patient == null) {

            return ResponseEntity
                    .status(401)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        if (!passwordEncoder.matches(
                password,
                patient.getPassword())) {

            return ResponseEntity
                    .status(401)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        String token =
                jwtService.generateToken(
                        patient.getId(),
                        patient.getEmail(),
                        "PATIENT"
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "message",
                "Patient login successful"
        );

        response.put("token", token);
        response.put("role", "PATIENT");
        response.put("userId", patient.getId());
        response.put("name", patient.getName());
        response.put("email", patient.getEmail());

        return ResponseEntity.ok(response);
    }
}