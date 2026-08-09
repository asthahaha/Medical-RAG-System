package com.medical.medical_backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "*")
public class PdfController {

    private final PythonService pythonService;

    public PdfController(PythonService pythonService) {
        this.pythonService = pythonService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadPdf(
            @RequestParam("file") MultipartFile file)
            throws Exception {

        String response = pythonService.uploadPdf(file);

        return ResponseEntity.ok(response);
    }
}