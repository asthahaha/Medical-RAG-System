package com.medical.medical_backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.medical.medical_backend.entity.Doctor;
import com.medical.medical_backend.entity.DoctorStatus;
import com.medical.medical_backend.entity.Patient;
import com.medical.medical_backend.repository.DoctorRepository;
import com.medical.medical_backend.repository.PatientRepository;

@Service
public class LoginService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginService(
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder) {

        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Patient loginPatient(String email, String password) {

        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, patient.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return patient;
    }

    public Doctor loginDoctor(String email, String password) {

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (doctor.getStatus() != DoctorStatus.APPROVED) {
            throw new RuntimeException(
                    "Doctor account is not approved"
            );
        }

        if (!passwordEncoder.matches(password, doctor.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return doctor;
    }
}