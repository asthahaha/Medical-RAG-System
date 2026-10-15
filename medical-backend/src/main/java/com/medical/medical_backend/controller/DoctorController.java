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

import com.medical.medical_backend.entity.Doctor;
import com.medical.medical_backend.entity.DoctorStatus;
import com.medical.medical_backend.repository.DoctorRepository;
import com.medical.medical_backend.security.JwtService;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public DoctorController(
            DoctorRepository doctorRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================
    // CREATE DOCTOR
    // =========================

    @PostMapping("/create")
    public ResponseEntity<?> createDoctor(
            @RequestBody Doctor doctor) {

        if (doctorRepository
                .findByEmail(doctor.getEmail())
                .isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Doctor email already exists"
                    ));
        }

        if (doctorRepository
                .findByLicenseNumber(
                        doctor.getLicenseNumber())
                .isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "License number already exists"
                    ));
        }

        doctor.setPassword(
                passwordEncoder.encode(
                        doctor.getPassword()
                )
        );

        // For now, newly created doctors are approved.
        doctor.setStatus(DoctorStatus.APPROVED);

        Doctor savedDoctor =
                doctorRepository.save(doctor);

        savedDoctor.setPassword(null);

        return ResponseEntity.ok(savedDoctor);
    }

    // =========================
    // DOCTOR LOGIN
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

        Doctor doctor =
                doctorRepository
                        .findByEmail(email)
                        .orElse(null);

        if (doctor == null) {

            return ResponseEntity
                    .status(401)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        if (!passwordEncoder.matches(
                password,
                doctor.getPassword())) {

            return ResponseEntity
                    .status(401)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        if (doctor.getStatus()
                != DoctorStatus.APPROVED) {

            return ResponseEntity
                    .status(403)
                    .body(Map.of(
                            "message",
                            "Doctor account is not approved"
                    ));
        }

        String token =
                jwtService.generateToken(
                        doctor.getId(),
                        doctor.getEmail(),
                        "DOCTOR"
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "message",
                "Doctor login successful"
        );

        response.put("token", token);
        response.put("role", "DOCTOR");
        response.put("userId", doctor.getId());
        response.put("name", doctor.getName());
        response.put("email", doctor.getEmail());

        return ResponseEntity.ok(response);
    }
}