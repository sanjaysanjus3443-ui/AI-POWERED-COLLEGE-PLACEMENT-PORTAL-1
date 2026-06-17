/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Job, Student } from "../src/types.js";

// Lazy-initialization utility for Gemini Client
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (geminiClient) return geminiClient;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY environment variable is not defined or is placeholder. Using smart recovery simulation engine.");
    return null;
  }
  
  try {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    return geminiClient;
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
    return null;
  }
}

// 1. Resume Analyzer
export interface ResumeAnalysisResult {
  skills: string[];
  missingSkills: string[];
  score: number;
  suggestions: string[];
}

export async function analyzeResume(resumeText: string, targetRole: string = "Software Engineer"): Promise<ResumeAnalysisResult> {
  const client = getGeminiClient();
  
  if (client) {
    try {
      const prompt = `Analyze the following resume details for the target role: "${targetRole}". 
Extract current core skills, list crucial industry skills missing for this role, compute a match score (0-100), and write 3 tactical recommendations to improve placement prospects.
Resume Text:
${resumeText}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Extracted skills from the resume text."
              },
              missingSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Crucial skills missing for the given target role."
              },
              score: {
                type: Type.INTEGER,
                description: "Placement readiness rating (0-100)."
              },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Up to 4 high-impact, direct improvement recommendations."
              }
            },
            required: ["skills", "missingSkills", "score", "suggestions"]
          }
        }
      });

      if (response && response.text) {
        return JSON.parse(response.text.trim()) as ResumeAnalysisResult;
      }
    } catch (err) {
      console.error("Gemini Resume Analysis failed, invoking fallback simulator.", err);
    }
  }

  // Smart Recovery Local Rule-base Engine
  return simulateResumeAnalysis(resumeText, targetRole);
}

function simulateResumeAnalysis(text: string, role: string): ResumeAnalysisResult {
  const normText = text.toLowerCase();
  const allPossibleSkills = ["React", "TypeScript", "Node.js", "Python", "SQL", "Docker", "Kubernetes", "Java", "C++", "System Design", "AWS", "PyTorch", "TensorFlow", "Tailwind CSS", "Git"];
  
  // Extract skills present in text
  const skills = allPossibleSkills.filter(s => normText.includes(s.toLowerCase()));
  if (skills.length === 0) {
    skills.push("React", "TypeScript", "Node.js", "Javascript"); // default placeholder if text is brief
  }

  // Determine missing skills based on role
  let missing: string[] = [];
  let score = 55;
  
  if (role.toLowerCase().includes("data") || role.toLowerCase().includes("ml") || role.toLowerCase().includes("analyst")) {
    missing = ["Python", "Pandas", "Scikit-Learn", "Machine Learning", "SQL"].filter(m => !skills.includes(m));
    score = missing.length === 0 ? 94 : Math.max(45, 95 - missing.length * 12);
  } else if (role.toLowerCase().includes("cloud") || role.toLowerCase().includes("devops") || role.toLowerCase().includes("solution")) {
    missing = ["Kubernetes", "AWS Cloud", "CI/CD Pipelines", "Docker", "Terraform"].filter(m => !skills.includes(m));
    score = missing.length === 0 ? 91 : Math.max(45, 93 - missing.length * 10);
  } else {
    // SDE / Frontend / Full-stack
    missing = ["System Design", "TypeScript", "Jest Testing", "Docker Containers", "SQL Tuning"].filter(m => !skills.includes(m));
    score = missing.length === 0 ? 92 : Math.max(45, 90 - missing.length * 8);
  }

  const suggestions: string[] = [
    `Engage in building a full-stack project demonstrating integration with standard databases.`,
    `Complete a specialized industrial certification in ${missing[0] || 'Modern System Architectures'}.`,
    `Refactor projects on GitHub to exhibit highly modularized TypeScript or Python structures.`,
    `Formulate technical write-ups explaining solutions to common algorithm design issues.`
  ];

  return { skills, missingSkills: missing, score, suggestions };
}


// 2. Mock Interview Question Generator
export interface GeneratedQuestion {
  question: string;
  type: 'Technical' | 'HR';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sampleAnswer?: string;
}

export async function generateInterviewQuestions(skills: string[], role: string = "Software Developer", difficulty: 'Easy' | 'Medium' | 'Hard' = "Medium"): Promise<GeneratedQuestion[]> {
  const client = getGeminiClient();
  
  if (client) {
    try {
      const prompt = `Produce 5 realistic interview practice questions (3 Technical, 2 HR) for a candidates seeking a "${role}" position, with these core competencies: ${skills.join(", ")}. Difficulty tier is: ${difficulty}. 
For each question, provide a short, professional sample answer showcasing standard industry best practices. Ensure the response format is JSON arrays of objects.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "A high-fidelity interview query." },
                type: { type: Type.STRING, enum: ["Technical", "HR"] },
                difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
                sampleAnswer: { type: Type.STRING, description: "Professional model response outline." }
              },
              required: ["question", "type", "difficulty", "sampleAnswer"]
            }
          }
        }
      });

      if (response && response.text) {
        return JSON.parse(response.text.trim()) as GeneratedQuestion[];
      }
    } catch (err) {
      console.error("Gemini Question Generation failed, invoking backup simulator.", err);
    }
  }

  return simulateInterviewQuestions(skills, role, difficulty);
}

function simulateInterviewQuestions(skills: string[], role: string, difficulty: string): GeneratedQuestion[] {
  const pSkill = skills[0] || "JavaScript/React";
  const sSkill = skills[1] || "SQL Databases";

  return [
    {
      question: `Can you describe how you would optimize a slow page load in a single page application built using ${pSkill}?`,
      type: "Technical",
      difficulty: difficulty as any,
      sampleAnswer: "I would analyze bundle chunks, implement lazy-loading with React.lazy, refactor costly components to prevent useless re-renders, compress assets via modern Vite setups, and cache static responses on a CDN layer."
    },
    {
      question: `What are the primary differences between SQL databases and NoSQL database structures, especially with respect to scaling?`,
      type: "Technical",
      difficulty: difficulty as any,
      sampleAnswer: "SQL databases scale vertically and use ACID properties, enforcing strict relational schemas. NoSQL scales horizontally, utilizing key-value, document, or graph models with immediate eventual consistency, optimized for unstructured high-write volumes."
    },
    {
      question: `Explain how you handled a technical deadlock or complex bug under tight semester constraints.`,
      type: "HR",
      difficulty: difficulty as any,
      sampleAnswer: "I paused active coding, isolated the module, wrote automated integration tests, consulted senior mentors/docs, and established clear daily targets, successfully deploying the fix 48 hours early."
    },
    {
      question: `Explain how code reviews and Version Control systems like Git play a role in standardizing development speed.`,
      type: "Technical",
      difficulty: "Medium",
      sampleAnswer: "Git branch workflows isolate changes safely. Regular peer reviews facilitate knowledge transfer, intercept potential runtime crashes, maintain code style sheets, and establish shared repository ownership."
    },
    {
      question: `Where does your interest in campus drives at firms like Google or Microsoft stem from, and what do you hope to contribute?`,
      type: "HR",
      difficulty: "Easy",
      sampleAnswer: "I aim to participate in building high-scale tools that power modern enterprise products. My background in academic projects, combined with rapid full-stack adaptation skills, lets me ship real features early on."
    }
  ];
}


// 3. Placement Probability Prediction
export interface PlacementPredictionResult {
  probability: number;
  factors: {
    label: string;
    impact: 'Positive' | 'Negative' | 'Neutral';
    reason: string;
  }[];
  recommendations: string[];
}

export async function predictPlacement(student: Student): Promise<PlacementPredictionResult> {
  const client = getGeminiClient();
  
  if (client) {
    try {
      const prompt = `Analyze placement probability for this student:
- Name: ${student.name}
- CGPA: ${student.cgpa}/10
- Core Skills: ${student.skills}
- Academic Projects: ${student.projects || "None declared"}
- Professional Certifications: ${student.certifications || "None listed"}
Format your response as a detailed JSON payload detailing a calculated probability rate (integer percent), 3-4 assessment factors, and 3 specific career tasks to raise potential.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              probability: { type: Type.INTEGER, description: "Placement success probability (0-100)" },
              factors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    impact: { type: Type.STRING, enum: ["Positive", "Negative", "Neutral"] },
                    reason: { type: Type.STRING }
                  },
                  required: ["label", "impact", "reason"]
                }
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["probability", "factors", "recommendations"]
          }
        }
      });

      if (response && response.text) {
        return JSON.parse(response.text.trim()) as PlacementPredictionResult;
      }
    } catch (e) {
      console.error("Gemini prediction failed, running internal assessment module.", e);
    }
  }

  return simulatePlacementPrediction(student);
}

function simulatePlacementPrediction(student: Student): PlacementPredictionResult {
  const cgpa = student.cgpa;
  const skillsCount = student.skills.split(",").length;
  const hasProjects = (student.projects && student.projects.trim().length > 10);
  const hasCertifications = (student.certifications && student.certifications.trim().length > 10);
  
  // Calculate based on realistic rules
  let baseProb = 50;
  baseProb += (cgpa - 6.0) * 10; // e.g. 9.0 cgpa adds 30%
  baseProb += Math.min(20, skillsCount * 2.5); // plenty skills adds up to 20%
  if (hasProjects) baseProb += 12;
  if (hasCertifications) baseProb += 8;
  
  const probability = Math.min(98, Math.max(30, Math.round(baseProb)));

  const factors: PlacementPredictionResult['factors'] = [
    {
      label: "Academic Standing (CGPA)",
      impact: cgpa >= 8.5 ? "Positive" : cgpa >= 7.5 ? "Neutral" : "Negative",
      reason: cgpa >= 8.5 
        ? `Superb academic CGPA of ${cgpa} comfortably clears first-round cutoffs for elite tech giants (Google/Microsoft >= 8.5).`
        : `Your CGPA of ${cgpa} qualifies you for general recruitment, but some tier-1 companies enforce higher GPA floors.`
    },
    {
      label: "Technical Skills Coverage",
      impact: skillsCount >= 6 ? "Positive" : "Negative",
      reason: skillsCount >= 6
        ? `Plentiful core skills discovered (${skillsCount} libraries). You show standard versatility across frontend and databases.`
        : `Limited skill tags enumerated. Consider adding specialized web framework or database technologies.`
    },
    {
      label: "Portfolio Projects & Artifacts",
      impact: hasProjects ? "Positive" : "Neutral",
      reason: hasProjects
        ? `Hands-on project listings provide key talking points for intermediate technical interviews.`
        : `No significant full-stack projects listed. Interviews heavily value end-to-end deployed systems.`
    }
  ];

  const recommendations: string[] = [
    cgpa < 8.0 ? "Work closely with computer networks and algorithms professors to bolster core subjects." : "Maintain high CGPA; practice rapid test-taking to clear prompt MCQ automation rounds.",
    !hasProjects ? "Deploy at least two responsive full-stack applications (e.g., using React and Cloud DB) on Vercel or Render." : "Enrich project documentation on GitHub with clear architectural wireframes.",
    "Formulate an outstanding resume structure highlighting custom tools, hosting pipelines, and real user databases."
  ];

  return { probability, factors, recommendations };
}


// 4. Job Match Recommendation Engine
export interface JobMatchResult {
  job: Job;
  matchScore: number;
  reasons: string[];
  isEligible: boolean;
}

export function recommendJobs(student: Student, jobs: Job[]): JobMatchResult[] {
  const studentSkills = student.skills.toLowerCase().split(",").map(s => s.trim());
  
  return jobs.map(job => {
    // 1. Eligibility Check (CGPA)
    const isEligible = student.cgpa >= job.cgpa_requirement;
    
    // 2. Skill match calculation
    const jobSkills = job.skills_required.toLowerCase().split(",").map(s => s.trim());
    const matchedSkills = jobSkills.filter(s => studentSkills.some(ss => ss.includes(s) || s.includes(ss)));
    const skillMatchPercentage = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 100 : 100;
    
    // 3. Overall match score
    let overallMatch = isEligible ? 50 : 30;
    overallMatch += (skillMatchPercentage * 0.5);
    
    const reasons: string[] = [];
    if (isEligible) {
      reasons.push(`Cleared academic prerequisite of ${job.cgpa_requirement} CGPA with your active ${student.cgpa}.`);
    } else {
      reasons.push(`Does not clear academic floor of ${job.cgpa_requirement} (Current is ${student.cgpa}).`);
    }
    
    if (matchedSkills.length > 0) {
      reasons.push(`Strong overlap with core required skills: [${matchedSkills.join(", ")}].`);
    } else {
      reasons.push(`No common match with required developer skill set. Add [${jobSkills.slice(0, 3).join(", ")}] to profile.`);
    }

    return {
      job,
      matchScore: Math.round(overallMatch),
      reasons,
      isEligible
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}


// 5. Resume Keyword Scanner / Matcher
export interface KeywordScanResult {
  density: number; // percent keyword match
  foundKeywords: string[];
  missingKeywords: string[];
}

export function scanResumeKeywords(studentSkills: string, jobSkillsRequired: string): KeywordScanResult {
  const studentArr = studentSkills.toLowerCase().split(",").map(s => s.trim());
  const jobArr = jobSkillsRequired.toLowerCase().split(",").map(s => s.trim());
  
  const foundKeywords = jobArr.filter(jk => studentArr.some(sk => sk.includes(jk) || jk.includes(sk)));
  const missingKeywords = jobArr.filter(jk => !foundKeywords.includes(jk));
  
  const density = jobArr.length > 0 ? Math.round((foundKeywords.length / jobArr.length) * 100) : 100;
  
  return {
    density,
    foundKeywords: foundKeywords.map(k => k.toUpperCase()),
    missingKeywords: missingKeywords.map(k => k.toUpperCase())
  };
}
