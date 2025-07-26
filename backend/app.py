from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import json
import fitz  # PyMuPDF for PDF reading
import google.generativeai as genai
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
CORS(app)
api_key = os.getenv('API_KEY')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///documents.db'
db = SQLAlchemy(app)

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(200))
    description = db.Column(db.Text)
    verdict = db.Column(db.String(50))
    date = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

def extract_text_from_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        file_path = os.path.join("uploads", file.filename)
        os.makedirs("uploads", exist_ok=True)
        file.save(file_path)

        print(f"File saved to {file_path}")

        text = extract_text_from_pdf(file_path)
        print(f"Extracted text: {text[:100]}...")

        prompt = f"""You are a financial analyst. Analyze this content and provide in JSON:
{{
"Company Name": "...",
"Description": "...",
"Verdict": "Positive or Negative",
"Date": "YYYY-MM-DD"
}}
Content:
{text}
"""
        response = model.generate_content(prompt)
        raw_output = response.text
        print(f"Raw response: {raw_output}")

        cleaned = raw_output.replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned)
        print(f"Parsed result: {result}")

        # Save to DB
        doc = Document(
            company_name=result["Company Name"],
            description=result["Description"],
            verdict=result["Verdict"],
            date=result["Date"]
        )
        db.session.add(doc)
        db.session.commit()
        print("Saved to DB")

        return jsonify({"message": "Document analyzed and saved"}), 200

    except Exception as e:
        print(f"Error: {e}")  # PRINT FULL ERROR
        return jsonify({"error": str(e)}), 500


@app.route('/results', methods=['GET'])
def get_results():
    docs = Document.query.order_by(Document.timestamp.desc()).all()
    output = [{
        "Company Name": d.company_name,
        "Description": d.description,
        "Verdict": d.verdict,
        "Date": d.date,
        "Timestamp": d.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    } for d in docs]
    return jsonify(output)


# Serve React frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

# Run
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=port)