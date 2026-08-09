from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")


def create_embeddings(chunks):
    embeddings = model.encode(
        chunks,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return embeddings.tolist()


def create_query_embedding(question):
    embedding = model.encode(
        question,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return embedding.tolist()