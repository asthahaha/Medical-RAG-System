package com.medical.medical_backend.controller;

import com.medical.medical_backend.entity.Patient;
import com.medical.medical_backend.entity.PatientReport;
import com.medical.medical_backend.repository.PatientReportRepository;
import com.medical.medical_backend.service.AuthService;
import com.medical.medical_backend.service.RagService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patient/reports")
public class PatientReportController {

    private final PatientReportRepository reportRepository;
    private final AuthService authService;
    private final RagService ragService;

    public PatientReportController(
            PatientReportRepository reportRepository,
            AuthService authService,
            RagService ragService) {

        this.reportRepository = reportRepository;
        this.authService = authService;
        this.ragService = ragService;
    }

    // Create report for the currently logged-in patient
    @PostMapping("/create")
    public ResponseEntity<?> createReport(
            @RequestParam String symptoms) {

        try {

            // Get patient directly from JWT
            Patient patient = authService.getLoggedInPatient();

            // Ask the Medical RAG system
            String aiResponse =
                    ragService.askRag(symptoms);

            // Create report
            PatientReport report =
                    new PatientReport();

            report.setSymptoms(symptoms);
            report.setAiResponse(aiResponse);
            report.setPatient(patient);

            PatientReport savedReport =
                    reportRepository.save(report);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Report created successfully",

                            "reportId",
                            savedReport.getId(),

                            "symptoms",
                            savedReport.getSymptoms(),

                            "aiResponse",
                            savedReport.getAiResponse()
                    )
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


    // Get reports of currently logged-in patient
    @GetMapping
    public ResponseEntity<?> getMyReports() {

        try {

            Patient patient =
                    authService.getLoggedInPatient();

            List<PatientReport> reports =
                    reportRepository
                            .findByPatientId(
                                    patient.getId()
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
}