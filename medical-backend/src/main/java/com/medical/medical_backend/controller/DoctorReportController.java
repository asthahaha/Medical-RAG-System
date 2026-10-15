package com.medical.medical_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medical.medical_backend.entity.PatientReport;
import com.medical.medical_backend.repository.PatientReportRepository;
import com.medical.medical_backend.service.AuthService;

@RestController
@RequestMapping("/api/doctor/reports")
public class DoctorReportController {

    private final PatientReportRepository reportRepository;
    private final AuthService authService;

    public DoctorReportController(
            PatientReportRepository reportRepository,
            AuthService authService) {

        this.reportRepository = reportRepository;
        this.authService = authService;
    }

    // Get all patient reports for an authenticated doctor
    @GetMapping
    public ResponseEntity<?> getAllReports() {

        try {

            // Verify that the request belongs to an authenticated doctor
            authService.getLoggedInDoctor();

            List<PatientReport> reports =
                    reportRepository.findAll();

            return ResponseEntity.ok(reports);

        } catch (Exception e) {

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

    // Get a specific patient's reports
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientReports(
            @PathVariable Long patientId) {

        try {

            // Only an authenticated doctor can access this endpoint
            authService.getLoggedInDoctor();

            List<PatientReport> reports =
                    reportRepository.findByPatientId(
                            patientId
                    );

            return ResponseEntity.ok(reports);

        } catch (Exception e) {

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

    // Get one report
    @GetMapping("/{reportId}")
    public ResponseEntity<?> getReport(
            @PathVariable Long reportId) {

        try {

            // Only authenticated doctors can access reports
            authService.getLoggedInDoctor();

            return reportRepository
                    .findById(reportId)
                    .map(ResponseEntity::ok)
                    .orElse(
                            ResponseEntity.notFound().build()
                    );

        } catch (Exception e) {

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