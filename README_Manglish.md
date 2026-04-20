# SkillRoute AI (SmartHire) 🚀
*Oru AI-Powered Recruitment System*

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</div>

<br/>

**SkillRoute AI** oru full-stack platform aanu. Job seekers-nu avarde resumes upload cheyyaam, recruiters-nu job post cheyyaam. Artificial Intelligence (AI) randum koodi compare cheythu match percentage auto aayi kandupidikkum. Hiring process smart and speed aakkan aanu ee project undakkiyathu.

---

## 📑 Table of Contents (Ulladakkam)
1. [Abstract](#-1-abstract)
2. [Problem Statement](#-2-problem-statement)
3. [System Overview](#-3-system-overview)
4. [User Roles](#-4-user-roles--responsibilities)
5. [Modules](#-5-modules)
6. [Features](#-6-features)
7. [Data Flow](#-7-data-flow--feature-connections)
8. [Database](#-8-database-explanation)
9. [Technologies Used](#-9-technologies-used)
10. [Pages & UI](#-10-pages--screens)
11. [Working Process](#-11-working-process-user-journey)
12. [Pros & Cons](#-12-advantages--limitations)
13. [Future Scope](#-13-future-enhancements)
14. [Conclusion](#-14-conclusion)

---

## 🔹 1. ABSTRACT
Nammude normal hiring process valare slow aanu. 1000 resumes vannal HR-nu athu muzhuvan vaayichu nokkan valare paadaanu. Athupole job seekers-nu ethaanu avarkku sherikkum pattiya job ennu ariyillayirikkum. Ithoru valiya problem solve cheyyan aanu 'SkillRoute AI' vannirikunnathu. 

Seeker oru PDF upload cheyumbol, system skills read cheyyum. Pinne Google Gemini AI use cheythu, jobs-um aayi engane match aakunnathu ennu oru % kanikum. Ithu koodathe, in-app live chat facility-um, applications track cheyyan oru visual Kanban board-um und. Churukkathil, hiring easy aakkunna oru machine annithu.

---

## 🔹 2. PROBLEM STATEMENT
- **Problem Solve Cheyunath:** Irrelevant aayulla jobs-nu aalkkar "blind aayi" apply cheythu samayam waste chyyunnath, pinne HR-mar manuall aayi resumes filter cheyth kashtappedunanthum.
- **Importance:** Manushyarude time save cheyyanum, correct aale correct panni-il ethikkanum automatic AI process mikkachu ninkunnu.

---

## 🔹 3. SYSTEM OVERVIEW
System engane aanu work avunath step-by-step nokkam:
1. **Entry:** Aal vannu Job Seeker aayitto Job Provider aayitto register cheyyunnu.
2. **Profile:** User profile complete aaki PDF resume idunnu. System athread aaki database-il collection idunnu.
3. **Jobs:** Recruiter oru puthiya job post cheyyunnu.
4. **AI Check:** User varumbol Gemini AI user profile-um job-um vechu compare adikum.
5. **Score:** "75% Match" ennokke UI-il pop aayi varum.
6. **Apply & Hire:** User apply click aakumbol providerkk notification ethi avarde rank list-il kaanum. Appol chat vazhi interview fix akkaam!

---

## 🔹 4. USER ROLES & RESPONSIBILITIES
* 👑 **Admin**: Boss. User-ne delete cheyyam, Jobs remove cheyyam. Logs nokkaam.
* 🏢 **Provider / Recruiter**: Company account. Avar jobs post cheyum. Varunna applicants-il ninnu AI score vechu aalkkare thiranjedukkum.
* 👤 **User / Seeker**: Job thedunnavar. PDF resume idunnu, jobs search adikkunnu, apply cheyyunnu. Kanban tracker vazhi application engane poova ennu ariyum.

---

## 🔹 5. MODULES
* `Authentication Module`: Login / Signup security (JWT & Bcrypt vechu).
* `User/Profile Module`: Profile matters. PDF idumbo text akki maathunna module (`pdf-parse`).
* `Job Module`: Jobs add akkanum remove aakanum. AI connection ivde aanu pani edukkunna.
* `Application Module`: Apply button deal akkunna edam. Data store cheyyanum Kanban update aakkum.
* `Chat Module`: Live whatsapp pole samsarikan Socket.io vechoondu ulla live backend.

---

## 🔹 6. FEATURES
1. **PDF Resume Auto-Reader:** PDF uplaod cheythal text full system capture cheyyum!
2. **AI Job Matcher:** User profile-um job requirement-um Gemini-kk send cheythu percentage score pidichedukumm.
3. **Interactive Kanban Tracker:** 'Applied', 'Reviewing' ennal columns ulla Trello-pole board.
4. **Live In-built Chat:** Mettethu aalude screen-il at-a-time msg varunath (WebSockets vechu).

---

## 🔹 7. DATA FLOW & FEATURE CONNECTIONS
- **Register Flow:** Password type cheythu → Server athonnal encrypt/lock cheyyum → Database save on.
- **Job Flow:** Apply amarthunnu → Database save aakum → Providerku live bell aayi notification add akum → Seeker screen-il tracker card varunnu.
- **Chat Flow:** Message send akiyappol Socket.io database-lum mattethualudeyum screen-ilkku at same time push cheyyunnu.

---

## 🔹 8. DATABASE EXPLANATION
* **Type:** MongoDB (NoSQL aannu). Mongoose library aannu ithine control cheyunnath.
* **Collections (Tables):**
  * `Users`: Email, skills, password, PDF data.
  * `Jobs`: Title, requiremnts, description.
  * `Applications`: Eethu user eathu job-lekku apply aki (Match %).
  * `Conversations / Messages`: Chat history de collections.
  * `Notifications`: Bell icon notifications item storing.

---

## 🔹 9. TECHNOLOGIES USED
* **Frontend:** React.js, Vite, Tailwind CSS (Design nannavan), React Router, Recharts.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose ORM).
* **AI Tool:** Google Gemini API (`@google/genai`).
* **Real-time Tech:** Socket.io.
* **Mini Libraries:** multer (loads files), pdf-parse (pdf vaikkunna brain), JWT.

---

## 🔹 10. PAGES / SCREENS
* **Login/Reg:** Kathavukal (Doors to system).
* **Seeker Dashboard:** User profile summary, stats.
* **Provider Dashboard:** Recruitesnte panimudakku - post cheytha jobs list kaanam.
* **Discovery:** Job lists view. Ivide aanu AI badge thillangi kaanunnathu.
* **Kanban Tracker:** Apply cheythathu track akkan ulla space.
* **Chat Inbox:** Samsarikkunathanu idham.

---

## 🔹 11. WORKING PROCESS (User Journey)
1. **Ramesh** (Job seeker) login cheythu resume, skills list upload akkunnu.
2. **Suresh** (Recruiter) login aaki oru job idunnu.
3. Ramesh Discovery page-lu jobs mullanu chuttunnu, appo AI parnja varunnu: *Ramesh, 90% Match ahn ithu!*.
4. Ramesh happy aayi Apply cheyyunnu.
5. Suresh application kand ishtapett, live chat-lu message idunnu "Hi Ramesh, join aakamo?". Set aayi!

---

## 🔹 12. ADVANTAGES & LIMITATIONS 
**✅ Advantages (Gunangal):**
* Manual aayi resume vayikenda, samayam labham.
* Candidates-nu clear aayi confidence koodum 90% okke kaanumbol. 
* Oru site-l thanne chat cheyyam, apply cheyyam.

**⚠️ Limitations (Kozhappangal):**
* AI enna cloud machine google kondu tharunathanu, athu down aayal matching work aavilla.
* Internet ellennukil chat um update'kalum work agilla.

---

## 🔹 13. FUTURE ENHANCEMENTS 
* **Voice AI Interviews:** Chatbot aayi system thanne aalu vechu mock interview edukkanulla valiya setup!
* **Mobile App:** iOS and Android aayoottu React Native vechu build akkam.
* **WhatsApp/SMS Alert:** App open allankilum messages varumpol whatsapp alerting tharanulla tech (Twilio).

---

## 🔹 14. CONCLUSION
Churukkathil, SkillRoute AI oru ordinary job searching webisite allaa. Ith MERN Stack-um puthiya kalathe Artificial Intelligence-um koootichertythulla oru nalla smart setup ahnu. Recruitersnteyum kanditdatesetnteyum thalavedana mattai ellam simple aakkunna super package aanithu!
