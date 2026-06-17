/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Building2, 
  Briefcase, 
  LogOut, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  User, 
  Bell, 
  PlusCircle, 
  Users, 
  ListOrdered, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  ChevronRight, 
  FileText, 
  ExternalLink, 
  UserPlus, 
  Trash2, 
  Calendar,
  SlidersHorizontal,
  Megaphone,
  Check,
  FileDown
} from 'lucide-react';

import { Student, Company, Job, Application, Interview, Notification, AuditLog } from './types.ts';
import LandingPage from './components/LandingPage.tsx';
import JobCard from './components/JobCard.tsx';
import ApplicationTracker from './components/ApplicationTracker.tsx';
import ResumeScannerPanel from './components/ResumeScannerPanel.tsx';
import AIQuestionPanel from './components/AIQuestionPanel.tsx';
import AIPredictorPanel from './components/AIPredictorPanel.tsx';

type ViewState = 
  | 'landing' 
  | 'student-register' | 'student-login' | 'student-dashboard'
  | 'company-register' | 'company-login' | 'company-dashboard'
  | 'admin-login' | 'admin-dashboard';

export default function App() {
  // Session tracking
  const [view, setView] = useState<ViewState>('landing');
  const [session, setSession] = useState<{
    token: string;
    userId: string;
    role: 'student' | 'company' | 'admin';
    name: string;
    email: string;
  } | null>(null);

  // Core Data States
  const [jobs, setJobs] = useState<{ job: Job; isEligible: boolean; matchScore: number }[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  // Breaking Bad Theme Mode Easter Egg
  const [isHeisenberg, setIsHeisenberg] = useState(false);

  // Periodic table highlight for Breaking Bad Easter Egg styling
  const renderPeriodicName = (name: string) => {
    const elements = [
      { symbol: 'W', num: 74, name: 'Tungsten' },
      { symbol: 'Ba', num: 56, name: 'Barium' },
      { symbol: 'S', num: 16, name: 'Sulfur' },
      { symbol: 'Na', num: 11, name: 'Sodium' },
      { symbol: 'Li', num: 3, name: 'Lithium' },
      { symbol: 'He', num: 2, name: 'Helium' },
      { symbol: 'C', num: 6, name: 'Carbon' },
      { symbol: 'N', num: 7, name: 'Nitrogen' },
      { symbol: 'O', num: 8, name: 'Oxygen' },
      { symbol: 'K', num: 19, name: 'Potassium' },
      { symbol: 'Cl', num: 17, name: 'Chlorine' },
      { symbol: 'I', num: 53, name: 'Iodine' }
    ];

    const lowerName = name.toLowerCase();

    // Look for 2 letter symbols first for cleaner matches (e.g. "Ba")
    for (const el of elements) {
      if (el.symbol.length === 2) {
        const symLower = el.symbol.toLowerCase();
        const idx = lowerName.indexOf(symLower);
        if (idx !== -1) {
          const before = name.substring(0, idx);
          const matchedText = name.substring(idx, idx + 2);
          const after = name.substring(idx + 2);
          return (
            <span className="flex items-center gap-1.5 font-display font-black">
              {before}
              <span className="inline-flex flex-col items-center justify-center bg-emerald-800 border-2 border-emerald-400 text-white font-mono rounded-lg w-10 h-10 shadow-md relative leading-none shrink-0" title={`${el.name} (${el.num})`}>
                <span className="text-[7px] font-bold text-emerald-300 absolute top-0.5 left-0.5">{el.num}</span>
                <span className="text-sm font-extrabold tracking-tight mt-1.5">{matchedText}</span>
              </span>
              {after}
            </span>
          );
        }
      }
    }

    // Look for 1 letter symbols (e.g. "W", "S", "H")
    for (const el of elements) {
      if (el.symbol.length === 1) {
        const symLower = el.symbol.toLowerCase();
        const idx = lowerName.indexOf(symLower);
        if (idx !== -1) {
          const before = name.substring(0, idx);
          const matchedText = name.substring(idx, idx + 1);
          const after = name.substring(idx + 1);
          return (
            <span className="flex items-center gap-1.5 font-display font-black">
              {before}
              <span className="inline-flex flex-col items-center justify-center bg-emerald-800 border-2 border-emerald-400 text-white font-mono rounded-lg w-10 h-10 shadow-md relative leading-none shrink-0" title={`${el.name} (${el.num})`}>
                <span className="text-[7px] font-bold text-emerald-300 absolute top-0.5 left-0.5">{el.num}</span>
                <span className="text-sm font-extrabold tracking-tight mt-1.5">{matchedText}</span>
              </span>
              {after}
            </span>
          );
        }
      }
    }

    return <span>{name}</span>;
  };
  
  // Admin Data & Control list state
  const [adminStats, setAdminStats] = useState<any>(null);
  const [adminStudents, setAdminStudents] = useState<Student[]>([]);
  const [adminCompanies, setAdminCompanies] = useState<Company[]>([]);
  
  // Dash Tab Sub-controls
  const [studentTab, setStudentTab] = useState<'jobs' | 'applications' | 'ai-prep' | 'ai-resume' | 'ai-predict' | 'profile' | 'notices'>('jobs');
  const [companyTab, setCompanyTab] = useState<'create-job' | 'view-apps' | 'view-jobs' | 'schedule' | 'details'>('create-job');
  const [adminTab, setAdminTab] = useState<'overview' | 'manage-students' | 'manage-companies' | 'manage-applications' | 'announcements'>('overview');

  // Input states (Login & Register Form containers)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regError, setRegError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Student Register Form Fields
  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sPhone, setSPhone] = useState("");
  const [sDept, setSDept] = useState("Computer Science & Engineering");
  const [sSem, setSSem] = useState("8");
  const [sCgpa, setSCgpa] = useState("8.5");
  const [sPass, setSPass] = useState("");
  const [sConfirmPass, setSConfirmPass] = useState("");

  // Company Register Form Fields
  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cWeb, setCWeb] = useState("");
  const [cDesc, setCDesc] = useState("");
  const [cPass, setCPass] = useState("");

  // Company Post Job Fields
  const [jRole, setJRole] = useState("");
  const [jPkg, setJPkg] = useState("12 LPA");
  const [jCgpa, setJCgpa] = useState("7.5");
  const [jSkills, setJSkills] = useState("React, Node.js, SQL, TypeScript");
  const [jDesc, setJDesc] = useState("");
  const [jDeadline, setJDeadline] = useState("2026-08-30");

  // Company Schedule Interview states
  const [selectedAppId, setSelectedAppId] = useState("");
  const [intDate, setIntDate] = useState("");
  const [intMode, setIntMode] = useState<'Online' | 'Offline'>('Online');

  // Admin Broadcast Announcements fields
  const [boardTitle, setBoardTitle] = useState("");
  const [boardMsg, setBoardMsg] = useState("");

  // Student Profile details
  const [profCgpa, setProfCgpa] = useState("8.5");
  const [profSkills, setProfSkills] = useState("React, TypeScript, Node.js, SQL, Tailwind CSS");
  const [profProjects, setProfProjects] = useState("");
  const [profCertifications, setProfCertifications] = useState("");
  const [profLinkedin, setProfLinkedin] = useState("");
  const [profGithub, setProfGithub] = useState("");
  const [profResume, setProfResume] = useState("");

  // Auto restore sessions on initial boot
  useEffect(() => {
    const saved = localStorage.getItem('cp_session');
    if (saved) {
      try {
        const loadedSession = JSON.parse(saved);
        setSession(loadedSession);
        // Direct route to respective dashboards
        if (loadedSession.role === 'student') {
          setView('student-dashboard');
          fetchStudentProfile(loadedSession.userId);
        } else if (loadedSession.role === 'company') {
          setView('company-dashboard');
        } else if (loadedSession.role === 'admin') {
          setView('admin-dashboard');
        }
      } catch (err) {
        console.error("Invalid cached session parameters.", err);
      }
    }
  }, []);

  // Fetch core data structures depending on session
  useEffect(() => {
    if (session) {
      fetchJobs();
      fetchApplications();
      fetchInterviews();
      fetchNotifications();

      if (session.role === 'admin') {
        fetchAdminStats();
        fetchAdminStudents();
        fetchAdminCompanies();
      }
    }
  }, [session]);

  const handleLogout = () => {
    localStorage.removeItem('cp_session');
    setSession(null);
    setView('landing');
    // Clear Form parameters
    setLoginEmail("");
    setLoginPassword("");
  };

  // ----------------------------------------------------
  // BACKEND API SERVICE HOOKS
  // ----------------------------------------------------
  
  const fetchStudentProfile = async (id: string) => {
    try {
      const res = await fetch(`/api/profile/student/${id}`);
      if (res.ok) {
        const s: Student = await res.json();
        setActiveStudent(s);
        // Set dynamic update forms parameters
        setProfCgpa(s.cgpa.toString());
        setProfSkills(s.skills);
        setProfProjects(s.projects || "");
        setProfCertifications(s.certifications || "");
        setProfLinkedin(s.linkedin || "");
        setProfGithub(s.github || "");
        setProfResume(s.resumeUrl || "");
      }
    } catch (e) {
      console.error("Failed loading student details.", e);
    }
  };

  const fetchJobs = async () => {
    const sId = session?.role === 'student' ? session.userId : '';
    try {
      const res = await fetch(`/api/jobs${sId ? `?student_id=${sId}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchApplications = async () => {
    const idParam = session?.role === 'student' 
      ? `?student_id=${session.userId}` 
      : session?.role === 'company' 
      ? `?company_id=${session.userId}` 
      : '';
    try {
      const res = await fetch(`/api/applications${idParam}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchInterviews = async () => {
    const idParam = session?.role === 'student' 
      ? `?student_id=${session.userId}` 
      : session?.role === 'company' 
      ? `?company_id=${session.userId}` 
      : '';
    try {
      const res = await fetch(`/api/interviews${idParam}`);
      if (res.ok) {
        const data = await res.json();
        setInterviews(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    const idParam = session ? `?user_id=${session.userId}` : '';
    try {
      const res = await fetch(`/api/notifications${idParam}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch(`/api/admin/stats`);
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAdminStudents = async () => {
    try {
      const res = await fetch(`/api/admin/students`);
      if (res.ok) {
        setAdminStudents(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAdminCompanies = async () => {
    try {
      const res = await fetch(`/api/admin/companies`);
      if (res.ok) {
        setAdminCompanies(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Action: Student Register Submitter
  const handleStudentRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (sPass !== sConfirmPass) {
      setRegError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch('/api/auth/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sName,
          email: sEmail,
          phone: sPhone,
          department: sDept,
          semester: sSem,
          cgpa: sCgpa,
          password: sPass
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setRegError(data.error || "Student registration failed.");
        return;
      }

      // Safe save session
      localStorage.setItem('cp_session', JSON.stringify(data));
      setSession(data);
      fetchStudentProfile(data.userId);
      setView('student-dashboard');
    } catch (err) {
      setRegError("Failed communicating with the recruitment node.");
    }
  };

  // Action: Student Login Submitter
  const handleStudentLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch('/api/auth/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Login rejected.");
        return;
      }

      localStorage.setItem('cp_session', JSON.stringify(data));
      setSession(data);
      fetchStudentProfile(data.userId);
      setView('student-dashboard');
    } catch (err) {
      setLoginError("Hardware offline.");
    }
  };

  // Action: Company Register Submitter
  const handleCompanyRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    try {
      const res = await fetch('/api/auth/company/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: cName,
          email: cEmail,
          website: cWeb,
          description: cDesc,
          password: cPass
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setRegError(data.error || "Recruiter registration failed.");
        return;
      }

      localStorage.setItem('cp_session', JSON.stringify(data));
      setSession(data);
      setView('company-dashboard');
    } catch (err) {
      setRegError("Corporate database unreachable.");
    }
  };

  // Action: Company Login Submitter
  const handleCompanyLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/company/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Corporate authentications failed.");
        return;
      }

      localStorage.setItem('cp_session', JSON.stringify(data));
      setSession(data);
      setView('company-dashboard');
    } catch (e) {
      setLoginError("Corporate portal offline.");
    }
  };

  // Action: Admin Login Submitter
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Admin clearance level rejected.");
        return;
      }

      localStorage.setItem('cp_session', JSON.stringify(data));
      setSession(data);
      setView('admin-dashboard');
    } catch (err) {
      setLoginError("Office network offline.");
    }
  };

  // Action: Student Profile Update submitter
  const handleProfileUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !activeStudent) return;

    try {
      const res = await fetch('/api/profile/student/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token
        },
        body: JSON.stringify({
          student_id: session.userId,
          cgpa: profCgpa,
          skills: profSkills,
          projects: profProjects,
          certifications: profCertifications,
          linkedin: profLinkedin,
          github: profGithub,
          resumeUrl: profResume
        })
      });

      if (res.ok) {
        fetchStudentProfile(session.userId);
        fetchJobs(); // Recalculate match eligibilities
        alert("Personal placement profile synchronized successfully.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Action: Student Job Apply
  const handleStudentJobApply = async (jobId: string) => {
    if (!session) return;
    try {
      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token
        },
        body: JSON.stringify({
          student_id: session.userId,
          job_id: jobId
        })
      });

      const outcome = await res.json();
      if (!res.ok) {
        alert(outcome.error || "Failed to catalog application.");
        return;
      }

      fetchJobs();
      fetchApplications();
      alert("Application submitted! Your credentials will move to Under Review.");
    } catch (err) {
      console.error(err);
    }
  };

  // Action: Recruiter Post Job Drive
  const handleCompanyPostJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    try {
      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token
        },
        body: JSON.stringify({
          company_id: session.userId,
          role: jRole,
          package: jPkg,
          cgpa_requirement: jCgpa,
          skills_required: jSkills,
          description: jDesc,
          deadline: jDeadline
        })
      });

      if (res.ok) {
        setJRole("");
        setJDesc("");
        // Refresh lists
        fetchJobs();
        alert("Placement drive posted live immediately. All students were alerted.");
        setCompanyTab('view-jobs');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Action: Recruiter Change application status
  const handleRecruiterUpdateStatus = async (appId: string, status: Application['status']) => {
    if (!session) return;
    try {
      const res = await fetch('/api/applications/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token
        },
        body: JSON.stringify({ application_id: appId, status })
      });

      if (res.ok) {
        fetchApplications();
        if (session.role === 'admin') fetchAdminStats();
        alert(`Application status advanced to: ${status}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Action: Recruiter Schedule technical interview
  const handleScheduleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !selectedAppId || !intDate) {
      alert("Ensure you pick an applicant and complete date parameters.");
      return;
    }

    try {
      const res = await fetch('/api/interviews/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token
        },
        body: JSON.stringify({
          application_id: selectedAppId,
          interview_date: intDate,
          mode: intMode
        })
      });

      if (res.ok) {
        setSelectedAppId("");
        setIntDate("");
        fetchInterviews();
        fetchApplications(); // App status progressed automatically
        alert("Interview scheduled successfully! Candidate notified.");
        setCompanyTab('view-apps');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Action: Admin broadcast announcements
  const handleAdminAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !boardTitle || !boardMsg) return;

    try {
      const res = await fetch('/api/notifications/notify-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token
        },
        body: JSON.stringify({ title: boardTitle, message: boardMsg })
      });

      if (res.ok) {
        setBoardTitle("");
        setBoardMsg("");
        fetchNotifications();
        fetchAdminStats();
        alert("Campus-wide alert published.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Action: Admin delete assets
  const handleDeleteStudent = async (id: string) => {
    if (!session || !confirm("Erase candidate files permanently from campus databases?")) return;
    try {
      const res = await fetch(`/api/admin/students/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': session.token }
      });
      if (res.ok) {
        fetchAdminStudents();
        fetchAdminStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!session || !confirm("Revoke recruiter credentials and delete associated jobs permanently?")) return;
    try {
      const res = await fetch(`/api/admin/companies/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': session.token }
      });
      if (res.ok) {
        fetchAdminCompanies();
        fetchAdminStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportAuditLogsCSV = async () => {
    try {
      const res = await fetch('/api/admin/export/audit-logs');
      if (res.ok) {
        const list: AuditLog[] = await res.json();
        const headers = ["LOG_ID", "TIMESTAMP", "ACTOR", "ROLE", "ACTION"];
        const rows = list.map(l => [l.id, l.timestamp, l.user, l.role, `"${l.action.replace(/"/g, '""')}"`]);
        const csvContent = "data:text/csv;charset=utf-8," 
          + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `WALTER_WHITE_PLACEMENT_AUDIT_LOGS_${new Date().toISOString().substring(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      alert("Failed CSV stream.");
    }
  };

  // Calculates active student profile completion percent
  const calculateProfileCompletion = () => {
    if (!activeStudent) return 0;
    let fields = 0;
    if (activeStudent.skills && activeStudent.skills.trim().length > 3) fields += 20;
    if (activeStudent.linkedin && activeStudent.linkedin.trim().length > 5) fields += 15;
    if (activeStudent.github && activeStudent.github.trim().length > 5) fields += 15;
    if (activeStudent.projects && activeStudent.projects.trim().length > 10) fields += 20;
    if (activeStudent.certifications && activeStudent.certifications.trim().length > 5) fields += 15;
    if (activeStudent.resumeUrl && activeStudent.resumeUrl.trim().length > 5) fields += 15;
    return fields;
  };

  return (
    <div className="bg-mesh min-h-screen font-sans text-brand-navy-900 flex flex-col justify-between">
      
      {/* 1. Static Layout Router rendering specific views */}
      {view === 'landing' && (
        <LandingPage onNavigate={(dest: any) => setView(dest)} />
      )}

      {/* Auth Screen layout wrappers */}
      {(view === 'student-login' || view === 'company-login' || view === 'admin-login' || view === 'student-register' || view === 'company-register') && (
        <div className="min-h-screen flex items-center justify-center p-6 bg-mesh">
          <div className="w-full max-w-md bg-white border border-brand-navy-100 border-t-4 border-t-brand-gold-500 rounded-3xl p-8 shadow-premium select-none relative overflow-hidden">
            {/* College header element on forms */}
            <div className="text-center mb-6">
              <span className="text-xs font-mono font-bold text-brand-gold-600 tracking-widest uppercase">WALTER WHITE</span>
              <h2 className="text-xl font-display font-extrabold text-brand-navy-800 uppercase tracking-tight mt-1">
                {view === 'student-login' && 'Student Terminal'}
                {view === 'company-login' && 'Recruiter Hub'}
                {view === 'admin-login' && 'Office Clearance'}
                {view === 'student-register' && 'Student Enlistment'}
                {view === 'company-register' && 'Recruiter Registration'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">Secure role-based recruitment gateway.</p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                {loginError}
              </div>
            )}

            {regError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                {regError}
              </div>
            )}

            {/* Render designated Forms */}
            {view === 'student-login' && (
              <form onSubmit={handleStudentLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1 font-display">Academic Email</label>
                  <input
                    id="student-email"
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-brand-navy-50 border border-brand-navy-100 px-4 py-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-gold-400 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1 font-display">Password</label>
                  <input
                    id="student-pass"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-brand-navy-50 border border-brand-navy-100 px-4 py-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-gold-400 focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  id="student-login-submit"
                  type="submit"
                  className="w-full bg-brand-navy-700 hover:bg-brand-navy-800 text-white font-display py-3 rounded-xl text-sm font-bold shadow hover:scale-[1.01] transition-all cursor-pointer mt-2"
                >
                  Authorize Console
                </button>
                <div className="flex justify-between items-center text-xs text-slate-500 pt-2 font-display">
                  <span>No profile yet? <span onClick={() => { setRegError(null); setView('student-register'); }} className="text-brand-gold-600 font-bold hover:underline cursor-pointer">Register</span></span>
                  <span onClick={() => setView('landing')} className="hover:underline cursor-pointer font-bold">Back to Hub</span>
                </div>
              </form>
            )}

            {view === 'company-login' && (
              <form onSubmit={handleCompanyLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1 font-display">Corporate Email</label>
                  <input
                    id="company-email"
                    type="email"
                    required
                    placeholder="recruiter@brand.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-brand-navy-50 border border-brand-navy-100 px-4 py-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-gold-400 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1 font-display">Password</label>
                  <input
                    id="company-pass"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-brand-navy-50 border border-brand-navy-100 px-4 py-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-gold-400 focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  id="company-login-submit"
                  type="submit"
                  className="w-full bg-brand-navy-700 hover:bg-brand-navy-800 text-white font-display py-3 rounded-xl text-sm font-bold shadow hover:scale-[1.01] transition-all cursor-pointer mt-2"
                >
                  Verify Recruiter Clearances
                </button>
                <div className="flex justify-between items-center text-xs text-slate-500 pt-2 font-display">
                  <span>New drive partner? <span onClick={() => { setRegError(null); setView('company-register'); }} className="text-brand-gold-600 font-bold hover:underline cursor-pointer">Register</span></span>
                  <span onClick={() => setView('landing')} className="hover:underline cursor-pointer font-bold">Back to Hub</span>
                </div>
              </form>
            )}

            {view === 'admin-login' && (
              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1 font-display">Office Email</label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    placeholder="admin@college.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-brand-navy-50 border border-brand-navy-100 px-4 py-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-gold-400 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1 font-display">Administrative Password</label>
                  <input
                    id="admin-pass"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-brand-navy-50 border border-brand-navy-100 px-4 py-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-gold-400 focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  id="admin-login-submit"
                  type="submit"
                  className="w-full bg-brand-navy-700 hover:bg-brand-navy-800 text-white font-display py-3 rounded-xl text-sm font-bold shadow hover:scale-[1.01] transition-all cursor-pointer mt-2"
                >
                  Override Dashboard Control
                </button>
                <div className="text-center text-xs text-slate-400 pt-3">
                  <span onClick={() => setView('landing')} className="hover:underline cursor-pointer font-bold font-display text-brand-navy-700">Cancel Override</span>
                </div>
              </form>
            )}

            {view === 'student-register' && (
              <form onSubmit={handleStudentRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-600 mb-0.5">Full Name</label>
                    <input
                      id="reg-s-name"
                      type="text"
                      required
                      placeholder="Alex Smith"
                      value={sName}
                      onChange={(e) => setSName(e.target.value)}
                      className="w-full bg-brand-navy-50 border border-brand-navy-100 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-gold-400 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-600 mb-0.5">Phone Number</label>
                    <input
                      id="reg-s-phone"
                      type="text"
                      required
                      placeholder="+1 (555) 019"
                      value={sPhone}
                      onChange={(e) => setSPhone(e.target.value)}
                      className="w-full bg-brand-navy-50 border border-brand-navy-100 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-gold-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-600 mb-0.5">Academic Email</label>
                  <input
                    id="reg-s-email"
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={sEmail}
                    onChange={(e) => setSEmail(e.target.value)}
                    className="w-full bg-brand-navy-50 border border-brand-navy-100 px-3 py-2.5 rounded-lg text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-600 mb-0.5">Department</label>
                  <select
                    id="reg-s-dept"
                    value={sDept}
                    onChange={(e) => setSDept(e.target.value)}
                    className="w-full bg-brand-navy-50 border border-brand-navy-100 px-3 py-2.5 rounded-lg text-xs font-semibold focus:outline-none"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-600 mb-0.5">Semester</label>
                    <input
                      id="reg-s-sem"
                      type="number"
                      required
                      min={1}
                      max={8}
                      value={sSem}
                      onChange={(e) => setSSem(e.target.value)}
                      className="w-full bg-brand-navy-50 border border-brand-navy-100 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-600 mb-0.5">Cgpa (out of 10)</label>
                    <input
                      id="reg-s-cgpa"
                      type="number"
                      required
                      step="0.01"
                      min={0}
                      max={10}
                      value={sCgpa}
                      onChange={(e) => setSCgpa(e.target.value)}
                      className="w-full bg-brand-navy-50 border border-brand-navy-100 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-600 mb-0.5">Password</label>
                    <input
                      id="reg-s-pass"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={sPass}
                      onChange={(e) => setSPass(e.target.value)}
                      className="w-full bg-brand-navy-50 border border-brand-navy-100 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-600 mb-0.5">Confirm Password</label>
                    <input
                      id="reg-s-confirm"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={sConfirmPass}
                      onChange={(e) => setSConfirmPass(e.target.value)}
                      className="w-full bg-brand-navy-50 border border-brand-navy-100 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  id="student-register-submit"
                  type="submit"
                  className="w-full bg-brand-navy-700 hover:bg-brand-navy-800 text-white font-display py-3 rounded-xl text-xs font-bold shadow hover:scale-[1.01] transition-all cursor-pointer mt-2"
                >
                  Submit Enlistment Form
                </button>
                <div className="text-center text-xs text-slate-500 pt-2 font-display">
                  Already have profile? <span onClick={() => setView('student-login')} className="text-brand-gold-600 font-bold hover:underline cursor-pointer">Login</span>
                </div>
              </form>
            )}

            {view === 'company-register' && (
              <form onSubmit={handleCompanyRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-0.5">Company Name</label>
                  <input
                    id="reg-c-name"
                    type="text"
                    required
                    placeholder="e.g. Google, Microsoft"
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    className="w-full bg-brand-navy-50 border border-brand-navy-100 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-0.5">Corporate Email</label>
                  <input
                    id="reg-c-email"
                    type="email"
                    required
                    placeholder="careers@company.com"
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    className="w-full bg-brand-navy-50 border border-brand-navy-100 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-0.5">Website URL</label>
                  <input
                    id="reg-c-web"
                    type="url"
                    required
                    placeholder="https://company.com/careers"
                    value={cWeb}
                    onChange={(e) => setCWeb(e.target.value)}
                    className="w-full bg-brand-navy-50 border border-brand-navy-100 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-0.5">Company Overview</label>
                  <textarea
                    id="reg-c-desc"
                    rows={3}
                    placeholder="Brief description of hiring portfolios..."
                    value={cDesc}
                    onChange={(e) => setCDesc(e.target.value)}
                    className="w-full bg-brand-navy-50 border border-brand-navy-100 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-0.5">Secure Password</label>
                  <input
                    id="reg-c-pass"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={cPass}
                    onChange={(e) => setCPass(e.target.value)}
                    className="w-full bg-brand-navy-50 border border-brand-navy-100 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none"
                  />
                </div>

                <button
                  id="company-register-submit"
                  type="submit"
                  className="w-full bg-brand-navy-700 hover:bg-brand-navy-800 text-white font-display py-3 rounded-xl text-xs font-bold shadow hover:scale-[1.01] transition-all cursor-pointer mt-2"
                >
                  Enlist Recruitment Partner
                </button>
                <div className="text-center text-xs text-slate-500 pt-2 font-display">
                  Already registered? <span onClick={() => setView('company-login')} className="text-brand-gold-600 font-bold hover:underline cursor-pointer">Login</span>
                </div>
              </form>
            )}

          </div>
        </div>
      )}


      {/* ----------------------------------------------------
          STUDENT DASHBOARD LAYOUT
          ---------------------------------------------------- */}
      {view === 'student-dashboard' && session && activeStudent && (
        <div className="min-h-screen flex flex-col">
          {/* Dashboard Header */}
          <header className="bg-brand-navy-800 text-white py-4 px-6 sticky top-0 z-40 border-b border-brand-gold-500/20 shadow-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => setIsHeisenberg(!isHeisenberg)}
                  className={`p-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 select-none ${isHeisenberg ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 animate-pulse' : 'bg-brand-gold-500 text-brand-navy-900'}`}
                  title="Toggle Heisenberg Chemistry Mode"
                >
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h1 
                    onClick={() => setIsHeisenberg(!isHeisenberg)}
                    className="text-lg font-display font-medium leading-tight cursor-pointer hover:opacity-90 flex items-center gap-1.5"
                  >
                    {renderPeriodicName(isHeisenberg ? "Walter White" : session.name)}
                  </h1>
                  <p className="text-xs text-brand-gold-400 font-mono tracking-wider font-semibold">
                    DEPARTMENT: {isHeisenberg ? "Chemical Synthesis & Drug Formulation" : activeStudent.department} (SEM {isHeisenberg ? "99.1%" : activeStudent.semester})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${isHeisenberg ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400 font-mono' : 'bg-brand-navy-900/60 border-brand-navy-700'}`}>
                  <TrendingUp className={`w-4 h-4 ${isHeisenberg ? 'text-emerald-400' : 'text-brand-gold-400'}`} />
                  <span className="text-xs font-bold">{isHeisenberg ? "Purity: 99.1%" : `CGPA: ${activeStudent.cgpa}`}</span>
                </div>

                <button 
                  onClick={handleLogout}
                  className="bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-navy-900 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
            {/* Sidebar Navigator */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Completion Card */}
              <div className="bg-white border border-brand-navy-100 rounded-3xl p-6 shadow-premium">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Portfolio Strength</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold inline-block py-1 px-2.5 uppercase rounded-full text-brand-gold-600 bg-brand-gold-100/50">
                        Profile Competency
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-brand-navy-800">
                        {calculateProfileCompletion()}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-brand-navy-50">
                    <div 
                      style={{ width: `${calculateProfileCompletion()}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-gold-550 rounded bg-brand-gold-500 transition-all duration-500"
                    ></div>
                  </div>
                  <p className="text-[9.5px] text-slate-400 leading-normal">Compiling certifications, resume URLs, github codes, and linkedin contacts adds visibility index up to 100%.</p>
                </div>
              </div>

              {/* Sidebar Tabs */}
              <div className="bg-white border border-brand-navy-100 rounded-3xl p-4 shadow-premium space-y-1">
                {[
                  { id: 'jobs', label: 'Recommended Jobs', icon: Briefcase },
                  { id: 'applications', label: 'Applied Drives', icon: Clock },
                  { id: 'ai-resume', label: 'AI Resume Audit & Scanner', icon: FileText },
                  { id: 'ai-prep', label: 'AI Mock Q&A Prep', icon: BookOpen },
                  { id: 'ai-predict', label: 'AI Placement Classifier', icon: Sparkles },
                  { id: 'profile', label: 'Update Active Profile', icon: User },
                  { id: 'notices', label: 'Official Announcements', icon: Bell }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => setStudentTab(tb.id as any)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all font-display cursor-pointer ${
                      studentTab === tb.id 
                        ? 'bg-brand-navy-700 text-brand-gold-400 border-b border-brand-gold-500/45 shadow' 
                        : 'text-slate-600 hover:bg-brand-navy-50 hover:text-brand-navy-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <tb.icon className="w-4 h-4 shrink-0" />
                      {tb.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            {/* Content view panels */}
            <div className="lg:col-span-9 space-y-8">
              {studentTab === 'jobs' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-brand-navy-50 pb-4">
                    <div>
                      <h2 className="text-xl font-display font-extrabold text-brand-navy-800">Visiting Recruitment Drives</h2>
                      <p className="text-xs text-slate-500">Instant-match placements filtered using criteria matching your metrics.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                    {jobs.map(({ job, isEligible, matchScore }) => (
                      <JobCard
                        key={job.job_id}
                        job={job}
                        studentCgpa={activeStudent?.cgpa}
                        studentSkills={activeStudent?.skills}
                        onApply={handleStudentJobApply}
                        applied={applications.some(a => a.job_id === job.job_id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {studentTab === 'applications' && (
                <ApplicationTracker 
                  applications={applications} 
                />
              )}

              {studentTab === 'ai-resume' && (
                <ResumeScannerPanel 
                  student={activeStudent} 
                  token={session.token}
                  onUpdateSkills={(newSkills) => {
                    // Update locally to propagate
                    setActiveStudent(prev => prev ? { ...prev, skills: newSkills } : null);
                    fetchStudentProfile(session.userId);
                  }}
                />
              )}

              {studentTab === 'ai-prep' && (
                <AIQuestionPanel 
                  skills={activeStudent.skills} 
                  token={session.token} 
                />
              )}

              {studentTab === 'ai-predict' && (
                <AIPredictorPanel 
                  student={activeStudent} 
                  token={session.token} 
                />
              )}

              {studentTab === 'notices' && (
                <div className="space-y-6">
                  <div className="border-b border-brand-navy-50 pb-4">
                    <h2 className="text-xl font-display font-bold text-brand-navy-800">Campus Alerts Broadcast Board</h2>
                    <p className="text-xs text-slate-500 font-sans">Read essential declarations formulated by Dean Office advisors.</p>
                  </div>

                  <div className="space-y-4 font-sans">
                    {notifications.map((notif) => (
                      <div key={notif.notification_id} className="bg-white border border-brand-navy-100 rounded-3xl p-6 shadow-premium relative overflow-hidden flex gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-brand-navy-50 flex items-center justify-center text-brand-navy-700 shrink-0">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="font-bold text-brand-navy-800 text-sm leading-tight">{notif.title}</h4>
                            <span className="text-[10px] text-slate-400 shrink-0 font-mono">{notif.created_at}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/50">{notif.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {studentTab === 'profile' && (
                <form onSubmit={handleProfileUpdateSubmit} className="bg-white border border-brand-navy-100 rounded-3xl p-8 shadow-premium space-y-6 font-sans">
                  <div>
                    <h3 className="text-lg font-display font-extrabold text-brand-navy-800">Manage Candidate Portfolio</h3>
                    <p className="text-xs text-slate-500">Provide direct web contacts to present credentials end-to-end.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Active Cumulative CGPA</label>
                      <input
                        id="prof-s-cgpa"
                        type="number"
                        step="0.01"
                        max={10}
                        value={profCgpa}
                        onChange={(e) => setProfCgpa(e.target.value)}
                        className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Verify Resume URL / Text</label>
                      <input
                        id="prof-s-resume"
                        type="text"
                        placeholder="https://drive.google.com/..."
                        value={profResume}
                        onChange={(e) => setProfResume(e.target.value)}
                        className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Corporate Skills (comma separated tags)</label>
                      <input
                        id="prof-s-skills"
                        type="text"
                        value={profSkills}
                        onChange={(e) => setProfSkills(e.target.value)}
                        className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Linkedin Profile url</label>
                        <input
                          id="prof-s-linkedin"
                          type="url"
                          placeholder="https://linkedin.com/in/..."
                          value={profLinkedin}
                          onChange={(e) => setProfLinkedin(e.target.value)}
                          className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">GitHub Portfolio url</label>
                        <input
                          id="prof-s-github"
                          type="url"
                          placeholder="https://github.com/..."
                          value={profGithub}
                          onChange={(e) => setProfGithub(e.target.value)}
                          className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Featured Projects Descriptions</label>
                      <textarea
                        id="prof-s-projects"
                        rows={3}
                        value={profProjects}
                        onChange={(e) => setProfProjects(e.target.value)}
                        placeholder="Project 1: brief descriptions..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Technical Certifications</label>
                      <input
                        id="prof-s-certs"
                        type="text"
                        placeholder="AWS Certified Developer, Google Associate..."
                        value={profCertifications}
                        onChange={(e) => setProfCertifications(e.target.value)}
                        className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    id="save-profile-btn"
                    type="submit"
                    className="bg-brand-navy-700 text-white font-display px-6 py-3 rounded-xl text-xs font-bold shadow hover:bg-brand-navy-900 cursor-pointer"
                  >
                    Save & Synchronize All Data
                  </button>
                </form>
              )}
            </div>
          </main>
        </div>
      )}


      {/* ----------------------------------------------------
          COMPANY RECRUITER DASHBOARD LAYOUT
          ---------------------------------------------------- */}
      {view === 'company-dashboard' && session && (
        <div className="min-h-screen flex flex-col font-sans select-none">
          {/* Header */}
          <header className="bg-brand-navy-800 text-white py-4 px-6 sticky top-0 z-45 border-b border-brand-gold-500/20 shadow">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-gold-500 text-brand-navy-900 rounded-xl shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-display font-extrabold tracking-tight">{session.name}</h1>
                  <p className="text-xs text-brand-gold-400 font-mono tracking-widest font-bold">CAMPUS PLACEMENT PARTNER</p>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-navy-900 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out
              </button>
            </div>
          </header>

          <main className="max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
            {/* Sidebar Controls */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border border-brand-navy-100 rounded-3xl p-4 shadow-premium space-y-1">
                {[
                  { id: 'create-job', label: 'Post Campus Job Drive', icon: PlusCircle },
                  { id: 'view-apps', label: 'Manage Candidates & Shortlists', icon: ListOrdered },
                  { id: 'view-jobs', label: 'Our Active Openings', icon: Briefcase },
                  { id: 'schedule', label: 'Schedule Interview Timings', icon: Calendar }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => setCompanyTab(tb.id as any)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all font-display cursor-pointer ${
                      companyTab === tb.id 
                        ? 'bg-brand-navy-700 text-brand-gold-400 shadow' 
                        : 'text-slate-600 hover:bg-brand-navy-50 hover:text-brand-navy-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <tb.icon className="w-4 h-4 shrink-0" />
                      {tb.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-65" />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Segment */}
            <div className="lg:col-span-9 space-y-8">
              {companyTab === 'create-job' && (
                <form onSubmit={handleCompanyPostJobSubmit} className="bg-white border border-brand-navy-100 rounded-3xl p-8 shadow-premium space-y-5">
                  <div className="border-b border-brand-navy-50 pb-4">
                    <h3 className="text-lg font-display font-extrabold text-brand-navy-800">Launch New Campus Recruitment Drive</h3>
                    <p className="text-xs text-slate-500">Provide job profiles, eligible hurdle parameters, and evaluation deadlines.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Target Job Role</label>
                      <input
                        id="job-role-input"
                        type="text"
                        required
                        placeholder="e.g. Software Engineer Intern, Data Analyst"
                        value={jRole}
                        onChange={(e) => setJRole(e.target.value)}
                        className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Salary Package (LPA)</label>
                      <input
                        id="job-pkg-input"
                        type="text"
                        required
                        value={jPkg}
                        onChange={(e) => setJPkg(e.target.value)}
                        className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Academic Hurdle (Minimum CGPA)</label>
                      <input
                        id="job-cgpa-input"
                        type="number"
                        step="0.1"
                        max={10}
                        required
                        value={jCgpa}
                        onChange={(e) => setJCgpa(e.target.value)}
                        className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Recruitment Expiration Date</label>
                      <input
                        id="job-deadline-input"
                        type="date"
                        required
                        value={jDeadline}
                        onChange={(e) => setJDeadline(e.target.value)}
                        className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Target Candidate Required Skills (comma separated)</label>
                      <input
                        id="job-skills-input"
                        type="text"
                        required
                        value={jSkills}
                        onChange={(e) => setJSkills(e.target.value)}
                        className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Drive Description & Core Responsibilities</label>
                      <textarea
                        id="job-desc-input"
                        rows={4}
                        required
                        value={jDesc}
                        onChange={(e) => setJDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium focus:outline-none"
                        placeholder="Write clear operational parameters, expected structures, and key deliverables..."
                      />
                    </div>
                  </div>

                  <button
                    id="post-job-btn"
                    type="submit"
                    className="bg-brand-navy-700 text-white font-display px-6 py-3 rounded-xl text-xs font-bold shadow hover:bg-brand-navy-900 cursor-pointer"
                  >
                    Broadcast Placement opening
                  </button>
                </form>
              )}

              {companyTab === 'view-apps' && (
                <div className="space-y-6">
                  <div className="border-b border-brand-navy-50 pb-4">
                    <h3 className="text-lg font-display font-extrabold text-brand-navy-800">Recruitment Pipelines & Applicant Screening</h3>
                    <p className="text-xs text-slate-500">Review student resumes, check eligibility, and schedule mock evaluations.</p>
                  </div>

                  <div className="bg-white border border-brand-navy-100 rounded-3xl p-6 shadow-premium overflow-x-auto">
                    {applications.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-6">No candidates have applied to your active drives currently.</p>
                    ) : (
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50">
                            <th className="py-3 px-4">Student</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Credentials Desk</th>
                            <th className="py-3 px-4">Applied</th>
                            <th className="py-3 px-4">Clearance Status</th>
                            <th className="py-3 px-4">Workflow Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {applications.map((app) => (
                            <tr key={app.application_id} className="hover:bg-slate-50/50">
                              <td className="py-4 px-4 font-bold text-brand-navy-800">
                                {app.student_name}
                                <span className="block text-[10px] font-normal text-slate-400 font-mono tracking-tight mt-0.5">{app.student_email}</span>
                              </td>
                              <td className="py-4 px-4 font-semibold">{app.job_role}</td>
                              <td className="py-4 px-4">
                                <div className="space-y-1">
                                  <span className="block text-[11px] font-bold text-brand-navy-800 p-1 bg-brand-navy-50 rounded text-center border-brand-navy-100 border">CGPA: {app.student_cgpa}</span>
                                  {app.student_id && (
                                    <span 
                                      onClick={() => {
                                        alert(`Candidate: ${app.student_name}\nEmail: ${app.student_email}\nCumulative CGPA: ${app.student_cgpa}\nAcademic verification certified by Office Records.`);
                                      }}
                                      className="text-[9px] text-brand-gold-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                                    >
                                      Inspect base skills <ExternalLink className="w-2.5 h-2.5" />
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-slate-400 font-mono">{app.applied_date.split(' ')[0]}</td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border leading-none ${
                                  app.status === 'Selected' ? 'bg-green-100 text-green-700 border-green-200' :
                                  app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                  app.status === 'Interview Scheduled' ? 'bg-sky-50 text-sky-700 border-sky-100' :
                                  'bg-brand-gold-100 text-brand-gold-600 border-brand-gold-200/50'
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex flex-col gap-1">
                                  <select
                                    id={`status-selector-${app.application_id}`}
                                    value={app.status}
                                    onChange={(e) => handleRecruiterUpdateStatus(app.application_id, e.target.value as any)}
                                    className="bg-brand-navy-50 border border-brand-navy-100 p-1.5 rounded text-[10px] uppercase font-bold focus:outline-none cursor-pointer"
                                  >
                                    <option value="Applied">Applied</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Shortlisted">Shortlist Candidate</option>
                                    <option value="Interview Scheduled">Interview Scheduled</option>
                                    <option value="Selected">Confirm Hiring (Selected)</option>
                                    <option value="Rejected">Reject</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {companyTab === 'view-jobs' && (
                <div className="space-y-6">
                  <div className="border-b border-brand-navy-50 pb-4">
                    <h3 className="text-lg font-display font-extrabold text-brand-navy-800">Our Posted Live Vacancies</h3>
                    <p className="text-xs text-slate-500">Monitor active drives and technical requisitions.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.filter(j => j.job.company_id === session.userId).map(({ job }) => (
                      <div key={job.job_id} className="bg-white border border-brand-navy-100 rounded-3xl p-6 shadow-premium relative">
                        <span className="text-[10px] font-mono font-bold text-slate-400">JOB DRIVETOKEN: {job.job_id}</span>
                        <h4 className="font-display font-extrabold text-brand-navy-800 text-base mt-1">{job.role}</h4>
                        <div className="flex gap-4 text-xs font-semibold text-slate-500 my-2">
                          <span>Package: {job.package}</span>
                          <span>Eligible CGPA: &gt;= {job.cgpa_requirement}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed bg-brand-navy-50/50 p-3 rounded-xl border border-brand-navy-50 mb-4">{job.description}</p>
                        
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-brand-gold-600 font-bold">Expiration: {job.deadline}</span>
                          <button
                            id={`delete-job-${job.job_id}`}
                            onClick={async () => {
                              if (confirm("Permanently retire this drive catalog?")) {
                                const res = await fetch(`/api/jobs/delete/${job.job_id}`, { method: 'DELETE' });
                                if (res.ok) fetchJobs();
                              }
                            }}
                            className="text-red-500 hover:text-red-600 font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Cancel Drive
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {companyTab === 'schedule' && (
                <form onSubmit={handleScheduleInterviewSubmit} className="bg-white border border-brand-navy-100 rounded-3xl p-8 shadow-premium space-y-6">
                  <div className="border-b border-brand-navy-50 pb-4">
                    <h3 className="text-lg font-display font-extrabold text-brand-navy-800">Map Evaluation Timings</h3>
                    <p className="text-xs text-slate-500">Assign interview sessions and formats to shortlisted student applications.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Target Evaluation Candidate</label>
                      <select
                        id="candidate-selector"
                        value={selectedAppId}
                        onChange={(e) => setSelectedAppId(e.target.value)}
                        className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:bg-white"
                      >
                        <option value="">-- Choose Candidate --</option>
                        {applications.filter(a => a.status === 'Shortlisted').map(a => (
                          <option key={a.application_id} value={a.application_id}>{a.student_name} ({a.job_role})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Interview Medium</label>
                      <div className="flex gap-2">
                        {(['Online', 'Offline'] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setIntMode(mode)}
                            className={`flex-1 py-3 text-sm font-bold font-display rounded-xl border transition-all ${
                              intMode === mode
                                ? 'bg-brand-navy-700 text-brand-gold-400 border-brand-navy-800'
                                : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Date & Evaluation Time</label>
                      <input
                        id="int-date-input"
                        type="datetime-local"
                        required
                        value={intDate}
                        onChange={(e) => setIntDate(e.target.value)}
                        className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    id="schedule-submit-btn"
                    type="submit"
                    className="bg-brand-navy-700 text-white font-display px-6 py-3 rounded-xl text-xs font-bold shadow hover:bg-brand-navy-900 cursor-pointer"
                  >
                    Confirm & Publish Timing Desk
                  </button>
                </form>
              )}
            </div>
          </main>
        </div>
      )}


      {/* ----------------------------------------------------
          ADMIN PORTAL HUB VIEW LAYOUT
          ---------------------------------------------------- */}
      {view === 'admin-dashboard' && session && adminStats && (
        <div className="min-h-screen flex flex-col font-sans select-none">
          {/* Header */}
          <header className="bg-brand-navy-800 text-white py-4 px-6 sticky top-0 z-45 border-b border-brand-gold-500/20 shadow-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-gold-500 text-brand-navy-900 rounded-xl">
                  <GraduationCap className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-display font-extrabold tracking-tight">University Placement Office</h1>
                  <p className="text-xs text-brand-gold-400 font-mono tracking-widest font-bold">ADMINISTRATIVE MASTER CONSOLE</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleExportAuditLogsCSV}
                  className="bg-brand-navy-950 text-brand-gold-400 hover:text-brand-gold-500 border border-brand-gold-500/35 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer duration-200"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Backup Audit Trail
                </button>

                <button 
                  onClick={handleLogout}
                  className="bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-navy-900 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
            {/* Sidebar selection */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border border-brand-navy-100 rounded-3xl p-4 shadow-premium space-y-1">
                {[
                  { id: 'overview', label: 'Dashboard & Metrics', icon: Activity },
                  { id: 'manage-students', label: 'Student Enlistment Roll', icon: Users },
                  { id: 'manage-companies', label: 'Recruitment Companies', icon: Building2 },
                  { id: 'manage-applications', label: 'Monitor Campus Drives', icon: ListOrdered },
                  { id: 'announcements', label: 'Broadcaster Board', icon: Megaphone }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => setAdminTab(tb.id as any)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all font-display cursor-pointer ${
                      adminTab === tb.id 
                        ? 'bg-brand-navy-700 text-brand-gold-400 shadow' 
                        : 'text-slate-600 hover:bg-brand-navy-50 hover:text-brand-navy-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <tb.icon className="w-4 h-4 shrink-0" />
                      {tb.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            {/* Content segment */}
            <div className="lg:col-span-9 space-y-8">
              {adminTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats Cards Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { l: "Enrolled Students", v: adminStats.totalStudents, i: Users, c: "text-brand-navy-700 bg-brand-navy-50" },
                      { l: "Partner Companies", v: adminStats.totalCompanies, i: Building2, c: "text-brand-navy-700 bg-brand-navy-50" },
                      { l: "Live Careers", v: adminStats.totalJobs, i: Briefcase, c: "text-brand-gold-600 bg-brand-gold-100/3 *bg-brand-gold-100/30" },
                      { l: "Placement Ratio", v: `${adminStats.placedRatio}%`, i: TrendingUp, c: "text-brand-gold-600 bg-brand-gold-100" }
                    ].map((card, i) => (
                      <div key={i} className="bg-white border border-brand-navy-100 rounded-3xl p-5 shadow-premium flex gap-4 items-center">
                        <div className={`p-3 rounded-2xl shrink-0 ${card.c}`}>
                          <card.i className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">{card.l}</p>
                          <h4 className="text-xl font-display font-extrabold text-brand-navy-800 mt-1">{card.v}</h4>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Operational status trackers */}
                  <div className="bg-white border border-brand-navy-100 rounded-3xl p-6 shadow-premium grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">APPLIED</span>
                      <h4 className="text-lg font-bold text-brand-navy-800">{adminStats.appliedCount}</h4>
                    </div>
                    <div className="border-l border-brand-navy-50">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">SHORTLISTED</span>
                      <h4 className="text-lg font-bold text-brand-navy-800">{adminStats.shortlistedCount}</h4>
                    </div>
                    <div className="border-l border-brand-navy-50">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">INTERVIEWED</span>
                      <h4 className="text-lg font-bold text-brand-navy-800">{adminStats.interviewScheduledCount}</h4>
                    </div>
                    <div className="border-l border-brand-navy-50 text-green-600">
                      <span className="text-[10px] font-bold uppercase">PLACED INDEX</span>
                      <h4 className="text-lg font-extrabold">{adminStats.selectedCount}</h4>
                    </div>
                  </div>

                  {/* Audit Logs Trail widget */}
                  <div className="bg-white border border-brand-navy-100 rounded-3xl p-6 shadow-premium space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-navy-50 pb-3">
                      <h4 className="font-display font-extrabold text-sm text-brand-navy-800 uppercase tracking-wider flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-brand-gold-500" />
                        System Audit Desk Log
                      </h4>
                      <span className="text-[9px] font-mono bg-slate-100 text-slate-400 rounded-full px-2 py-0.5 font-bold">AUTOMATED TIMESTAMPS</span>
                    </div>

                    <div className="overflow-y-auto max-h-[300px] border border-slate-100 rounded-xl divide-y divide-slate-100 text-[11px] font-mono text-slate-500">
                      {adminStats.auditLogsTail.map((log: any) => (
                        <div key={log.id} className="p-3 bg-slate-50/20 hover:bg-slate-50 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <div className="space-y-0.5 pr-2">
                            <span className="text-[10px] font-bold text-brand-navy-850 bg-brand-navy-50 border-brand-navy-100 border text-brand-navy-800 px-1.5 py-0.5 rounded mr-2 uppercase">{log.role}</span>
                            <span className="font-bold text-slate-700">{log.user}:</span>
                            <span className="text-slate-600 pl-2">{log.action}</span>
                          </div>
                          <span className="text-[9.5px] text-slate-400 shrink-0 font-sans">{log.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {adminTab === 'manage-students' && (
                <div className="space-y-6">
                  <div className="border-b border-brand-navy-50 pb-4">
                    <h3 className="text-lg font-display font-extrabold text-brand-navy-800">Academic Student Enrollment roll</h3>
                    <p className="text-xs text-slate-500 font-sans">Verify student parameters and manage platform access permissions.</p>
                  </div>

                  <div className="bg-white border border-brand-navy-100 rounded-3xl p-6 shadow-premium overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50">
                          <th className="py-2.5 px-4">Student ID</th>
                          <th className="py-2.5 px-4">Name</th>
                          <th className="py-2.5 px-4">E-Mail</th>
                          <th className="py-2.5 px-4">Dept</th>
                          <th className="py-2.5 px-4">CGPA</th>
                          <th className="py-2.5 px-4 text-center">Safety Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {adminStudents.map((stu) => (
                          <tr key={stu.student_id} className="hover:bg-slate-50/30">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{stu.student_id}</td>
                            <td className="py-3.5 px-4 font-bold text-brand-navy-800">{stu.name}</td>
                            <td className="py-3.5 px-4 text-slate-500">{stu.email}</td>
                            <td className="py-3.5 px-4 text-[11px]">{stu.department} (Semester {stu.semester})</td>
                            <td className="py-3.5 px-4 font-bold text-brand-navy-800">{stu.cgpa}</td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                id={`delete-student-${stu.student_id}`}
                                onClick={() => handleDeleteStudent(stu.student_id)}
                                className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 rounded font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1 mx-auto"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Erase
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {adminTab === 'manage-companies' && (
                <div className="space-y-6">
                  <div className="border-b border-brand-navy-50 pb-4">
                    <h3 className="text-lg font-display font-extrabold text-brand-navy-800">Recruitment Company Catalogs</h3>
                    <p className="text-xs text-slate-500 font-sans">Erase inactive corporations or verify organizational links.</p>
                  </div>

                  <div className="bg-white border border-brand-navy-100 rounded-3xl p-6 shadow-premium overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50">
                          <th className="py-2.5 px-4">Company ID</th>
                          <th className="py-2.5 px-4">Corporate Name</th>
                          <th className="py-2.5 px-4">Official E-Mail</th>
                          <th className="py-2.5 px-4">Web URL</th>
                          <th className="py-2.5 px-4 text-center">Platform Permissions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {adminCompanies.map((co) => (
                          <tr key={co.company_id} className="hover:bg-slate-50/30">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{co.company_id}</td>
                            <td className="py-3.5 px-4 font-bold text-brand-navy-800">{co.company_name}</td>
                            <td className="py-3.5 px-4 text-slate-500">{co.email}</td>
                            <td className="py-3.5 px-4">
                              <a href={co.website} target="_blank" rel="noreferrer" className="text-brand-gold-600 hover:underline font-bold flex items-center gap-0.5">
                                Visit careers <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                id={`delete-company-${co.company_id}`}
                                onClick={() => handleDeleteCompany(co.company_id)}
                                className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 rounded font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1 mx-auto"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Erase
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {adminTab === 'manage-applications' && (
                <div className="space-y-6">
                  <div className="border-b border-brand-navy-50 pb-4">
                    <h3 className="text-lg font-display font-extrabold text-brand-navy-800">Direct Campus drives applications logs</h3>
                    <p className="text-xs text-slate-500 font-sans">Audit real-time status transitions or manually proceed selections.</p>
                  </div>

                  <div className="bg-white border border-brand-navy-100 rounded-3xl p-6 shadow-premium overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50">
                          <th>Candidate</th>
                          <th>Role Opening</th>
                          <th>Employer</th>
                          <th>Apply Time</th>
                          <th>Hiring Status</th>
                          <th>Manual Override Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {applications.map((app) => (
                          <tr key={app.application_id} className="hover:bg-slate-50/20">
                            <td className="py-3.5 px-4 font-bold text-brand-navy-800">{app.student_name}</td>
                            <td className="py-3.5 px-4 font-semibold">{app.job_role}</td>
                            <td className="py-3.5 px-4 text-brand-gold-600 font-bold text-[10.5px] uppercase">{app.company_name}</td>
                            <td className="py-3.5 px-4 text-slate-400 font-mono text-[10px]">{app.applied_date}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide border leading-none ${
                                app.status === 'Selected' ? 'bg-green-100 text-green-700 border-green-200' :
                                app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                'bg-brand-gold-100 text-brand-gold-600 border-brand-gold-200/50'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                id={`admin-status-override-${app.application_id}`}
                                value={app.status}
                                onChange={(e) => handleRecruiterUpdateStatus(app.application_id, e.target.value as any)}
                                className="bg-brand-navy-50 border border-brand-navy-100 p-1 rounded text-[10px] font-bold uppercase focus:outline-none focus:bg-white"
                              >
                                <option value="Applied">Applied</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Selected">Confirm Hiring</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {adminTab === 'announcements' && (
                <form onSubmit={handleAdminAnnouncementSubmit} className="bg-white border border-brand-navy-100 rounded-3xl p-8 shadow-premium space-y-5">
                  <div className="border-b border-brand-navy-50 pb-4">
                    <h3 className="text-lg font-display font-extrabold text-brand-navy-800">Publish Campus-Wide Official Notices</h3>
                    <p className="text-xs text-slate-500">Alert visiting recruiters and candidates immediately on global news screens.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display font-semibold">Announcement Title</label>
                      <input
                        id="broad-title"
                        type="text"
                        required
                        placeholder="e.g. Schedule for SDE Microsoft Drive"
                        value={boardTitle}
                        onChange={(e) => setBoardTitle(e.target.value)}
                        className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display font-semibold">Notice Message</label>
                      <textarea
                        id="broad-msg"
                        rows={4}
                        required
                        placeholder="Submit clear directives, meeting links, or venue details"
                        value={boardMsg}
                        onChange={(e) => setBoardMsg(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    id="broadcast-submit-btn"
                    type="submit"
                    className="bg-brand-navy-700 text-white font-display px-6 py-3 rounded-xl text-xs font-bold shadow hover:bg-brand-navy-900 cursor-pointer flex items-center gap-1.5"
                  >
                    <Megaphone className="w-4 h-4 shrink-0" />
                    Publish Announcement to All Dashboards
                  </button>
                </form>
              )}
            </div>
          </main>
        </div>
      )}

      {/* Elegant minimalist bottom logo credit */}
      <div className="text-center py-2.5 text-[9px] font-mono text-slate-400/80 bg-slate-100 border-t border-slate-200/40">
        POWERED BY WALTER WHITE CAREER & RECRUITMENT DECISION SUITE • VERSION 1.4.0
      </div>

    </div>
  );
}
