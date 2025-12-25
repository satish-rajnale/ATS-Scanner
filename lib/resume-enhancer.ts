/**
 * Enhanced resume analysis for professional language, weak verbs, and impact quantification
 */

export interface WeakPhrase {
  phrase: string;
  type: "weak_verb" | "vague_phrase" | "passive_voice" | "cliche";
  suggestion: string;
  example?: string;
}

export interface BulletAnalysis {
  text: string;
  isQuantified: boolean;
  hasWeakVerb: boolean;
  hasVaguePhrase: boolean;
  suggestions: string[];
  score: number; // 0-100 for this bullet
}

// Weak action verbs that should be replaced with stronger alternatives
const WEAK_VERBS: Record<string, string[]> = {
  created: ["developed", "built", "established", "founded", "designed", "launched"],
  responsible: ["managed", "led", "oversaw", "directed", "coordinated"],
  worked: ["collaborated", "partnered", "contributed", "delivered", "executed"],
  helped: ["supported", "enabled", "facilitated", "drove", "achieved"],
  did: ["executed", "performed", "delivered", "accomplished", "completed"],
  made: ["produced", "generated", "created", "delivered", "achieved"],
  got: ["earned", "achieved", "secured", "obtained", "attained"],
  used: ["leveraged", "utilized", "implemented", "applied", "employed"],
  tried: ["attempted", "pursued", "sought", "aimed"],
  wanted: ["targeted", "aimed", "sought", "pursued"],
};

// Vague phrases that need quantification or specificity
const VAGUE_PHRASES: Record<string, string> = {
  "a lot": "specific number or percentage",
  "many": "specific number",
  "several": "specific number",
  "various": "specific examples",
  "some": "specific number",
  "few": "specific number",
  "significant": "specific metric or percentage",
  "substantial": "specific metric or percentage",
  "large": "specific number or size",
  "small": "specific number or size",
  "improved": "improved by X% or to X",
  "increased": "increased by X% or to X",
  "decreased": "decreased by X% or to X",
  "reduced": "reduced by X% or to X",
  "responsible for": "specific action verb + metric",
  "worked on": "specific action verb + outcome",
  "helped with": "specific action verb + impact",
  "involved in": "specific action verb + result",
  "participated in": "specific action verb + achievement",
};

// Cliche phrases to avoid
const CLICHE_PHRASES = [
  "think outside the box",
  "team player",
  "hard worker",
  "detail-oriented",
  "self-motivated",
  "results-driven",
  "proven track record",
  "go-getter",
  "people person",
  "fast learner",
];

/**
 * Analyze a bullet point for quality and impact
 */
export function analyzeBulletPoint(bullet: string): BulletAnalysis {
  const text = bullet.trim();
  const lowerText = text.toLowerCase();
  
  let isQuantified = false;
  let hasWeakVerb = false;
  let hasVaguePhrase = false;
  const suggestions: string[] = [];
  let score = 100;

  // Check for quantification - more lenient detection
  const hasNumbers = 
    // Percentages
    /\d+%/.test(text) || 
    // Dollar amounts
    /\$\d+/.test(text) || 
    // Numbers with + (e.g., "50+", "100+")
    /\d+\+/.test(text) ||
    // Numbers with units (expanded list)
    /\d+\s*(years?|months?|days?|weeks?|hours?|people|users|clients|customers|team members|projects|products|employees|members|students|patients|revenue|sales|budget|dollars?|percent)/i.test(text) ||
    // Action verbs followed by numbers (expanded list)
    /(increased|decreased|improved|reduced|grew|achieved|saved|generated|delivered|raised|lowered|boosted|enhanced|optimized|streamlined|cut|doubled|tripled|quadrupled).*\d+/i.test(text) ||
    // "from X to Y" patterns
    /from\s+\d+.*to\s+\d+/.test(text) ||
    // Standalone numbers that are likely metrics (2+ digits, not dates or years)
    (/\b\d{2,}\b/.test(text) && !/\b(19|20)\d{2}\b/.test(text) && !/\d{1,2}\/\d{1,2}\/\d{2,4}/.test(text));

  isQuantified = hasNumbers;
  if (!isQuantified) {
    score -= 30; // Major deduction for lack of quantification
  }

  // Check for weak verbs
  for (const [weakVerb, alternatives] of Object.entries(WEAK_VERBS)) {
    const regex = new RegExp(`\\b${weakVerb}\\b`, "i");
    if (regex.test(lowerText)) {
      hasWeakVerb = true;
      score -= 15;
      suggestions.push(`Replace "${weakVerb}" with stronger verbs like: ${alternatives.slice(0, 3).join(", ")}`);
      break; // Only flag the first weak verb
    }
  }

  // Check for vague phrases
  for (const [vaguePhrase, suggestion] of Object.entries(VAGUE_PHRASES)) {
    const regex = new RegExp(`\\b${vaguePhrase.replace(/\s+/g, "\\s+")}\\b`, "i");
    if (regex.test(lowerText)) {
      hasVaguePhrase = true;
      score -= 20;
      suggestions.push(`Replace "${vaguePhrase}" with ${suggestion}`);
      break;
    }
  }

  // Check for cliches
  for (const cliche of CLICHE_PHRASES) {
    if (lowerText.includes(cliche)) {
      score -= 10;
      suggestions.push(`Avoid cliche phrase: "${cliche}". Use specific examples instead.`);
      break;
    }
  }

  // Check for passive voice indicators
  if (/\b(was|were|been|being)\s+\w+ed\b/i.test(text)) {
    score -= 10;
    suggestions.push("Use active voice instead of passive voice for stronger impact.");
  }

  // Check if bullet starts with weak structure
  if (/^(responsible|worked|helped|involved|participated)/i.test(text)) {
    score -= 15;
    suggestions.push("Start with a strong action verb instead of 'responsible for' or 'worked on'.");
  }

  // Bonus points for strong action verbs
  const strongVerbs = [
    "achieved", "delivered", "executed", "implemented", "launched", "optimized",
    "transformed", "drove", "generated", "increased", "improved", "reduced",
    "streamlined", "enhanced", "established", "built", "developed", "managed",
    "led", "directed", "oversaw", "coordinated", "facilitated", "enabled"
  ];
  
  const hasStrongVerb = strongVerbs.some(verb => 
    new RegExp(`\\b${verb}\\b`, "i").test(lowerText)
  );
  
  if (hasStrongVerb && isQuantified) {
    score += 5; // Bonus for strong verb + quantification
  }

  return {
    text,
    isQuantified,
    hasWeakVerb,
    hasVaguePhrase,
    suggestions,
    score: Math.max(0, Math.min(100, score)),
  };
}

/**
 * Find weak phrases in resume text
 */
export function findWeakPhrases(text: string): WeakPhrase[] {
  const weakPhrases: WeakPhrase[] = [];
  const lowerText = text.toLowerCase();
  const sentences = text.split(/[.!?]\s+/);

  sentences.forEach((sentence) => {
    const lowerSentence = sentence.toLowerCase().trim();
    
    // Check for weak verbs
    for (const [weakVerb, alternatives] of Object.entries(WEAK_VERBS)) {
      const regex = new RegExp(`\\b${weakVerb}\\b`, "i");
      if (regex.test(lowerSentence)) {
        weakPhrases.push({
          phrase: weakVerb,
          type: "weak_verb",
          suggestion: `Use stronger verbs like: ${alternatives.slice(0, 3).join(", ")}`,
          example: sentence.trim(),
        });
        break;
      }
    }

    // Check for vague phrases
    for (const [vaguePhrase, suggestion] of Object.entries(VAGUE_PHRASES)) {
      const regex = new RegExp(`\\b${vaguePhrase.replace(/\s+/g, "\\s+")}\\b`, "i");
      if (regex.test(lowerSentence)) {
        weakPhrases.push({
          phrase: vaguePhrase,
          type: "vague_phrase",
          suggestion: `Replace with ${suggestion}`,
          example: sentence.trim(),
        });
        break;
      }
    }

    // Check for cliches
    for (const cliche of CLICHE_PHRASES) {
      if (lowerSentence.includes(cliche)) {
        weakPhrases.push({
          phrase: cliche,
          type: "cliche",
          suggestion: "Use specific examples and achievements instead",
          example: sentence.trim(),
        });
        break;
      }
    }
  });

  return weakPhrases.slice(0, 10); // Limit to top 10
}

/**
 * Extract experience sections from resume
 */
export function extractExperienceSections(text: string): Array<{ lines: string[]; sectionText: string }> {
  const experienceSections: Array<{ lines: string[]; sectionText: string }> = [];
  
  // Find experience section (case insensitive)
  const experienceRegex = /(?:experience|work experience|employment|professional experience|work history)[\s\S]*?(?=(?:education|skills|projects|certifications|summary|objective|$))/i;
  const match = text.match(experienceRegex);
  
  if (match) {
    const experienceText = match[0];
    const lines = experienceText.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);
    
    // Group lines by job (look for date patterns, company names, etc.)
    let currentSection: string[] = [];
    let currentSectionText = "";
    
    lines.forEach((line, index) => {
      // Check if this line is a job header (contains dates, company, or title)
      const isJobHeader = /\d{4}|\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(line) ||
                          line.length < 80 && /(inc|llc|corp|company|university|college)/i.test(line);
      
      if (isJobHeader && currentSection.length > 0) {
        // Save previous section
        experienceSections.push({
          lines: currentSection,
          sectionText: currentSectionText,
        });
        currentSection = [];
        currentSectionText = "";
      }
      
      currentSection.push(line);
      currentSectionText += line + "\n";
    });
    
    // Add last section
    if (currentSection.length > 0) {
      experienceSections.push({
        lines: currentSection,
        sectionText: currentSectionText,
      });
    }
  }
  
  return experienceSections;
}

/**
 * Analyze all bullet points in resume (improved detection)
 */
export function analyzeAllBullets(text: string): {
  bullets: BulletAnalysis[];
  averageScore: number;
  quantifiedCount: number;
  weakVerbCount: number;
  vaguePhraseCount: number;
  vagueLines: Array<{ line: string; score: number; suggestions: string[] }>;
  unquantifiedBullets: string[]; // Bullets that need quantification
} {
  const bullets: string[] = [];
  const vagueLines: Array<{ line: string; score: number; suggestions: string[] }> = [];
  
  // Method 1: Standard bullet points - improved regex to catch ALL bullet types
  // Include: • (U+2022), ● (U+25CF), ◦ (U+25E6), ○ (U+25CB), ▪ (U+25AA), ▫ (U+25AB), ■ (U+25A0), □ (U+25A1), -, *, etc.
  const bulletChars = /[•●◦○▪▫■□\-\*]/;
  const lines = text.split(/\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    
    // Check for bullet markers at start - be more flexible with spacing
    // Match: bullet char followed by space(s), or numbered list
    const bulletPattern = /^[•●◦○▪▫■□\-\*]\s*/;
    const numberedPattern = /^\d+\.\s+/;
    
    if (bulletPattern.test(trimmed) || numberedPattern.test(trimmed)) {
      // Remove bullet character and any leading whitespace
      let bulletText = trimmed
        .replace(/^[•●◦○▪▫■□\-\*]\s*/, "")
        .replace(/^\d+\.\s+/, "")
        .trim();
      
      // Also handle cases where bullet might be followed by tab or multiple spaces
      bulletText = bulletText.replace(/^[\s\t]+/, "").trim();
      
      // More lenient length requirement - some bullets might be shorter
      if (bulletText.length > 5 && bulletText.length < 300) {
        bullets.push(bulletText);
      }
    }
  });
  
  // Also try multiline regex as fallback - include all bullet characters, be flexible with spacing
  const bulletRegex = /(?:^|\n)(?:[•●◦○▪▫■□\-\*]|\d+\.)\s*([^\n]+)/gm;
  let match;
  while ((match = bulletRegex.exec(text)) !== null) {
    const bullet = match[1].trim();
    if (bullet.length > 5 && bullet.length < 300 && !bullets.some(b => b.toLowerCase() === bullet.toLowerCase())) {
      bullets.push(bullet);
    }
  }
  
  // Additional pass: look for lines that start with bullet but might have been missed
  // This handles cases where PDF extraction might have weird spacing
  lines.forEach((line) => {
    const trimmed = line.trim();
    // Check if line starts with any bullet character (even without space after)
    if (/^[•●◦○▪▫■□\-\*]/.test(trimmed)) {
      const bulletText = trimmed.replace(/^[•●◦○▪▫■□\-\*]\s*/, "").trim();
      if (bulletText.length > 5 && bulletText.length < 300 && !bullets.some(b => b.toLowerCase() === bulletText.toLowerCase())) {
        bullets.push(bulletText);
      }
    }
  });

  // Method 2: Lines in experience sections that look like bullets
  // First, check if lines in experience section start with bullet characters (might have been missed)
  const experienceSections = extractExperienceSections(text);
  experienceSections.forEach((section) => {
    section.lines.forEach((line) => {
      const trimmed = line.trim();
      
      // Check if line starts with bullet character (even if missed in Method 1)
      if (/^[•●◦○▪▫■□\-\*]/.test(trimmed)) {
        const bulletText = trimmed.replace(/^[•●◦○▪▫■□\-\*]\s*/, "").trim();
        if (bulletText.length > 10 && bulletText.length < 300 && !bullets.some(b => b.toLowerCase() === bulletText.toLowerCase())) {
          bullets.push(bulletText);
        }
      }
    });
  });
  
  // Method 2b: Lines in experience sections that look like bullets (action verbs)
  experienceSections.forEach((section) => {
    section.lines.forEach((line) => {
      const trimmed = line.trim();
      
      // Skip headers, dates, and very short/long lines
      if (
        trimmed.length > 15 &&
        trimmed.length < 250 &&
        !trimmed.match(/^(experience|education|skills|summary|objective|january|february|march|april|may|june|july|august|september|october|november|december|\d{4})/i) &&
        !trimmed.match(/^\d{1,2}\/\d{1,2}\/\d{2,4}/) && // Skip dates
        !trimmed.match(/^[A-Z][a-z]+\s+\d{4}/) && // Skip "Month Year"
        !trimmed.match(/^[•●◦○▪▫■□\-\*]/) && // Skip if already detected as bullet
        !bullets.some((b) => b.toLowerCase() === trimmed.toLowerCase())
      ) {
        // Check if it starts with an action verb (weak or strong) - expanded list
        const actionVerbPattern = /^(created|developed|managed|led|improved|increased|achieved|delivered|executed|implemented|launched|responsible|worked|helped|involved|participated|designed|built|established|coordinated|facilitated|enabled|supported|contributed|performed|completed|accomplished|generated|produced|optimized|streamlined|enhanced|transformed|drove|saved|reduced|decreased|grew|secured|obtained|attained|earned|leveraged|utilized|applied|employed|attempted|pursued|sought|aimed|targeted|maintained|supervised|organized|planned|initiated|collaborated|researched|analyzed|evaluated|monitored|trained|mentored|coached|guided|assisted|prepared|presented|communicated|negotiated|resolved|solved|automated|integrated|configured|deployed|tested|debugged|documented|wrote|authored|edited|reviewed|updated|operated|administered)/i;
        
        if (actionVerbPattern.test(trimmed)) {
          bullets.push(trimmed);
        } else {
          // Check if it's a vague line that needs improvement
          const analysis = analyzeBulletPoint(trimmed);
          if (analysis.score < 70 && !analysis.isQuantified) {
            vagueLines.push({
              line: trimmed,
              score: analysis.score,
              suggestions: analysis.suggestions,
            });
          }
        }
      }
    });
  });

  // Method 3: Lines that look like achievements (even without bullets) - more aggressive
  const allLines = text.split(/\n/).map(l => l.trim()).filter(l => l.length > 15 && l.length < 250);
  allLines.forEach((line) => {
    if (
      !line.match(/^(experience|education|skills|summary|objective|contact|phone|email|address)/i) &&
      !line.match(/^\d{1,2}\/\d{1,2}\/\d{2,4}/) && // Skip dates
      !line.match(/^[A-Z][a-z]+\s+\d{4}/) && // Skip "Month Year"
      !line.match(/^(present|current|january|february|march|april|may|june|july|august|september|october|november|december)/i) &&
      !bullets.some((b) => b.toLowerCase() === line.toLowerCase()) &&
      !vagueLines.some((v) => v.line.toLowerCase() === line.toLowerCase())
    ) {
      // Check for weak verbs or vague phrases
      const lowerLine = line.toLowerCase();
      const hasWeakVerb = Object.keys(WEAK_VERBS).some(verb => 
        new RegExp(`^${verb}\\b`, "i").test(lowerLine) || new RegExp(`\\b${verb}\\b`, "i").test(lowerLine)
      );
      const hasVaguePhrase = Object.keys(VAGUE_PHRASES).some(phrase =>
        new RegExp(`\\b${phrase.replace(/\s+/g, "\\s+")}\\b`, "i").test(lowerLine)
      );
      
      // Also check if line starts with action verb (even if not in our list)
      const startsWithActionVerb = /^[a-z]+ed\s/i.test(lowerLine) || /^[a-z]+ing\s/i.test(lowerLine);
      
      if ((hasWeakVerb || hasVaguePhrase || startsWithActionVerb) && !/\d+/.test(line)) {
        const analysis = analyzeBulletPoint(line);
        if (analysis.score < 70) {
          vagueLines.push({
            line,
            score: analysis.score,
            suggestions: analysis.suggestions,
          });
        } else if (startsWithActionVerb && !bullets.some((b) => b.toLowerCase() === line.toLowerCase())) {
          // If it looks like a bullet but wasn't caught, add it
          bullets.push(line);
        }
      }
    }
  });

  const analyses = bullets.map(analyzeBulletPoint);
  
  const quantifiedCount = analyses.filter(a => a.isQuantified).length;
  const weakVerbCount = analyses.filter(a => a.hasWeakVerb).length;
  const vaguePhraseCount = analyses.filter(a => a.hasVaguePhrase).length;
  const averageScore = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length)
    : 0;

  // Get unquantified bullets (top 3 worst scoring ones)
  const unquantifiedBullets = analyses
    .filter(a => !a.isQuantified)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(a => a.text);

  // Sort vague lines by score (worst first) and limit to top 5
  vagueLines.sort((a, b) => a.score - b.score);

  return {
    bullets: analyses,
    averageScore,
    quantifiedCount,
    weakVerbCount,
    vaguePhraseCount,
    vagueLines: vagueLines.slice(0, 5),
    unquantifiedBullets,
  };
}
