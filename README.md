# SkillRoute AI (SmartHire) 🚀

![SkillRoute AI](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue) ![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-success) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-green) ![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange)

SkillRoute AI is an intelligent, full-stack recruitment and mentorship platform. It leverages Google's Gemini AI to automatically calculate match percentages between a candidate's skills and a job's requirements, fundamentally streamlining the hiring process.

---

## 📑 Table of Contents
- [Abstract](#-abstract)
- [Introduction](#-introduction)
- [Key Features](#-key-features)
- [System Overview](#-system-overview)
- [Technologies Used](#-technologies-used)
- [Working Process](#-working-process)
- [Quick Start limit](#-quick-start)
- [Future Enhancements](#-future-enhancements)

---

## 📖 Abstract
The traditional job search process is tedious and inefficient. SkillRoute AI bridges the gap between eager candidates and overloaded recruiters. By generating highly accurate AI "Match Percentages" based on skills and resumes, it removes the guesswork from hiring. Additionally, the platform provides integrated mentorship features, project roadmaps, and real-time messaging, creating a holistic ecosystem for career growth.

## 💡 Introduction
**The Problem:** Candidates apply for roles blindly, and companies waste hours manually screening unqualified resumes. 
**The Solution:** SkillRoute AI acts as a smart mediator. It evaluates user skill sets against job descriptions instantly, guiding candidates toward the right jobs and providing recruiters with sorted, relevant applications.

## ✨ Key Features
- **🤖 AI-Powered Job Matching:** Accurately compares user skills with job postings using the Gemini AI API.
- **📊 Comprehensive Dashboards:** Distinct interfaces for Seekers, Providers, Mentors, and Admins.
- **📄 Automated Resume Parsing:** Extracts valuable metadata directly from PDF resume uploads.
- **💬 Real-time Chat System:** Built-in Socket.io messaging for instant user-recruiter-mentor communication.
- **🎓 Mentorship & Roadmaps:** Track learning progress, submit assignments, and receive feedback from industry experts.
- **🎨 Dynamic Gamification:** Auto-generated vector avatars to enhance the community feel.

## ⚙️ System Overview
SkillRoute uses a robust Client-Server architecture. 
1. **Frontend:** A responsive Vite + React single-page application focused on premium UI/UX.
2. **Backend:** An Express.js REST API handling business logic, database queries, and AI prompt engineering.
3. **Database:** MongoDB handles document storage for Users, Jobs, Applications, and Chat History.
4. **AI Engine:** Google Gemini handles complex text analysis and scoring invisibly in the background.

## 💻 Technologies Used

### Frontend
* **React.js & Vite:** Core framework and build tool.
* **Tailwind CSS:** For rapid, responsive, and modern UI styling.
* **React Router Dom:** For secure role-based navigation.
* **Recharts:** For analytical dashboards.

### Backend
* **Node.js & Express.js:** Server environment and API framework.
* **JSON Web Tokens (JWT):** For secure authentication and authorization.
* **Socket.io:** For bidirectional real-time communication.
* **Multer & PDF-Parse:** For secure file uploading and text extraction.

### Database & Services
* **MongoDB (Mongoose):** NoSQL database schema modeling.
* **Google Gemini API:** AI capabilities and text generation.

## 🚀 Working Process
1. **Register/Login:** Users authenticate securely based on their specific role.
2. **Profile Setup:** Users add skills or upload a resume. Companies post job listings.
3. **AI Discovery:** As a Seeker browses jobs, the system runs an invisible AI check, returning a tailored "Match %".
4. **Connect:** Seekers apply to perfect-match jobs. Recruiters view sorted applications and can instantly open a unified chat to schedule interviews.

## 🛠 Quick Start

Ensure you have Node.js and MongoDB installed on your local machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YourUsername/SkillRoute-AI.git
   cd job-ai-1
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Environment Setup:**
   Create `.env` files in both `/client` and `/server` directories matching your configuration (MongoDB URI, JWT Secret, Gemini API Key, etc.).

4. **Run the Application (Development Mode):**
   ```bash
   npm run dev
   ```
   *This single command will concurrently start both the React frontend and Node backend.*

## 🔮 Future Enhancements
* **AI Mock Interviews:** Voice-based conversational AI for interview preparation.
* **Mobile App:** A native React Native mobile companion app.
* **Skill Verification:** Built-in coding quizzes to validate self-reported skills.

---

> **Note:** This project was developed as a comprehensive college/portfolio project to demonstrate proficiency in Full-Stack MERN development and modern AI API integration.
