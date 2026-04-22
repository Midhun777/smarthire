# Viva Questions and Answers - SkillRoute AI (SmartHire)

This document contains 25 common viva questions explained in simple, non-technical language.

---

### 1. What is the main goal of this project (SkillRoute AI)?
**Answer:** Think of it like a "matchmaking service" for jobs. Instead of a person manually reading hundreds of resumes, our AI (an intelligent computer program) looks at a person's resume and a job description and instantly tells them how "good" a match they are. It saves time for both the company and the person looking for a job.

### 2. Who are the different people that can use this website?
**Answer:**
- **The Admin:** Like a manager who looks over the whole system to make sure everyone is behaving and everything is running smoothly.
- **The Recruiter (Job Provider):** A person from a company who posts job openings and picks the best candidates.
- **The Job Seeker:** A person looking for work who uploads their resume and applies for jobs.

### 3. How is the project built? (The "MERN Stack")
**Answer:** It's built using four main parts that work together:
1. A database (like a giant digital filing cabinet) to store information.
2. A server (the "brain") that handles all the requests.
3. A frontend (the "face") which is what the user actually sees and clicks on.
4. A way for all these parts to "talk" to each other using the same programming language (JavaScript).

### 4. Why did you choose this specific technology?
**Answer:** We chose it because it's very fast, modern, and reliable. It's the same kind of technology used by big companies like Facebook and Netflix, making the website feel smooth and professional.

### 5. How does the AI "match" a person to a job?
**Answer:** We give the AI the candidate's skills and their resume, along with what the job requires. The AI then "reads" both and compares them, just like a human would, but much faster. It then gives a score (like 90%) to show how well they fit.

### 6. What "Brain" are you using for the AI matching?
**Answer:** We are using **Google Gemini**. It's one of the smartest AI systems in the world (similar to ChatGPT). It's very good at understanding human language, which makes it perfect for reading resumes.

### 7. How does the computer read a PDF resume?
**Answer:** We use a tool that "scrapes" the text out of the PDF. Imagine it like a digital highlighter that goes over the document and copies all the words into a simple text list that the AI can then read.

### 8. What is the "Kanban Tracker" for?
**Answer:** It’s like a digital "To-Do" board with columns. When you apply for a job, you can see exactly where you stand—whether you just applied, are being reviewed, or have been invited for an interview. It’s a visual way to keep track of your progress.

### 9. How does the chat messaging work?
**Answer:** It works just like WhatsApp or Facebook Messenger. When one person sends a message, it pops up instantly on the other person’s screen without them having to refresh the page.

### 10. How do the "instant" updates work?
**Answer:** We use a technology called **WebSockets**. Normally, a website only gives you info when you click something. With WebSockets, the server can "push" info to you instantly, like a notification on your phone.

### 11. How do you keep the website secure?
**Answer:** We use a digital "ID Card" system. When you log in, the website gives you a secret digital card. Every time you click a button or visit a page, you show this card so the website knows it's really you.

### 12. How do you make sure a Job Seeker can't do an Admin's job?
**Answer:** We have strict "Permission Levels." Every user has a "Role." The system checks your role before letting you see certain pages. It’s like having a key that only opens specific doors in a building.

### 13. How is the information stored?
**Answer:** We use a "NoSQL" database (MongoDB). Instead of rigid tables like an Excel sheet, it stores info in "documents" that look more like a digital profile. This makes it very easy to store different types of info, like a list of skills or a library of jobs.

### 14. How do you connect a job to an applicant?
**Answer:** We use a "link" in our database. Every job has a unique ID, and every person has a unique ID. We create a "receipt" that says "Person A is applying for Job B," which connects the two pieces of information.

### 15. What is an "Audit Log"?
**Answer:** It’s like a "Security Camera" for the website but in text form. It records who did what and when (e.g., "Admin deleted a job at 2 PM"). This helps us find and fix problems or see if someone is trying to break the rules.

### 16. How does the website handle files (like resumes)?
**Answer:** When you upload a resume, the website catches it, reads the text inside, and saves it in our digital filing cabinet. We make sure the file is handled safely so it doesn't get lost or corrupted.

### 17. How do you protect user passwords?
**Answer:** We never store actual passwords. Instead, we "scramble" them using a process called "hashing." Even if someone stole our data, they would only see a bunch of random characters, not your password.

### 18. What happens step-by-step when someone applies for a job?
**Answer:**
1. The user clicks "Apply."
2. The website checks if they are logged in.
3. A "receipt" is created in the database.
4. An instant "ding" (notification) is sent to the recruiter’s dashboard.

### 19. Why is the website so fast?
**Answer:** We use modern building tools (like Vite) that prepare the website's files in a very optimized way. This means the pages load almost instantly when you click them.

### 20. What was the hardest part of building this?
**Answer:** The hardest part was teaching the AI to give us the exact information we wanted. Sometimes AI can be a bit "chatty," so we had to give it very specific instructions to make sure it only gave us a simple number (the match score).

### 21. How do notifications work?
**Answer:** Whenever something important happens (like you get selected for an interview), the server sends a signal to your browser. Your browser then shows a little red dot or a popup message instantly.

### 22. What is "blind applying" and how do you fix it?
**Answer:** Blind applying is when people apply for random jobs hoping one sticks. Our project fixes this by showing you a "Match Score" first. It tells you, "Hey, you are a 90% match for this!" so you only spend time on jobs you are likely to get.

### 23. What happens if the AI stops working?
**Answer:** The website is built to be smart. If the AI is "sleeping" or busy, you can still apply for the job, but the match score might just say "Wait a moment" or "N/A" instead of breaking the whole page.

### 24. What is the difference between a Recruiter's view and an Admin's view?
**Answer:** A Recruiter only sees things related to *their* company and jobs. An Admin is the "Super User"—they can see every single user and every single job on the entire platform to keep things organized.

### 25. What would you add to this project next?
**Answer:** We would like to add "AI Interviews" where the computer talks to you to practice for the real thing, and mobile phone apps so you can apply for jobs while on the go.
