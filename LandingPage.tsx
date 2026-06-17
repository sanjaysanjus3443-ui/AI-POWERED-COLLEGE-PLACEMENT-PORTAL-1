/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Users, 
  CheckCircle2, 
  MapPin, 
  Mail, 
  Phone 
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const stats = [
    { label: "Overall Placement", value: "94.2%", icon: GraduationCap, color: "text-brand-gold-500 bg-brand-gold-100" },
    { label: "Visiting Companies", value: "180+", icon: Building2, color: "text-brand-navy-600 bg-brand-navy-100" },
    { label: "Average Package", value: "11.6 LPA", icon: Briefcase, color: "text-brand-navy-600 bg-brand-navy-100" },
    { label: "Highest Package", value: "42.0 LPA", icon: TrendingUp, color: "text-brand-gold-500 bg-brand-gold-100" }
  ];

  const stories = [
    {
      name: "Tanya Sharma",
      dept: "Data Science, Batch of 2026",
      package: "32 LPA at Google",
      quote: "The personalized AI Job matching and instant mock interview questions accurately prepared me for the core technical rounds.",
      initials: "TS"
    },
    {
      name: "Yashvardhan Rao",
      dept: "Computer Science, Batch of 2026",
      package: "24 LPA at Microsoft",
      quote: "Uploading my resume and getting immediate missing skills suggestions gave me a clear academic roadmap in my senior semester.",
      initials: "YR"
    }
  ];

  const companies = ["Google", "Microsoft", "Goldman Sachs", "Amazon", "IBM", "Adobe", "Oracle", "Navi"];

  return (
    <div className="bg-mesh min-h-screen text-brand-navy-900 select-none">
      {/* Dynamic Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-navy-100/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-navy-800 rounded-xl text-brand-gold-400">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-brand-navy-800">
                WALTER WHITE
              </h1>
              <p className="text-xs font-mono tracking-wider text-brand-gold-600 font-semibold">
                UNIVERSITY RECRUITMENT HUB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              id="student-entry-btn"
              onClick={() => onNavigate('student-login')} 
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-brand-navy-700 hover:text-brand-gold-600 hover:bg-brand-navy-50 transition-all font-display duration-200"
            >
              Student Portal
            </button>
            <button 
              id="company-entry-btn"
              onClick={() => onNavigate('company-login')} 
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-brand-navy-700 hover:text-brand-gold-600 hover:bg-brand-navy-50 transition-all font-display duration-200"
            >
              Recruiter Hub
            </button>
            <button 
              id="admin-entry-btn"
              onClick={() => onNavigate('admin-login')} 
              className="bg-brand-navy-800 text-white border-b-2 border-brand-gold-500 font-display px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-brand-navy-700 transition-all flex items-center gap-2 duration-200"
            >
              Office Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold-100 border border-brand-gold-500/20 text-brand-gold-600 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI-POWERED PREPARATION ENGINE LIVE
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-none text-brand-navy-800">
            Bridging Academic Excellence with <span className="gradient-text-gold font-bold">Global Careers</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Walter White Placement Hub offers structured direct drives, resume scanners, mock interview generator, and custom probability tools built to match senior profiles to tier-1 technology and finance enterprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              id="hero-student-reg"
              onClick={() => onNavigate('student-register')}
              className="bg-brand-navy-700 text-white font-display px-8 py-4 rounded-2xl font-bold shadow-lg shadow-brand-navy-800/10 hover:bg-brand-navy-800 transition-all flex items-center justify-center gap-3 cursor-pointer group hover:scale-[1.02]"
            >
              Register as Student
              <ArrowRight className="w-5 h-5 text-brand-gold-400 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              id="hero-company-reg"
              onClick={() => onNavigate('company-register')}
              className="bg-white border border-brand-navy-100 hover:border-brand-navy-600 font-display text-brand-navy-800 px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 hover:bg-brand-navy-50/50"
            >
              Register Company Drive
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-brand-gold-500 to-brand-navy-600 opacity-20 blur-2xl"></div>
          <div className="bg-white border border-brand-navy-100 rounded-3xl shadow-premium p-8 relative overflow-hidden">
            <div className="mb-6 flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400">PLACEMENT PORTAL STATUS</span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                ACTIVE
              </span>
            </div>
            
            {/* Display Widget */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-brand-navy-50 border border-brand-navy-100/60 flex items-center gap-4">
                <div className="p-3 bg-brand-navy-600 text-brand-gold-400 rounded-xl">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy-800">AI Placement Predictor</h4>
                  <p className="text-xs text-slate-500">Scan project portfolio and CGPA instantly.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-navy-50 border border-brand-navy-100/60 flex items-center gap-4">
                <div className="p-3 bg-brand-gold-600 text-white rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy-800">Resume Analyzer Tool</h4>
                  <p className="text-xs text-slate-500">Match resumes to real company keywords.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-navy-50 border border-brand-navy-100/60 flex items-center gap-4">
                <div className="p-3 bg-brand-navy-700 text-brand-gold-400 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy-800">Pre-vetted Candidates</h4>
                  <p className="text-xs text-slate-500">Direct shortlist filters for HR teams.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-brand-navy-800 text-white py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {stats.map((st, i) => (
            <div key={i} className="text-center lg:border-r last:border-0 border-brand-navy-700/60 py-4 px-2">
              <div className="flex justify-center mb-3">
                <div className={`p-2.5 rounded-xl ${st.color}`}>
                  <st.icon className="w-5 h-5 text-brand-navy-800" />
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold text-brand-gold-400">{st.value}</h3>
              <p className="text-xs text-brand-navy-100/80 mt-1 uppercase tracking-wider font-semibold font-display">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recruiter Partners */}
      <section className="py-16 bg-white border-y border-brand-navy-100/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-brand-gold-600 font-semibold mb-6">PROUD HIRING PARTNERS</p>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-6 items-center opacity-60">
            {companies.map((co, i) => (
              <div key={i} className="py-4 hover:opacity-100 transition-opacity">
                <span className="text-base font-display font-bold tracking-tight text-brand-navy-800 border-b-2 border-brand-gold-400 pb-0.5">{co}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-wider font-semibold uppercase text-brand-gold-600">SMART CAPABILITIES</span>
          <h3 className="text-3xl font-display font-bold text-brand-navy-800 mt-2">Next-Generation Placement Workflows</h3>
          <p className="text-slate-500 mt-3 text-sm">Automating recruitment pipelines, equipping students with real insights, and simplifying corporate schedules.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-brand-navy-100/50 rounded-2xl p-8 hover:shadow-premium transition-all">
            <div className="p-3 bg-brand-navy-50 rounded-xl text-brand-navy-700 inline-block mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-brand-navy-800 mb-2">Dual Keyword Scanner</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Runs comparisons between professional resumes and job opening skills. Highlights density scores and prompts missing core phrases.</p>
          </div>

          <div className="bg-white border border-brand-navy-100/50 rounded-2xl p-8 hover:shadow-premium transition-all">
            <div className="p-3 bg-brand-navy-50 rounded-xl text-brand-gold-600 inline-block mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-brand-navy-800 mb-2">Practice Interview Prep</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Generates standard technical and human-resource questions matching designated company profiles, difficulty level, and user technical stack.</p>
          </div>

          <div className="bg-white border border-brand-navy-100/50 rounded-2xl p-8 hover:shadow-premium transition-all">
            <div className="p-3 bg-brand-navy-50 rounded-xl text-brand-navy-700 inline-block mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-brand-navy-800 mb-2">Direct HR Schedulers</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Allows verified companies to filter applicant lists, instant-shortlist candidates matching eligibility barriers, and set virtual call parameters.</p>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-brand-navy-50 py-20 border-t border-brand-navy-100/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono tracking-wider font-semibold uppercase text-brand-gold-600">WALTER WHITE PRIDE</span>
            <h3 className="text-2xl font-display font-bold text-brand-navy-800 mt-2">Latest Alums Sharing Drive Experiences</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stories.map((st, i) => (
              <div key={i} className="bg-white border border-brand-navy-100/50 rounded-3xl p-8 shadow-premium flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-brand-gold-500 flex items-center justify-center text-white font-display font-semibold shrink-0">
                  {st.initials}
                </div>
                <div className="space-y-4">
                  <p className="text-slate-600 italic text-sm">"{st.quote}"</p>
                  <div>
                    <h5 className="font-bold text-brand-navy-800 text-sm">{st.name}</h5>
                    <p className="text-xs text-slate-400 mb-1">{st.dept}</p>
                    <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold text-brand-navy-700 bg-brand-navy-100 rounded-full border border-brand-navy-200">
                      {st.package}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Support / Footer */}
      <footer className="bg-brand-navy-900 text-white border-t border-brand-navy-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-gold-500 rounded text-brand-navy-900 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-display font-bold tracking-tight text-base">WALTER WHITE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Serving our campus community and recruiters since 2005. Championing academic rigor and technical prowess.
            </p>
          </div>

          <div>
            <h6 className="font-display font-semibold text-xs text-brand-gold-400 mb-4 uppercase tracking-wider">Office Hours</h6>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monday - Friday: 09:00 AM - 05:00 PM<br />
              Saturday: 09:00 AM - 01:00 PM<br />
              Closed on Sundays and Gazetted Holidays.
            </p>
          </div>

          <div>
            <h6 className="font-display font-semibold text-xs text-brand-gold-400 mb-4 uppercase tracking-wider">Contact Administration</h6>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-brand-gold-400 shrink-0" /> Administration Block, Floor 2, Sector 15</li>
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-brand-gold-400" /> +1 (555) 012-7000</li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-brand-gold-400" /> placements@walterwhite.edu</li>
            </ul>
          </div>

          <div>
            <h6 className="font-display font-semibold text-xs text-brand-gold-400 mb-4 uppercase tracking-wider">Verify Recruiter</h6>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              All visiting corporate executives must possess a placement agreement with the Dean of Career Services.
            </p>
            <button 
              onClick={() => onNavigate('student-login')} 
              className="text-xs font-bold text-brand-gold-400 hover:text-brand-gold-500 flex items-center gap-1 group"
            >
              Access student logs <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-brand-navy-800/60 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500">
          <p>© 2026 Walter White. All Rights Reserved. Created under the Academic Placement Scheme.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Recruit Terms</span>
            <span className="hover:text-slate-300 cursor-pointer">Academic Guidelines</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
