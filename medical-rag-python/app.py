from fastapi import FastAPI, UploadFile, File, HTTPException
import os
import shutil

from rag import upload_pdf, ask_question


app = FastAPI()


# ==========================================
# CONFIGURATION
# ==========================================

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "RAG server is running"
    }


# ==========================================
# ASK QUESTION
# ==========================================

@app.get("/ask")
def ask(question: str):

    try:

        answer = ask_question(question)

        return {
            "status": "success",
            "question": question,
            "answer": answer
        }

    except Exception as e:

        print("Question error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"AI question failed: {str(e)}"
        )


# ==========================================
# REPORT
# ==========================================

@app.get("/report")
def report():

    return {
        "status": "success",
        "message": "Medical RAG server is working"
    }


# ==========================================
# UPLOAD PDF
# ==========================================

@app.post("/upload")
async def upload(file: UploadFile = File(...)):

    try:

        # --------------------------------------
        # Validate file
        # --------------------------------------

        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No file selected"
            )

        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed"
            )

        # --------------------------------------
        # Save uploaded file
        # --------------------------------------

        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename
        )

        print("\n================================")
        print("RECEIVED PDF")
        print("================================")

        print("Filename:", file.filename)
        print("Saving to:", file_path)

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        # --------------------------------------
        # Process PDF using file path
        # --------------------------------------

        result = upload_pdf(file_path)

        print("\n================================")
        print("UPLOAD SUCCESSFUL")
        print("================================")

        return result

    except HTTPException:
        raise

    except Exception as e:

        print("\n================================")
        print("PDF UPLOAD ERROR")
        print("================================")

        print(type(e).__name__)
        print(str(e))

        raise HTTPException(
            status_code=500,
            detail=f"PDF upload failed: {str(e)}"
        )