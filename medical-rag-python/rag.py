import os
import uuid

from pypdf import PdfReader

from chunking import create_chunks
from embedding import create_embeddings, create_query_embedding
from chromadb_service import store_chunks, search_chunks
from gemini_service import generate_answer


# ============================================================
# GLOBAL VARIABLE
# ============================================================

# Stores the name/ID of the latest uploaded PDF.
# The patient's question will be searched only against this PDF.
CURRENT_PDF_NAME = None


# ============================================================
# EXTRACT TEXT FROM PDF
# ============================================================

def extract_text_from_pdf(file_path):

    print("\n========================================")
    print("READING PDF")
    print("========================================")

    print("File:", file_path)

    reader = PdfReader(file_path)

    text = ""

    for page_number, page in enumerate(reader.pages):

        page_text = page.extract_text()

        print(
            f"Page {page_number + 1}: "
            f"{len(page_text or '')} characters"
        )

        if page_text:
            text += page_text + "\n"

    return text


# ============================================================
# UPLOAD AND PROCESS PDF
# ============================================================

def upload_pdf(file_path):

    global CURRENT_PDF_NAME

    try:

        print("\n========================================")
        print("STARTING PDF PROCESSING")
        print("========================================")

        # ----------------------------------------------------
        # Check file
        # ----------------------------------------------------

        if not os.path.exists(file_path):

            raise FileNotFoundError(
                f"PDF not found: {file_path}"
            )

        print("File exists:", file_path)

        # ----------------------------------------------------
        # Extract text
        # ----------------------------------------------------

        text = extract_text_from_pdf(file_path)

        if not text.strip():

            raise ValueError(
                "No text could be extracted from the PDF."
            )

        print("\nTotal extracted characters:")
        print(len(text))

        # ----------------------------------------------------
        # Create chunks
        # ----------------------------------------------------

        print("\n========================================")
        print("CREATING CHUNKS")
        print("========================================")

        chunks = create_chunks(text)

        if not chunks:

            raise ValueError(
                "PDF text was extracted but no chunks were created."
            )

        print("Total chunks:", len(chunks))

        # ----------------------------------------------------
        # Create embeddings
        # ----------------------------------------------------

        print("\n========================================")
        print("CREATING EMBEDDINGS")
        print("========================================")

        embeddings = create_embeddings(chunks)

        print(
            "Embeddings created:",
            len(embeddings)
        )

        # ----------------------------------------------------
        # Generate unique PDF name
        # ----------------------------------------------------

        original_name = os.path.basename(file_path)

        pdf_name = (
            str(uuid.uuid4())[:8]
            + "_"
            + original_name
        )

        print("\nPDF name used in ChromaDB:")
        print(pdf_name)

        # ----------------------------------------------------
        # Store chunks in ChromaDB
        # ----------------------------------------------------

        print("\n========================================")
        print("STORING CHUNKS IN CHROMADB")
        print("========================================")

        store_chunks(
            chunks,
            embeddings,
            pdf_name
        )

        # ----------------------------------------------------
        # Set current PDF
        # ----------------------------------------------------

        CURRENT_PDF_NAME = pdf_name

        print("\n========================================")
        print("PDF PROCESSING SUCCESSFUL")
        print("========================================")

        print("Current PDF:", CURRENT_PDF_NAME)
        print("Chunks:", len(chunks))

        return {
            "status": "success",
            "file_name": original_name,
            "document_id": pdf_name,
            "chunks": len(chunks)
        }

    except Exception as e:

        print("\n========================================")
        print("PDF PROCESSING ERROR")
        print("========================================")

        print("Error type:", type(e).__name__)
        print("Error:", str(e))

        raise


# ============================================================
# ASK QUESTION
# ============================================================

def ask_question(question):

    print("\n========================================")
    print("RAG QUESTION")
    print("========================================")

    print("Question:")
    print(question)

    # ----------------------------------------------------
    # Check if PDF has been uploaded
    # ----------------------------------------------------

    if CURRENT_PDF_NAME is None:

        print("\nNo PDF has been uploaded yet.")

        return (
            "Please upload a medical document first."
        )

    print("\nCurrent PDF:")
    print(CURRENT_PDF_NAME)

    # ----------------------------------------------------
    # Create embedding for question
    # ----------------------------------------------------

    print("\n========================================")
    print("CREATING QUERY EMBEDDING")
    print("========================================")

    query_embedding = create_query_embedding(
        question
    )

    print("Query embedding created.")

    # ----------------------------------------------------
    # Search ChromaDB
    # ----------------------------------------------------

    print("\n========================================")
    print("SEARCHING CHROMADB")
    print("========================================")

    documents = search_chunks(
        query_embedding,
        pdf_name=CURRENT_PDF_NAME,
        n_results=5
    )

    # ----------------------------------------------------
    # Check retrieved documents
    # ----------------------------------------------------

    if not documents:

        print("\nNo chunks retrieved from ChromaDB.")

        return (
            "I could not find this information "
            "in the uploaded medical document."
        )

    # ----------------------------------------------------
    # Print retrieved chunks
    # ----------------------------------------------------

    print("\n========================================")
    print("RETRIEVED CHUNKS")
    print("========================================")

    for i, document in enumerate(documents):

        print(
            f"\n---------- CHUNK {i + 1} ----------"
        )

        print(document[:1500])

    # ----------------------------------------------------
    # Combine retrieved chunks
    # ----------------------------------------------------

    context = "\n\n".join(documents)

    print("\n========================================")
    print("CONTEXT SENT TO GEMINI")
    print("========================================")

    print(context[:5000])

    # ----------------------------------------------------
    # Generate answer using Gemini
    # ----------------------------------------------------

    print("\n========================================")
    print("CALLING GEMINI")
    print("========================================")

    try:

        answer = generate_answer(
            question,
            context
        )

    except Exception as e:

        print("\n========================================")
        print("GEMINI ERROR")
        print("========================================")

        print(type(e).__name__)
        print(str(e))

        raise

    # ----------------------------------------------------
    # Final answer
    # ----------------------------------------------------

    print("\n========================================")
    print("FINAL ANSWER")
    print("========================================")

    print(answer)

    return answer