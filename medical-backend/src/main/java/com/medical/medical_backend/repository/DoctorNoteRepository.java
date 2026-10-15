package com.medical.medical_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medical.medical_backend.entity.DoctorNote;

public interface DoctorNoteRepository
        extends JpaRepository<DoctorNote, Long> {

    List<DoctorNote> findByPatientId(Long patientId);

    List<DoctorNote> findByDoctorId(Long doctorId);
}