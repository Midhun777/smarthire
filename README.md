# SkillRoute AI (SmartHire) 🚀

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Google_Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket" />
</div>

<br/>

**SkillRoute AI** is an intelligent, full-stack recruitment platform designed to securely and efficiently connect job seekers with employers by automatically matching uploaded resumes and skills to job postings using advanced Generative AI.

---

## 📑 Table of Contents
1. [Abstract](#-abstract)
2. [Problem Statement](#-problem-statement)
3. [System Overview](#-system-overview)
4. [User Roles & Responsibilities](#-user-roles--responsibilities)
5. [Core Modules](#-modules)
6. [Key Features](#-features)
7. [Data Flow & Database](#-data-flow--database-architecture)
8. [Technologies Used](#-technologies-used)
9. [Pages & UI Structure](#-pages--screens)
10. [Working Process](#-working-process)
11. [Advantages & Limitations](#-advantages--limitations)
12. [Future Enhancements](#-future-enhancements)
13. [Conclusion](#-conclusion)

---

## 🔹 Abstract
The traditional recruitment process is plagued with massive inefficiencies. SkillRoute AI addresses this critical bottleneck by acting as an intelligent mediator. Utilizing **Google Gemini AI**, the platform parses uploaded resumes and deeply analyzes job seeker skills against specific job requirements, instantly generating an accurate **"Match Percentage"**. Alongside this matching engine, the system features a real-time messaging interface, role-specific interactive dashboards, visual Kanban-style application trackers, and comprehensive administrative oversight logs.

---

## 🔹 Problem Statement
* **The Problem:** Job seekers guess their fit for a role, while employers manually filter through thousands of irrelevant, keyword-stuffed applications.
* **The Solution:** An unbiased, rapid, and automated system capable of interpreting human skills and accurately matching them with precise business requirements.

---

## 🔹 System Overview
The workflow operates in an integrated, step-by-step lifecycle:
1. **Initial Entry:** A guest registers as either a `job_seeker` or a `job_provider`.
2. **Profile Formulation:** The Seeker adds their details and uploads a PDF resume. The backend extracts text from this PDF.
3. **Marketplace Creation:** The Job Provider posts a new job listing with localized requirements.
4. **Intelligent AI Processing:** The backend dynamically forwards the seeker's profile and the Job's description to Google Gemini AI. The AI calculates a compatibility match percentage.
5. **Application Stage:** The Job Seeker formally applies to high-matched jobs.
6. **Provider Review:** The Provider's dashboard reflects the new applicant.
7. **Status & Communication:** The provider updates status and initiates real-time messaging natively via the socket-powered Chat Window.

---

## 🔹 User Roles & Responsibilities

| Role | Permissions and Capabilities |
| :--- | :--- |
| **Admin** | Oversee the entire ecosystem (view all users, jobs, applications). Suspend users, remove jobs, and monitor system Audit Logs. Manipulate global core settings. |
| **Provider** | Access the corporate hub. Create/oversee job postings. Evaluate candidates using AI Match scores. Manage application status and initiate real-time interviews. |
| **Seeker** | Create detailed profiles and upload PDF resumes. Browse jobs with AI compatibility testing. Submit applications and track them via visual Kanban tools. |

---

## 🔹 Modules
The system is separated into autonomous logical modules:

* 🔐 **Authentication Module:** Manages entry (JWT and hashing).
* 👤 **User/Profile Module:** Controls profiles and extracts PDF strings (`multer`, `pdf-parse`). Provides `resumeText` to AI matching.
* 🏢 **Job Module:** Core CRUD for company job postings. Communicates with `@google/genai` to generate user-match prompts.
* 📝 **Application Module:** Maps Users to Jobs. Tracks states (Applied, Reviewing, etc.) and populates UI Kanban structures.
* 💬 **Chat/Notification Module:** WebSockets implementation. Uses `socket.io` for zero-latency messaging.
* 🛡️ **Admin/Audit Module:** Specialized logging mapping granular HTTP verbs mapping to platform actions.

---

## 🔹 Features
* **Automated Resume Parsing:** Extracts textual strings from complex PDF resumes automatically upon upload.
* **Generative AI Match Generator:** Combines Seeker's skills + resume text + Job description into an LLM prompt yielding an integer compatibility score.
* **Interactive Kanban Tracker:** Visually categorizes applications into distinct status columns.
* **Real-Time Live Messaging:** MongoDB-persisted `Conversation` tracking utilizing web sockets for ephemeral bidirectional connectivity.

---

## 🔹 Data Flow & Database Architecture

### Data Flow Example (Application Flow)
1. Seeker clicks "Apply" UI trigger.
2. `POST /applications` fires to the backend.
3. New `Application` Schema created linking `UserId` and `JobId`.
4. Trigger notification into MongoDB for the `ProviderId`.
5. WebSocket fires `unread_update` forcing exact UI components to react natively.

### Database Collection (MongoDB / Mongoose)
* `Users`: name, role, skills array, savedJobs refs.
* `Jobs`: title, description, skillsRequired, providerId ref.
* `Applications`: Junction collection (seekerId, jobId, matchScore, string status).
* `Conversations / Messages`: Relational mapping of messages to chat sessions.
* `Notifications & AuditLogs`: Alert and administration tracking schemas.

---

## 🔹 Technologies Used
* **Frontend:** React.js (v19) / Vite / Tailwind CSS / Lucide-React / React-Router-DOM / Recharts
* **Backend:** Node.js / Express.js
* **Database:** MongoDB / Mongoose
* **Generative AI Toolkit:** `@google/genai` (Gemini API)
* **Real-time Engine:** `socket.io` & `socket.io-client`
* **Core Libraries:** `multer` (Uploads), `pdf-parse` (Extraction), `bcrypt` & `jsonwebtoken` (Security)

---

## 🔹 Pages & Screens
* **Auth**: `Login.jsx`, `Signup.jsx`
* **Dashboards**: `Dashboard.jsx` (Seeker), `ProviderDashboard.jsx` (Corporate Hub), `AdminOverview.jsx` (Global Hub).
* **Job System**: `Discovery.jsx` (Infinite job scroll with AI badges), `JobDetails.jsx` (Single listing view).
* **User Interfaces**: `Profile.jsx` / `CompleteProfile.jsx` (Data injection), `KanbanTracker.jsx` (Visual board).
* **Engagement**: `ChatInbox.jsx` / `ChatWindow.jsx` (Messaging UI).

---

## 🔹 Working Process
1. User globally registers as a 'Job Seeker'.
2. The user traverses to complete their profile safely loading their master PDF resume wrapper.
3. A corporate user logs in, creating an urgent listing for a Developer.
4. Seeker checks "Discovery", locating the new job. The Gemini API calculates an 88% Match percentage.
5. Trusting the AI insight, Seeker applies.
6. The Job Provider visualizes the new applicant intelligently sorted by Match score.
7. The Provider utilizes the Chat tool directly inside the platform to coordinate hiring logistics.

---

## 🔹 Advantages & Limitations
### Advantages ✅
* **Cuts Overhead:** Eliminates deeply manual resume analysis.
* **Confidence Building:** Eliminates 'guess' applications through rigorous smart AI percentiles.
* **Centralization:** Fuses searching, matching, and direct communication natively.

### Limitations ⚠️
* Highly reliant on the Google Gemini infrastructure remaining consistently online without rate-limit throttling.
* Web socket integrations universally require stable bandwidth to operate flawlessly.

---

## 🔹 Future Enhancements
* **🚀 Smart Voice AI Interviews:** Incorporating native Audio Chatbot pathways parsing automated technical interviews.
* **📱 Dedicated App:** Transitioning towards React-Native implementations supporting iOS/Android.
* **✉️ External Routing:** Firing automated SMS pushes whenever live chats go unread globally.

---

## 🔹 Conclusion
SkillRoute AI represents an enterprise-grade, modern-web engineering initiative dramatically modernizing the historically fragmented hiring paradigm. By intertwining the reactive speed of the foundational React/Node (MERN) framework alongside dynamic Generative Artificial Intelligence pipelines via Google Gemini—the ecosystem serves as an advanced toolkit for enterprise businesses and career seekers entirely.
