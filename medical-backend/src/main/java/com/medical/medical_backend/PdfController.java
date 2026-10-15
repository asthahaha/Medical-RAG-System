package com.medical.medical_backend;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.medical.medical_backend.entity.Doctor;
import com.medical.medical_backend.entity.MedicalDocument;
import com.medical.medical_backend.repository.MedicalDocumentRepository;
import com.medical.medical_backend.service.AuthService;
import com.medical.medical_backend.service.RagService;

@RestController
@RequestMapping("/api/doctor/documents")
public class PdfController {

    private final MedicalDocumentRepository medicalDocumentRepository;
    private final RagService ragService;
    private final AuthService authService;

    private final Path uploadDirectory =
            Paths.get("uploads/medical-pdfs");

    public PdfController(
            MedicalDocumentRepository medicalDocumentRepository,
            RagService ragService,
            AuthService authService) {

        this.medicalDocumentRepository =
                medicalDocumentRepository;

        this.ragService = ragService;

        this.authService = authService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPdf(

            @RequestParam("file")
            MultipartFile file) {

        try {

            // ============================================
            // 1. GET LOGGED-IN DOCTOR FROM JWT
            // ============================================

            Doctor doctor =
                    authService.getLoggedInDoctor();

            // ============================================
            // 2. CHECK FILE
            // ============================================

            if (file == null || file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "Please select a PDF file"
                                )
                        );
            }

            // ============================================
            // 3. CHECK PDF EXTENSION
            // ============================================

            String fileName =
                    file.getOriginalFilename();

            if (fileName == null ||
                    !fileName
                            .toLowerCase()
                            .endsWith(".pdf")) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "Only PDF files are allowed"
                                )
                        );
            }

            // ============================================
            // 4. CREATE UPLOAD DIRECTORY
            // ============================================

            Files.createDirectories(
                    uploadDirectory
            );

            // ============================================
            // 5. MAKE FILE NAME SAFE
            // ============================================

            String safeFileName =
                    Paths.get(fileName)
                            .getFileName()
                            .toString();

            // ============================================
            // 6. CREATE UNIQUE FILE NAME
            // ============================================

            String uniqueFileName =
                    System.currentTimeMillis()
                            + "_"
                            + safeFileName;

            // ============================================
            // 7. CREATE TARGET PATH
            // ============================================

            Path targetPath =
                    uploadDirectory.resolve(
                            uniqueFileName
                    );

            // ============================================
            // 8. SAVE PDF LOCALLY
            // ============================================

            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            // ============================================
            // 9. CREATE MEDICAL DOCUMENT
            // ============================================

            MedicalDocument document =
                    new MedicalDocument();

            document.setFileName(
                    safeFileName
            );

            document.setFilePath(
                    targetPath
                            .toAbsolutePath()
                            .toString()
            );

            document.setUploadedAt(
                    LocalDateTime.now()
            );

            // IMPORTANT:
            // Doctor comes from JWT.
            // We DO NOT trust doctorId from frontend.

            document.setDoctor(
                    doctor
            );

            // ============================================
            // 10. SAVE DOCUMENT INFORMATION IN MYSQL
            // ============================================

            MedicalDocument savedDocument =
                    medicalDocumentRepository.save(
                            document
                    );

            // ============================================
            // 11. SEND PDF TO RAG SERVER
            // ============================================

            String ragResponse =
                    ragService.uploadToRag(file);

            // ============================================
            // 12. SUCCESS RESPONSE
            // ============================================

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            Map.of(
                                    "message",
                                    "PDF uploaded and processed successfully",

                                    "documentId",
                                    savedDocument.getId(),

                                    "fileName",
                                    savedDocument.getFileName(),

                                    "doctorId",
                                    doctor.getId(),

                                    "ragResponse",
                                    ragResponse
                            )
                    );

        } catch (IOException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "error",
                                    "Could not save PDF",

                                    "details",
                                    e.getMessage()
                            )
                    );

        } catch (Exception e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "error",
                                    "PDF processing failed",

                                    "details",
                                    e.getMessage()
                            )
                    );
        }
    }
}