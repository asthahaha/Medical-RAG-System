from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from rag import upload_pdf, ask_question

app = FastAPI(title="Medical RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Medical RAG API Running Successfully"
    }


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    result = await upload_pdf(file)

    return {
        "message": result
    }


@app.get("/ask")
def ask(question: str):

    answer = ask_question(question)

    return {
        "answer": answer
    }