import os

from dotenv import load_dotenv
from google import genai


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not configured.")


client = genai.Client(api_key=api_key)


def generate_answer(question, context):

    prompt = f"""
You are a medical document question-answering assistant.

Answer the user's question using ONLY the information provided
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
4. Do not repeat the entire context.
5. Give only the answer relevant to the question.
6. Keep the answer concise.
7. If the answer is not present in the context, respond exactly:

I could not find this information in the uploaded medical document.

8. Do not claim to be a doctor.

Answer the QUESTION now.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    if not response or not response.text:
        return "I could not generate an answer."

    return response.text.strip()