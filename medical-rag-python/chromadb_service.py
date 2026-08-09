import chromadb

# Create ChromaDB client
client = chromadb.PersistentClient(path="./chroma_db")

# Create/Get Collection
collection = client.get_or_create_collection(
    name="medical_reports"
)


def store_chunks(chunks, embeddings, pdf_name):
    """
    Store PDF chunks in ChromaDB.
    """

    ids = [f"{pdf_name}_{i}" for i in range(len(chunks))]

    metadatas = [
        {"pdf_name": pdf_name}
        for _ in chunks
    ]

    collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )


def search_chunks(query_embedding, n_results=3):
    """
    Search relevant chunks.
    """

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )

    if (
        "documents" not in results
        or len(results["documents"]) == 0
    ):
        return []

    return results["documents"][0]


def delete_pdf(pdf_name):
    """
    Delete all chunks of one PDF.
    """

    data = collection.get()

    ids = []

    for i, meta in enumerate(data["metadatas"]):
        if meta["pdf_name"] == pdf_name:
            ids.append(data["ids"][i])

    if ids:
        collection.delete(ids=ids)


def get_all_documents():
    """
    Return all stored documents.
    """

    return collection.get()