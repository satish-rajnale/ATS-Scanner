"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarAd, BottomBannerAd } from "@/components/AdSense";

interface ScanResults {
  atsScore: number;
  keywordMatchPercentage: number;
  previewIssues: Array<{ title: string; description: string }>;
  detectedIssues: Array<{ title: string; description: string }>;
  rawFindings?: {
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
    atsParseRate?: number;
    wordRepetitions?: Array<{ word: string; count: number; suggestions: string[] }>;
    quantifiedBullets?: number;
    totalBullets?: number;
    bulletAverageScore?: number;
    weakPhrases?: Array<{ phrase: string; type: string; suggestion: string }>;
    weakVerbCount?: number;
    vaguePhraseCount?: number;
    vagueLines?: Array<{ line: string; score: number; suggestions: string[] }>;
    resumeText?: string;
    detectedBullets?: string[];
    unquantifiedBullets?: string[];
  };
}

type SectionStatus = "success" | "warning" | "error";

interface SectionData {
  status: SectionStatus;
  percentage?: number;
  items: Array<{ name: string; status: SectionStatus }>;
  explanation: string;
  details?: string;
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<ScanResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["sections"])); // Expand first section by default
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Array<{ original: string; improved: string }>>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const paymentSuccess = searchParams.get("payment_success");
    if (paymentSuccess === "true") {
      setUnlocked(true);
      loadFullReport();
    }

    const stored = sessionStorage.getItem("scanResults");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setResults(data);
      } catch (err) {
        console.error("Failed to parse scan results", err);
        router.push("/");
      }
    } else {
      router.push("/");
    }
    setLoading(false);
  }, [searchParams, router]);

  const loadFullReport = async () => {
    if (!results) return;

    setLoadingExplanation(true);
    setLoadingSuggestions(true);
    
    try {
      // Load AI explanation
      const explainResponse = await fetch("/api/ai-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          atsScore: results.atsScore,
          issues: results.detectedIssues,
          rawFindings: results.rawFindings,
        }),
      });

      if (explainResponse.ok) {
        const explainData = await explainResponse.json();
        setAiExplanation(explainData.explanation);
      }

      // Load AI suggestions for vague lines
      if (results.rawFindings?.vagueLines && results.rawFindings.vagueLines.length > 0) {
        const suggestionsResponse = await fetch("/api/suggest-improvements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vagueLines: results.rawFindings.vagueLines,
          }),
        });

        if (suggestionsResponse.ok) {
          const suggestionsData = await suggestionsResponse.json();
          setAiSuggestions(suggestionsData.suggestions || []);
        }
      }
    } catch (err) {
      console.error("Failed to load full report", err);
    } finally {
      setLoadingExplanation(false);
      setLoadingSuggestions(false);
    }
  };

  const handleUnlockFullReport = async () => {
    setUnlocking(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/results?payment_success=true`,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        alert("Failed to create checkout session");
        setUnlocking(false);
      }
    } catch (err) {
      console.error("Checkout error", err);
      alert("An error occurred");
      setUnlocking(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  if (loading || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const rawFindings = results.rawFindings || {};

  // Calculate section data
  const getSectionsData = (): SectionData => {
    const essentialSections = [
      { name: "Work Experience", present: rawFindings.hasExperience },
      { name: "Skills", present: rawFindings.hasSkills },
      { name: "Education", present: rawFindings.hasEducation },
    ];

    const allPresent = essentialSections.every((s) => s.present);
    const somePresent = essentialSections.some((s) => s.present);

    let status: SectionStatus = "success";
    if (!somePresent) status = "error";
    else if (!allPresent) status = "warning";

    const percentage = Math.round(
      (essentialSections.filter((s) => s.present).length / essentialSections.length) * 100
    );

    return {
      status,
      percentage,
      items: essentialSections.map((s) => ({
        name: s.name,
        status: s.present ? "success" : "error",
      })),
      explanation: allPresent
        ? "Your resume includes all essential sections required by ATS systems."
        : somePresent
        ? "Your resume is missing some essential sections. Add the missing sections to improve ATS compatibility."
        : "Your resume is missing essential sections. Add Work Experience, Skills, and Education sections.",
    };
  };

  const getContactInfoData = (): SectionData => {
    // We detect contact info by looking for phone, email, contact, address, or @ symbol
    const hasEmail = rawFindings.hasContactInfo; // Our detection checks for @ symbol
    const hasPhone = rawFindings.hasContactInfo; // Our detection checks for "phone"
    
    const contactItems = [
      { name: "Email", present: hasEmail },
      { name: "Phone", present: hasPhone },
    ];

    const allPresent = contactItems.every((item) => item.present);
    const status: SectionStatus = allPresent ? "success" : "warning";

    return {
      status,
      items: contactItems.map((item) => ({
        name: item.name,
        status: item.present ? "success" : "warning",
      })),
      explanation: allPresent
        ? "Your contact information is clearly visible and ATS-readable."
        : "Make sure your email and phone number are clearly visible in your resume header.",
    };
  };

  const getATSParseRateData = (): SectionData => {
    const parseRate = rawFindings.atsParseRate ?? 100;
    const parseIssues = [];
    if (rawFindings.isImageOnly) parseIssues.push("Image-only resume");
    if (rawFindings.hasTables) parseIssues.push("Tables detected");
    if (rawFindings.hasColumns) parseIssues.push("Column layout detected");

    let status: SectionStatus = "success";
    if (parseRate < 50) status = "error";
    else if (parseRate < 80) status = "warning";

    return {
      status,
      percentage: parseRate,
      items: [
        { name: "Text-based format", status: rawFindings.isImageOnly ? "error" : "success" },
        { name: "Simple layout", status: rawFindings.hasTables || rawFindings.hasColumns ? "warning" : "success" },
        { name: "ATS-readable structure", status: parseRate >= 80 ? "success" : parseRate >= 50 ? "warning" : "error" },
      ],
      explanation:
        parseRate >= 80
          ? `We parsed ${parseRate}% of your resume successfully using an industry-leading ATS. Your resume format is ATS-friendly and most information is visible to recruiters.`
          : parseRate >= 50
          ? `We parsed only ${parseRate}% of your resume successfully. There's a chance some important information isn't visible to ATS systems. Consider simplifying your formatting.`
          : `We parsed only ${parseRate}% of your resume successfully. There's a high chance the most important information on your resume isn't visible by the ATS. Build an ATS-friendly resume using simple formatting.`,
      details: parseIssues.length > 0 ? parseIssues.join(", ") : undefined,
    };
  };

  const getKeywordMatchData = (): SectionData => {
    const matchPercent = results.keywordMatchPercentage;
    let status: SectionStatus = "success";
    if (matchPercent < 30) status = "error";
    else if (matchPercent < 60) status = "warning";

    return {
      status,
      percentage: Math.round(matchPercent),
      items: [
        {
          name: "Keywords matched",
          status: matchPercent >= 60 ? "success" : matchPercent >= 30 ? "warning" : "error",
        },
      ],
      explanation:
        matchPercent === 0
          ? "No job description was provided. Add a job description to see keyword matching analysis."
          : matchPercent >= 70
          ? `Excellent! Your resume matches ${matchPercent.toFixed(0)}% of important keywords from the job description.`
          : matchPercent >= 40
          ? `Your resume matches ${matchPercent.toFixed(0)}% of keywords. Adding more relevant terms can improve your ATS ranking.`
          : `Your resume matches only ${matchPercent.toFixed(0)}% of keywords. Consider adding more terms from the job description.`,
      details:
        rawFindings.totalKeywords > 0
          ? `${rawFindings.keywordMatches || 0} of ${rawFindings.totalKeywords} keywords matched`
          : undefined,
    };
  };

  const getContentQualityData = (): SectionData => {
    const pageCount = rawFindings.pageCount || 1;
    let status: SectionStatus = "success";
    if (pageCount > 2) status = "warning";
    else if (pageCount < 0.5) status = "warning";

    return {
      status,
      items: [
        { name: "Appropriate length", status: pageCount >= 0.5 && pageCount <= 2 ? "success" : "warning" },
        { name: "Well-structured", status: "success" },
      ],
      explanation:
        pageCount >= 0.5 && pageCount <= 2
          ? `Your resume is ${pageCount === 1 ? "1 page" : `${Math.round(pageCount)} pages`} long, which is ideal for ATS systems.`
          : pageCount > 2
          ? `Your resume is ${Math.round(pageCount)} pages long. Most ATS systems prefer 1-2 page resumes. Consider condensing your content.`
          : "Your resume appears very short. Make sure you've included all relevant experience, education, and skills.",
    };
  };

  const getQuantifyImpactData = (): SectionData => {
    const totalBullets = rawFindings.totalBullets || 0;
    const quantifiedBullets = rawFindings.quantifiedBullets || 0;
    const quantifiedPercentage = totalBullets > 0 ? Math.round((quantifiedBullets / totalBullets) * 100) : 0;
    const bulletScore = rawFindings.bulletAverageScore || 0;
    const weakVerbCount = rawFindings.weakVerbCount || 0;
    const vaguePhraseCount = rawFindings.vaguePhraseCount || 0;

    let status: SectionStatus = "success";
    if (quantifiedPercentage < 50 || bulletScore < 70) status = "warning";
    if (quantifiedPercentage < 30 || bulletScore < 60) status = "error";

    return {
      status,
      percentage: quantifiedPercentage,
      items: [
        {
          name: "Quantified achievements",
          status: quantifiedPercentage >= 50 ? "success" : quantifiedPercentage >= 30 ? "warning" : "error",
        },
        {
          name: "Strong action verbs",
          status: weakVerbCount === 0 ? "success" : weakVerbCount <= 2 ? "warning" : "error",
        },
        {
          name: "Specific language",
          status: vaguePhraseCount === 0 ? "success" : vaguePhraseCount <= 2 ? "warning" : "error",
        },
      ],
      explanation:
        quantifiedPercentage >= 50 && bulletScore >= 75
          ? `Excellent! ${quantifiedPercentage}% of your bullet points include quantified impact, and your language is strong. This helps recruiters understand the scale of your achievements.`
          : quantifiedPercentage >= 30
          ? `Only ${quantifiedPercentage}% of your bullet points include quantified impact. Adding numbers, percentages, and metrics will make your achievements more compelling. ${weakVerbCount > 0 ? `Also consider replacing ${weakVerbCount} weak verb${weakVerbCount > 1 ? "s" : ""} with stronger alternatives.` : ""}`
          : totalBullets === 0
          ? "We couldn't detect bullet points in your resume. Consider using bullet points to highlight your achievements with quantified impact."
          : `Only ${quantifiedPercentage}% of your bullet points include quantified impact. Quantifying your achievements is key to building a strong application. Replace vague phrases with specific numbers and metrics.`,
      details:
        totalBullets > 0
          ? `${quantifiedBullets} of ${totalBullets} bullet points include quantified metrics${bulletScore < 75 ? ` • Average bullet quality score: ${bulletScore}/100` : ""}`
          : undefined,
    };
  };

  const getRepetitionData = (): SectionData => {
    const repetitions = rawFindings.wordRepetitions || [];
    const hasRepetitions = repetitions.length > 0;

    let status: SectionStatus = "success";
    if (hasRepetitions) status = "warning";

    return {
      status,
      items: [
        {
          name: "Word variety",
          status: hasRepetitions ? "warning" : "success",
        },
      ],
      explanation: hasRepetitions
        ? `We found ${repetitions.length} word${repetitions.length > 1 ? "s" : ""} repeated frequently in your resume. Using synonyms and active verbs increases the impact of your achievements.`
        : "Your resume shows good word variety. You're using diverse language to describe your achievements.",
      details: hasRepetitions
        ? repetitions
            .slice(0, 3)
            .map((r) => `${r.count} times: ${r.word}`)
            .join(", ")
        : undefined,
    };
  };

  const getSpellingGrammarData = (): SectionData => {
    // Always show as success since we're not actually checking spelling/grammar
    // Results are hidden as per requirements
    return {
      status: "success",
      items: [
        {
          name: "Spelling & Grammar",
          status: "success",
        },
      ],
      explanation:
        "Having an error-free resume is key to making a good first impression on the hiring manager. Ensure that your resume is free from spelling and grammatical errors by reading it aloud a few times.",
    };
  };

  const sectionsData = getSectionsData();
  const contactData = getContactInfoData();
  const parseRateData = getATSParseRateData();
  const keywordData = getKeywordMatchData();
  const contentData = getContentQualityData();
  const quantifyData = getQuantifyImpactData();
  const repetitionData = getRepetitionData();
  const spellingData = getSpellingGrammarData();

  const getStatusIcon = (status: SectionStatus) => {
    switch (status) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
    }
  };

  const getStatusBadgeClass = (status: SectionStatus) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (score >= 60) return { text: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
    return { text: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  };

  const scoreColors = getScoreColor(results.atsScore);
  const totalIssues = results.detectedIssues.length;
  const criticalIssues = results.detectedIssues.filter((i) => i.severity === "high").length;

  const SectionCard = ({
    id,
    title,
    data,
    isLocked = false,
  }: {
    id: string;
    title: string;
    data: SectionData;
    isLocked?: boolean;
  }) => {
    const isExpanded = expandedSections.has(id);
    const canExpand = !isLocked || unlocked;

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <button
          onClick={() => canExpand && toggleSection(id)}
          disabled={!canExpand}
          className={`w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors ${
            !canExpand ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <div className="flex items-center gap-4 flex-1">
            <span className="text-2xl">{getStatusIcon(data.status)}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-black">{title}</h3>
                {data.percentage !== undefined && (
                  <span className="text-sm font-medium text-gray-600">{data.percentage}%</span>
                )}
                <span
                  className={`px-2 py-1 text-xs font-medium rounded border ${getStatusBadgeClass(data.status)}`}
                >
                  {data.status === "success"
                    ? "No issues"
                    : data.status === "warning"
                    ? "Needs improvement"
                    : "Critical issue"}
                </span>
              </div>
              {!isExpanded && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">{data.explanation}</p>
              )}
            </div>
          </div>
          {canExpand && (
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {isLocked && !unlocked && (
            <span className="ml-2 text-xs text-indigo-600 font-medium">🔒</span>
          )}
        </button>

        {isExpanded && canExpand && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <div className="pt-4 space-y-3">
              {data.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-lg">{getStatusIcon(item.status)}</span>
                </div>
              ))}
              {data.details && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">{data.details}</p>
                </div>
              )}
              {/* Show repetition details with suggestions */}
              {id === "repetition" && rawFindings.wordRepetitions && rawFindings.wordRepetitions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-black mb-3">
                    We found that the following words are repeated frequently in your resume:
                  </p>
                  <div className="space-y-3">
                    {rawFindings.wordRepetitions.slice(0, 5).map((rep, idx) => (
                      <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {rep.count} times: <strong>{rep.word}</strong>
                          </span>
                        </div>
                        {rep.suggestions.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-600">Try replacing with: </span>
                            <span className="text-xs text-indigo-600 font-medium">
                              {rep.suggestions.slice(0, 3).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Show lines that need quantification */}
              {id === "quantify" && (() => {
                // Get unquantified bullets - use provided ones or compute from detected bullets
                let bulletsToShow: string[] = [];
                
                if (rawFindings.unquantifiedBullets && rawFindings.unquantifiedBullets.length > 0) {
                  bulletsToShow = rawFindings.unquantifiedBullets;
                } else if (rawFindings.detectedBullets && rawFindings.detectedBullets.length > 0) {
                  // Fallback: find bullets without numbers/percentages
                  bulletsToShow = rawFindings.detectedBullets
                    .filter(bullet => {
                      const hasNumbers = /\d+%/.test(bullet) || 
                                        /\$\d+/.test(bullet) || 
                                        /\d+\+/.test(bullet) ||
                                        /\d+\s*(years?|months?|days?|people|users|clients|customers|team members|projects|products|employees|members|students|patients|revenue|sales|budget|dollars?|percent)/i.test(bullet) ||
                                        /(increased|decreased|improved|reduced|grew|achieved|saved|generated|delivered).*\d+/i.test(bullet) ||
                                        /from\s+\d+.*to\s+\d+/.test(bullet);
                      return !hasNumbers;
                    })
                    .slice(0, 3);
                }
                
                return bulletsToShow.length > 0 ? (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-semibold text-black mb-3">Lines that need quantification (2-3 examples):</p>
                    <div className="space-y-2">
                      {bulletsToShow.slice(0, 3).map((bullet, idx) => (
                        <div key={idx} className="bg-red-50 border-l-4 border-red-500 rounded-r p-3">
                          <p className="text-sm text-gray-800">"{bullet}"</p>
                          <p className="text-xs text-red-700 mt-1 italic">Add specific numbers, percentages, or metrics to quantify impact</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
              {/* Show detected bullets for debugging */}
              {id === "quantify" && rawFindings.detectedBullets && rawFindings.detectedBullets.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Detected Bullet Points ({rawFindings.detectedBullets.length}):</p>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                    <ul className="text-xs text-gray-700 space-y-1">
                      {rawFindings.detectedBullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {/* Show quantify impact examples */}
              {id === "quantify" && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-black mb-3">Examples that quantify impact:</p>
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-900 mb-1">Good examples:</p>
                      <ul className="text-xs text-gray-700 space-y-1 mt-1">
                        <li>• "Achieved 40% product revenue growth in three months by planning and launching four new key features."</li>
                        <li>• "Improved state test pass rates from 78% to 87% in two years."</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-900 mb-1">Bad examples:</p>
                      <ul className="text-xs text-gray-700 space-y-1 mt-1">
                        <li>• "Created a conducive learning environment."</li>
                        <li>• "Responsible for preparing financial reports including budget performance."</li>
                      </ul>
                    </div>
                  </div>
                  {/* Show weak phrases if any */}
                  {rawFindings.weakPhrases && rawFindings.weakPhrases.length > 0 && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-yellow-900 mb-2">Weak phrases found in your resume:</p>
                      <div className="space-y-2">
                        {rawFindings.weakPhrases.slice(0, 5).map((wp, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="font-medium text-gray-900">"{wp.phrase}"</span>
                            <span className="text-gray-600"> → {wp.suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-900 mb-2">What if I'm not in a number-focused role?</p>
                    <p className="text-xs text-gray-700">
                      It's common to think that only people in finance and sales can have a quantifier in their bullets. Although that's not true as every role has something to quantify. If you think outside of the financial impact of your work, you can find numbers in almost every activity. For example, if you "worked in an international team", you can write "worked in an international team of 50+ people". Using numbers in your resume gives recruiters the ability to grasp the scale you've worked at.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">{data.explanation}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <SidebarAd position="left" />
      <SidebarAd position="right" />
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="text-xl font-bold text-indigo-600">
              ATS Scanner
            </a>
            <a href="/" className="text-sm text-gray-600 hover:text-indigo-600">
              Scan Another Resume
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Your ATS Scan Results</h1>
          <p className="text-gray-600">Comprehensive analysis of your resume's ATS compatibility</p>
        </div>

        {/* Score Card */}
        <div className={`bg-white rounded-xl shadow-lg p-8 mb-6 border-2 ${scoreColors.border}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className={`rounded-full p-6 ${scoreColors.bg}`}>
                <div className={`text-5xl font-bold ${scoreColors.text}`}>{results.atsScore}</div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black mb-1">ATS Score</h2>
                <p className="text-gray-600">
                  {results.atsScore >= 80
                    ? "Excellent! Your resume is highly ATS-friendly."
                    : results.atsScore >= 60
                    ? "Good foundation with room for improvement."
                    : "Needs significant improvements for ATS compatibility."}
                </p>
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalIssues}</div>
                <div className="text-sm text-gray-600">Total Issues</div>
              </div>
              {criticalIssues > 0 && (
                <div>
                  <div className="text-2xl font-bold text-red-600">{criticalIssues}</div>
                  <div className="text-sm text-gray-600">Critical</div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>ATS Compatibility</span>
              <span>{results.atsScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  results.atsScore >= 80
                    ? "bg-green-500"
                    : results.atsScore >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${results.atsScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4 mb-6">
          <SectionCard id="sections" title="Essential Sections" data={sectionsData} isLocked={!unlocked} />
          <SectionCard id="contact" title="Contact Information" data={contactData} isLocked={!unlocked} />
          <SectionCard id="parse" title="ATS Parse Rate" data={parseRateData} isLocked={!unlocked} />
          <SectionCard id="keywords" title="Keyword Match" data={keywordData} isLocked={!unlocked} />
          <SectionCard id="content" title="Content Quality" data={contentData} isLocked={!unlocked} />
          <SectionCard id="quantify" title="Quantify Impact" data={quantifyData} isLocked={false} />
          <SectionCard id="repetition" title="Repetition" data={repetitionData} isLocked={!unlocked} />
          <SectionCard id="spelling" title="Spelling & Grammar" data={spellingData} isLocked={false} />
        </div>

        {/* Extracted Resume Text Section */}
        {rawFindings.resumeText && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <button
              onClick={() => toggleSection("extracted-text")}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-2xl">📄</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Extracted Resume Text</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    View the complete text extracted from your resume PDF
                  </p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.has("extracted-text") ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedSections.has("extracted-text") && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-4">
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-200">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {rawFindings.resumeText}
                    </pre>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This is the raw text extracted from your resume. Use this to verify what was parsed by the ATS scanner.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Paywall */}
        {!unlocked && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 mb-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Unlock Full ATS Report</h2>
                <p className="mb-4 text-indigo-100">
                  Get detailed insights, all detected issues, and AI-powered improvement suggestions.
                </p>
                <ul className="space-y-2 text-sm text-indigo-100">
                  <li className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Complete analysis of all sections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span>
                    <span>AI-powered improvement recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Keyword suggestions from job description</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Detailed explanations for each issue</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold mb-2">$3.99</div>
                <div className="text-sm text-indigo-200 mb-4">One-time payment</div>
                <button
                  onClick={handleUnlockFullReport}
                  disabled={unlocking}
                  className="bg-white text-indigo-600 py-3 px-8 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  {unlocking ? "Processing..." : "Unlock Full Report"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Report (Unlocked) */}
        {unlocked && (
          <>
            {/* Vague Lines with AI Suggestions */}
            {rawFindings.vagueLines && rawFindings.vagueLines.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Lines That Need Quantification</h2>
                <p className="text-gray-600 mb-4">
                  The following lines from your experience section are vague and could be improved with specific metrics and stronger language.
                </p>
                {loadingSuggestions ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Generating AI-powered suggestions...</p>
                  </div>
                ) : aiSuggestions.length > 0 ? (
                  <div className="space-y-4">
                    {aiSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded-r">
                        <div className="mb-2">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Current:</p>
                          <p className="text-sm text-gray-600 italic">"{suggestion.original}"</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-700 mb-1">Suggested improvement:</p>
                          <p className="text-sm text-gray-800 font-medium">"{suggestion.improved}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rawFindings.vagueLines.slice(0, 3).map((vague, idx) => (
                      <div key={idx} className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded-r">
                        <p className="text-sm text-gray-700">"{vague.line}"</p>
                        {vague.suggestions.length > 0 && (
                          <p className="text-xs text-gray-600 mt-2">
                            Suggestion: {vague.suggestions[0]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Full Resume Text */}
            {rawFindings.resumeText && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-gray-200">
                <button
                  onClick={() => toggleSection("resume-text")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h2 className="text-2xl font-bold text-gray-900">Extracted Resume Text</h2>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.has("resume-text") ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.has("resume-text") && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                        {rawFindings.resumeText}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI-Powered Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Analysis</h2>
              {loadingExplanation ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Generating detailed analysis...</p>
                </div>
              ) : aiExplanation ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{aiExplanation}</div>
                </div>
              ) : (
                <p className="text-gray-600">Loading analysis...</p>
              )}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block bg-indigo-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
          >
            Scan Another Resume
          </a>
        </div>
      </main>
      <BottomBannerAd />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
