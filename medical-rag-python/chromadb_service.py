import chromadb


client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_or_create_collection(
    name="medical_reports"
)


def store_chunks(chunks, embeddings, pdf_name):

    ids = [
        f"{pdf_name}_{i}"
        for i in range(len(chunks))
    ]

    metadatas = [
        {
            "pdf_name": pdf_name,
            "chunk_index": i
        }
        for i in range(len(chunks))
    ]

    collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )

    print("Stored chunks:", len(chunks))


def search_chunks(query_embedding, pdf_name=None, n_results=10):

    query_arguments = {
        "query_embeddings": [query_embedding],
        "n_results": n_results,
        "include": [
            "documents",
            "metadatas",
            "distances"
        ]
    }

    if pdf_name:
        query_arguments["where"] = {
            "pdf_name": pdf_name
        }

    results = collection.query(
        **query_arguments
    )

    documents = results.get(
        "documents",
        [[]]
    )[0]

    metadatas = results.get(
        "metadatas",
        [[]]
    )[0]

    distances = results.get(
        "distances",
        [[]]
    )[0]

    print("\n========== CHROMADB RESULTS ==========")

    for i, document in enumerate(documents):

        print(f"\nCHUNK {i + 1}")

        if i < len(distances):
            print("Distance:", distances[i])

        print(document[:1000])

    return documents


def delete_pdf(pdf_name):

    data = collection.get(
        include=["metadatas"]
    )

    ids_to_delete = []

    for i, metadata in enumerate(
        data.get("metadatas", [])
    ):

        if metadata.get("pdf_name") == pdf_name:
            ids_to_delete.append(
                data["ids"][i]
            )

    if ids_to_delete:
        collection.delete(
            ids=ids_to_delete
        )


def get_all_documents():

    return collection.get(
        include=[
            "documents",
            "metadatas"
        ]
    )


def get_collection_count():

    return collection.count()