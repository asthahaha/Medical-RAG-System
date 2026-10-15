package com.medical.medical_backend.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.medical.medical_backend.entity.Doctor;
import com.medical.medical_backend.entity.Patient;
import com.medical.medical_backend.repository.DoctorRepository;
import com.medical.medical_backend.repository.PatientRepository;

@Service
public class AuthService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AuthService(
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {

        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public String getLoggedInEmail() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        return authentication.getName();
    }

    public Patient getLoggedInPatient() {

        String email = getLoggedInEmail();

        return patientRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in patient not found"
                        )
                );
    }

    public Doctor getLoggedInDoctor() {

        String email = getLoggedInEmail();

        return doctorRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in doctor not found"
                        )
                );
    }
}