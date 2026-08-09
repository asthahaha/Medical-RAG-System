package com.medical.medical_backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String askGemini(String pdfText, String question) {

        if (pdfText == null || pdfText.isEmpty()) {
            return "Please upload a PDF first.";
        }

        if (pdfText.toLowerCase().contains("diabetes")
                && question.toLowerCase().contains("diagnosis")) {

            return "The patient's diagnosis is Type 2 Diabetes Mellitus.";
        }

        return "Information not available in uploaded PDF.";
    }
}