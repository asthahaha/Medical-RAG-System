package com.medical.medical_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medical.medical_backend.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByEmail(String email);

    Optional<Doctor> findByLicenseNumber(String licenseNumber);
}