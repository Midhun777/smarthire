# SkillRoute AI (SmartHire)

---

## 1. Project Title
**SkillRoute AI: An AI-Powered Job Recommendation and Career Mentorship Platform**

## 2. Abstract
The traditional job search and recruitment process is often tedious, time-consuming, and inefficient. Candidates struggle to find roles that accurately match their skills, while recruiters face difficulties in screening hundreds of applications to find the perfect candidate. SkillRoute AI is an intelligent, AI-powered web platform designed to bridge this gap. By leveraging advanced Artificial Intelligence (Google Gemini API), the system automatically analyzes a job seeker’s profile and skills, generating a highly accurate match percentage for available job roles. Beyond simple job recommendations, the platform integrates career mentorship features, a real-time communication system, and an interactive learning roadmap. By combining automated resume parsing, AI-driven insights, and structured mentorship, SkillRoute AI provides a holistic ecosystem that simplifies recruitment for employers and accelerates career growth for job seekers.

## 3. Introduction
**Problem Statement:**
In today's competitive job market, candidates often apply for jobs where they don't meet the core requirements, leading to high rejection rates. Conversely, companies spend vast amounts of time manually filtering through unqualified resumes. There is a clear need for a smarter system that can automatically understand human skills and job requirements to create perfect matches.

**Usefulness:**
SkillRoute AI solves this problem by functioning as a smart bridge between eager job seekers, experienced mentors, and hiring companies. It removes the guesswork from job hunting by telling users exactly how well they fit a job and what skills they need to improve. It saves time for recruiters by sorting candidates using AI-driven match scores.

## 4. Features
* **AI-Powered Job Matching:** Intelligent algorithm that calculates a "Match Percentage" between a candidate's skills and a job's requirements.
* **Smart Dashboard:** Comprehensive separate dashboards for Job Seekers, Job Providers, Mentors, and Admins.
* **Automated Resume Parsing:** Extracts skills and details directly from uploaded PDF resumes.
* **Gamified User Profiles:** Dynamic, auto-generated vector avatars and interactive user badges.
* **Real-time Chat System:** Built-in messaging for users, mentors, and recruiters to communicate instantly.
* **Career Roadmaps & Learning:** A dedicated space for candidates to track their learning progress and submit project assignments.
* **Role-Based Access Control (RBAC):** Secure login routing ensuring users only see the data relevant to their specific role.

## 5. System Overview
The system operates on a modern client-server architecture:
1. **User Authentication:** A user registers on the platform and selects their role (Seeker, Provider, Mentor).
2. **Profile Creation:** Users build their profile. Seekers upload their skills/resume, while Providers post job openings.
3. **AI Processing:** When a Seeker views jobs, the server sends their skill data and the job description to the AI engine, which responds with a compatibility score.
4. **Interaction:** Seekers apply for high-match jobs. Providers receive these applications.
5. **Mentorship:** Seekers can connect with mentors for guidance via the integrated chat system.

## 6. Modules / Components
* **Authentication Module:** Handles secure login, registration, and password management using JWT (JSON Web Tokens).
* **Job Seeker Module:** Allows candidates to browse jobs, view their AI match scores, save jobs as bookmarks, and track applications.
* **Job Provider Module:** An enterprise portal for companies to post new job listings, view applicants, and analyze recruitment metrics.
* **Mentor Module:** A dedicated interface where industry experts can track student progress, review submitted phase projects, and provide guidance.
* **Admin Module:** A centralized control panel for managing users, overseeing platform activity, and monitoring system audit logs.
* **Chat System Module:** A real-time socket-based messaging component allowing instant communication between users.

## 7. Technologies Used
* **Frontend:** React.js, Vite, Tailwind CSS (for modern, responsive styling), Recharts (for data visualization), Lucide React (for icons).
* **Backend:** Node.js, Express.js (for building robust REST APIs).
* **Database:** MongoDB & Mongoose (for flexible, document-based data storage).
* **Artificial Intelligence:** Google Gemini API (`@google/genai`) for intelligent matching and data extraction.
* **Real-time Communication:** Socket.io (for instant messaging).
* **Authentication:** JSON Web Tokens (JWT) for robust security.
* **File Handling:** Multer and PDF-Parse for secure resume uploads and text extraction.

## 8. Working Process
1. **Onboarding:** The user creates an account and logs in safely.
2. **Data Input:** A recruiter posts a job listing with required skills. A job seeker inputs their technical skills or uploads a resume.
3. **AI Evaluation:** The candidate navigates to the "Job Feed". The system invisibly asks the AI to compare the candidate with the jobs.
4. **Actionable Insights:** The candidate sees a "Match %" badge on each job. They confidently apply to the best fits.
5. **Review:** The recruiter checks their dashboard and sees applications sorted by relevance.
6. **Connection:** They can initiate a chat with the candidate directly on the platform to schedule an interview.

## 9. Advantages
* **Time-saving:** Drastically reduces the time spent on manual resume screening for recruiters.
* **High Accuracy:** AI-driven matching ensures candidates are recommended jobs they are actually qualified for.
* **All-in-one Platform:** Combines job searching, networking, learning roadmaps, and mentoring in a single application.
* **User-friendly:** Clean, modern, and responsive interface makes navigation simple for non-technical users.

## 10. Limitations
* **AI Dependency:** The accuracy of job matching relies heavily on the Google Gemini API; if the AI service goes down, the matching feature is temporarily crippled.
* **Self-Reported Data:** The system assumes that the skills entered by the job seeker or parsed from the resume are entirely truthful.
* **Internet Requirement:** Being a cloud-based web application, it requires a constant and stable internet connection to function optimally, especially for real-time chat.

## 11. Future Enhancements
* **Interview Preparation AI:** Add mock AI-driven interviews where the system generates questions based on the applied job and evaluates the user's answers.
* **Mobile Application:** Develop a dedicated app version using React Native for Android and iOS devices.
* **Automated Skill Verification:** Integrate coding tests or quizzes to verify a candidate's self-reported skills before they apply.
* **Email Notifications:** Add automated email or SMS alerts for when a job seeker is selected for an interview or receives a chat message.

## 12. Conclusion
SkillRoute AI (SmartHire) successfully modernizes and streamlines the challenging landscape of hiring and career development. By harnessing the predictive power of Artificial Intelligence, the project turns a typically fragmented process into a smooth, guided journey for both applicants and recruiters. With its robust architecture, real-time features, and user-centric design, SkillRoute AI stands as a highly practical and scalable solution for the future of digital recruitment.
