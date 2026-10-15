import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not configured.")

client = genai.Client(api_key=api_key)

MODEL = "gemini-3.5-flash-lite"


def generate_answer(question, context):

    prompt = f"""
You are a medical document question-answering assistant.

Answer the question using ONLY the information provided
in the CONTEXT.

CONTEXT:
--------------------
{context}
--------------------

QUESTION:
{question}

STRICT RULES:
1. Use only the CONTEXT.
2. Do not use outside medical knowledge.
3. Do not guess or invent information.
4. Keep the answer concise.
5. If the answer is not present in the context, respond exactly:

I could not find this information in the uploaded medical document.

6. Do not claim to be a doctor.
7. Do not provide a definitive medical diagnosis.

Answer the QUESTION now.
"""

    print("========================================")
    print("CALLING GEMINI")
    print("========================================")
    print("Model:", MODEL)

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )

        if response and response.text:
            print("GEMINI RESPONSE RECEIVED")
            return response.text.strip()

        return "I could not generate an answer."

    except Exception as e:
        print("GEMINI ERROR:", str(e))
        raise