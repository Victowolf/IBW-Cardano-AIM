import os
import fitz  # PyMuPDF for PDFs
from docx import Document

def extract_text_from_pdf(file_path: str) -> str:
    """Extracts all text from a PDF file."""
    text = ""
    with fitz.open(file_path) as pdf:
        for page in pdf:
            text += page.get_text("text")
    return text.strip()

def extract_text_from_docx(file_path: str) -> str:
    """Extracts all text from a DOCX file."""
    doc = Document(file_path)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text.strip()

def extract_text_from_txt(file_path: str) -> str:
    """Reads plain text file."""
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read().strip()

def extract_text(file_path: str) -> str:
    """
    Universal function to extract text from a CV file.
    Supports: .pdf, .docx, .txt
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext == ".docx":
        return extract_text_from_docx(file_path)
    elif ext == ".txt":
        return extract_text_from_txt(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

if __name__ == "__main__":
    # Example usage (for testing)
    cv_path = input("Enter path to CV file (.pdf/.docx/.txt): ").strip()
    try:
        extracted_text = extract_text(cv_path)
        print("\n[INFO] Extracted Text:\n")
        print(extracted_text[:1500])  # print first 1500 chars
    except Exception as e:
        print(f"[ERROR] {e}")
