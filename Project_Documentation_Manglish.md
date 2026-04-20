# SkillRoute AI (SmartHire) - Project Documentation
*A smart AI recruitment platform*

---

## 🔹 1. PROJECT OVERVIEW
- **Project Title:** SkillRoute AI (SmartHire)
- **Short Description:** Ithu oru AI-powered recruitment platform aanu. Job seekers-nu avarde resumes upload cheyyaam, recruiters-nu (companies) job post cheyyaam. Artificial Intelligence (AI) randum koodi compare cheythu match percentage auto aayi kandupidikkum.
- **Purpose of the Project:** Normal aayi nadakkunna job hunting and hiring process valare slow aanu. Athu valare fast, smart, and easy aakkan aanu ee project undakkiyathu. Candidates-nu avarkk pattiya correct job kandupidikkan ee system help cheyyum.

---

## 🔹 2. ABSTRACT (Project-nte Churukkam)
Nammude normal hiring process valare time-consuming aanu. Oru company-il 1000 resumes vannal HR-nu athu muzhuvan vaayichu nokkan valare paadaanu. Athupole job seekers-nu ethaanu avarkku sherikkum pattiya job ennu ariyillayirikkum. Ithoru valiya problem aanu. Ee problem solve cheyyan aanu 'SkillRoute AI' undakkiyirikkunnathu. 

Ithu engane work cheyyum ennu vechal, oru job seeker avante PDF resume system-il upload cheyumbol, system athil ulla details (education, skills) automatic aayi read cheyyum. Pinne Google Gemini AI use cheythu, platform-il ulla eathokke jobs aanu aalumaayi valare match aakunnathu ennu oru % (procentage) vechu kanichu tharum. Ithu mathram alla, platform-il thanne recruiter-umaayi chat cheyyanulla facility-um, applications engane pokunnu ennu ariyan oru visual board-um (Kanban) undu. Churukkathil paranjal, job hiring process valare easy aakkan ee artificial intelligence system help cheyyunnu.

---

## 🔹 3. PROBLEM STATEMENT
- **What problem this project solves:** Normally nammal oru job-nu apply cheyumbol namukku ariyilla nammude skills athumaayi set aakumo ennu. Angane kure aalkkar irrelevant jobs-nu "blind aayi" apply cheyyum. Pinne HR/Recruiters-nu ithu filter cheyyan valare kashtappadu aanu. Avarude samayam full poyippovum.
- **Why this solution is needed:** Manushyarude samayam labhikkanum, correct aayittaalu aale correct job-il (thettillathe) ethikkanum, hiring process tension-free aakanum oru intelligent automated system aavashyam aanu.

---

## 🔹 4. SYSTEM OVERVIEW (VERY IMPORTANT)
Ee system full aayi engane work cheyyunnu ennu step-by-step nokkam:
1. **Starting Point:** Oru aal vannu register cheyyunnu. Aalkk 'Job Seeker' (job anweshikkunnavar) aayitto 'Job Provider' (job kodukkunnavar/recruiter) aayitto account edukkam.
2. **Profile Set-Aakkal:** User avante profile complete cheyyunnu. Oru PDF resume upload cheyyum. System automatic aayi aa PDF reader cheythu athile terms & skills (like Python, Java) database-lekku edukkum.
3. **Job Post Cheyyunnu:** Recruiter oru job post cheyyunnu. (Example: "We need a React Developer").
4. **AI Connection:** Job Seeker ee job page-il varumbol, background-il Gemini AI ee user-nte profile-um aa job requirement-um thammil compare cheyyum. 
5. **Applying:** Result aayi User-nu oru "Match %" kanan pattum (e.g., "75% Match"). User-nu ishtappettal 'Apply' button amartham. 
6. **Provider Action:** Recruiter-nu oru notification povum. Recruiter applications list open aakkumbol, most matched aayulla candidates-ne mukalil (top-il) kanikkum. So they don't have to search much.
7. **Contacting:** Recruiter-nu aale ishtapettal, avide ninnu thanne seeker-umaayi live Chat cheyyam interview fix cheyyan. Email-nte avashyam illa!

---

## 🔹 5. USER ROLES & RESPONSIBILITIES
- **Admin**
  - *What they can do:* System-nte master aanu admin. Admin-nu ellam kanam.
  - *Permissions:* Users, Jobs, Applications oke control cheyyam. Aarenkilum fake job post cheythaal delete cheyyam. Logs nokki platform-il arokke endhokke cheyyunnu ennu track cheyyam.
- **Provider / Recruiter (Company Aalkkar)**
  - *What they can do:* Avar avarde company-kku vendi jobs post cheyyum.
  - *Responsibilities:* Varunna applications review cheyyum. AI kanichu tharunna match scores use cheythu candidates-ne select cheyum. Chat-il replies kodukkum.
- **User / Job Seeker (Ordinary Users)**
  - *What they can do:* Resume upload cheyyunnu, jobs thediyedukkunnu.
  - *Responsibilities:* Profile updated aayi vekkanam. Resume upload cheythu jobs-nu apply cheyyanam. Chat notifications varumbol reply cheyyanam. Kanban board vazhi application status (applied, selected) ariyum.

---

## 🔹 6. MODULES (CORE PART)
Project-ne pala blocks (modules) aayi thirichittundu:

1. **Authentication Module:**
   - *What it does:* Login / Signup nadakkunnathu ivideyaanu. 
   - *How it works:* Password hash cheythu (encrypt cheythu) secure aayi store cheyyum. JWT (JSON Web Tokens) vazhiyaanu security manage cheyyunnath.
   - *Connections:* System-ilekku keraan eathu module-num ithu aavisyamanu.
2. **User/Profile Module:**
   - *What it does:* User profiles and avatar maintain cheyyanulla module.
   - *How it works:* PDF-parse ennathu vechu mukalil varunna resume read cheyyum.
3. **Job/Post Module:**
   - *What it does:* Recruiters jobs add cheyyanum kananum ulla part.
   - *How it works:* AI connection ivideyaanu. Database-il ninnu job data eduthu AI-kku kodukkum.
4. **Application Module:**
   - *What it does:* Job application deal cheyyunnu.
   - *How it works:* "Reviewing", "Selected" ennivayokke deal cheyyunnathu ithaanu. Kanban board-um aayi ithu directly connected aanu.
5. **Chat/Notification Module:**
   - *What it does:* Live aayi sambhashikkannulla part. Whatsapp pole!
   - *How it works:* Reload/Refresh cheyyathe thanne messages tharuvam Socket.io use cheyyunnu.
6. **Admin Module:**
   - *What it does:* Ellathiyayum monitor cheyyan ulla dashboard.

---

## 🔹 7. FEATURES (VERY DETAILED)
- **PDF Resume Auto-Reader**
  - *What it does:* Upload cheyunna PDF resume-il ninnu data edukkunnu.
  - *How it works step-by-step:* User form-il PDF idunnu -> Backend-ilekku povunnu -> `pdf-parse` library PDF text format-lekku maattunnu -> Database-il string aayi save aakkunnu.
  - *Belongs to:* User Module. Connects to Job Match feature.
- **AI Job Matcher (The brain of the system)**
  - *What it does:* Oru job enikku ethra percentage patiyathaanennu parayum.
  - *How it works:* User details-um Job details-um Gemini AI-ku send cheyyum -> AI analyze cheyyum -> Oru final percentage (like 89%) return cheyyum -> Athaanu UI-il kaanikkunnathu.
  - *Belongs to:* Job Module. Connects with User Module.
- **Kanban Tracker**
  - *What it does:* Applications enthaayi ennu oru visual board-il kanikkaan.
  - *How it works:* Trello pole cards aayi 'Applied', 'Reviewing', 'Rejected' columns-il list cheyyum. Valare simple aayi kandu manassilaakkam.
  - *Belongs to:* Application Module.
- **Live In-built Chat**
  - *What it does:* Recruiter-um seeker-um thammil platform-il ninnu thanne samsarikkan.
  - *How it works:* Aalkkar chat window turakkunnu -> type cheythu send amarthunu -> WebSockets vazhi at the speed of light matthe aalude screen-il pongum!

---

## 🔹 8. DATA FLOW & FEATURE CONNECTIONS 🔗
Data engane aane ee system-il paari nadakkunath ennu nokkam:
- **Registration Flow:** User e-mail and password type cheyyunnu → Info Server-il pokunnu → Password encrypt aakkunnu (security!) → Database-il save aakkunnu → Profile create aakunnu.
- **Apply Job Flow:** Seeker oru job-il "Apply" amel click cheyyunnu → Ee application details (Seeker ID & Job ID) database-il save aakkunnu → System thiricharinjirittu Recruiter-kku "Puthiya applicant vannotti" ennu Live Notification trigger cheyyunnu → Seeker-nte Kanban board-il puthiya card add aakunnu.
- **Chat Flow:** Message type cheythu send adikkunnu → Database-il message save aakkunnu (for history) → WebSockets vazhi other user-te screen-il instant aayi message push cheyyunnu. 

---

## 🔹 9. DATABASE EXPLANATION 🧠
- **Database Used:** MongoDB (Mongoose Object modeling vazhi connect cheuthittundu). Ithu oru flexible NoSQL database aanu.
- **Core Collections (Tables pole):**
  - `Users`: Name, email, password, skills, pdf text (resume detail) okke save cheyyam.
  - `Jobs`: Job title, description, skills required, provider(recruiter) details.
  - `Applications`: Ethe user, ethe job, match percent ethraya, current status ('Applied'/'Rejected') enthanu.
  - `Conversations & Messages`: Live chat cheyyumbazhathe messages and history.
  - `Notifications` & `AuditLogs`: Alerts-um Admin-kku ullla history-um.
- **Relationships:** Ellam Object IDs vazhi aanu inter-connect aakunnathu. For example, oru Application edukumbol athil ulla User ID eduthaal amukku aalu aaranennu specific aayi data edukkan pattum (`populate` cheythu).

---

## 🔹 10. TECHNOLOGIES USED
Bhayankara power aayulla latest tools vechanu ee system undakiyittullathu:
- **Frontend (Website Kanikkan):** HTML, CSS, JavaScript. Structure cheyyan React.js, Vite. Nalla look & feel (design) kittan Tailwind CSS. Pages maarran React Router DOM. Graphical charts varakkaan Recharts.
- **Backend (Inside Brain):** Node.js koode Express.js framework.
- **Database (Store cheyyan):** MongoDB.
- **AI Brain:** Google Gemini API.
- **Real-time Live Tech:** Socket.io (for chat and notification ringtones).
- **Other Mini Tools:** `multer` (file upload handling), `pdf-parse` (pdf read cheyyan), `jsonwebtoken` (Auth secure aakkan), `bcrypt` (password marachu vayikkan).

---

## 🔹 11. PAGES / SCREENS
- **Login / Register Page:** System-ilekku keraanula vazhi (doors).
- **Dashboard (Seeker):** User-te main landing page. Saved jobs, statistics, profile stats oke kaanam.
- **Provider Dashboard:** Company aalkkarude pratheka page. Avarde jobs-um puthiya applicants varunnathum kaanam.
- **Discovery Page:** Jobs thedan ulla main place iividayanu. AI Match percentage badge ellathilum chudukan kaanam.
- **Job Details:** Oru job-ne patti click cheythal purathu varunna full details. "Apply" amarthunnathu iivde ninnanu.
- **Profile Page:** User-te bio, education uokke update cheyyanum resume paruthidanum ulla page.
- **Kanban Tracker:** Apply cheytha jobs engane irikkunnu ennu cards form-il kaaanan ulla space.
- **Chat Inbox:** Messages vayikkanum ayakkanum ulla sthalam.
- **Admin Panel:** Oru global boss portal. Admin users-ne monitor cheyyan.

---

## 🔹 12. COMPONENTS / SYSTEM STRUCTURE
- **Frontend Structure:** React components aayi thirichittundu. Easiy aayi paranjal Lego blocks pole. Oru Navbar, oru Form, oru Button—ellam different blocks aanu. Ithonnum potti pokillatha reethiyilanu design cheythittulathu.
- **Backend Structure:** App-ile route-ukal (vazhikal) Controllers-umaayi connect cheythirikkunnu. Client (Frontend) backend API-ne vilikkum, backend database-il ninnu data eduthitt JSON (simple data format) aayi return cheyum.
- **Overall Architecture:** Frontend Client <---> Node API <---> MongoDB. Socket.io ithinte idayilude live messages eduthu kondu nadakkum.

---

## 🔹 13. WORKING PROCESS (USER JOURNEY)
Oru cheriya kadha pole user engne experience cheyum ennu nokkam:
1. Ramesh (Job seeker) vannu phone number/email vechu register cheyyunnu.
2. Login cheyyumbol Ramesh avante skills (like React, Node) add cheyyunnu. Kutathe oru PDF resume upload cheyyunnu.
3. Vere oridathu, Suresh (Recruiter) company dashboard-il keri oru "React Developer" want ennu paranju job add cheyunnu.
4. Ramesh Discovery page-il varumbol iyaa "React Developer" job kaanunnu. AI auto-calculate cheyth parayunnu "Ramesh, you have a 90% match for this job!".
5. Ramesh super happy aayi "Apply" amarthunnu.
6. Suresh adutha divasam login cheyumbol Ramesh-nte application top-il kaanunnu. 90% aayathukondu Suresh Ramesh-nte profile open cheyyunnu.
7. Suresh-nu candidate-ne valare ishtapettu. Platform-il ulla Chat window vazhi Suresh Ramesh-odu "When can you join us for an interview?" ennu live msg ayakkunnu.
8. Ramesh-nu athu notification bell aayi varunnu. Ramesh reply cheyyunnu. Appointmennt fix aakunnu!

---

## 🔹 14. ADVANTAGES
- Valare time-saving aanu (Resume oro page aayi HR vaayikkenda aavasyam illa, AI read cheyyum).
- Jobs match accurate aanu, so user-nu selection kittan ulla confidence koodum.
- Oru single place-il thanne job anweshikkam, apply cheyyam, chat-um cheyyam (emails thedi pokanda).

---

## 🔹 15. LIMITATIONS
- System proper aayi work cheyyanam enkil continuous Internet connection venam (especially for Chat).
- Google Gemini AI server down aayal nammude AI matching temporary aayi work aavilla. 
- Oru aal thettu data (fake skills) adichal AI athu viswasichittu valiya match score kanikkan chance undu.

---

## 🔹 16. FUTURE ENHANCEMENTS
Munnottulla kaalathu enthelaam add cheyyam:
- **Voice AI Interviews:** System thanne candidate-odu auto aayi questions chodichu voice AI vazhi mock interview nadathal.
- **Mobile App:** React Native use cheythu dedicated Android/iOS mobile application undakkam.
- **Phone Alerts:** Message vannaal app open akathe thanne SMS/WhatsApp alert varan ulla setup (Twilio vechu).

---

## 🔹 17. CONCLUSION
In short, **SkillRoute AI** oru normal job board mathram alla, ithoru smart machine aanu! Manushyarude resume vaayanaykku pakaram AI tools use cheyunath kondu recruitment industry-ile valiya oru thalavedhana ee software maatti kodukkunnu. Recruiters-nu pani eluppam aakunu, candidates-nu correct job path kittunnu.
