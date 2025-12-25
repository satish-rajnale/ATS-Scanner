import { ParsedResume } from "./resume-parser";
import { analyzeAllBullets, findWeakPhrases } from "./resume-enhancer";

export interface DetectedIssue {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}

export interface ATSAnalysis {
  atsScore: number;
  keywordMatchPercentage: number;
  detectedIssues: DetectedIssue[];
  rawFindings: {
    hasContactInfo: boolean;
    hasExperience: boolean;
    hasEducation: boolean;
    hasSkills: boolean;
    hasSummary: boolean;
    isImageOnly: boolean;
    hasTables: boolean;
    hasColumns: boolean;
    pageCount: number;
    keywordMatches: number;
    totalKeywords: number;
    atsParseRate: number;
    wordRepetitions: Array<{ word: string; count: number; suggestions: string[] }>;
    quantifiedBullets: number;
    totalBullets: number;
    bulletAverageScore: number;
    weakPhrases: Array<{ phrase: string; type: string; suggestion: string }>;
    weakVerbCount: number;
    vaguePhraseCount: number;
    vagueLines: Array<{ line: string; score: number; suggestions: string[] }>;
    detectedBullets?: string[]; // Debug: list of detected bullet points
    unquantifiedBullets?: string[]; // Top bullets that need quantification
  };
}

export function analyzeResume(
  parsedResume: ParsedResume,
  jobDescription?: string
): ATSAnalysis {
  const text = parsedResume.text.toLowerCase();
  const issues: DetectedIssue[] = [];
  let score = 100;
  
  // Check for essential sections
  const hasContactInfo = /(phone|email|contact|address|@)/i.test(parsedResume.text);
  const hasExperience = /(experience|work history|employment|professional experience|work experience)/i.test(parsedResume.text) ||
                        /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}/i.test(parsedResume.text);
  const hasEducation = /(education|degree|university|college|bachelor|master|phd|diploma)/i.test(parsedResume.text);
  const hasSkills = /(skills|technical skills|competencies|proficiencies)/i.test(parsedResume.text) ||
                    /(javascript|python|java|sql|html|css|react|node|aws|docker)/i.test(parsedResume.text);
  const hasSummary = /(summary|objective|profile|about)/i.test(parsedResume.text);
  
  // Deduct points for missing sections
  if (!hasContactInfo) {
    score -= 5;
    issues.push({
      title: "Missing Contact Information",
      description: "Your resume should include phone number, email, and optionally LinkedIn profile.",
      severity: "high",
    });
  }
  
  if (!hasExperience) {
    score -= 10;
    issues.push({
      title: "Missing Work Experience Section",
      description: "Your resume should include a Work Experience or Employment History section with job titles, companies, and dates.",
      severity: "high",
    });
  }
  
  if (!hasEducation) {
    score -= 5;
    issues.push({
      title: "Missing Education Section",
      description: "Include your educational background with degree, institution, and graduation date.",
      severity: "medium",
    });
  }
  
  if (!hasSkills) {
    score -= 10;
    issues.push({
      title: "Missing Skills Section",
      description: "Add a dedicated Skills section listing your technical and soft skills relevant to the position.",
      severity: "high",
    });
  }
  
  // Check for formatting issues
  if (parsedResume.isImageOnly) {
    score -= 20;
    issues.push({
      title: "Image-Only Resume Detected",
      description: "Your resume appears to be a scanned image or contains very little text. ATS systems cannot read image-based resumes. Use a text-based PDF or DOCX file.",
      severity: "high",
    });
  }
  
  if (parsedResume.hasTables) {
    score -= 10;
    issues.push({
      title: "Tables Detected",
      description: "Tables in resumes can break ATS parsing. Use simple bullet points and standard formatting instead.",
      severity: "medium",
    });
  }
  
  if (parsedResume.hasColumns) {
    score -= 5;
    issues.push({
      title: "Column Layout Detected",
      description: "Multi-column layouts can confuse ATS systems. Use a single-column format for better compatibility.",
      severity: "low",
    });
  }
  
  // Check resume length
  if (parsedResume.pageCount > 2) {
    score -= 5;
    issues.push({
      title: "Resume Too Long",
      description: `Your resume appears to be ${parsedResume.pageCount} pages. Most ATS systems prefer 1-2 page resumes. Consider condensing your content.`,
      severity: "low",
    });
  } else if (parsedResume.pageCount < 0.5) {
    score -= 5;
    issues.push({
      title: "Resume Too Short",
      description: "Your resume appears to be very short. Make sure you've included all relevant experience, education, and skills.",
      severity: "low",
    });
  }
  
  // Keyword matching
  let keywordMatchPercentage = 0;
  let keywordMatches = 0;
  let totalKeywords = 0;
  
  if (jobDescription && jobDescription.trim()) {
    const jobText = jobDescription.toLowerCase();
    
    // Extract keywords (simple approach: words that appear multiple times or are capitalized)
    const jobWords = jobText
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter((word, index, arr) => arr.indexOf(word) !== index || /[A-Z]/.test(word)); // Duplicates or capitalized
    
    // Also look for common skill keywords
    const commonSkills = [
      "javascript", "python", "java", "sql", "react", "node", "aws", "docker",
      "kubernetes", "typescript", "angular", "vue", "mongodb", "postgresql",
      "project management", "agile", "scrum", "leadership", "communication",
      "analytics", "data analysis", "machine learning", "ai", "api", "rest",
      "graphql", "git", "ci/cd", "devops", "cloud", "azure", "gcp"
    ];
    
    const allKeywords = [...new Set([...jobWords, ...commonSkills])]
      .filter(keyword => jobText.includes(keyword))
      .slice(0, 30); // Limit to top 30 keywords
    
    totalKeywords = allKeywords.length;
    
    if (totalKeywords > 0) {
      keywordMatches = allKeywords.filter(keyword => 
        text.includes(keyword) || 
        text.includes(keyword.replace(/\s+/g, "")) ||
        text.includes(keyword.replace(/\s+/g, "-"))
      ).length;
      
      keywordMatchPercentage = (keywordMatches / totalKeywords) * 100;
      
      // Adjust score based on keyword match
      if (keywordMatchPercentage < 30) {
        score -= 20;
        issues.push({
          title: "Low Keyword Match",
          description: `Only ${keywordMatchPercentage.toFixed(1)}% of important keywords from the job description were found in your resume. Add more relevant keywords to improve your ATS ranking.`,
          severity: "high",
        });
      } else if (keywordMatchPercentage < 50) {
        score -= 10;
        issues.push({
          title: "Moderate Keyword Match",
          description: `Your resume matches ${keywordMatchPercentage.toFixed(1)}% of job description keywords. Consider adding more relevant terms to improve your ranking.`,
          severity: "medium",
        });
      } else if (keywordMatchPercentage < 70) {
        score -= 5;
        issues.push({
          title: "Good Keyword Match",
          description: `Your resume matches ${keywordMatchPercentage.toFixed(1)}% of keywords. You can improve further by adding more specific terms from the job description.`,
          severity: "low",
        });
      }
    }
  }
  
  // Calculate ATS Parse Rate (percentage of resume successfully parsed)
  let atsParseRate = 100;
  if (parsedResume.isImageOnly) {
    atsParseRate = 0; // Image-only resumes can't be parsed
  } else {
    // Start with 100% and deduct for issues
    if (parsedResume.hasTables) atsParseRate -= 20;
    if (parsedResume.hasColumns) atsParseRate -= 15;
    if (!hasContactInfo) atsParseRate -= 10;
    if (!hasExperience) atsParseRate -= 15;
    if (!hasEducation) atsParseRate -= 10;
    if (!hasSkills) atsParseRate -= 15;
    // Ensure minimum of 0
    atsParseRate = Math.max(0, atsParseRate);
  }

  // Detect word repetitions
  const wordRepetitions: Array<{ word: string; count: number; suggestions: string[] }> = [];
  const wordCounts = new Map<string, number>();
  const words = parsedResume.text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4); // Only count words longer than 4 characters

  words.forEach((word) => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  });

  // Synonym suggestions for common repeated words
  const synonymMap: Record<string, string[]> = {
    developed: ["enhanced", "expanded", "improved", "created", "built"],
    awarded: ["granted", "recognized", "bestowed", "honored", "presented"],
    led: ["managed", "directed", "headed", "oversaw", "guided"],
    created: ["developed", "built", "established", "founded", "designed"],
    managed: ["led", "directed", "oversaw", "coordinated", "supervised"],
    improved: ["enhanced", "optimized", "refined", "upgraded", "strengthened"],
    implemented: ["executed", "deployed", "established", "introduced", "launched"],
    responsible: ["accountable", "tasked", "charged", "entrusted"],
  };

  wordCounts.forEach((count, word) => {
    if (count >= 3) {
      // Only flag words repeated 3+ times
      wordRepetitions.push({
        word,
        count,
        suggestions: synonymMap[word] || [],
      });
    }
  });

  // Sort by count (most repeated first) and limit to top 5
  wordRepetitions.sort((a, b) => b.count - a.count);
  const topRepetitions = wordRepetitions.slice(0, 5);

  // Deduct points for repetition
  if (topRepetitions.length > 0) {
    const totalRepetitions = topRepetitions.reduce((sum, r) => sum + r.count, 0);
    if (totalRepetitions >= 15) {
      score -= 8;
      issues.push({
        title: "Excessive Word Repetition",
        description: `You're repeating words frequently throughout your resume. Using synonyms and varied language increases impact.`,
        severity: "medium",
      });
    } else if (totalRepetitions >= 10) {
      score -= 5;
      issues.push({
        title: "Word Repetition Detected",
        description: `Some words are repeated multiple times. Consider using synonyms for better variety.`,
        severity: "low",
      });
    }
  }

  // Enhanced bullet point analysis using resume-enhancer
  const bulletAnalysis = analyzeAllBullets(parsedResume.text);
  const totalBullets = bulletAnalysis.bullets.length;
  const quantifiedBullets = bulletAnalysis.quantifiedCount;
  const bulletAverageScore = bulletAnalysis.averageScore;
  const vagueLines = bulletAnalysis.vagueLines || [];

  // Find weak phrases in the resume
  const weakPhrases = findWeakPhrases(parsedResume.text);
  
  // Deduct points based on bullet quality
  if (totalBullets > 0) {
    const unquantifiedPercentage = ((totalBullets - quantifiedBullets) / totalBullets) * 100;
    if (unquantifiedPercentage > 50) {
      score -= 15;
      issues.push({
        title: "Most Bullet Points Lack Quantification",
        description: `${Math.round(unquantifiedPercentage)}% of your bullet points don't include numbers or metrics. Quantify your achievements to show impact.`,
        severity: "high",
      });
    } else if (unquantifiedPercentage > 30) {
      score -= 8;
      issues.push({
        title: "Some Bullet Points Need Quantification",
        description: `${Math.round(unquantifiedPercentage)}% of your bullet points could be improved with numbers or metrics.`,
        severity: "medium",
      });
    }

    // Deduct for weak verbs
    if (bulletAnalysis.weakVerbCount > 0) {
      const weakVerbPercentage = (bulletAnalysis.weakVerbCount / totalBullets) * 100;
      if (weakVerbPercentage > 30) {
        score -= 10;
        issues.push({
          title: "Weak Action Verbs Detected",
          description: `${bulletAnalysis.weakVerbCount} bullet points use weak verbs like "created", "responsible for", or "worked on". Replace with stronger action verbs for more impact.`,
          severity: "medium",
        });
      }
    }

    // Deduct for vague phrases
    if (bulletAnalysis.vaguePhraseCount > 0) {
      const vaguePercentage = (bulletAnalysis.vaguePhraseCount / totalBullets) * 100;
      if (vaguePercentage > 20) {
        score -= 8;
        issues.push({
          title: "Vague Phrases Need Specificity",
          description: `${bulletAnalysis.vaguePhraseCount} bullet points contain vague phrases. Replace with specific numbers, metrics, or concrete examples.`,
          severity: "medium",
        });
      }
    }

    // Deduct for overall bullet quality
    if (bulletAverageScore < 60) {
      score -= 10;
      issues.push({
        title: "Bullet Points Need Improvement",
        description: "Your bullet points could be more impactful. Focus on quantification, strong action verbs, and specific achievements.",
        severity: "high",
      });
    } else if (bulletAverageScore < 75) {
      score -= 5;
    }
  }

  // Add issues for specific weak phrases found
  if (weakPhrases.length > 0) {
    const weakVerbPhrases = weakPhrases.filter(p => p.type === "weak_verb").slice(0, 3);
    if (weakVerbPhrases.length > 0) {
      issues.push({
        title: "Replace Weak Verbs with Stronger Alternatives",
        description: `Consider replacing weak verbs like "${weakVerbPhrases[0].phrase}" with more impactful alternatives. See detailed suggestions in the report.`,
        severity: "low",
      });
    }
  }

  // Additional critical checks to prevent 100% scores
  // Even perfect resumes should have room for improvement
  if (score >= 95) {
    // Check if resume is truly exceptional
    const hasExcellentQuantification = totalBullets > 0 && (quantifiedBullets / totalBullets) >= 0.8;
    const hasNoWeakPhrases = weakPhrases.length === 0;
    const hasStrongKeywords = keywordMatchPercentage >= 70 || totalKeywords === 0;
    
    if (!hasExcellentQuantification || !hasNoWeakPhrases || !hasStrongKeywords) {
      // Deduct 3-5 points to show there's always room for improvement
      score -= 3;
    }
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));
  
  // Sort issues by severity
  issues.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
  
  return {
    atsScore: Math.round(score),
    keywordMatchPercentage: Math.round(keywordMatchPercentage * 10) / 10,
    detectedIssues: issues,
    rawFindings: {
      hasContactInfo,
      hasExperience,
      hasEducation,
      hasSkills,
      hasSummary,
      isImageOnly: parsedResume.isImageOnly,
      hasTables: parsedResume.hasTables,
      hasColumns: parsedResume.hasColumns,
      pageCount: parsedResume.pageCount,
      keywordMatches,
      totalKeywords,
      atsParseRate: Math.round(atsParseRate),
      wordRepetitions: topRepetitions,
      quantifiedBullets,
      totalBullets,
      bulletAverageScore,
      weakPhrases: weakPhrases.slice(0, 10).map(p => ({
        phrase: p.phrase,
        type: p.type,
        suggestion: p.suggestion,
      })),
      weakVerbCount: bulletAnalysis.weakVerbCount,
      vaguePhraseCount: bulletAnalysis.vaguePhraseCount,
      vagueLines: vagueLines.map(v => ({
        line: v.line,
        score: v.score,
        suggestions: v.suggestions,
      })),
      detectedBullets: bulletAnalysis.bullets.map(b => b.text), // Debug: show detected bullets
      unquantifiedBullets: bulletAnalysis.unquantifiedBullets || [], // Top 3 bullets needing quantification
    },
  };
}

