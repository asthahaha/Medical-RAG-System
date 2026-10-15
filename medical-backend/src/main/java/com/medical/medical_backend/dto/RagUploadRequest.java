package com.medical.medical_backend.dto;

public class RagUploadRequest {

    private String filePath;
    private String fileName;
    private Long doctorId;

    public RagUploadRequest() {
    }

    public RagUploadRequest(
            String filePath,
            String fileName,
            Long doctorId) {

        this.filePath = filePath;
        this.fileName = fileName;
        this.doctorId = doctorId;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }
}