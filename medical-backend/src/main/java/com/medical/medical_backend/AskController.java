package com.medical.medical_backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AskController {

    private final PythonService pythonService;

    public AskController(PythonService pythonService) {
        this.pythonService = pythonService;
    }

    @PostMapping("/ask")
    public ResponseEntity<String> askQuestion(
            @RequestBody QuestionRequest request) {

        String answer = pythonService.askQuestion(request.getQuestion());

        return ResponseEntity.ok(answer);
    }

    public static class QuestionRequest {

        private String question;

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }
    }
}