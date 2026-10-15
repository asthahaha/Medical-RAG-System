package com.medical.medical_backend.controller;

import com.medical.medical_backend.entity.Doctor;
import com.medical.medical_backend.entity.DoctorStatus;
import com.medical.medical_backend.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorAdminController {

    private final DoctorRepository doctorRepository;

    public DoctorAdminController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @PutMapping("/{doctorId}/approve")
    public ResponseEntity<?> approveDoctor(
            @PathVariable Long doctorId) {

        return doctorRepository.findById(doctorId)
                .map(doctor -> {

                    doctor.setStatus(DoctorStatus.APPROVED);
                    doctorRepository.save(doctor);

                    return ResponseEntity.ok(
                            Map.of(
                                    "message", "Doctor approved successfully",
                                    "doctorId", doctor.getId(),
                                    "status", doctor.getStatus().name()
                            )
                    );
                })
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }
}