package com.medical.medical_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medical.medical_backend.entity.MedicalDocument;

public interface MedicalDocumentRepository
        extends JpaRepository<MedicalDocument, Long> {

    List<MedicalDocument> findByDoctorId(Long doctorId);
}