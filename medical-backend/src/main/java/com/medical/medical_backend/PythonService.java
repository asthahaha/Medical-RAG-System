package com.medical.medical_backend;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class PythonService {

    private final RestTemplate restTemplate;

    private final String PYTHON_API = "http://127.0.0.1:8001";

    public PythonService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Upload PDF to Python RAG backend
    public String uploadPdf(MultipartFile file) throws Exception {

        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", resource);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                PYTHON_API + "/upload",
                request,
                String.class
        );

        return response.getBody();
    }

    // Ask question to Python RAG backend
    public String askQuestion(String question) {

        String url = UriComponentsBuilder
                .fromUriString(PYTHON_API + "/ask")
                .queryParam("question", question)
                .toUriString();

        return restTemplate.getForObject(url, String.class);
    }
}