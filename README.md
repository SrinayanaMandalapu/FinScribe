# 📊 FinScribe

FinScribe is a web application that helps analyze **conference call and earnings call transcripts**.  
It allows users to upload PDF documents, extract key insights using **Generative AI**, and store results in a structured database for easy retrieval and visualization.

🔗 **Live Demo**: https://document-analyzer-2kuo.onrender.com/

---

## 🚀 Features Implemented

- **PDF Uploads**: Upload conference call/earnings call transcripts in PDF format.  
- **Text Extraction**: Extract text from uploaded PDFs using [PyMuPDF](https://pymupdf.readthedocs.io/).  
- **AI-Powered Analysis**: Analyze transcript content with the **Gemini API**, extracting:  
  - 📌 Company Name  
  - 📌 Description (summary)  
  - 📌 Verdict (Positive/Negative sentiment)  
  - 📌 Date of transcript  
- **Database Storage**: Save results into a **PostgreSQL** database using SQLAlchemy.  
- **Frontend Integration**: View analyzed results on a clean React-based frontend.  
- **Deployment**: Backend + DB deployed on **Render**.

---

## 🛠️ Tech Stack

- **Backend**: Flask (Python), SQLAlchemy  
- **Frontend**: React + Vite  
- **Database**: PostgreSQL (Render-hosted)  
- **AI Model**: Gemini API  
- **Deployment**: Render  

---

## ⚙️ Setup & Run Locally

1. Clone the repo  
   ```bash
   git clone https://github.com/<your-username>/FinScribe.git
   cd FinScribe

2. Setup Environment Variables

Create a .env file in the root directory and add:

API_KEY=your_gemini_api_key
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/db_name

3. Run Backend
    ````bash
    cd backend
    python app.py

4. Run Frontend
    ````bash
    cd frontend
    npm install
    npm run dev

---

## 🔜 Work in Progress & Future Enhancements

- 🌐 Automated transcript scraping from NSE and similar investor relation sources.  
- ☁️ Migration to cost-efficient private cloud APIs for scalability.  
- 📲 Subscriber alerts via WhatsApp/Email for key updates.  
- 🤖 Future integration with automated trading workflows.  


