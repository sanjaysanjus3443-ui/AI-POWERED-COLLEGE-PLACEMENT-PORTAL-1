/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileSearch, Sparkles, AlertCircle, RefreshCw, Check, ArrowRight, Layers, FileText } from 'lucide-react';
import { Student } from '../types.js';

interface ResumeScannerPanelProps {
  student: Student;
  token?: string;
  onUpdateSkills?: (newSkills: string) => void;
}

export default function ResumeScannerPanel({ student, token, onUpdateSkills }: ResumeScannerPanelProps) {
  // Resume Analyzer States
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    skills: string[];
    missingSkills: string[];
    score: number;
    suggestions: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Keyword Scanner States
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    density: number;
    foundKeywords: string[];
    missingKeywords: string[];
  } | null>(null);
  const [jobSkillsText, setJobSkillsText] = useState("React, Tailwind CSS, TypeScript, SQL, Microservices, Git");

  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume content details to initiate AI scanning.");
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({ resumeText, targetRole })
      });

      if (!res.ok) {
        throw new Error("Failed compiling resume file text. Please double check prompt.");
      }

      const outcome = await res.json();
      setAnalysis(outcome);
      
      // Auto-populate scan skills matching
      if (outcome.skills && outcome.skills.length > 0) {
        // Offer to synchronize skills back to database profile
        if (onUpdateSkills) {
          onUpdateSkills(outcome.skills.join(", "));
        }
      }
    } catch (e: any) {
      setError(e.message || "An exception happened during resume parsing.");
    } finally {
      setLoading(false);
    }
  };

  const handleScanKeywords = async () => {
    setScanning(true);
    try {
      const res = await fetch('/api/ai/scan-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({
          studentSkills: student.skills,
          jobSkillsRequired: jobSkillsText
        })
      });
      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* 1. Resume Analyzer Panel */}
      <div className="bg-white border border-brand-navy-100 rounded-3xl p-8 shadow-premium">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-navy-50 pb-6 mb-6">
          <div>
            <h2 className="text-xl font-display font-bold text-brand-navy-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-gold-500" />
              AI Resume Auditor
            </h2>
            <p className="text-xs text-slate-500">Paste your resume draft below to parse your skills portfolio and identify missing credentials.</p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-brand-gold-100 text-brand-gold-600 px-2.5 py-1 rounded-full border border-brand-gold-500/20">
            POWERED BY GEMINI-3.5-FLASH
          </span>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex gap-2 items-center mb-6">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Target Carrier Sector</label>
              <input
                id="resume-role-input"
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Frontend developer, ML scientist"
                className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy-800 focus:outline-none focus:ring-2 focus:ring-brand-gold-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Paste Copy of Resume Text</label>
              <textarea
                id="resume-text-input"
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste work experience, project bullets, academic history, or text certifications here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-gold-400 focus:bg-white resize-y"
              />
            </div>

            <button
              id="submit-analysis-btn"
              onClick={handleAnalyzeResume}
              disabled={loading}
              className="w-full bg-brand-navy-700 text-white font-display py-3.5 rounded-xl text-sm font-bold shadow hover:bg-brand-navy-800 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Resume Subnet...
                </>
              ) : (
                <>
                  <FileSearch className="w-4 h-4" />
                  Analyze Live Resume
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-brand-navy-50/40 border border-brand-navy-100/50 rounded-2xl p-6 min-h-[300px] flex flex-col justify-center">
            {loading && (
              <div className="text-center py-12">
                <div className="w-10 h-10 rounded-full border-4 border-brand-navy-100 border-t-brand-gold-500 animate-spin mx-auto mb-4"></div>
                <p className="text-xs text-slate-400 font-mono tracking-wider animate-pulse leading-relaxed">
                  COMPUTING KEY PHRASES MODEL INDEX...<br />
                  SCORING COGNITIONAL RELEVANCY AGAINST SDE SECTORS...
                </p>
              </div>
            )}

            {!loading && !analysis && (
              <div className="text-center p-6 text-slate-400">
                <FileSearch className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs max-w-xs mx-auto leading-relaxed">
                  Provide your target career sector and paste your career text blocks to extract a full skill portfolio audit immediately.
                </p>
              </div>
            )}

            {!loading && analysis && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white border border-brand-navy-100/50 p-4 rounded-xl">
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase">PLACEMENT SCORE</span>
                    <h3 className="text-2xl font-display font-extrabold text-brand-navy-800">{analysis.score} <span className="text-xs text-slate-400 font-normal">/ 100</span></h3>
                  </div>
                  <div>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      analysis.score >= 80 ? 'bg-green-100 text-green-700' : 'bg-brand-gold-100 text-brand-gold-600'
                    }`}>
                      {analysis.score >= 80 ? 'Ready for SDE Drive' : 'Upgrades Recommended'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Found Skills */}
                  <div>
                    <h4 className="text-xs font-bold text-brand-navy-800 uppercase mb-2 flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500 font-bold" /> Detected Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.skills.map((s, i) => (
                        <span key={i} className="text-[10px] font-bold bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <h4 className="text-xs font-bold text-brand-navy-800 uppercase mb-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-brand-gold-500" /> Missing Industry Needs</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.missingSkills.map((s, i) => (
                        <span key={i} className="text-[10px] font-bold bg-brand-gold-100/50 border border-brand-gold-500/20 text-brand-gold-600 px-2 py-1 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-brand-navy-800 uppercase mb-2">Detailed Strategic Suggestions</h4>
                  <ul className="space-y-1.5">
                    {analysis.suggestions.map((s, i) => (
                      <li key={i} className="flex gap-2 text-[11px] text-slate-600 leading-normal">
                        <ArrowRight className="w-3.5 h-3.5 text-brand-gold-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Keyword Scanner Panel */}
      <div className="bg-white border border-brand-navy-100 rounded-3xl p-8 shadow-premium">
        <div className="border-b border-brand-navy-50 pb-4 mb-4">
          <h2 className="text-lg font-display font-bold text-brand-navy-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-gold-500" />
            Resume Keyword Scanner (Mandate check)
          </h2>
          <p className="text-xs text-slate-500">Scan match densities against custom lists of requirements on active corporate cards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Target Job Opening Skills</label>
              <textarea
                id="job-skills-matcher"
                rows={3}
                value={jobSkillsText}
                onChange={(e) => setJobSkillsText(e.target.value)}
                placeholder="e.g. React, SQL, Java..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-gold-400"
              />
            </div>

            <button
              id="trigger-scanner-btn"
              onClick={handleScanKeywords}
              disabled={scanning}
              className="bg-brand-gold-500 text-white font-display px-5 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-brand-gold-600 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Scanning Keywords...
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5" />
                  Compare My Skills Portfolio
                </>
              )}
            </button>
          </div>

          <div className="bg-brand-navy-50/40 rounded-xl p-6 border border-brand-navy-100/40 flex flex-col justify-center">
            {scanResult ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-3.5 rounded-lg border border-brand-navy-50">
                  <span className="text-xs text-slate-500 font-bold">KEYWORD DENSITY SCORE:</span>
                  <span className="text-lg font-display font-extrabold text-brand-navy-800">{scanResult.density}%</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">✔ MATCHES FOUND:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {scanResult.foundKeywords.length > 0 ? (
                        scanResult.foundKeywords.map((k, i) => (
                          <span key={i} className="text-[9px] font-bold bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
                            {k}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">None found</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-brand-gold-600 flex items-center gap-1">✖ MISSING KEY PHRASES:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {scanResult.missingKeywords.length > 0 ? (
                        scanResult.missingKeywords.map((k, i) => (
                          <span key={i} className="text-[9px] font-bold bg-brand-gold-100/50 text-brand-gold-600 border border-brand-gold-200/50 px-2 py-0.5 rounded">
                            {k}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-green-600 italic font-semibold">Perfect keyword match!</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-slate-400">
                Trigger evaluation against your profile skills:<br />
                <span className="font-semibold text-brand-navy-800">[{student.skills}]</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
