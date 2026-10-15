package com.medical.medical_backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medical.medical_backend.dto.DoctorRegistrationRequest;
import com.medical.medical_backend.dto.PatientRegistrationRequest;
import com.medical.medical_backend.entity.Doctor;
import com.medical.medical_backend.entity.Patient;
import com.medical.medical_backend.service.RegistrationService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(
            RegistrationService registrationService) {

        this.registrationService = registrationService;
    }


    // ==========================================
    // PATIENT REGISTRATION
    // ==========================================

    @PostMapping("/patient/register")
    public ResponseEntity<?> registerPatient(
            @RequestBody PatientRegistrationRequest request) {

        try {

            Patient patient =
                    registrationService.registerPatient(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            Map.of(
                                    "message",
                                    "Patient registered successfully",

                                    "patientId",
                                    patient.getId()
                            )
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // ==========================================
    // DOCTOR REGISTRATION
    // ==========================================

    @PostMapping("/doctor/register")
    public ResponseEntity<?> registerDoctor(
            @RequestBody DoctorRegistrationRequest request) {

        try {

            Doctor doctor =
                    registrationService.registerDoctor(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            Map.of(
                                    "message",
                                    "Doctor registration submitted",

                                    "doctorId",
                                    doctor.getId(),

                                    "status",
                                    doctor.getStatus().name()
                            )
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // ==========================================
    // RESET DOCTOR PASSWORD
    // ==========================================

    @PutMapping("/doctor/reset-password")
    public ResponseEntity<?> resetDoctorPassword(
            @RequestParam String email,
            @RequestParam String newPassword) {

        try {

            Doctor doctor =
                    registrationService.resetDoctorPassword(
                            email,
                            newPassword
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Doctor password updated successfully",

                            "doctorId",
                            doctor.getId(),

                            "email",
                            doctor.getEmail()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }
}