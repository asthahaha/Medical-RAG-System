package com.medical.medical_backend.repository;

import com.medical.medical_backend.entity.PatientReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientReportRepository
        extends JpaRepository<PatientReport, Long> {

    List<PatientReport> findByPatientId(Long patientId);
}