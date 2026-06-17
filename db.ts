/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Student, Company, Job, Application, Interview, Notification, AuditLog } from '../src/types.js';

const DB_FILE = path.join(process.cwd(), 'placement-database.json');

interface DatabaseSchema {
  students: Student[];
  companies: Company[];
  jobs: Job[];
  applications: Application[];
  interviews: Interview[];
  notifications: Notification[];
  auditLogs: AuditLog[];
}

// Simple Helper for ID generation
export function generateId(): string {
  return crypto.randomUUID();
}

// Secure sha256 hashing
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initial Seed Data
const DEFAULT_SKILLS = "React, TypeScript, Node.js, Python, SQL, Git, Java, C++, Docker";

const INITIAL_DB: DatabaseSchema = {
  students: [
    {
      student_id: "s1",
      name: "Sanjay Kumar",
      email: "student@college.edu",
      phone: "+1 (555) 019-2834",
      department: "Computer Science & Engineering",
      semester: 8,
      cgpa: 9.2,
      skills: "React, Node.js, TypeScript, Python, Tailwind CSS, SQL, Git",
      resumeUrl: "https://example.com/resumes/sanjay_kumar.pdf",
      linkedin: "https://linkedin.com/in/sanjay-kumar-placement",
      github: "https://github.com/sanjaykumar-dev",
      password_hash: hashPassword("student123"), // Seed matching simple login
      projects: "HealthTracker: Full-stack React app tracking user metrics; QueryEngine: Optimized SQL generator.",
      certifications: "AWS Certified Developer Associate, Google Cloud Digital Leader"
    },
    {
      student_id: "s2",
      name: "Ananya Iyer",
      email: "ananya@college.edu",
      phone: "+1 (555) 014-9875",
      department: "Information Technology",
      semester: 8,
      cgpa: 8.7,
      skills: "Java, Python, Django, PostgreSQL, Docker, Kubernetes, C++",
      resumeUrl: "https://example.com/resumes/ananya_iyer.pdf",
      linkedin: "https://linkedin.com/in/ananya-iyer",
      github: "https://github.com/ananya-iyer-codes",
      password_hash: hashPassword("student123"),
      projects: "InventorySync: Microservices application for real-time tracking.",
      certifications: "Oracle Java SE 11 Programmer"
    },
    {
      student_id: "s3",
      name: "Rohan Varma",
      email: "rohan@college.edu",
      phone: "+1 (555) 018-2231",
      department: "Electronics & Communication",
      semester: 8,
      cgpa: 7.4,
      skills: "Python, Embedded C, Raspberry Pi, Circuit Design, MATLAB",
      resumeUrl: "https://example.com/resumes/rohan_varma.pdf",
      linkedin: "https://linkedin.com/in/rohan-varma-ece",
      github: "https://github.com/rohan-varma-ece",
      password_hash: hashPassword("student123"),
      projects: "SmartHome IoT: Microcontroller-based ambient home sensor system.",
      certifications: "Cisco Certified Network Associate (CCNA)"
    },
    {
      student_id: "s4",
      name: "Maria Jenkins",
      email: "maria@college.edu",
      phone: "+1 (555) 012-3456",
      department: "Data Science",
      semester: 8,
      cgpa: 9.6,
      skills: "Python, TensorFlow, PyTorch, SQL, R, Pandas, Tableau, Machine Learning",
      resumeUrl: "",
      linkedin: "https://linkedin.com/in/maria-jenkins-ds",
      github: "https://github.com/maria-ds",
      password_hash: hashPassword("student123"),
      projects: "PlacementPredictor: Machine learning tool calculating hiring success rates.",
      certifications: "TensorFlow Developer Certificate, DeepLearning.AI Specialization"
    }
  ],
  companies: [
    {
      company_id: "c1",
      company_name: "Google inc",
      email: "google@recruitment.com",
      password_hash: hashPassword("company123"),
      website: "https://google.com/careers",
      description: "Our mission is to organize the world's information and make it universally accessible and useful. We seek passionate software interns and engineers who thrive on deep technical problem solving."
    },
    {
      company_id: "c2",
      company_name: "Microsoft Corp",
      email: "microsoft@recruitment.com",
      password_hash: hashPassword("company123"),
      website: "https://microsoft.com/careers",
      description: "Empowering every person and organization on the planet to achieve more. We hold global scale opportunities across Azure Cloud, Windows Core, and Office Productivity suites."
    },
    {
      company_id: "c3",
      company_name: "Goldman Sachs",
      email: "goldman@recruitment.com",
      password_hash: hashPassword("company123"),
      website: "https://goldmansachs.com/careers",
      description: "A leading global financial institution that delivers a broad range of services. Our engineering teams build highly performant, low-latency financial tech engines."
    }
  ],
  jobs: [
    {
      job_id: "j1",
      company_id: "c1",
      role: "Software Development Engineer",
      package: "32 LPA",
      cgpa_requirement: 8.5,
      skills_required: "Python, Docker, TypeScript, SQL, Algorithms, Data Structures",
      description: "Join the core Systems Infrastructure team inside Google Cloud. Develop foundational routing software, scale microservices, and optimize multi-node databases. Excellent exposure to distributed systems and virtualized runtimes.",
      deadline: "2026-08-15"
    },
    {
      job_id: "j2",
      company_id: "c2",
      role: "Cloud Solutions Engineer",
      package: "24 LPA",
      cgpa_requirement: 8.0,
      skills_required: "Java, Kubernetes, C++, Git, System Design",
      description: "Help enterprises architect elite serverless cloud services. You will design container clusters on Azure, implement enterprise APIs, and write detailed architectural guidelines.",
      deadline: "2026-07-20"
    },
    {
      job_id: "j3",
      company_id: "c3",
      role: "Financial Analyst & Engineer",
      package: "28 LPA",
      cgpa_requirement: 8.5,
      skills_required: "Python, SQL, PyTorch, Pandas, Excel, Quant Modeling",
      description: "Design systematic computer programs checking market anomalies and assessing venture capital portfolios in real-time. Heavy emphasis on python-based quantitative analytics.",
      deadline: "2026-07-30"
    },
    {
      job_id: "j4",
      company_id: "c2",
      role: "Frontend Engineer Intern",
      package: "14 LPA",
      cgpa_requirement: 7.5,
      skills_required: "React, TypeScript, Tailwind CSS, Javascript",
      description: "Create and perfect user-facing web dashboards across Microsoft Teams extensions. Focus on highly responsive layouts, beautiful telemetry diagrams, and accessibility Standards.",
      deadline: "2026-09-01"
    }
  ],
  applications: [
    {
      application_id: "a1",
      student_id: "s1",
      job_id: "j1",
      status: "Shortlisted",
      applied_date: "2026-06-10 10:14:00"
    },
    {
      application_id: "a2",
      student_id: "s1",
      job_id: "j4",
      status: "Interview Scheduled",
      applied_date: "2026-06-11 14:22:15"
    },
    {
      application_id: "a3",
      student_id: "s2",
      job_id: "j2",
      status: "Applied",
      applied_date: "2026-06-12 09:05:30"
    },
    {
      application_id: "a4",
      student_id: "s4",
      job_id: "j1",
      status: "Selected",
      applied_date: "2026-06-08 11:40:02"
    }
  ],
  interviews: [
    {
      interview_id: "i1",
      application_id: "a2",
      interview_date: "2026-06-20 11:00",
      mode: "Online",
      result: "Pending"
    }
  ],
  notifications: [
    {
      notification_id: "n1",
      user_id: "all",
      title: "Placement Drives Open",
      message: "Google Inc has declared their Software Development SDE drives open. Elite students with CGPA >= 8.5 can submit application profiles under Jobs. Deadline is Aug 15.",
      created_at: "2026-06-15 08:00:00"
    },
    {
      notification_id: "n2",
      user_id: "s1",
      title: "Interview Scheduled",
      message: "Your application for Microsoft Frontend Engineer Inern has been shortlisted! An Online interview is scheduled for June 20 at 11:00 AM.",
      created_at: "2026-06-12 15:30:00"
    },
    {
      notification_id: "n3",
      user_id: "all",
      title: "Admin Panel Notice",
      message: "Welcome to the College Placement Portal. All Students and Company Recruiter dashboards are live. Complete your profiles to trigger AI Resume Matching.",
      created_at: "2026-06-16 09:00:00"
    }
  ],
  auditLogs: [
    {
      id: "l1",
      timestamp: "2026-06-16 09:12:00",
      user: "System Daemon",
      role: "system",
      action: "Database initialized with rich college records."
    }
  ]
};

class DatabaseManager {
  private schema: DatabaseSchema = { ...INITIAL_DB };

  constructor() {
    this.load();
  }

  // Load database from file or use defaults
  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        this.schema = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (e) {
      console.error("Failed to load placement database, using memory-store.", e);
    }
  }

  // Save database to file
  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.schema, null, 2), 'utf8');
    } catch (e) {
      console.error("Failed to persist database updates safely.", e);
    }
  }

  // Database Accessors
  public getStudents(): Student[] {
    return this.schema.students;
  }

  public getStudentById(id: string): Student | undefined {
    return this.schema.students.find(s => s.student_id === id);
  }

  public getStudentByEmail(email: string): Student | undefined {
    return this.schema.students.find(s => s.email.toLowerCase() === email.toLowerCase());
  }

  public insertStudent(student: Student) {
    this.schema.students.push(student);
    this.save();
    this.addAuditLog(student.name, 'student', `Registration submitted for department: ${student.department}`);
  }

  public updateStudent(student: Student) {
    const idx = this.schema.students.findIndex(s => s.student_id === student.student_id);
    if (idx !== -1) {
      this.schema.students[idx] = student;
      this.save();
      this.addAuditLog(student.name, 'student', `Student academic/personal profile completed.`);
    }
  }

  public deleteStudent(id: string) {
    const student = this.getStudentById(id);
    if (student) {
      this.schema.students = this.schema.students.filter(s => s.student_id !== id);
      // Clean secondary applications cascade
      this.schema.applications = this.schema.applications.filter(a => a.student_id !== id);
      this.save();
      this.addAuditLog("Admin", 'admin', `Deleted student profile: ${student.name} (${student.email})`);
    }
  }

  public getCompanies(): Company[] {
    return this.schema.companies;
  }

  public getCompanyById(id: string): Company | undefined {
    return this.schema.companies.find(c => c.company_id === id);
  }

  public getCompanyByEmail(email: string): Company | undefined {
    return this.schema.companies.find(c => c.email.toLowerCase() === email.toLowerCase());
  }

  public insertCompany(company: Company) {
    this.schema.companies.push(company);
    this.save();
    this.addAuditLog(company.company_name, 'company', `Company registered recruitment credentials.`);
  }

  public updateCompany(company: Company) {
    const idx = this.schema.companies.findIndex(c => c.company_id === company.company_id);
    if (idx !== -1) {
      this.schema.companies[idx] = company;
      this.save();
      this.addAuditLog(company.company_name, 'company', `Recruiting firm profile description was enhanced.`);
    }
  }

  public deleteCompany(id: string) {
    const company = this.getCompanyById(id);
    if (company) {
      this.schema.companies = this.schema.companies.filter(c => c.company_id !== id);
      // Clean associated jobs and their applications
      const companyJobs = this.schema.jobs.filter(j => j.company_id === id).map(j => j.job_id);
      this.schema.jobs = this.schema.jobs.filter(j => j.company_id !== id);
      this.schema.applications = this.schema.applications.filter(a => !companyJobs.includes(a.job_id));
      this.save();
      this.addAuditLog("Admin", 'admin', `Deleted recruiting partner company: ${company.company_name}`);
    }
  }

  public getJobs(): Job[] {
    return this.schema.jobs.map(j => {
      const co = this.getCompanyById(j.company_id);
      return {
        ...j,
        company_name: co ? co.company_name : "Recruiting Partner"
      };
    });
  }

  public getJobById(id: string): Job | undefined {
    const j = this.schema.jobs.find(x => x.job_id === id);
    if (!j) return undefined;
    const co = this.getCompanyById(j.company_id);
    return {
      ...j,
      company_name: co ? co.company_name : "Recruiting Partner"
    };
  }

  public insertJob(job: Job) {
    this.schema.jobs.push(job);
    this.save();
    const co = this.getCompanyById(job.company_id);
    this.addAuditLog(co ? co.company_name : "Company recruiter", 'company', `Posted a new hiring drive: ${job.role} with package ${job.package}.`);
  }

  public updateJob(job: Job) {
    const idx = this.schema.jobs.findIndex(j => j.job_id === job.job_id);
    if (idx !== -1) {
      this.schema.jobs[idx] = job;
      this.save();
    }
  }

  public deleteJob(id: string) {
    const job = this.getJobById(id);
    if (job) {
      this.schema.jobs = this.schema.jobs.filter(j => j.job_id !== id);
      this.schema.applications = this.schema.applications.filter(a => a.job_id !== id);
      this.save();
      this.addAuditLog("Admin", 'admin', `Removed drive opening: ${job.role} of ${job.company_name}`);
    }
  }

  public getApplications(): Application[] {
    return this.schema.applications.map(a => {
      const stu = this.getStudentById(a.student_id);
      const j = this.getJobById(a.job_id);
      return {
        ...a,
        student_name: stu ? stu.name : "Anonymous Student",
        student_email: stu ? stu.email : "",
        student_cgpa: stu ? stu.cgpa : 0.0,
        job_role: j ? j.role : "SDE Drive",
        company_name: j ? j.company_name : "Recruiting Partner"
      };
    });
  }

  public insertApplication(app: Application) {
    this.schema.applications.push(app);
    this.save();
    const stu = this.getStudentById(app.student_id);
    const j = this.getJobById(app.job_id);
    this.addAuditLog(stu ? stu.name : "Student", 'student', `Applied for ${j ? j.role : 'Job'} at ${j ? j.company_name : 'Partner'}`);
  }

  public updateApplicationStatus(appId: string, status: Application['status']) {
    const idx = this.schema.applications.findIndex(a => a.application_id === appId);
    if (idx !== -1) {
      const oldApp = this.schema.applications[idx];
      this.schema.applications[idx].status = status;
      this.save();

      const stu = this.getStudentById(oldApp.student_id);
      const j = this.getJobById(oldApp.job_id);

      // System notification
      this.insertNotification({
        notification_id: generateId(),
        user_id: oldApp.student_id,
        title: "Application Status Update",
        message: `Your application for ${j ? j.role : 'Job'} at ${j ? j.company_name : 'Partner'} is now [${status}]. Check details under your profile logs.`,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });

      this.addAuditLog("Recruiter", 'company', `Application #${appId} progressed to: ${status}`);
    }
  }

  public getInterviews(): Interview[] {
    return this.schema.interviews.map(i => {
      const app = this.schema.applications.find(a => a.application_id === i.application_id);
      const stu = app ? this.getStudentById(app.student_id) : undefined;
      const j = app ? this.getJobById(app.job_id) : undefined;
      return {
        ...i,
        student_name: stu ? stu.name : "Registered Candidate",
        job_role: j ? j.role : "Hiring Drive",
        company_name: j ? j.company_name : "Recruiting Partner"
      };
    });
  }

  public insertInterview(interview: Interview) {
    this.schema.interviews.push(interview);
    this.save();

    const app = this.schema.applications.find(a => a.application_id === interview.application_id);
    if (app) {
      const stu = this.getStudentById(app.student_id);
      const j = this.getJobById(app.job_id);

      // System notification for candidate
      this.insertNotification({
        notification_id: generateId(),
        user_id: app.student_id,
        title: "Interview Event Scheduled",
        message: `An ${interview.mode} interview has been scheduled on ${interview.interview_date} for ${j ? j.role : 'Job'}. Prepare your skills portfolio!`,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });

      this.addAuditLog("Recruiter", 'company', `Interview scheduled for applicant ${stu ? stu.name : 'Candidate'}`);
    }
  }

  public updateInterviewResult(interviewId: string, result: Interview['result']) {
    const idx = this.schema.interviews.findIndex(i => i.interview_id === interviewId);
    if (idx !== -1) {
      this.schema.interviews[idx].result = result;
      this.save();
    }
  }

  public getNotifications(): Notification[] {
    return this.schema.notifications;
  }

  public insertNotification(notif: Notification) {
    this.schema.notifications.unshift(notif); // Prepend latest
    this.save();
  }

  public addAuditLog(user: string, role: string, action: string) {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const log: AuditLog = {
      id: generateId(),
      timestamp,
      user,
      role,
      action
    };
    this.schema.auditLogs.unshift(log); // Keep latest at top
    this.save();
  }

  public getAuditLogs(): AuditLog[] {
    return this.schema.auditLogs;
  }
}

export const db = new DatabaseManager();
