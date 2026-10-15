package com.medical.medical_backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.medical.medical_backend.dto.DoctorRegistrationRequest;
import com.medical.medical_backend.dto.PatientRegistrationRequest;
import com.medical.medical_backend.entity.Doctor;
import com.medical.medical_backend.entity.DoctorStatus;
import com.medical.medical_backend.entity.Patient;
import com.medical.medical_backend.repository.DoctorRepository;
import com.medical.medical_backend.repository.PatientRepository;

@Service
public class RegistrationService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationService(
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder) {

        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // PATIENT REGISTRATION
    // =========================

    public Patient registerPatient(PatientRegistrationRequest request) {

        if (patientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException(
                    "Patient with this email already exists"
            );
        }

        Patient patient = new Patient();

        patient.setName(request.getName());
        patient.setEmail(request.getEmail());

        // Encrypt password before saving
        patient.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        patient.setPhone(request.getPhone());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());

        return patientRepository.save(patient);
    }


    // =========================
    // DOCTOR REGISTRATION
    // =========================

    public Doctor registerDoctor(DoctorRegistrationRequest request) {

        if (doctorRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException(
                    "Doctor with this email already exists"
            );
        }

        Doctor doctor = new Doctor();

        doctor.setName(request.getName());
        doctor.setEmail(request.getEmail());

        // Encrypt password before saving
        doctor.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        doctor.setSpecialization(request.getSpecialization());
        doctor.setLicenseNumber(request.getLicenseNumber());

        // New doctors are pending until approved
        doctor.setStatus(DoctorStatus.PENDING);

        return doctorRepository.save(doctor);
    }


    // =========================
    // RESET DOCTOR PASSWORD
    // =========================

    public Doctor resetDoctorPassword(
            String email,
            String newPassword) {

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        // Encrypt the new password
        doctor.setPassword(
                passwordEncoder.encode(newPassword)
        );

        return doctorRepository.save(doctor);
    }
}