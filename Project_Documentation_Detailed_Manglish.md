# SkillRoute AI (SmartHire) - Complete Project Documentation
> *Oru valare detailed aayulla Architecture eand Database Breakdown (Manglish Version).*

---

## 🔹 1. PROJECT OVERVIEW
* **Project Title:** SkillRoute AI (SmartHire)
* **Short Description:** Ithu oru full-stack web application aanu. Job seekers-nu resumes idaanum, companies-nu jobs post cheyyanum ulla platform. Main highlight enthanennu vechal, AI (Artificial Intelligence) use cheythu candidates-ne auto-match cheyyum.
* **Purpose of the Project:** Recruitment process valare fast and easy aakkan. Candidates-nu avarkk pattiya job ethaanu ennu mansilakkanum, employers-nu samayam kalayathe best candidates-ne filter cheythu edukkanum ithu help cheyyum.

## 🔹 2. ABSTRACT
Nammude normal job searching and hiring process valare slow aanu. Job seekers palayidathum free aayi apply cheyyum, HR aalkkarkk varunna aayirakkanakkinu resumes vaayichu maddiyakkum. SkillRoute AI ee prashnam complete aayi solve cheyyunnu.

Google Gemini AI use cheythu, aalkkar upload cheyyunna PDF resume system vaayikkum. Pinne aa resume-um, job requirement-um thammil compare cheythu oru "Match Percentage" (Eg: 85%) auto aayi calculate cheyyum. Ithu koodathe, in-app live chat facility-um, applications track cheyyan oru visual Kanban board-um, separate dashboards-um undu. Churukkathil, hiring valare fast, data-driven, thakaraarillatha oru process aakkunnu.

## 🔹 3. PROBLEM STATEMENT
* **What problem this project solves:** 
  1. For candidates: Enikku ee job-nu proper aayi skill undo ennulla confusion.
  2. For recruiters: Unqualified aayulla aayirakkanakkinu resumes vaayikkendi varunna thalavedhana.
  3. For both: Emails vazhi ulla slow communication.

## 4. SYSTEM OVERVIEW (VERY IMPORTANT)
System full aayi engane work aakunnu enulla step-by-step logic:
* **Step 1:** Oru aal vannu register cheyyunnu (Seeker aayitto Provider/Recruiter aayitto).
* **Step 2:** Seeker avante profile complete aakiyattu PDF resume idunnu. System aa thurannu text full edukkunnu.
* **Step 3:** Job provider oru puthiya job post cheyyunnu (skills required okke add aakki).
* **Step 4:** Seeker jobs thappumpol, background-il Gemini AI seeker-tem job-nteyum data eduthu oru Match Score paranje tharum.
* **Step 5:** Seeker aa high-match job-nu "Apply" cheyyunnu. Database-il record aakunnu.
* **Step 6:** Job provider-nte dashboard-il puthiya applicant-ne kaanunnu. High rank aayath kond, ivide ninnu thanne seeker-odu chat cheythu interview fix aakkunnu.

## 5. USER ROLES & RESPONSIBILITIES
* **Admin:** 
  * *What they do:* System-nte master. Ellam monitor cheyyan.
  * *Actions:* All users, jobs, applications ivarkku kaanam. Thettaya job posts delete cheyyanum, aalkkare suspend aakkanum pattam. Audit Logs (site-il okke enthu nadakkunnu) vaayikkam.
* **Provider (Recruiter/Faculty):**
  * *What they do:* Company/Institution-kku vendi aalkere thedunnavar.
  * *Actions:* Jobs post cheyyan, edit cheyyan. Varunna applications AI score vechu filter cheyth edukkaan. Status "Accepted"/ "Rejected" aakkaan. Pinne candidates-maayi live chat cheyyan.
* **Seeker (Normal User):**
  * *What they do:* Job anweshikkunnavar.
  * *Actions:* Skills add cheyyan, resume idan. Jobs search cheyyumbol AI match percentage kaanan. Apply cheythathinte status Kanban board-il tracking nadathaan.

## 6. MODULES (CORE PART)
* **Authentication Module:**
  * *What it does:* Login / Signup secure aakkan.
  * *How it works:* Password hash cheythu marachu vayikkunnu. JSON Web Tokens (JWT) use cheythu aalanu kerunnathu ariyum.
* **Profile / User Module:**
  * *What it does:* User data deal cheyyan.
  * *How it works:* `multer` library vechu PDF vaangum, `pdf-parse` library athine text aakki database-il save cheyyum.
* **Job / Post Module:**
  * *What it does:* Jobs undakkanum, AI calculations nadakkanum.
  * *How it works:* Job and User data Google Gemini AI-lekku ayachu "percentage" vangi tharum.
* **Application Module:**
  * *What it does:* User-neyum Job-neyum connect aakkunna paalam.
  * *How it works:* Status (Pending, Reviewed) track cheyyum.
* **Chat / Notification Module:**
  * *What it does:* WhatsApp pole live chatting-um bell icons-um.
  * *How it works:* WebSockets (`socket.io`) vechu page refresh aakathe thunne messages kondu pokum.

## 7. FEATURES (VERY DETAILED)
* **Auto Resume Parsing:** 
  * *What it is:* Upload cheyyunna PDF vayikkunna logic.
  * *How it works:* PDF data Node backend-il ethiyal text strings maathram aakkiyittu save aakum. User -> Job modules-ukal thammile base ithaanu.
* **AI Job Match Engine:** 
  * *What it is:* Candidate eyu Job ineyum vechu % score undakkal.
  * *How it works:* Job description-um Resume-um orumichu Google API-kk kodukkum. Return aayi varunna JSON result-il math-logic ulla score kaanum.
* **Live Inbox / Chat:** 
  * *What it is:* In-app message feature.
  * *How it works:* Send button amarthumpol, socket.io appol thanne msg mattiyalde screenil ethekkum, pinne database-ilum history aayi save aakum.

## 8. DATA FLOW & FEATURE CONNECTIONS
- **Registration Flow:** User details Email/Password adikkunnu → Backend server-il etih Password lock (encryption) aakkunnu → DB-il row undakkunnu → Thirichu Success message UI-il kaanikkunnu.
- **Application Flow:** Seeker Apply click aakkumbol → Apply table-il row generate aakum → System DB-il Providerkk Notification undakum → Provider-de screenile bell icon appo thanne thuvakkum (red aakum).
- **Connections:** Enthekilum update aayal (e.g., Application Status maariyal) athu automatic aayi Notifications triger cheyyum.

## 9. PAGES / SCREENS
* **Login/Register:** App-ilekku keraanulla vathilukal.
* **Seeker Dashboard:** Saved jobs-um apply cheytha count-um kaanikkunna home page.
* **Provider Dashboard:** Company muthalali page. Active jobs, fresh applicants list oke avide kaanum.
* **Discovery Page:** Jobs thedan ulla scrolling timeline. AI Match Badges full choodan aayi kaanam.
* **Job Details Page:** Oru job click akkumbol full detail vayikkavunna screen. Apply button ivideyanu.
* **Profile Page:** Skills, bio, resume oke feed cheyyunna forms ulla page.
* **Kanban Tracker:** Apply cheythath pole cards drag cheyam patunna board ("Applied", "Reviewing").
* **Chat Inbox Page:** Messages list-um open chat thread-um ulla page.
* **Admin Control Panel:** Users List, system charts, Audit Logs (history of platform) okke ulla area.

## 10. COMPONENTS / STRUCTURE
* **Frontend Structure:** React.js aanu (Lego blocks pole). `JobCard`, `Navbar`, pop-ups (Modals) oke separate pieces aayi thanneyanu undakkiyeth.
* **Backend Structure:** Node/Express. Routes (API links), Controllers (Brain logic), Models (Database files) aayi divide aakki vachittund.
* **API Flow:** Frontend website backend-umaayi JSON (text standard) vazhi maathrame samsarikku. 

## 11. TECHNOLOGIES USED
* **Frontend:** React.js, Vite, Tailwind CSS (Style cheyyan), React Router (Pages oadan), Recharts (Graph varaykaan).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (with Mongoose).
* **AI:** Google Gemini API.
* **Real-time:** `socket.io`.
* **Security & Other:** `bcrypt`, `jsonwebtoken`, `multer`, `pdf-parse`.

---
# 🧠 DATABASE SECTION (VERY IMPORTANT)

## 12. DATABASE OVERVIEW
* **Type of Database:** MongoDB (Ithu oru NoSQL Document database aanu).
* **Why this database is used:** Normal SQL server-ne kaalum valare flexible aanithinulla schemas. Json formats-il data vekkanam. Job details-um aalkkarude skills-um vary aayond, athu ellam array aayi easy aayi MongoDB-il store cheyyam.

## 13. TABLES / COLLECTIONS
Ivide tables-ne collections ennanu parayuka:
* **`Users`**: System-il keriya ella aalkkarum.
* **`Jobs`**: Companies post cheytha job notices.
* **`Applications`**: User-um Job-um thammilulla pala palappangal (Aal Apply cheythathu).
* **`Conversations`**: Randaal thammil message cheythalulla base header data.
* **`Messages`**: Aa conversation-il ayalatha oro text bubbles.
* **`Notifications`**: "You have matched" pole ulla sound adikkunna alerts.
* **`AuditLogs`**: Admin history tracking, aaru enthu cheythu ennu ariyan.

## 14. ATTRIBUTES (COLUMNS)
Model files read cheythal ivayokeyanu field:
* **Users Table:**
  * `name`, `email`, `password` (String)
  * `role` (Enum values: 'user', 'admin', 'job_seeker', 'job_provider')
  * `skills`, `education`, `experience` (Items ulla Arrays)
  * `resumeText` (String - pdf-il ninnu kittya pure text)
* **Jobs Table:**
  * `title`, `company`, `location`, `description` (Strings)
  * `postedBy` (ObjectId - ethu user aanu ithu add cheythath ennu ariyanulla ID)
* **Applications Table:**
  * `job`, `user` (Randum foreign ObjectIDs)
  * `status` (Enum: 'Pending', 'Reviewed' etc)
  * `aiMatch` (Oru object, athil `matchPercentage` integer value aayi kanum).
* **Conversations / Messages Table:**
  * `jobId`, `providerId`, `seekerId` (Foreign ObjectIDs)
  * `content` (Message string)

## 15. RELATIONSHIPS BETWEEN TABLES
* **One-to-Many (1:N):**
  * Oru *User*-nu (Provider) kure *Jobs* undakkam.
  * Oru *Conversation*-il kure *Messages* veram.
* **Many-to-Many (M:N):**
  * Oru *User*-kku kure *Jobs*-il apply cheyyam. Oru *Job*-inu thirichu kure *Users* varam. Ithane M:N bandham ennu parayum. Ithu safe aakan aanu idaykku **Applications Table** use cheythirikkunnathu.

## 16. DATA FLOW (DETAILED)
**Engane Data move aavunnu (Apply Flow simple aytt):**
1. User form-il "Apply" amel click cheyyunnu.
2. Frontend athine JSON aaki backend server URL-ilekku adikkunnu.
3. Backend ath vayichitt MongoDB database-nod parayum `Application.create()` cheyyan.
4. Database athu hard disk-il ezhuyhitt, backend-noth success reply kodukkum.
5. Backend Response Frontend UI-lekku thirich vidum. Screen update aakkum.

## 17. FEATURE-WISE DATA FLOW
* **Matching Feature:** 
  * Enth data: `User.resumeText`-um `Job.description`-um.
  * Evede pookum: API computation kazhinjal nerittu `Application.aiMatch.matchPercentage`-lekku write aakum.
* **Chat Feature:**
  * Enth data: Oru `Message` content.
  * Evede pookum: `Messages` db collection-il keri irikkum. Athu `Conversation.id`-um aayi kootti inakki vekkum.

## 18. DATA CONNECTION BETWEEN FEATURES
App-il ellam connected aanu. Oru Provider application status "Reviewed"-il ninnu "Accepted" (Tracker Feature) aakkuinapol, automatic aayi Database `Notifications` table-il row generate aakum (Alert Feature).

## 19. CRUD OPERATIONS
* **Create (C):** Signup cheyyumbol, Puthiya job type cheyumpol, msg send cheyumpol.
* **Read (R):** Discovery page-il jobs read varumbol.
* **Update (U):** User profile-il skill maatti save aakkumbol, application track status maarumbol.
* **Delete (D):** Thettaya jobs admin/provider delete adikkumpol.

## 20. DATA VALIDATION & CONSTRAINTS
* **Required Fields:** `email` um `password`-um ellatthe aarodum database save akilla. Reject aakum.
* **Unique Fields:** `email` unique aavanam. Oru email vechu rand account theerkkan pattilla.
* **Constraints:** Conversation collection-il `jobId`, `providerId`, `seekerId` ithu moounum cheernu ore oru combination varaan padaullu (Uniqueness constraint by mongodb).

## 21. OVERALL DATA ARCHITECTURE
* **Frontend:** Browser aanu - temporary memory.
* **Backend:** Express Server - Data thettano sheriyano ennu check cheyunna gatekeeper.
* **Database:** MongoDB Vault - Ennennekumayi store cheyyunna hard drive vault.

---

## 22. WORKING PROCESS (USER JOURNEY)
Oru chinna katha pole:
1. User vannu Register cheyunnu. Database data secure cheydhu vekunnu.
2. Login akkunnu. Back-end token tharunu.
3. User jobs kanunumpol, hidden AI engine scores calculate cheyyunnu.
4. Apply akkunumpol DB ath Application table-lekk ezuthunnu.
5. Employer login aakumpol, most match ulla aale top-il kanunnu. Appo thanne live chat cheyythu interview set akkunnu.

## 23. ADVANTAGES
* **Saves Hours:** Manushyarude resume read cheyyunna paadu illaathakkunnu.
* **Mathematical Logical:** AI scoring irikkuna kondu numbers noki decision edukkam.
* **Live Comm:** Veruthe Gmail thedi pokanda. Platform-il thanne samsarikam.

## 24. LIMITATIONS
* **Internet Venam:** Live chatum notificationsum socket aayond 24/7 internet connection cut aavan paadilla.
* **Google Dependence:** Gemini servers down aayal matching engine ninnu pokum.
* **Fake Data:** User false skills resume-il idukayanenkil AI ath sheriyay edukkan chance undu.

## 25. FUTURE ENHANCEMENTS
* **Voice AI Interview:** System thanne oru manushyane pole Audio test edukkunnathu.
* **Mobile Apps:** React Native vaych Android App Build aakanam.
* **WhatsApp Alerts:** Offline aanenkipum SMS / Whatsapp notification adikkunna system (Twilio).

## 26. CONCLUSION
Churukkathil, SkillRoute AI ordinary job website alla. Oru high-speed React system-um, flexible MongoDB database-um, athilekk pinne modern Generative AI-yum koodi cherth vechu ondakkiya oru kidu product aanu idhu. Recruitment enna pani valare simple, logical and mathi varatha vidham easy aakiyirikkunnu ith.
