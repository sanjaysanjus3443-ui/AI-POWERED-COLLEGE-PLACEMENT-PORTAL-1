/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  student_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  semester: number;
  cgpa: number;
  skills: string; // Comma separated values
  resumeUrl: string; // Text or base64 or placeholder
  linkedin: string;
  github: string;
  password_hash: string;
  projects?: string; // Additional details
  certifications?: string; // Additional details
}

export interface Company {
  company_id: string;
  company_name: string;
  email: string;
  password_hash: string;
  website: string;
  description: string;
}

export interface Job {
  job_id: string;
  company_id: string;
  company_name?: string; // Populated fields
  role: string;
  package: string; // package LPA
  cgpa_requirement: number;
  skills_required: string; // Comma separated values
  description: string;
  deadline: string; // YYYY-MM-DD
}

export interface Application {
  application_id: string;
  student_id: string;
  student_name?: string; // Populated
  student_email?: string; // Populated
  student_cgpa?: number; // Populated
  job_id: string;
  job_role?: string; // Populated
  company_name?: string; // Populated
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected';
  applied_date: string; // YYYY-MM-DD HH:MM:SS
}

export interface Interview {
  interview_id: string;
  application_id: string;
  student_name?: string; // Populated
  job_role?: string; // Populated
  company_name?: string; // Populated
  interview_date: string; // YYYY-MM-DD HH:MM
  mode: 'Online' | 'Offline';
  result: 'Pending' | 'Passed' | 'Failed';
}

export interface Notification {
  notification_id: string;
  user_id: string; // Can be Student, Company or "admin" or "all"
  title: string;
  message: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
}

export interface AuthSession {
  token: string;
  userId: string;
  role: 'student' | 'company' | 'admin';
  email: string;
  name: string;
}

export interface AISkillsExtraction {
  skills: string[];
  missingSkills: string[];
  score: number;
  suggestions: string[];
}

export interface AIQuestion {
  question: string;
  type: 'Technical' | 'HR';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sampleAnswer?: string;
}

export interface AIPrediction {
  probability: number;
  factors: {
    label: string;
    impact: 'Positive' | 'Negative' | 'Neutral';
    reason: string;
  }[];
  recommendations: string[];
}
