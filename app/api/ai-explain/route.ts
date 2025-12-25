import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Initialize OpenAI client only if API key is available
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { atsScore, issues, rawFindings } = body;

    // Fallback explanation if OpenAI is not configured
    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json({
        explanation: generateFallbackExplanation(atsScore, issues, rawFindings),
      });
    }

    // Build prompt for OpenAI
    const prompt = buildPrompt(atsScore, issues, rawFindings);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful career advisor specializing in resume optimization for Applicant Tracking Systems (ATS). Provide clear, actionable advice.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const explanation = completion.choices[0]?.message?.content || generateFallbackExplanation(atsScore, issues, rawFindings);

      return NextResponse.json({ explanation });
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      // Return fallback on OpenAI error
      return NextResponse.json({
        explanation: generateFallbackExplanation(atsScore, issues, rawFindings),
      });
    }
  } catch (error) {
    console.error("Error generating AI explanation:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}

function buildPrompt(
  atsScore: number,
  issues: Array<{ title: string; description: string }>,
  rawFindings: any
): string {
  let prompt = `Analyze this resume's ATS compatibility and provide improvement suggestions.\n\n`;
  prompt += `ATS Score: ${atsScore}/100\n\n`;

  if (issues && issues.length > 0) {
    prompt += `Detected Issues:\n`;
    issues.forEach((issue, idx) => {
      prompt += `${idx + 1}. ${issue.title}: ${issue.description}\n`;
    });
    prompt += `\n`;
  }

  prompt += `Resume Analysis:\n`;
  prompt += `- Contact Information: ${rawFindings?.hasContactInfo ? "Present" : "Missing"}\n`;
  prompt += `- Work Experience: ${rawFindings?.hasExperience ? "Present" : "Missing"}\n`;
  prompt += `- Education: ${rawFindings?.hasEducation ? "Present" : "Missing"}\n`;
  prompt += `- Skills Section: ${rawFindings?.hasSkills ? "Present" : "Missing"}\n`;
  prompt += `- Keyword Match: ${rawFindings?.keywordMatches || 0}/${rawFindings?.totalKeywords || 0} keywords matched\n`;
  prompt += `- Formatting Issues: ${rawFindings?.hasTables ? "Tables detected" : "None"} ${rawFindings?.hasColumns ? ", Columns detected" : ""}\n`;
  prompt += `- Resume Length: ${rawFindings?.pageCount || 1} page(s)\n\n`;

  prompt += `Provide:\n`;
  prompt += `1. A brief explanation of why the resume received this ATS score\n`;
  prompt += `2. Top 3-5 actionable improvement suggestions\n`;
  prompt += `3. Specific keyword recommendations if keyword match is low\n`;
  prompt += `4. Formatting tips if issues were detected\n\n`;
  prompt += `Keep the response concise, practical, and easy to understand. Use bullet points where appropriate.`;

  return prompt;
}

function generateFallbackExplanation(
  atsScore: number,
  issues: Array<{ title: string; description: string }>,
  rawFindings: any
): string {
  let explanation = `Your resume received an ATS score of ${atsScore}/100.\n\n`;

  if (atsScore >= 80) {
    explanation += `Excellent! Your resume is well-optimized for ATS systems. It includes essential sections, has good formatting, and should pass most ATS screenings.\n\n`;
  } else if (atsScore >= 60) {
    explanation += `Your resume is mostly ATS-friendly but has room for improvement. Address the detected issues to increase your score and chances of passing ATS screening.\n\n`;
  } else {
    explanation += `Your resume needs significant improvements for ATS compatibility. Focus on addressing the detected issues to improve your chances of passing ATS screening.\n\n`;
  }

  if (issues && issues.length > 0) {
    explanation += `Key Issues to Address:\n`;
    issues.slice(0, 5).forEach((issue, idx) => {
      explanation += `${idx + 1}. ${issue.title}: ${issue.description}\n`;
    });
    explanation += `\n`;
  }

  explanation += `Improvement Suggestions:\n`;
  if (!rawFindings?.hasSkills) {
    explanation += `• Add a dedicated Skills section with relevant technical and soft skills\n`;
  }
  if (!rawFindings?.hasExperience) {
    explanation += `• Include a Work Experience section with job titles, companies, and dates\n`;
  }
  if (rawFindings?.hasTables) {
    explanation += `• Remove tables and use simple bullet points instead\n`;
  }
  if (rawFindings?.keywordMatches && rawFindings?.totalKeywords) {
    const matchPercent = (rawFindings.keywordMatches / rawFindings.totalKeywords) * 100;
    if (matchPercent < 50) {
      explanation += `• Improve keyword matching by adding more terms from the job description\n`;
    }
  }
  explanation += `• Use standard section headers (Experience, Education, Skills)\n`;
  explanation += `• Keep formatting simple and avoid complex layouts\n`;

  return explanation;
}

