package com.medical.medical_backend.controller;

import com.medical.medical_backend.dto.LoginRequest;
import com.medical.medical_backend.entity.Doctor;
import com.medical.medical_backend.entity.Patient;
import com.medical.medical_backend.security.JwtService;
import com.medical.medical_backend.service.LoginService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    private final LoginService loginService;
    private final JwtService jwtService;

    public LoginController(
            LoginService loginService,
            JwtService jwtService) {

        this.loginService = loginService;
        this.jwtService = jwtService;
    }

    @PostMapping("/patient/login")
    public ResponseEntity<?> patientLogin(
            @RequestBody LoginRequest request) {

        try {

            Patient patient = loginService.loginPatient(
                    request.getEmail(),
                    request.getPassword()
            );

            String token = jwtService.generateToken(
                    patient.getId(),
                    patient.getEmail(),
                    "PATIENT"
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Patient login successful",
                            "token", token,
                            "role", "PATIENT",
                            "patientId", patient.getId(),
                            "name", patient.getName(),
                            "email", patient.getEmail()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error",
                            e.getMessage()
                    )
            );
        }
    }

    @PostMapping("/doctor/login")
    public ResponseEntity<?> doctorLogin(
            @RequestBody LoginRequest request) {

        try {

            Doctor doctor = loginService.loginDoctor(
                    request.getEmail(),
                    request.getPassword()
            );

            String token = jwtService.generateToken(
                    doctor.getId(),
                    doctor.getEmail(),
                    "DOCTOR"
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Doctor login successful",
                            "token", token,
                            "role", "DOCTOR",
                            "doctorId", doctor.getId(),
                            "name", doctor.getName(),
                            "email", doctor.getEmail(),
                            "specialization",
                            doctor.getSpecialization()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error",
                            e.getMessage()
                    )
            );
        }
    }
}