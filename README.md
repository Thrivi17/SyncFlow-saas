# ⚡ SyncFlow

> **Turn one asset into multi-platform gold.**

SyncFlow is a production-grade, full-stack AI SaaS application built for the **Galuxium Nexus V2** hackathon. It empowers creators, marketers, and developers to transform raw, long-form text (such as blog posts, release notes, or brainstorms) into a structured multi-platform content suite in seconds.

---

## 🚀 Live Demo & Endpoints
* **Frontend Web App (React Native / Expo)**: [https://syncflow-frontend-v89l.onrender.com](https://syncflow-frontend-v89l.onrender.com)
* **Backend API Swagger Docs (FastAPI)**: [https://syncflow-backend-bimz.onrender.com/docs](https://syncflow-backend-bimz.onrender.com/docs)

---

## 🛠️ Architecture & Tech Stack

SyncFlow utilizes a decoupled, modern cloud-native architecture hosted on Render:

* **Frontend**: 
  * **Framework**: React Native & Expo (compiled for Web)
  * **Styling**: Custom responsive StyleSheet with dark-mode SaaS UI
  * **State Management**: React Hooks (`useState`) with an interactive *Session History Vault*
* **Backend**: 
  * **Framework**: Python FastAPI (asynchronous, high-throughput)
  * **Validation**: Pydantic for robust request/response payload parsing
  * **Middleware**: Global CORS middleware enabled for seamless cross-origin communication
* **AI Engine**: 
  * **Provider**: Groq API (using the OpenAI-compatible Python SDK)
  * **Model**: `openai/gpt-oss-20b` for blazing-fast hardware acceleration and inference

---

## ✨ Core Features

1. **Multi-Tone Content Engine**: Toggle between **Professional**, **Viral**, and **Technical** output modes to instantly adapt the generated copy to your target audience.
2. **Tri-Platform Content Suite**: Generates a unified output package including:
   * 🐦 **Twitter Thread**: Hook-driven, numbered multi-tweet sequence.
   * 💼 **LinkedIn Post**: Structured network update with professional formatting and hashtags.
   * 🚀 **Changelog Summary**: Concise engineering release note.
3. **Session History Vault**: Automatically archives past generations during your session, allowing you to click any past entry to instantly restore text, tone, and results.
4. **Export & Utility Tools**: One-click clipboard copying and direct `.md` (Markdown) file downloading optimized for web deployment.

---

## 📂 Project Structure

```text
syncflow/
├── backend/
│   ├── main.py          # FastAPI application & Groq / OpenAI-compatible client integration
│   ├── requirements.txt # Python dependencies (fastapi, uvicorn, groq, python-dotenv)
│   └── .env             # Environment variables (GROQ_API_KEY)
└── frontend/
    ├── App.js           # React Native Web UI & live Render API fetch logic
    ├── package.json     # Node dependencies (expo, react-native-web)
    └── app.json         # Expo configuration
