# SkillRoute AI (SmartHire) - Complete Project Documentation

---

## 1. PROJECT OVERVIEW
* **Project Title:** SkillRoute AI (SmartHire)
* **Short Description:** An intelligent, full-stack web application designed to connect job seekers with employers by automatically matching resumes to job postings using advanced AI.
* **Purpose of the Project:** To simplify and speed up the recruitment process. It helps candidates figure out which jobs they actually qualify for, and it helps employers instantly filter applicants without manually reading every single resume.

---

## 2. ABSTRACT
The traditional job searching and hiring process is incredibly time-consuming. Job seekers often apply blindly to dozens of roles, while Human Resources (HR) teams get overwhelmed by thousands of irrelevant applications. SkillRoute AI is built to completely solve this problem. 

By leveraging the Google Gemini Artificial Intelligence API, the system automatically reads an uploaded PDF resume and compares the user's skills against a job's requirements. It mathematically calculates an exact "Match Percentage." Alongside this powerful AI matching engine, the platform includes a real-time messaging system, visual application tracking (Kanban boards), and distinct dashboards for both employers and job seekers. Ultimately, this system makes hiring data-driven, fair, instant, and frictionless.

---

## 3. PROBLEM STATEMENT
* **What problem this project solves:** 
  1. For candidates: The uncertainty of not knowing if their skills match a job.
  2. For recruiters: The massive waste of time spent manually reading unqualified resumes.
  3. For both: The disjointed communication that usually relies on slow email threads.

---

## 4. SYSTEM OVERVIEW (VERY IMPORTANT)
The entire system operates as a connected loop:
* **Step 1:** A user registers on the website and chooses whether they are a 'job_seeker' or a 'job_provider'.
* **Step 2:** A job seeker fills out their profile and uploads their PDF resume. The system extracts the text from the PDF.
* **Step 3:** A job provider posts a job vacancy detailing the required skills.
* **Step 4:** The seeker searches for jobs. Behind the scenes, the AI compares the seeker's extracted resume text with the job vacancy text and outputs a Match Score (e.g., 85%).
* **Step 5:** The seeker clicks "Apply" for the top matching jobs. Data is stored in the database.
* **Step 6:** The job provider opens their dashboard, sees the new applicant arranged by rank, and clicks "Message" to directly chat with the candidate natively in the app.

---

## 5. USER ROLES & RESPONSIBILITIES
* **Admin:** 
  * *What they do:* The highest authority. Monitors the health of the entire platform.
  * *Actions:* They can view all users, suspend accounts, delete inappropriate job posts, and track system audit logs (a history of everything happening on the platform).
* **Provider (Recruiter/Employer):**
  * *What they do:* Represent a company looking to hire.
  * *Actions:* Post new jobs, edit job details, review applications sorted by AI match scores, change applicant status (e.g., "Accepted" or "Rejected"), and message seekers.
* **Seeker (Normal User / Candidate):**
  * *What they do:* Looking for a job.
  * *Actions:* Create a profile, edit skills, upload a PDF resume, browse job listings, see their AI match percentage, apply for jobs, and continuously track their status on a Kanban board.

---

## 6. MODULES (CORE PART)
* **Authentication Module:**
  * *What it does:* Manages logins securely.
  * *How it works:* Encrypts user passwords into unreadable hashes. Uses JSON Web Tokens (JWT) to remember logged-in users safely.
* **Profile / User Module:**
  * *What it does:* Handles personal data and resume processing.
  * *How it works:* Uses a tool called `multer` to accept PDF uploads and `pdf-parse` to convert the PDF document into raw text strings that the AI can understand.
* **Job / Post Module:**
  * *What it does:* Where jobs are created and AI comparisons happen.
  * *How it works:* Sends job data and user data to Google Gemini AI via an API request to receive a mathematical compatibility score.
* **Application Module:**
  * *What it does:* Connects a user to a job they want.
  * *How it works:* Saves an entry linking the User ID and Job ID, along with their current status (Pending, Reviewed, Accepted).
* **Chat / Notification Module:**
  * *What it does:* The real-time communication engine.
  * *How it works:* Uses WebSockets (`socket.io`) to instantly send messages back and forth without forcing the user to refresh the webpage.

---

## 7. FEATURES (VERY DETAILED)
* **Feature: Auto Resume Parsing**
  * *What it is:* Turning a PDF file into readable database text.
  * *Internals:* When submitted, the backend intercepts the file, reads the binary data, strips away images/formatting, and saves just the important text.
  * *Connections:* Connects User Module to the Job Module. (Requires User text to make AI Job Matching possible).
* **Feature: AI Job Match Engine**
  * *What it is:* Generates a percentage score of how well you fit a job.
  * *Internals:* Packages the Job Description and the User's Resume Text into a "prompt". Sends it safely over the internet to Google's Gemini AI, which replies with a parsed JSON score.
  * *Connections:* Connects Job Module, User Module, and External AI APIs.
* **Feature: Live Inbox / Chat**
  * *What it is:* A WhatsApp-style window inside the web app.
  * *Internals:* When "Send" is clicked, Socket.io pushes the message payload immediately to the other user's screen while simultaneously saving it to the database.
  * *Connections:* Connects Chat Module to Database (for history) and Notifications (triggering bell icons).

---

## 8. DATA FLOW & FEATURE CONNECTIONS
- **Registration Flow:** User types email/password → Data hits backend server → Password is encrypted → New row created in Database → Success message sent back to UI.
- **Application Flow:** Seeker clicks Apply → Application record created tracking both Seeker ID & Job ID → "Application Received" Notification generated in DB for the Provider → Provider's Unread Bell Icon turns red. 
- **Connections:** E.g., The *Applying* feature automatically triggers the *Notification* feature, which in turn influences the *Chat* feature if the provider decides to reach out.

---

## 9. PAGES / SCREENS
* **Login/Register:** Entry doors to the platform.
* **Dashboard (Seeker):** Summary of saved jobs and active application counts.
* **Provider Dashboard:** Employer's view showing active job posts and recent candidates.
* **Discovery Page:** A scrolling feed of all available jobs, stamped with AI Match Badges.
* **Job Details Page:** Full textual read-out of a single job. Includes the final Apply button.
* **Completer Profile Page:** Form interface to add skills, colleges, and upload resumes.
* **Kanban Tracker:** A drag-and-drop style horizontal board showing jobs under "Applied", "Reviewing", and "Rejected" columns.
* **Chat Inbox Page:** Two-pane view (users on left, chat thread on right).
* **Admin Control Panel:** Tables showing data metrics, a list of all users, and system audit logs.

---

## 10. COMPONENTS / STRUCTURE
* **Frontend Structure:** Built using React. User Interface (UI) is split into small reusable components like `JobCard` (shows a tiny square of a job), `Navbar` (top navigation bar), and `ExperienceModal` (pop-ups).
* **Backend Structure:** Built in Node/Express. Separated into routes (URLs), controllers (logic brains), and models (database rules).
* **Overall Architecture:** A Client-Server Model. The React web browser talks to the Node server exclusively via JSON API endpoints.

---

## 11. TECHNOLOGIES USED
* **Frontend:** React.js, Vite, Tailwind CSS (for styling), React Router DOM (navigation), Recharts (graphs), Lucide-React (icons).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (via Mongoose).
* **AI:** `@google/genai` (Google Gemini API).
* **Real-time:** `socket.io` & `socket.io-client`.
* **Libraries:** `bcrypt` (password securing), `jsonwebtoken` (auth), `multer` (file handling), `pdf-parse` (pdf text reader).

---

## 12. DATABASE OVERVIEW (VERY IMPORTANT)
* **Type of Database:** MongoDB (NoSQL Document database).
* **Why this database is used:** MongoDB is highly flexible. Unlike strict SQL tables, it stores data in JSON-like "documents". Since a user's skills or a job's requirements can vary wildly in size, NoSQL handles those shifting arrays easily.

---

## 13. TABLES / COLLECTIONS
* **`Users`**: Stores all human humans logging into the system.
* **`Jobs`**: Stores postings created by companies.
* **`Applications`**: Acts as a bridge linking a User to a Job.
* **`Conversations`**: Stores the metadata of a chat session between two people.
* **`Messages`**: Stores individual text bubbles sent within a Conversation.
* **`Notifications`**: Stores system alerts (like "You have a new match!").
* **`AuditLogs`**: Stores a permanent history of admin and system actions.

---

## 14. ATTRIBUTES (COLUMNS)
* **Users Table:**
  * `name`, `email`, `password` (Strings)
  * `role` (String Enum: 'user', 'admin', 'job_seeker', 'job_provider')
  * `skills`, `education`, `experience` (Arrays)
  * `resumeText` (String: holds the extracted PDF data)
* **Jobs Table:**
  * `title`, `company`, `location`, `description` (Strings)
  * `postedBy` (ObjectId linking to a User)
  * `aiTags` (Array of Strings)
  * `status` (String: 'active' or 'closed')
* **Applications Table:**
  * `job` (ObjectId linking Job)
  * `user` (ObjectId linking User)
  * `status` (String: 'Pending', 'Reviewed', etc.)
  * `aiMatch` (Object containing `matchPercentage` Number).
* **Conversations / Messages Table:**
  * `jobId`, `providerId`, `seekerId` (ObjectIDs in Conversation)
  * `content` (String in Message)
  * `senderId` (ObjectId in Message)

---

## 15. RELATIONSHIPS BETWEEN TABLES
* **One-to-Many (1:N):**
  * One *User* can create Many *Jobs* (Provider).
  * One *Conversation* has Many *Messages*.
  * One *User* has Many *Notifications*.
* **Many-to-Many (M:N) resolved via Junctions:**
  * A *User* can apply to Many *Jobs*, and a *Job* can have Many *Users*. The **Applications Table** acts as the bridge that connects them perfectly without breaking database rules.

---

## 16. DATA FLOW (DETAILED)
**Example: Job Posting Flow**
1. **UI Phase:** Recruiter fills out the HTML Job form and clicks Submit.
2. **Network Phase:** Frontend sends an HTTP POST request carrying a JSON payload (title, skills) to the Backend API.
3. **Backend Phase:** Application searches for the logged-in JWT to verify it is indeed a Recruiter.
4. **Database Phase:** Express tells MongoDB to `INSERT` a new Document into the Jobs collection.
5. **Response:** DB confirms. Backend replies with Success 200 OK. Frontend redirects to dashboard.

---

## 17. FEATURE-WISE DATA FLOW
* **Matching Feature:** 
  * Data used: `User.resumeText` + `Job.description`.
  * Where stored: Once Gemini calculates the score, it is saved into `Application.aiMatch.matchPercentage`.
* **Chat Feature:**
  * Data Created: A `Message` document containing `content`.
  * Where it is stored: Appended to the `Messages` collection.
  * How it connects: Links directly to `Conversation` via foreign ID rules, verifying both users belong there.

---

## 18. DATA CONNECTION BETWEEN FEATURES
Dependencies are rampant to ensure everything updates live. If a Provider changes an application status from "Pending" to "Accepted" (Feature: Application Tracking), it automatically generates an alert in the `Notifications` table (Feature: Alerts). If the alert is clicked, it routes right to the `Jobs` document. They depend heavily on foreign key Object IDs.

---

## 19. CRUD OPERATIONS
* **Create (C):** Signup (Users), Posting a Job (Jobs), Sending a map (Messages).
* **Read (R):** Viewing the Discovery Job Feed (Jobs), opening a profile (Users).
* **Update (U):** Editing a profile to add a new skill (Users), changing application status (Applications).
* **Delete (D):** Only Admins or providers deleting old job posts (Jobs).

---

## 20. DATA VALIDATION & CONSTRAINTS
* **Required Fields:** You absolutely cannot create a User without an `email` or `password`. 
* **Unique Fields:** `email` in User is perfectly unique to stop duplicate accounts.
* **Constraints:** A Seeker cannot apply to the exact same Job twice. This constraint is mapped inherently in the backend logic.

---

## 21. OVERALL DATA ARCHITECTURE
* **Frontend View:** React holds 'State' temporarily in the browser's memory.
* **Backend Brain:** Express acts as the bouncer, making sure user data is legally allowed to pass.
* **Database Vault:** MongoDB is the hard drive layer permanently storing the memory securely.

---

## 22. WORKING PROCESS (USER JOURNEY)
* **Step 1:** User Registers. The database accepts the new email.
* **Step 2:** Logs in. The server hands them a JWT 'ticket' to walk around safely.
* **Step 3:** The user clicks on jobs. AI fetches their resume, fetches the job, scores it.
* **Step 4:** They apply. The system updates the Kanban board instantly.
* **Step 5:** Employer logs in, checks the DB list, sees the top scorer, and sends an immediate chat message to schedule an interview.

---

## 23. ADVANTAGES
* **Saves Hours of Reading:** Eliminates manual resume reading entirely.
* **Removes Guessing:** Mathematical percentages make hiring logical, not emotional.
* **Direct Comms:** No getting lost in Gmail or Outlook—everything is managed natively through Live WebSockets.

---

## 24. LIMITATIONS
* Needs a permanent active internet connection (for WebSocket chats).
* Relies entirely on Google’s Gemini Servers to stay online for the AI engine to function.
* Candidates who lie on resumes are still a risk, as the AI only trusts the PDF text.

---

## 25. FUTURE ENHANCEMENTS
* Add Voice AI interactions (the computer performing mock technical interviews).
* Mobile Application equivalents for Android and iOS using React Native.
* Integration with GitHub or LinkedIn APIs to auto-verify the skills the applicant claims to have.

---

## 26. CONCLUSION
SkillRoute AI represents an incredibly robust leap forward to modernize digital recruitment. By beautifully unifying a high-speed React user interface, incredibly deep MongoDB NoSQL architectures, and cutting-edge Generative Artificial Intelligence, the product effectively turns an agonizingly slow business bottleneck into a rapid, simple, and satisfying user experience.
