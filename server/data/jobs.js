const jobs = [
    // --- KERALA JOBS ---
    {
        title: "Senior Full Stack Developer",
        company: "UST Global",
        location: "Trivandrum, Kerala",
        description: "Leading digital transformation projects. Requires deep expertise in React, Node.js, and cloud architectures.",
        requirements: ["React", "Node.js", "AWS", "Microservices", "Team Leadership"],
        experienceLevel: "Senior",
        type: "Full-time",
        salaryRange: "₹12,00,000 - ₹20,00,000",
        aiTags: ["Full Stack", "React", "Node.js", "Cloud", "Leadership"]
    },
    {
        title: "Flutter Developer",
        company: "Techvantage Systems",
        location: "Kochi, Kerala",
        description: "Build beautiful, high-performance mobile apps for international clients using Flutter.",
        requirements: ["Flutter", "Dart", "Firebase", "State Management", "REST APIs"],
        experienceLevel: "Mid Level",
        type: "Full-time",
        salaryRange: "₹5,00,000 - ₹9,00,000",
        aiTags: ["Mobile", "Flutter", "Android", "iOS"]
    },
    {
        title: "DevOps Engineer",
        company: "IBS Software",
        location: "Trivandrum, Kerala",
        description: "Manage CI/CD pipelines and cloud infrastructure for large-scale aviation software.",
        requirements: ["Docker", "Kubernetes", "Jenkins", "AWS/Azure", "Linux"],
        experienceLevel: "Mid Level",
        type: "Hybrid",
        salaryRange: "₹8,00,000 - ₹15,00,000",
        aiTags: ["DevOps", "Cloud", "Infrastructure", "CI/CD"]
    },
    {
        title: "UI/UX Designer",
        company: "QBurst",
        location: "Kochi, Kerala",
        description: "Create intuitive and visually stunning user interfaces for web and mobile applications.",
        requirements: ["Figma", "Adobe XD", "Prototyping", "User Research", "Wireframing"],
        experienceLevel: "Entry Level",
        type: "Full-time",
        salaryRange: "₹3,00,000 - ₹6,00,000",
        aiTags: ["Design", "UI", "UX", "Creative"]
    },
    {
        title: "Python Backend Developer",
        company: "ULTS",
        location: "Kozhikode, Kerala",
        description: "Develop robust backend systems for government and enterprise projects.",
        requirements: ["Python", "Django", "PostgreSQL", "Redis", "Celery"],
        experienceLevel: "Senior",
        type: "On-site",
        salaryRange: "₹10,00,000 - ₹18,00,000",
        aiTags: ["Backend", "Python", "Database", "API"]
    },
    {
        title: "Digital Marketing Specialist",
        company: "Lulu Group",
        location: "Kochi, Kerala",
        description: "Lead digital marketing campaigns for retail giants.",
        requirements: ["SEO", "SEM", "Google Analytics", "Social Media Marketing", "Content Strategy"],
        experienceLevel: "Mid Level",
        type: "Full-time",
        salaryRange: "₹4,00,000 - ₹8,00,000",
        aiTags: ["Marketing", "Digital", "SEO", "Analytics"]
    },

    // --- INDIA JOBS ---
    {
        title: "SDE II - Backend",
        company: "Swiggy",
        location: "Bangalore, Karnataka",
        description: "Scale high-throughput systems serving millions of users.",
        requirements: ["Java", "Spring Boot", "Kafka", "Distributed Systems", "NoSQL"],
        experienceLevel: "Senior",
        type: "Hybrid",
        salaryRange: "₹25,00,000 - ₹45,00,000",
        aiTags: ["Backend", "Java", "High Scale", "System Design"]
    },
    {
        title: "Frontend Engineer",
        company: "Razorpay",
        location: "Bangalore, Karnataka",
        description: "Build pixel-perfect, smooth financial dashboards.",
        requirements: ["React", "Redux", "TypeScript", "Webpack", "Performance Optimization"],
        experienceLevel: "Mid Level",
        type: "Full-time",
        salaryRange: "₹15,00,000 - ₹28,00,000",
        aiTags: ["Frontend", "React", "Fintech"]
    },
    {
        title: "Data Scientist",
        company: "Reliance Jio",
        location: "Mumbai, Maharashtra",
        description: "Analyze vast amounts of telecom data to improve network efficiency.",
        requirements: ["Python", "Machine Learning", "Big Data", "Spark", "TensorFlow"],
        experienceLevel: "Senior",
        type: "On-site",
        salaryRange: "₹18,00,000 - ₹35,00,000",
        aiTags: ["Data Science", "AI", "ML", "Big Data"]
    },
    {
        title: "Product Manager",
        company: "Zomato",
        location: "Gurgaon, Delhi NCR",
        description: "Own the product roadmap for new food delivery verticals.",
        requirements: ["Product Management", "Agile", "User Analytics", "Strategy", "Communication"],
        experienceLevel: "Senior",
        type: "Hybrid",
        salaryRange: "₹30,00,000 - ₹50,00,000",
        aiTags: ["Product", "Management", "Strategy"]
    },
    {
        title: "Blockchain Developer",
        company: "Polygon",
        location: "Remote (India)",
        description: " contribute to the leading layer-2 scaling solution for Ethereum.",
        requirements: ["Solidity", "Smart Contracts", "Ethereum", "Web3.js", "Go"],
        experienceLevel: "Mid Level",
        type: "Remote",
        salaryRange: "₹20,00,000 - ₹40,00,000",
        aiTags: ["Blockchain", "Web3", "Crypto", "Smart Contracts"]
    },
    {
        title: "Systems Engineer",
        company: "TCS",
        location: "Pune, Maharashtra",
        description: "Maintain and upgrade enterprise legacy systems for banking clients.",
        requirements: ["Java", "J2EE", "Oracle", "Unix", "ITIL"],
        experienceLevel: "Entry Level",
        type: "On-site",
        salaryRange: "₹4,00,000 - ₹7,00,000",
        aiTags: ["Enterprise", "Java", "Maintenance"]
    },

    // --- INTERNATIONAL JOBS ---
    {
        title: "Senior Software Engineer",
        company: "Google",
        location: "London, UK",
        description: "Work on world-class search and AI products.",
        requirements: ["C++", "Python", "Algorithms", "System Design", "Distributed Computing"],
        experienceLevel: "Senior",
        type: "Hybrid",
        salaryRange: "£80,000 - £120,000",
        aiTags: ["Big Tech", "Engineering", "Algorithms", "Global"]
    },
    {
        title: "Tech Lead",
        company: "Spotify",
        location: "Stockholm, Sweden",
        description: "Lead a team building the next generation of audio streaming discovery.",
        requirements: ["Java", "System Design", "Leadership", "Microservices", "Data Engineering"],
        experienceLevel: "Senior",
        type: "On-site",
        salaryRange: "€70,000 - €100,000",
        aiTags: ["Streaming", "Tech Lead", "Leadership"]
    },
    {
        title: "AI Researcher",
        company: "OpenAI",
        location: "San Francisco, USA",
        description: "Push the boundaries of AGI. Requires a PhD and top-tier publication record.",
        requirements: ["Deep Learning", "PyTorch", "NLP", "Mathematics", "Research"],
        experienceLevel: "Senior",
        type: "On-site",
        salaryRange: "$200,000 - $500,000",
        aiTags: ["AI", "Research", "Deep Learning", "NLP"]
    },
    {
        title: "Cloud Architect",
        company: "Emirates Group",
        location: "Dubai, UAE",
        description: "Design scalable cloud infrastructure for the airline industry.",
        requirements: ["AWS", "Azure", "Cloud Security", "Enterprise Architecture", "Migration"],
        experienceLevel: "Senior",
        type: "On-site",
        salaryRange: "AED 25,000 - AED 45,000 / Month",
        aiTags: ["Cloud", "Architecture", "Travel Tech"]
    },
    {
        title: "Cybersecurity Analyst",
        company: "DBS Bank",
        location: "Singapore",
        description: "Protect financial assets from advanced cyber threats.",
        requirements: ["Network Security", "Penetration Testing", "CISSP", "Forensics", "SIEM"],
        experienceLevel: "Mid Level",
        type: "Hybrid",
        salaryRange: "SGD 6,000 - SGD 10,000 / Month",
        aiTags: ["Security", "Cybersecurity", "Banking"]
    },
    {
        title: "Frontend Developer",
        company: "Shopify",
        location: "Toronto, Canada",
        description: "Build commerce tools for millions of merchants worldwide.",
        requirements: ["React", "Ruby on Rails", "GraphQL", "Accessibility", "CSS"],
        experienceLevel: "Mid Level",
        type: "Remote",
        salaryRange: "CAD 90,000 - CAD 130,000",
        aiTags: ["Frontend", "E-commerce", "Remote"]
    },
    {
        title: "Mobile Engineer (iOS)",
        company: "Revolut",
        location: "London, UK",
        description: "Build the world's first global financial superapp.",
        requirements: ["Swift", "Objective-C", "iOS SDK", "CocoaPods", "Fintech"],
        experienceLevel: "Senior",
        type: "Hybrid",
        salaryRange: "£70,000 - £110,000",
        aiTags: ["Mobile", "iOS", "Fintech"]
    },

    // --- DIVERSE FIELDS (Healthcare, Education, Finance, etc.) ---
    {
        title: "General Physician",
        company: "Aster Medcity",
        location: "Kochi, Kerala",
        description: "Provide primary healthcare services and patient consultations.",
        requirements: ["MBBS", "MD", "Patient Care", "Diagnosis", "Medical Ethics"],
        experienceLevel: "Senior",
        type: "On-site",
        salaryRange: "₹80,000 - ₹1,50,000 / Month",
        aiTags: ["Healthcare", "Medical", "Doctor"]
    },
    {
        title: "Civil Engineer",
        company: "Sobha Developers",
        location: "Bangalore, Karnataka",
        description: "Oversee construction projects, ensure structural integrity and compliance.",
        requirements: ["Civil Engineering", "AutoCAD", "Project Management", "Site Safety"],
        experienceLevel: "Mid Level",
        type: "On-site",
        salaryRange: "₹6,00,000 - ₹10,00,000",
        aiTags: ["Construction", "Engineering", "Civil"]
    },
    {
        title: "Chartered Accountant",
        company: "KPMG India",
        location: "Mumbai, Maharashtra",
        description: "Manage financial audits, taxation, and compliance for corporate clients.",
        requirements: ["CA", "Auditing", "Taxation", "Financial Reporting", "GST"],
        experienceLevel: "Senior",
        type: "Hybrid",
        salaryRange: "₹12,00,000 - ₹20,00,000",
        aiTags: ["Finance", "Accounting", "Audit"]
    },
    {
        title: "High School Physics Teacher",
        company: "Trivandrum International School",
        location: "Trivandrum, Kerala",
        description: "Teach Physics to high school students and prepare them for board exams.",
        requirements: ["B.Ed", "M.Sc Physics", "Teaching", "Communication", "Classroom Management"],
        experienceLevel: "Mid Level",
        type: "On-site",
        salaryRange: "₹40,000 - ₹60,000 / Month",
        aiTags: ["Education", "Teaching", "Physics"]
    },
    {
        title: "Executive Chef",
        company: "Taj Hotels",
        location: "Kochi, Kerala",
        description: "Lead the culinary team and design menus for a 5-star luxury hotel.",
        requirements: ["Culinary Arts", "Menu Planning", "Kitchen Management", "Food Safety"],
        experienceLevel: "Senior",
        type: "On-site",
        salaryRange: "₹10,00,000 - ₹18,00,000",
        aiTags: ["Hospitality", "Culinary", "Chef", "Management"]
    },
    {
        title: "Content Writer",
        company: "Byju's",
        location: "Bangalore, Karnataka",
        description: "Create engaging educational content and marketing copy.",
        requirements: ["Copywriting", "SEO", "Creative Writing", "Editing", "English Proficiency"],
        experienceLevel: "Entry Level",
        type: "Remote",
        salaryRange: "₹4,00,000 - ₹7,00,000",
        aiTags: ["Content", "Marketing", "Writing", "Creative"]
    },
    {
        title: "Sales Manager",
        company: "Maruti Suzuki",
        location: "Kozhikode, Kerala",
        description: "Drive sales targets and manage a team of sales executives.",
        requirements: ["Sales Strategy", "Team Management", "Negotiation", "CRM", "Automotive"],
        experienceLevel: "Mid Level",
        type: "On-site",
        salaryRange: "₹50,000 - ₹80,000 / Month",
        aiTags: ["Sales", "Management", "Automotive"]
    },
    {
        title: "Architect",
        company: "Habitat Technology Group",
        location: "Trivandrum, Kerala",
        description: "Design sustainable and eco-friendly building solutions.",
        requirements: ["B.Arch", "Sustainable Design", "AutoCAD", "Revit", "Urban Planning"],
        experienceLevel: "Mid Level",
        type: "On-site",
        salaryRange: "₹5,00,000 - ₹9,00,000",
        aiTags: ["Architecture", "Design", "Construction"]
    }
];

module.exports = jobs;
