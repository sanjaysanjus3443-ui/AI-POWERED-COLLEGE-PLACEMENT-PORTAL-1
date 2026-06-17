/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Student, AIPrediction } from '../types.js';

interface AIPredictorPanelProps {
  student: Student;
  token?: string;
}

export default function AIPredictorPanel({ student, token }: AIPredictorPanelProps) {
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read properties directly from form state passed from parent
  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/predict-placement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({
          cgpa: student.cgpa,
          skills: student.skills,
          projects: student.projects || '',
          certifications: student.certifications || ''
        })
      });

      if (!response.ok) {
        throw new Error('Our prediction subnet was busy. Please try again.');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err: any) {
      setError(err.message || 'Failed to trigger predictive framework.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-brand-navy-100 rounded-3xl p-8 shadow-premium select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-navy-50 pb-6 mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-brand-navy-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-gold-500" />
            AI Placement Predictor
          </h2>
          <p className="text-xs text-slate-500">Calculate your placement readiness probability on Google & Microsoft models.</p>
        </div>
        <button
          id="run-predictor-btn"
          onClick={handlePredict}
          disabled={loading}
          className="bg-brand-navy-700 text-white font-display px-5 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-brand-navy-800 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Running Engine...
            </>
          ) : (
            <>
              <TrendingUp className="w-3.5 h-3.5" />
              {prediction ? "Re-calculate Score" : "Predict My Probability"}
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex gap-2 items-center mb-6">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {!prediction && !loading && (
        <div className="text-center py-10 px-4">
          <div className="w-16 h-16 rounded-full bg-brand-gold-100/60 text-brand-gold-600 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
            Our predictor analyzes your active Profile details (CGPA: {student.cgpa || "None"}, Project details, and Registered Skills) to determine campus hire likelihood.
          </p>
          <button
            onClick={handlePredict}
            className="text-xs font-bold text-brand-gold-500 hover:text-brand-gold-600 underline"
          >
            Initiate analysis sequence
          </button>
        </div>
      )}

      {loading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-navy-100 border-t-brand-gold-500 animate-spin"></div>
          <p className="text-xs text-slate-400 font-mono tracking-widest text-center animate-pulse">
            LAZILY COMPUTING SYSTEM METRICS...<br />
            CROSS-JOINING DRIVE DEADLINES & ELIGIBILITY...
          </p>
        </div>
      )}

      {prediction && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Radial Probability Circle */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-brand-navy-50/50 rounded-2xl border border-brand-navy-100/50">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Circular track */}
              <svg className="absolute inset-0 w-full h-full rotate-270">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  stroke="#e2e8f5"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  stroke="#c5a059"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={389}
                  strokeDashoffset={389 - (389 * prediction.probability) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="text-center">
                <span className="text-4xl font-display font-extrabold text-brand-navy-800">{prediction.probability}%</span>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">PROBABILITY</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold leading-none ${
                prediction.probability >= 80 
                  ? 'bg-green-100 text-green-700' 
                  : prediction.probability >= 60 
                  ? 'text-brand-gold-600 bg-brand-gold-100/60' 
                  : 'bg-red-50 text-red-600'
              }`}>
                {prediction.probability >= 80 ? 'Highly Competitive' : prediction.probability >= 60 ? 'Favorable Match' : 'Action Required'}
              </span>
            </div>
          </div>

          {/* Assessment Criteria Factors */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-brand-navy-800 mb-3">Key Assessment Factors</h3>
              <div className="space-y-3">
                {prediction.factors.map((f, i) => (
                  <div key={i} className="p-3.5 bg-white border border-brand-navy-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1 justify-between">
                      <span className="text-xs font-bold text-brand-navy-800">{f.label}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        f.impact === 'Positive' ? 'text-green-600' : f.impact === 'Negative' ? 'text-red-500' : 'text-slate-400'
                      }`}>
                        {f.impact}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{f.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-brand-navy-800 mb-3">Target Recommendations to Boost Match Rate</h3>
              <ul className="space-y-2">
                {prediction.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold-500 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
