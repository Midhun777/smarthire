# SkillRoute AI (SmartHire) - Project Documentation
> *An immensely detailed architectural, systemic, and database breakdown.*

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</div>

<br/>

---

## 📑 TABLE OF CONTENTS
1. [Project Overview](#1-project-overview)
2. [Abstract](#2-abstract)
3. [Problem Statement](#3-problem-statement)
4. [System Overview](#4-system-overview-very-important)
5. [User Roles & Responsibilities](#5-user-roles--responsibilities)
6. [Modules](#6-modules-core-part)
7. [Features](#7-features-very-detailed)
8. [Data Flow & Feature Connections](#8-data-flow--feature-connections)
9. [Pages / Screens](#9-pages--screens)
10. [Components / Structure](#10-components--structure)
11. [Technologies Used](#11-technologies-used)
12. [Database Overview](#12-database-overview-very-important)
13. [Tables / Collections](#13-tables--collections)
14. [Attributes (Columns)](#14-attributes-columns)
15. [Relationships Between Tables](#15-relationships-between-tables)
16. [Data Flow (Detailed)](#16-data-flow-detailed)
17. [Feature-Wise Data Flow](#17-feature-wise-data-flow)
18. [Data Connection Between Features](#18-data-connection-between-features)
19. [CRUD Operations](#19-crud-operations)
20. [Data Validation & Constraints](#20-data-validation--constraints)
21. [Overall Data Architecture](#21-overall-data-architecture)
22. [Working Process (User Journey)](#22-working-process-user-journey)
23. [Advantages](#23-advantages)
24. [Limitations](#24-limitations)
25. [Future Enhancements](#25-future-enhancements)
26. [Conclusion](#26-conclusion)

---

## 1. PROJECT OVERVIEW
* **Project Title:** SkillRoute AI (SmartHire)
* **Short Description:** An intelligent, full-stack web application designed to connect job seekers with employers by automatically matching resumes to job postings using advanced AI.
* **Purpose of the Project:** To simplify and speed up the recruitment process. It helps candidates figure out which jobs they actually qualify for, and it helps employers instantly filter applicants without manually reading every single resume.

## 2. ABSTRACT
The traditional job searching and hiring process is incredibly time-consuming. Job seekers often apply blindly to dozens of roles, while Human Resources (HR) teams get overwhelmed by thousands of irrelevant applications. SkillRoute AI is built to completely solve this problem. 

By leveraging the Google Gemini Artificial Intelligence API, the system automatically reads an uploaded PDF resume and compares the user's skills against a job's requirements. It mathematically calculates an exact "Match Percentage." Alongside this powerful AI matching engine, the platform includes a real-time messaging system, visual application tracking (Kanban boards), and distinct dashboards for both employers and job seekers. Ultimately, this system makes hiring data-driven, fair, instant, and frictionless.

## 3. PROBLEM STATEMENT
* **What problem this project solves:** 
  1. For candidates: The uncertainty of not knowing if their skills match a job.
  2. For recruiters: The massive waste of time spent manually reading unqualified resumes.
  3. For both: The disjointed communication that usually relies on slow email threads.

## 4. SYSTEM OVERVIEW (VERY IMPORTANT)
The entire system operates as a connected loop:
* **Step 1:** A user registers on the website and chooses whether they are a 'job_seeker' or a 'job_provider'.
* **Step 2:** A job seeker fills out their profile and uploads their PDF resume. The system extracts the text from the PDF.
* **Step 3:** A job provider posts a job vacancy detailing the required skills.
* **Step 4:** The seeker searches for jobs. Behind the scenes, the AI compares the seeker's extracted resume text with the job vacancy text and outputs a Match Score (e.g., 85%).
* **Step 5:** The seeker clicks "Apply" for the top matching jobs. Data is stored in the database.
* **Step 6:** The job provider opens their dashboard, sees the new applicant arranged by rank, and clicks "Message" to directly chat with the candidate natively in the app.

## 5. USER ROLES & Responsibilities
* **Admin:** 
  * *What they do:* The highest authority.
  * *Actions:* They can view all users, suspend accounts, delete inappropriate job posts, and track system audit logs.
* **Provider (Recruiter/Employer):**
  * *What they do:* Represent a company looking to hire.
  * *Actions:* Post new jobs, edit details, review applications sorted by AI match scores, change status, and message seekers.
* **Seeker (Normal User):**
  * *What they do:* Looking for a career.
  * *Actions:* Edit skills, upload a PDF resume, browse job listings, see their AI match percentage, apply for jobs, and continuously track their status on a visual Kanban board.

## 6. MODULES (CORE PART)
* **Authentication Module:** Manages logins securely. Encrypts user passwords. Uses JSON Web Tokens (JWT).
* **Profile / User Module:** Handles personal data. Uses `multer` to accept PDF uploads and `pdf-parse` to convert the PDF document into raw text strings.
* **Job / Post Module:** Where jobs are created and AI comparisons happen. Sends payload to Google Gemini AI API to receive mathematically scoped scores.
* **Application Module:** Connects a user to a job they want. Controls tracking (Pending, Reviewed, Accepted).
* **Chat / Notification Module:** The real-time communication engine using WebSockets (`socket.io`).

## 7. FEATURES (VERY DETAILED)
* **Auto Resume Parsing:** Turning a PDF file into readable database text. It strips images and format, saving pure text. Connects User Module to the Job Module.
* **AI Job Match Engine:** Generates a percentage score of how well you fit a job. Sends prompt to Google Gemini AI, which replies with a JSON score. Connects Job Module and External AI.
* **Live Inbox / Chat:** A WhatsApp-style window. Socket.io pushes messages immediately. Connects Chat Module to Notifications.

## 8. DATA FLOW & FEATURE CONNECTIONS
- **Registration Flow:** UI → HTTP Post → Backend → Hashing → Database Write → Return JWT Token → UI.
- **Application Flow:** Seeker Applies → System triggers Notification creation in Database → Provider's Unread Bell Icon turns red immediately via WebSocket.

## 9. PAGES / SCREENS
* **Login/Register:** Entry bounds.
* **Seeker Dashboard:** Summary of saved jobs and applied counts.
* **Provider Dashboard:** Employer's view indicating active jobs and applicants.
* **Discovery Page:** The job hunting feed. Shows active job badges.
* **Job Details Page:** Full Job text.
* **Completer Profile Page:** Form interface to upload skills.
* **Kanban Tracker:** A drag-and-drop horizontal board showing jobs under moving columns.
* **Chat Inbox Page:** Two-pane view messaging layout.

## 10. COMPONENTS / STRUCTURE
* **Frontend Structure:** Built in React. Split into small reusable components like `JobCard`, `Navbar`, and `ExperienceModal`.
* **Backend Structure:** Node/Express. Separated into routes, controllers, and database models.
* **API Flow:** The frontend strictly converses with the backend exclusively via JSON endpoints.

## 11. TECHNOLOGIES USED
* **Frontend:** React.js, Vite, Tailwind CSS, React Router DOM, Recharts, Lucide-React.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose ORM).
* **AI Engine:** Google Gemini API.
* **Real-time Engine:** `socket.io`.
* **File Handling:** `multer` and `pdf-parse`.

---
# DATABASE SECTION (VERY IMPORTANT)

## 12. DATABASE OVERVIEW
* **Type of Database:** MongoDB (NoSQL Document database).
* **Why this database is used:** MongoDB is highly flexible. Unlike strict SQL tables, it stores data in JSON-like "documents". Because job requirements and human skills can vary vastly in layout and size, NoSQL handles those shifting datasets perfectly.

## 13. TABLES / COLLECTIONS
* **`Users`**: Stores humans logging into the system.
* **`Jobs`**: Stores postings created by companies.
* **`Applications`**: Acts as a bridge junction linking a User to a Job.
* **`Conversations`**: Stores the meta backbone of a chat session between two people.
* **`Messages`**: Stores individual text bubbles sent within a Conversation.
* **`Notifications`**: Stores system alerts (like "You have a new match!").
* **`AuditLogs`**: Stores a permanent history of admin actions.

## 14. ATTRIBUTES (COLUMNS)
* **Users Table:**
  * `name`, `email`, `password` (Strings)
  * `role` (Enum: 'user', 'admin', 'job_seeker', 'job_provider')
  * `skills`, `education`, `experience` (Arrays)
  * `resumeText` (String)
* **Jobs Table:**
  * `title`, `company`, `location`, `description` (Strings)
  * `postedBy` (ObjectId linking to User)
  * `status` (String: 'active' or 'closed')
* **Applications Table:**
  * `job`, `user` (ObjectIds)
  * `status` (String Enum)
  * `aiMatch` (Object containing `matchPercentage` integer).
* **Conversations / Messages Table:**
  * `jobId`, `providerId`, `seekerId` (ObjectIDs in Conversation)
  * `content` (String in Message)

## 15. RELATIONSHIPS BETWEEN TABLES
* **One-to-Many (1:N):**
  * One *User* can create Many *Jobs* (Provider).
  * One *Conversation* has Many *Messages*.
* **Many-to-Many (M:N) resolved via Junctions:**
  * A *User* can apply to Many *Jobs*, and a *Job* can have Many *Users*. The **Applications Table** operates as the resolution point solving this many-to-many relationship smoothly.

## 16. DATA FLOW (DETAILED)
**Data Movement (Application Flow Example):**
`User Clicks "Apply"` -> `Frontend Formats JSON` -> `Backend Endpoint Receives` -> `Database Application.create()` -> `Database Mux Response` -> `Frontend UI Updates local state`

## 17. FEATURE-WISE DATA FLOW
* **Matching Feature:** 
  * Data used: `User.resumeText` + `Job.description`.
  * Where stored: Mathematical return calculates and sets directly into `Application.aiMatch.matchPercentage`.
* **Chat Feature:**
  * Data Created: A `Message` document containing `content`.
  * Where stored: Appended to the `Messages` db collection linking with `Conversation.id`.

## 18. DATA CONNECTION BETWEEN FEATURES
Dependencies are rampant. Changing an application status from "Pending" to "Accepted" (Tracker Feature) automatically triggers and generates an alert in the `Notifications` table (Alert Feature).

## 19. CRUD OPERATIONS
* **Create (C):** Signup accounts, Posting a Job, Sending a chat message.
* **Read (R):** Viewing the Job Feed, Opening profiles.
* **Update (U):** Editing a profile to push a new skill, updating tracking status.
* **Delete (D):** Admins enforcing account deletions and expired job posts.

## 20. DATA VALIDATION & CONSTRAINTS
* **Required Fields:** You cannot formulate a User document without `email` or `password`. 
* **Unique Fields:** `email` in User is absolutely unique across the entire table.
* **Constraints:** Conversation schema enforces a strict uniqueness constraint across `jobId`, `providerId`, and `seekerId` so duplicates aren't spawned. 

## 21. OVERALL DATA ARCHITECTURE
* **Frontend:** Browser holds temporary memory arrays (State).
* **Backend:** Express API ensures data shapes are legal.
* **Database:** MongoDB guarantees persistent, permanent storage of that memory securely on disk.

---

## 22. WORKING PROCESS (USER JOURNEY)
1. User Registers. Database secures the profile.
2. User Logs in. Back-end hands them an identifying JWT ticket.
3. User views jobs. AI Engine secretly calculates compatibility logic behind the scenes.
4. User Applies. Database writes linking connection via Application table.
5. Employer views dashboard, reads applications, triggers real-time Messaging socket to contact User.

## 23. ADVANTAGES
* **Saves Hours:** Eliminates manual resume reading.
* **Mathematical Reasoning:** Match percentages make hiring logical.
* **Direct Communication:** Keeps professional channels confined efficiently natively in-app.

## 24. LIMITATIONS
* Needs an active internet connection (for WebSocket persistence).
* Relies primarily on Google Gemini Servers to stay functioning.
* Artificial trust mechanism—the algorithm can be fooled if users grossly lie inside PDF data.

## 25. FUTURE ENHANCEMENTS
* Incorporate logic tests (React/SQL forms) to prove applicant skills mathematically.
* Standalone Mobile Apps via React Native.
* External Push Notifications to Text Message / WhatsApp.

## 26. CONCLUSION
SkillRoute AI represents an incredibly robust leap forward to modernize digital recruitment systems. By bridging a high-speed React user interface, incredibly dynamic MongoDB NoSQL architectural logic, and cutting-edge Generative AI—the platform successfully turns an agonizingly slow manual business constraint into a rapid, simple, and beautifully satisfying digital experience.
