package com.medical.medical_backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class RagService {

    private final RestTemplate restTemplate;

    private static final String RAG_UPLOAD_URL =
            "http://127.0.0.1:8001/upload";

    private static final String RAG_ASK_URL =
            "http://127.0.0.1:8001/ask";

    public RagService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // =========================================================
    // 1. UPLOAD PDF TO RAG
    // =========================================================

    public String uploadToRag(MultipartFile file) {

        try {

            MultiValueMap<String, Object> body =
                    new LinkedMultiValueMap<>();

            ByteArrayResource fileResource =
                    new ByteArrayResource(file.getBytes()) {

                        @Override
                        public String getFilename() {
                            return file.getOriginalFilename();
                        }
                    };

            body.add("file", fileResource);

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(
                    MediaType.MULTIPART_FORM_DATA
            );

            HttpEntity<MultiValueMap<String, Object>> request =
                    new HttpEntity<>(
                            body,
                            headers
                    );

            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            RAG_UPLOAD_URL,
                            request,
                            String.class
                    );

            return response.getBody();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to send PDF to RAG server: "
                            + e.getMessage(),
                    e
            );
        }
    }


    // =========================================================
    // 2. ASK RAG ABOUT PATIENT SYMPTOMS
    // =========================================================

    public String askRag(String symptoms) {

        try {

            String url = UriComponentsBuilder
                    .fromUriString(RAG_ASK_URL)
                    .queryParam("question", symptoms)
                    .toUriString();

            HttpHeaders headers = new HttpHeaders();

            headers.setAccept(
                    List.of(MediaType.APPLICATION_JSON)
            );

            HttpEntity<Void> request =
                    new HttpEntity<>(headers);

            ResponseEntity<Map> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            request,
                            Map.class
                    );

            Map body = response.getBody();

            if (body == null) {
                throw new RuntimeException(
                        "RAG server returned an empty response"
                );
            }

            Object status = body.get("status");

            if (status != null &&
                    !"success".equalsIgnoreCase(
                            status.toString())) {

                throw new RuntimeException(
                        "RAG server returned an unsuccessful response: "
                                + body
                );
            }

            Object answer = body.get("answer");

            if (answer == null) {
                throw new RuntimeException(
                        "RAG server response does not contain an answer"
                );
            }

            return answer.toString();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to get response from RAG server: "
                            + e.getMessage(),
                    e
            );
        }
    }
}