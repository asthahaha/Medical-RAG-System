package com.medical.medical_backend.controller;

import com.medical.medical_backend.dto.DoctorNoteRequest;
import com.medical.medical_backend.entity.Doctor;
import com.medical.medical_backend.entity.DoctorNote;
import com.medical.medical_backend.entity.Patient;
import com.medical.medical_backend.repository.DoctorNoteRepository;
import com.medical.medical_backend.repository.PatientRepository;
import com.medical.medical_backend.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor/notes")
public class DoctorNoteController {

    private final DoctorNoteRepository doctorNoteRepository;
    private final PatientRepository patientRepository;
    private final AuthService authService;

    public DoctorNoteController(
            DoctorNoteRepository doctorNoteRepository,
            PatientRepository patientRepository,
            AuthService authService) {

        this.doctorNoteRepository = doctorNoteRepository;
        this.patientRepository = patientRepository;
        this.authService = authService;
    }

    // Create doctor's clinical review
    @PostMapping("/create")
    public ResponseEntity<?> createNote(
            @RequestBody DoctorNoteRequest request) {

        try {

            // Get doctor directly from JWT
            Doctor doctor =
                    authService.getLoggedInDoctor();

            // Patient is the target of the review
            Patient patient =
                    patientRepository.findById(
                            request.getPatientId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Patient not found"
                            )
                    );

            DoctorNote note =
                    new DoctorNote();

            // IMPORTANT:
            // Doctor comes from JWT, NOT request.getDoctorId()
            note.setDoctor(doctor);

            note.setPatient(patient);
            note.setDiagnosis(request.getDiagnosis());
            note.setTreatment(request.getTreatment());
            note.setNotes(request.getNotes());

            DoctorNote savedNote =
                    doctorNoteRepository.save(note);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Doctor review saved successfully",

                            "noteId",
                            savedNote.getId(),

                            "doctorId",
                            doctor.getId(),

                            "patientId",
                            patient.getId()
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


    // Get notes for a patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientNotes(
            @PathVariable Long patientId) {

        try {

            // Verify authenticated doctor
            authService.getLoggedInDoctor();

            List<DoctorNote> notes =
                    doctorNoteRepository
                            .findByPatientId(patientId);

            return ResponseEntity.ok(notes);

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


    // Get notes written by logged-in doctor
    @GetMapping("/doctor")
    public ResponseEntity<?> getMyNotes() {

        try {

            Doctor doctor =
                    authService.getLoggedInDoctor();

            List<DoctorNote> notes =
                    doctorNoteRepository
                            .findByDoctorId(
                                    doctor.getId()
                            );

            return ResponseEntity.ok(notes);

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


    // Get one note
    @GetMapping("/{noteId}")
    public ResponseEntity<?> getNote(
            @PathVariable Long noteId) {

        try {

            authService.getLoggedInDoctor();

            return doctorNoteRepository
                    .findById(noteId)
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