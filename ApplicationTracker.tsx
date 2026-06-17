/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Circle, AlertTriangle, Building2, Briefcase, Calendar, Info, Clock } from 'lucide-react';
import { Application } from '../types.js';

interface ApplicationTrackerProps {
  applications: Application[];
  onCancel?: (appId: string) => void;
}

const STEPS = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected'
];

export default function ApplicationTracker({ applications, onCancel }: ApplicationTrackerProps) {
  const getStepIndex = (status: Application['status']): number => {
    if (status === 'Rejected') return -1;
    return STEPS.indexOf(status);
  };

  return (
    <div className="space-y-6 select-none">
      <div className="border-b border-brand-navy-50 pb-4">
        <h2 className="text-xl font-display font-bold text-brand-navy-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-gold-500" />
          Application Drive Monitor
        </h2>
        <p className="text-xs text-slate-500">Track and review corporate hiring statuses inside real-time placement logs.</p>
      </div>

      {applications.length === 0 ? (
        <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-500">No active applications currently.</p>
          <p className="text-xs text-slate-400 mt-1">Visit the Jobs board and check eligibility requirements to apply.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const stepIndex = getStepIndex(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div 
                key={app.application_id} 
                className="bg-white border border-brand-navy-100 rounded-3xl p-6 shadow-premium hover:border-brand-navy-200 transition-all"
              >
                {/* App summary */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-brand-navy-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-navy-50 rounded-xl text-brand-navy-700">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-brand-navy-800">{app.job_role}</h4>
                      <p className="text-xs text-brand-gold-600 font-bold font-display uppercase tracking-wider">{app.company_name}</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">APPLIED DATE</span>
                    <span className="text-xs font-bold text-brand-navy-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {app.applied_date.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Stepper progress timeline */}
                {!isRejected ? (
                  <div className="relative">
                    <div className="absolute top-4 left-0 right-0 h-1 bg-brand-navy-50 hidden md:block z-0"></div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
                      {STEPS.map((step, idx) => {
                        const isCompleted = idx <= stepIndex;
                        const isActive = idx === stepIndex;

                        return (
                          <div key={idx} className="text-center md:px-2 flex flex-col items-center">
                            {/* Visual indicator node */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                              isCompleted 
                                ? 'bg-brand-navy-700 text-brand-gold-400 border-brand-navy-800 ring-4 ring-brand-navy-100/50' 
                                : 'bg-white text-slate-300 border-slate-200'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                              ) : (
                                <Circle className="w-3 h-3 text-slate-300 shrink-0" />
                              )}
                            </div>

                            <p className={`text-[11px] mt-2 font-display uppercase tracking-wider leading-none font-bold ${
                              isActive 
                                ? 'text-brand-gold-600' 
                                : isCompleted 
                                ? 'text-brand-navy-700 font-semibold' 
                                : 'text-slate-400'
                            }`}>
                              {step}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-red-700 uppercase tracking-wide">Application Rejected</h5>
                      <p className="text-[11px] text-red-600 leading-normal">The recruiter representative chose not to proceed at this stage. Keep refining your skills profile and practice coding questions!</p>
                    </div>
                  </div>
                )}

                {/* Additional tracking info notes */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100/50 mt-6 flex gap-2 items-start text-slate-500 text-[10.5px] leading-relaxed">
                  <Info className="w-4 h-4 text-brand-navy-600 shrink-0 mt-0.5" />
                  <div>
                    {app.status === 'Applied' && "We have notified the executive HR. Your profile will be scanned against their keywords soon."}
                    {app.status === 'Under Review' && "Recruitment staff is verifying resumes. Maintain high-level skills summaries."}
                    {app.status === 'Shortlisted' && "Congratulations! Clear academic prerequisites. Look out for system interview scheduling."}
                    {app.status === 'Interview Scheduled' && "An Interview is mapped to your calendar. Read mock QA modules under the preparations panel immediately."}
                    {app.status === 'Selected' && "HURRAY! You have received a formal placement offer. Confirm your placement status in the office database."}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
