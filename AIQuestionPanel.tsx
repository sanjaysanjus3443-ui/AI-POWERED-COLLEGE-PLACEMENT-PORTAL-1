/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, AlertCircle, RefreshCw, ChevronDown, ChevronUp, CheckCircle, HelpCircle } from 'lucide-react';
import { AIQuestion } from '../types.js';

interface AIQuestionPanelProps {
  skills: string;
  token?: string;
}

export default function AIQuestionPanel({ skills, token }: AIQuestionPanelProps) {
  const [role, setRole] = useState("Software Development Engineer");
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>("Medium");
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setExpandedIndex(null);
    try {
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({
          skills: skills || "React, TypeScript, SQL",
          role,
          difficulty
        })
      });

      if (!response.ok) {
        throw new Error('Interview generator segment was busy. Retry shortly.');
      }

      const list = await response.json();
      setQuestions(list);
    } catch (err: any) {
      setError(err.message || 'Failed to assemble interview prep deck.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="bg-white border border-brand-navy-100 rounded-3xl p-8 shadow-premium select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-navy-50 pb-6 mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-brand-navy-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-gold-500" />
            AI Mock Question Prep
          </h2>
          <p className="text-xs text-slate-500">Access custom practice questions mapped to your skills & targeted roles.</p>
        </div>
        <button
          id="generate-questions-btn"
          onClick={handleGenerate}
          disabled={loading}
          className="bg-brand-navy-700 text-white font-display px-5 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-brand-navy-800 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Assembling Questions...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              {questions.length > 0 ? "Generate Different Questions" : "Generate Q&A Syllabus"}
            </>
          )}
        </button>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Target Carrier Role</label>
          <select
            id="qa-role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-brand-navy-50 border border-brand-navy-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-gold-400 focus:bg-white"
          >
            <option value="Software Development Engineer">Software Development SDE</option>
            <option value="Data Science & ML Specialist">Data Scientist & ML Engineer</option>
            <option value="Cloud Architect & DevOps Developer">DevOps & Cloud Solutions</option>
            <option value="System Architect">System Architect & Low-Level Engineer</option>
            <option value="UI/UX Specialist">UI/UX and Frontend Designer</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy-600 mb-1.5 font-display">Interview Rigor / Difficulty</label>
          <div className="flex gap-2">
            {(['Easy', 'Medium', 'Hard'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setDifficulty(tier)}
                className={`flex-1 py-3 text-sm font-bold font-display rounded-xl border transition-all ${
                  difficulty === tier
                    ? 'bg-brand-gold-500 text-white border-brand-gold-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-brand-navy-50'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex gap-2 items-center mb-6">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {loading && (
        <div className="py-14 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-brand-navy-100 border-t-brand-gold-500 animate-spin mx-auto mb-4"></div>
          <p className="text-xs text-slate-400 font-mono tracking-wider animate-pulse uppercase">
            Parsing student credentials: [{skills}] ...<br />
            Configuring matching standard technical question-bank ...
          </p>
        </div>
      )}

      {!loading && questions.length === 0 && (
        <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Choose your target career track and select a difficulty tier to generate structured coding challenges and standard tech review questions.
          </p>
        </div>
      )}

      {!loading && questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-brand-gold-100/40 border border-brand-gold-500/20 rounded-xl px-4 py-2 text-xs font-semibold text-brand-gold-600 mb-2">
            <span>READY TO ATTEMPT: 3 TECHNICAL, 2 GENERAL HR</span>
            <span>DIFFICULTY: {difficulty.toUpperCase()}</span>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div key={idx} className="border border-brand-navy-100 rounded-2xl overflow-hidden hover:border-brand-navy-200 transition-colors">
                  {/* Accordion header */}
                  <button
                    onClick={() => toggleAnswer(idx)}
                    className="w-full flex items-center justify-between text-left px-5 py-4 bg-brand-navy-50/30 hover:bg-brand-navy-50/70 transition-all"
                  >
                    <div className="flex gap-3 items-start pr-4">
                      <span className={`px-2 py-0.5 mt-0.5 rounded text-[10px] uppercase font-bold shrink-0 ${
                        q.type === 'Technical' ? 'bg-brand-navy-700 text-white' : 'bg-brand-gold-500 text-white'
                      }`}>
                        {q.type}
                      </span>
                      <span className="text-sm font-semibold text-brand-navy-800 leading-snug">{q.question}</span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  {/* Accordion body */}
                  {isExpanded && (
                    <div className="px-5 py-4 bg-white border-t border-brand-navy-50">
                      <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold mb-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>AI RECOMMENDED RESPONSE PATHWAY & MODEL OUTLINE</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed bg-brand-navy-50/50 p-4 rounded-xl border border-brand-navy-50 font-sans whitespace-pre-line">
                        {q.sampleAnswer || "Practice explaining core architectural structures using the STAR method (Situation, Task, Action, Result) to maximize reviewer response."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
