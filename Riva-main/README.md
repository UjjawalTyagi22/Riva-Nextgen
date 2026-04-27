**RIVA** is an intelligent voice-powered AI assistant built for the **NextGen Supercomputing Club** at KIET Group of Institutions. It combines cutting-edge AI technology with an immersive 3D audio visualization experience to serve as the club's digital host and expert.

## 🚀 Features

-   **Gemini 3 Flash AI**: Powered by Google's latest `gemini-3-flash-preview` model for ultra-fast and intelligent responses.
-   **Voice-First Interaction**: Integrated hands-free conversation capabilities using Browser Web Speech API.
-   **3D AudioSphere Visualization**: A real-time Three.js animated sphere that reacts dynamically to voice amplitude and frequency.
-   **Split-Panel UI**: A premium dark-themed interface with separate streams for AI responses and user inputs.
-   **Deep Knowledge Base**: Specialized expert knowledge on the NextGen Supercomputing Club and **Smart India Hackathon (SIH) 2025** projects.
-   **Intelligent Response Logic**: 
    -   Detailed, formatted introductions for club-specific queries.
    -   Concise, "short & crisp" (2-4 sentences) answers for general topics.
    -   Natural typewriter effect for all AI messages.
-   **Multi-Model Ready**: Backend support for both Google Gemini and OpenAI (GPT-4o Mini) providers.

## 🛠 Tech Stack

### Backend
-   **Node.js & Express**: Core API server.
-   **Google Generative AI**: Gemini 3 Flash Preview integration.
-   **OpenAI SDK**: Support for GPT-4o Mini and Whisper STT.
-   **Dotenv**: Secure environment variable management.

### Frontend
-   **React.js**: UI component architecture.
-   **Three.js**: 3D rendering engine for the AudioSphere.
-   **Web Speech API**: Native browser support for STT (Speech-to-Text) and TTS (Text-to-Speech).
-   **React Markdown**: Rich text formatting for AI responses.

## 📦 Project Structure

```text
Riva-main/
├── backend/
│   ├── server.js           # Main Express server & AI logic
│   ├── list_models.js      # Utility to check available Gemini models
│   ├── .env                # Environment configurations (API Keys)
│   └── package.json        # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js          # Core React application logic
│   │   ├── App.css         # Premium styling and animations
│   │   └── components/
│   │       └── AudioSphere.js # Three.js visualization component
│   └── package.json        # Frontend dependencies
└── README.md               # Main project documentation
```

## ⚙️ Installation & Setup

### 1. Prerequisites
-   Node.js (v16.x or higher)
-   NVIDIA API Key (optional, for hardware-specific info)
-   Gemini API Key (Required)

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
GEMINI_API_KEY=your_key_here
AI_PROVIDER=gemini
PORT=5000
```
Start the server:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🎮 Usage & Commands

1.  **Welcome Message**: RIVA greets you automatically upon the first interaction.
2.  **Voice Input**: Click the **Mic Icon** to start speaking. RIVA detects your voice and processes the request.
3.  **Special Triggers**:
    -   *"Are you ready to take over?"*: RIVA delivers the full club inauguration speech.
    -   *"Tell me about the club"*: Provides a comprehensive overview of mission and activities.
    -   *"Tell me about SIH projects"*: Lists all Smart India Hackathon projects under the club.
4.  **Microphone Test**: Use the **Test Mic** button to calibrate your audio levels.

## 🧠 Knowledge Domains

### NextGen Supercomputing Club
-   **Focus**: HPC, AI/ML, Quantum Computing, and GPU Programming.
-   **Hardware**: Access to **NVIDIA DGX A100** Supercomputer.
-   **Motto**: "Building Production Brains".

### SIH 2025 Projects
RIVA contains detailed information on various student projects:
-   **CodeGamma**: Livestock Management System.
-   **JanMitr**: Civic Infrastructure Platform.
-   **TechYodhaas**: Digital Heritage Preservation.
-   **Omnitrix**: AI-Powered Sports Performance Analytics.


**Built by Ujjawal Tyagi**
*Where Intelligence Meets Innovation*
