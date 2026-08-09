import os

from pypdf import PdfReader
import chromadb

from chunking import create_chunks
from embedding import create_embeddings, create_query_embedding
from gemini_service import generate_answer


client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_or_create_collection(
    name="medical_reports"
)


async def upload_pdf(file):

    os.makedirs("uploads", exist_ok=True)

    filepath = os.path.join(
        "uploads",
        file.filename
    )

    with open(filepath, "wb") as f:
        f.write(await file.read())

    reader = PdfReader(filepath)

    text = ""

    for page in reader.pages:
        extracted = page.extract_text()

        if extracted:
            text += extracted + "\n"

    if not text.strip():
        return "Could not extract text from PDF."

    chunks = create_chunks(text)

    print("TOTAL CHUNKS:", len(chunks))

    embeddings = create_embeddings(chunks)

    ids = [
        f"{file.filename}_chunk_{i}"
        for i in range(len(chunks))
    ]

    collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings
    )

    return f"PDF uploaded successfully. {len(chunks)} chunks stored."


def ask_question(question):

    query_embedding = create_query_embedding(question)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3,
        include=["documents", "distances"]
    )

    if not results["documents"] or not results["documents"][0]:
        return "I could not find this information in the uploaded medical document."

    documents = results["documents"][0]
    distances = results["distances"][0]

    print("DISTANCES:", distances)

    relevant_documents = []

    for document, distance in zip(documents, distances):

        if distance <= 0.65:
            relevant_documents.append(document)

    if not relevant_documents:
        return "I could not find this information in the uploaded medical document."

    context = "\n\n".join(relevant_documents)

    print("CONTEXT:", context)

    return generate_answer(
        question=question,
        context=context
    )