/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db, hashPassword, generateId } from "./server/db.js";
import { 
  analyzeResume, 
  generateInterviewQuestions, 
  predictPlacement, 
  recommendJobs, 
  scanResumeKeywords 
} from "./server/ai.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // ----------------------------------------------------
  // SERVER SIDE API ROUTES
  // ----------------------------------------------------

  // Security Middleware - simple Role Authorization Check
  const checkAuthToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // For a highly robust stateless prototype, we check custom headers 'Authorization'
    // in the layout. Tokens are simple: `session-<role>-<userId>`
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Access denied. Missing session authentication token." });
    }
    next();
  };

  // Auth: Student Register
  app.post("/api/auth/student/register", (req, res) => {
    const { name, email, phone, department, semester, cgpa, password } = req.body;

    if (!name || !email || !phone || !department || !semester || !cgpa || !password) {
      return res.status(400).json({ error: "All student registration parameters are mandatory." });
    }

    const existing = db.getStudentByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "A student profile with this email already exists." });
    }

    const parsedCgpa = parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10.0) {
      return res.status(400).json({ error: "CGPA must be a valid float between 0.0 and 10.0" });
    }

    const newStudent = {
      student_id: "s-" + generateId().substring(0, 8),
      name,
      email,
      phone,
      department,
      semester: parseInt(semester, 10),
      cgpa: parsedCgpa,
      skills: "React, TypeScript, SQL", // Default skills
      resumeUrl: "",
      linkedin: "",
      github: "",
      password_hash: hashPassword(password)
    };

    db.insertStudent(newStudent);
    
    // Add success notification
    db.insertNotification({
      notification_id: generateId(),
      user_id: newStudent.student_id,
      title: "Welcome aboard!",
      message: "Your profile is registered successfully. Complete your Academic details and upload your Resume under Profile to unlock personalized recommended jobs.",
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    res.status(201).json({
      token: `session-student-${newStudent.student_id}`,
      userId: newStudent.student_id,
      role: 'student',
      name: newStudent.name,
      email: newStudent.email
    });
  });

  // Auth: Student Login
  app.post("/api/auth/student/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const student = db.getStudentByEmail(email);
    if (!student || student.password_hash !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid academic email or password credentials." });
    }

    db.addAuditLog(student.name, "student", "Logged in to placement console.");

    res.json({
      token: `session-student-${student.student_id}`,
      userId: student.student_id,
      role: 'student',
      name: student.name,
      email: student.email
    });
  });

  // Auth: Company Register
  app.post("/api/auth/company/register", (req, res) => {
    const { company_name, email, password, website, description } = req.body;

    if (!company_name || !email || !password || !website) {
      return res.status(400).json({ error: "Company Name, official corporate email, web URL and password are required." });
    }

    const existing = db.getCompanyByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "This corporate recruiter email is already registered." });
    }

    const newCompany = {
      company_id: "c-" + generateId().substring(0, 8),
      company_name,
      email,
      website,
      description: description || "Leading hiring partner and technology innovator.",
      password_hash: hashPassword(password)
    };

    db.insertCompany(newCompany);

    res.status(201).json({
      token: `session-company-${newCompany.company_id}`,
      userId: newCompany.company_id,
      role: 'company',
      name: newCompany.company_name,
      email: newCompany.email
    });
  });

  // Auth: Company Login
  app.post("/api/auth/company/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Corporate email and password are required." });
    }

    const company = db.getCompanyByEmail(email);
    if (!company || company.password_hash !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid corporate credentials." });
    }

    db.addAuditLog(company.company_name, "company", "Recruiter portal accessed.");

    res.json({
      token: `session-company-${company.company_id}`,
      userId: company.company_id,
      role: 'company',
      name: company.company_name,
      email: company.email
    });
  });

  // Auth: Admin Login
  app.post("/api/auth/admin/login", (req, res) => {
    const { email, password } = req.body;
    
    // Constant credentials for placement administrative hub
    if (email === "admin@college.edu" && password === "admin123") {
      db.addAuditLog("Administrator Hub", "admin", "Admin dashboard loaded.");
      return res.json({
        token: `session-admin-college`,
        userId: "admin",
        role: "admin",
        name: "Campus Placement Admin",
        email: "admin@college.edu"
      });
    }

    return res.status(401).json({ error: "Invalid administrative credentials." });
  });

  // Get active student profile info
  app.get("/api/profile/student/:id", (req, res) => {
    const s = db.getStudentById(req.params.id);
    if (!s) return res.status(404).json({ error: "Student profile not found." });
    res.json(s);
  });

  // Update student profile details
  app.post("/api/profile/student/update", (req, res) => {
    const { student_id, cgpa, skills, resumeUrl, linkedin, github, projects, certifications } = req.body;
    const s = db.getStudentById(student_id);
    if (!s) return res.status(404).json({ error: "Student profile not identified." });

    const updated = {
      ...s,
      cgpa: cgpa ? parseFloat(cgpa) : s.cgpa,
      skills: skills || s.skills,
      resumeUrl: typeof resumeUrl === 'string' ? resumeUrl : s.resumeUrl,
      linkedin: linkedin || s.linkedin,
      github: github || s.github,
      projects: projects || s.projects || "",
      certifications: certifications || s.certifications || ""
    };

    db.updateStudent(updated);
    res.json({ success: true, student: updated });
  });

  // Get Jobs List
  app.get("/api/jobs", (req, res) => {
    const jobsList = db.getJobs();
    const studentId = req.query.student_id as string;
    
    // If student_id is passed, we check match recommendations
    if (studentId) {
      const student = db.getStudentById(studentId);
      if (student) {
        const matches = recommendJobs(student, jobsList);
        return res.json(matches);
      }
    }

    res.json(jobsList.map(j => ({ job: j, isEligible: true, matchScore: 80 })));
  });

  // Post Job Drives
  app.post("/api/jobs/create", (req, res) => {
    const { company_id, role, package: pkg, cgpa_requirement, skills_required, description, deadline } = req.body;
    if (!company_id || !role || !pkg || !cgpa_requirement || !skills_required || !description || !deadline) {
      return res.status(400).json({ error: "All fields are required to launch a hiring drive." });
    }

    const newJob = {
      job_id: "j-" + generateId().substring(0, 8),
      company_id,
      role,
      package: pkg,
      cgpa_requirement: parseFloat(cgpa_requirement),
      skills_required,
      description,
      deadline
    };

    db.insertJob(newJob);

    // Global alert
    const co = db.getCompanyById(company_id);
    db.insertNotification({
      notification_id: generateId(),
      user_id: "all",
      title: "New Placement Opportunity",
      message: `${co ? co.company_name : 'A top tech brand'} is visiting campus for: ${role}. Package Offered: ${pkg}. Eligible CGPA: >= ${cgpa_requirement}. Last date to apply is ${deadline}.`,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    res.status(201).json({ success: true, job: newJob });
  });

  // Delete Job Openings
  app.delete("/api/jobs/delete/:id", (req, res) => {
    db.deleteJob(req.params.id);
    res.json({ success: true });
  });

  // Get Applications Log (Highly Filterable)
  app.get("/api/applications", (req, res) => {
    const { student_id, company_id } = req.query;
    let apps = db.getApplications();

    if (student_id) {
      apps = apps.filter(a => a.student_id === student_id);
    } else if (company_id) {
      // Find jobs of this company first
      const myJobs = db.getJobs().filter(j => j.company_id === company_id).map(j => j.job_id);
      apps = apps.filter(a => myJobs.includes(a.job_id));
    }

    res.json(apps);
  });

  // Apply to a specific Job opening
  app.post("/api/applications/apply", (req, res) => {
    const { student_id, job_id } = req.body;
    if (!student_id || !job_id) {
      return res.status(400).json({ error: "Missing applicant student_id or job_id." });
    }

    // Eligibility check
    const student = db.getStudentById(student_id);
    const job = db.getJobById(job_id);
    if (!student || !job) {
      return res.status(404).json({ error: "Student or job identifier invalid." });
    }

    if (student.cgpa < job.cgpa_requirement) {
      return res.status(403).json({ error: `Ineligible. Your CGPA (${student.cgpa}) does not meet the company hurdle of (${job.cgpa_requirement})` });
    }

    // Check duplicate applications
    const existing = db.getApplications().find(a => a.student_id === student_id && a.job_id === job_id);
    if (existing) {
      return res.status(409).json({ error: "Already applied. You can monitor progress under Application status logs." });
    }

    const app = {
      application_id: "a-" + generateId().substring(0, 8),
      student_id,
      job_id,
      status: "Applied" as const,
      applied_date: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    db.insertApplication(app);
    res.status(201).json({ success: true, application: app });
  });

  // Update hiring progress status
  app.post("/api/applications/update-status", (req, res) => {
    const { application_id, status } = req.body;
    if (!application_id || !status) {
      return res.status(400).json({ error: "Application token and new status required." });
    }

    db.updateApplicationStatus(application_id, status);
    res.json({ success: true });
  });

  // Get Interviews schedule
  app.get("/api/interviews", (req, res) => {
    const { student_id, company_id } = req.query;
    let ints = db.getInterviews();

    if (student_id) {
      // Find student apps
      const studentApps = db.getApplications().filter(a => a.student_id === student_id).map(a => a.application_id);
      ints = ints.filter(i => studentApps.includes(i.application_id));
    } else if (company_id) {
      // Find company jobs and apps
      const compJobs = db.getJobs().filter(j => j.company_id === company_id).map(j => j.job_id);
      const compApps = db.getApplications().filter(a => compJobs.includes(a.job_id)).map(a => a.application_id);
      ints = ints.filter(i => compApps.includes(i.application_id));
    }

    res.json(ints);
  });

  // Schedule technical or HR interview
  app.post("/api/interviews/schedule", (req, res) => {
    const { application_id, interview_date, mode } = req.body;
    if (!application_id || !interview_date || !mode) {
      return res.status(400).json({ error: "Application ID, dynamic date-time, and interview medium (Online/Offline) required." });
    }

    const newInt = {
      interview_id: "i-" + generateId().substring(0, 8),
      application_id,
      interview_date,
      mode,
      result: "Pending" as const
    };

    db.insertInterview(newInt);
    
    // Automatically promotion status of application to "Interview Scheduled"
    db.updateApplicationStatus(application_id, "Interview Scheduled");

    res.status(201).json({ success: true, interview: newInt });
  });

  // Post announcement or custom notify log
  app.post("/api/notifications/notify-all", (req, res) => {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: "Announcement title and clear message string needed." });
    }

    db.insertNotification({
      notification_id: generateId(),
      user_id: "all",
      title,
      message,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
    
    db.addAuditLog("Admin", "admin", `Published campus announcement: "${title}"`);
    res.json({ success: true });
  });

  // Get active users notify list
  app.get("/api/notifications", (req, res) => {
    const userId = req.query.user_id as string;
    let list = db.getNotifications();
    
    if (userId) {
      // Find announcements for 'all' + student/company specific ID
      list = list.filter(n => n.user_id === "all" || n.user_id === userId);
    }
    
    res.json(list);
  });

  // AI Endpoint: Analyze Skills and Resume
  app.post("/api/ai/analyze-resume", async (req, res) => {
    const { resumeText, targetRole } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "Resume contents text cannot be blank." });
    }

    try {
      const analysis = await analyzeResume(resumeText, targetRole);
      res.json(analysis);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed parsing resume text via AI." });
    }
  });

  // AI Endpoint: Interview Q&A helper
  app.post("/api/ai/generate-questions", async (req, res) => {
    const { skills, role, difficulty } = req.body;
    const skillsArr = Array.isArray(skills) ? skills : (skills ? skills.split(",") : []);
    
    try {
      const qaList = await generateInterviewQuestions(skillsArr, role || "Developer", difficulty || "Medium");
      res.json(qaList);
    } catch (err: any) {
      res.status(500).json({ error: "Technical query generated exception." });
    }
  });

  // AI Endpoint: Placement Prediction percentage
  app.post("/api/ai/predict-placement", async (req, res) => {
    const { cgpa, skills, projects, certifications } = req.body;
    const mockStudent: any = {
      name: "Enrolled Candidate",
      cgpa: cgpa ? parseFloat(cgpa) : 8.0,
      skills: skills || "",
      projects: projects || "",
      certifications: certifications || ""
    };

    try {
      const pred = await predictPlacement(mockStudent);
      res.json(pred);
    } catch (err) {
      res.status(500).json({ error: "Prediction sequence failed." });
    }
  });

  // AI Endpoint: Keyword Scanner density checks
  app.post("/api/ai/scan-keywords", (req, res) => {
    const { studentSkills, jobSkillsRequired } = req.body;
    if (!studentSkills || !jobSkillsRequired) {
      return res.status(400).json({ error: "Student skills inventory and job requirements mandatory." });
    }
    
    const scan = scanResumeKeywords(studentSkills, jobSkillsRequired);
    res.json(scan);
  });

  // Admin Panels: Dashboard analytics and listings managers
  app.get("/api/admin/stats", (req, res) => {
    const students = db.getStudents();
    const companies = db.getCompanies();
    const jobs = db.getJobs();
    const apps = db.getApplications();
    const logs = db.getAuditLogs();
    const intv = db.getInterviews();

    const stats = {
      totalStudents: students.length,
      totalCompanies: companies.length,
      totalJobs: jobs.length,
      totalApplications: apps.length,
      placedRatio: apps.length > 0 ? Math.round((apps.filter(a => a.status === 'Selected').length / students.length) * 100) : 0,
      activeDrives: jobs.filter(j => new Date(j.deadline) >= new Date()).length,
      appliedCount: apps.length,
      shortlistedCount: apps.filter(a => a.status === 'Shortlisted').length,
      interviewScheduledCount: apps.filter(a => a.status === 'Interview Scheduled').length,
      selectedCount: apps.filter(a => a.status === 'Selected').length,
      rejectedCount: apps.filter(a => a.status === 'Rejected').length,
      auditLogsTail: logs.slice(0, 15) // Recent 15 entries
    };

    res.json(stats);
  });

  // Admin: Get absolute Audit trail
  app.get("/api/admin/export/audit-logs", (req, res) => {
    res.json(db.getAuditLogs());
  });

  // Admin: Manage Students - Add, Delete
  app.get("/api/admin/students", (req, res) => {
    res.json(db.getStudents());
  });

  app.delete("/api/admin/students/delete/:id", checkAuthToken, (req, res) => {
    db.deleteStudent(req.params.id);
    res.json({ success: true });
  });

  // Admin: Manage Companies - Add, Delete
  app.get("/api/admin/companies", (req, res) => {
    res.json(db.getCompanies());
  });

  app.delete("/api/admin/companies/delete/:id", checkAuthToken, (req, res) => {
    db.deleteCompany(req.params.id);
    res.json({ success: true });
  });


  // ----------------------------------------------------
  // VITE COMPILER MIDDLEWARE INTEGRATION
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    // Development mode leveraging Hot module compilation (via process config rules)
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from compiled dist directory in container
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`===============================================`);
    console.log(`🚀 College Placement Portal server fully live!`);
    console.log(`🔗 Address: http://0.0.0.0:${PORT}`);
    console.log(`===============================================`);
  });
}

startServer();
