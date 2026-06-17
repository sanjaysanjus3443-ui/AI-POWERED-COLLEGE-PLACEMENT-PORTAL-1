/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Briefcase, MapPin, Calendar, CheckCircle2, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import { Job } from '../types.js';

interface JobCardProps {
  job: Job;
  studentCgpa?: number; // Passed for live eligibility checks
  studentSkills?: string; // Checked for similarity match
  onApply: (jobId: string) => void;
  applied?: boolean;
  key?: React.Key | string;
}

export default function JobCard({ job, studentCgpa = 0.0, studentSkills = "", onApply, applied = false }: JobCardProps) {
  // Eligibility calculation
  const isEligible = studentCgpa >= job.cgpa_requirement;

  // Skills similarity match index
  const studentSkillsArr = studentSkills.toLowerCase().split(",").map(s => s.trim());
  const jobSkillsArr = job.skills_required.toLowerCase().split(",").map(s => s.trim());
  const matchedSkills = jobSkillsArr.filter(js => studentSkillsArr.some(ss => ss.includes(js) || js.includes(ss)));
  const skillMatchPercentage = jobSkillsArr.length > 0 ? (matchedSkills.length / jobSkillsArr.length) * 100 : 100;
  
  // Overall match rating
  const matchScore = isEligible ? Math.round(50 + (skillMatchPercentage * 0.5)) : Math.round(30 + (skillMatchPercentage * 0.3));

  return (
    <div className="bg-white border border-brand-navy-100 rounded-3xl p-6 shadow-premium hover:shadow-xl hover:border-brand-navy-200 transition-all flex flex-col justify-between select-none">
      <div className="space-y-4">
        {/* Company and Eligibility Badges */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-brand-gold-600 uppercase">
              CAMPUS RECRUITMENT DRIVE
            </span>
            <h3 className="text-lg font-display font-extrabold text-brand-navy-800 leading-tight">
              {job.role}
            </h3>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span className="hover:underline cursor-pointer">{job.company_name}</span>
            </p>
          </div>

          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md leading-none ${
            isEligible ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
          }`}>
            {isEligible ? 'Eligible' : 'Ineligible'}
          </span>
        </div>

        {/* Job Parameters Grid */}
        <div className="grid grid-cols-2 gap-3 bg-brand-navy-50/50 p-3 rounded-2xl border border-brand-navy-50">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-brand-gold-500 shrink-0" />
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">PACKAGE</p>
              <p className="text-xs font-extrabold text-brand-navy-800">{job.package}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-gold-500 shrink-0" />
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">DEADLINE</p>
              <p className="text-xs font-bold text-brand-navy-800">{job.deadline}</p>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
            {job.description}
          </p>
        </div>

        {/* Skills Tag block */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-display">Required Skills</p>
          <div className="flex flex-wrap gap-1">
            {jobSkillsArr.map((skill, index) => {
              const matches = studentSkillsArr.some(ss => ss.includes(skill) || skill.includes(ss));
              return (
                <span 
                  key={index} 
                  className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    matches 
                      ? 'bg-brand-navy-50 hover:bg-brand-navy-100 text-brand-navy-700 font-semibold border border-brand-navy-100/60' 
                      : 'bg-slate-50 text-slate-400 font-normal border border-slate-100'
                  }`}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Matching Score Dial & Action Button */}
      <div className="border-t border-brand-navy-50 pt-5 mt-5 flex justify-between items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className={`p-1.5 rounded ${matchScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-brand-gold-100 text-brand-gold-600'}`}>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">MATCH RATE</p>
            <p className="text-xs font-extrabold text-brand-navy-800">{matchScore}%</p>
          </div>
        </div>

        {applied ? (
          <span className="bg-slate-100 text-slate-400 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 cursor-not-allowed flex items-center gap-1.5 leading-none">
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
            Applied
          </span>
        ) : (
          <button
            id={`apply-job-${job.job_id}`}
            onClick={() => isEligible && onApply(job.job_id)}
            disabled={!isEligible}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold font-display shadow leading-none transition-all cursor-pointer ${
              isEligible 
                ? 'bg-brand-navy-700 hover:bg-brand-navy-800 text-white hover:scale-[1.02]' 
                : 'bg-slate-100 text-slate-300 pointer-events-none shadow-none border border-slate-100'
            }`}
          >
            Apply Now
          </button>
        )}
      </div>

      {/* Eligibility Warn note */}
      {!isEligible && (
        <p className="text-[9.5px] text-red-500 font-bold flex items-center gap-1 mt-2- bg-red-50/50 p-2 rounded-lg border border-red-100 mt-2">
          <AlertCircle className="w-3 h-3 shrink-0" />
          Requires CGPA &gt;= {job.cgpa_requirement} (Current is {studentCgpa})
        </p>
      )}
    </div>
  );
}
