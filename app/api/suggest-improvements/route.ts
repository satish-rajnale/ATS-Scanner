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
    const { vagueLines } = body;

    if (!vagueLines || !Array.isArray(vagueLines) || vagueLines.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    // Fallback if OpenAI is not configured
    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json({
        suggestions: vagueLines.map((v: any) => ({
          original: v.line,
          improved: generateFallbackSuggestion(v.line),
        })),
      });
    }

    // Limit to 3 lines to save tokens
    const linesToImprove = vagueLines.slice(0, 3);

    try {
      const prompt = `You are a resume writing expert. Convert vague resume lines into quantified, impactful statements.

For each line below, provide ONE improved version that:
1. Includes specific numbers, percentages, or metrics
2. Uses strong action verbs
3. Shows measurable impact
4. Is realistic and professional

Format your response as JSON object: {"suggestions": [{"original": "...", "improved": "..."}]}

Lines to improve:
${linesToImprove.map((v: any, i: number) => `${i + 1}. ${v.line}`).join("\n")}

Return only the JSON object, no other text.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a resume writing expert. Convert vague resume lines into quantified, impactful statements. Respond with a JSON object containing a 'suggestions' array.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const responseText = completion.choices[0]?.message?.content || "{}";
      
      // Try to parse as JSON
      let suggestions;
      try {
        const parsed = JSON.parse(responseText);
        // Handle {suggestions: [...]} format
        if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
          suggestions = parsed.suggestions;
        } else if (Array.isArray(parsed)) {
          suggestions = parsed;
        } else {
          // Fallback: create suggestions from original lines
          suggestions = linesToImprove.map((v: any) => ({
            original: v.line,
            improved: generateFallbackSuggestion(v.line),
          }));
        }
      } catch {
        // If JSON parsing fails, use fallback
        suggestions = linesToImprove.map((v: any) => ({
          original: v.line,
          improved: generateFallbackSuggestion(v.line),
        }));
      }

      return NextResponse.json({ suggestions });
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      // Return fallback suggestions
      return NextResponse.json({
        suggestions: linesToImprove.map((v: any) => ({
          original: v.line,
          improved: generateFallbackSuggestion(v.line),
        })),
      });
    }
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}

function generateFallbackSuggestion(original: string): string {
  const lower = original.toLowerCase();
  
  // Simple pattern-based improvements
  if (lower.includes("created") && !/\d+/.test(original)) {
    return original.replace(/created/i, "Developed and launched").replace(/\.$/, " resulting in measurable improvements.");
  }
  
  if (lower.includes("responsible for") && !/\d+/.test(original)) {
    return original.replace(/responsible for/i, "Managed").replace(/\.$/, " achieving positive outcomes.");
  }
  
  if (lower.includes("worked on") && !/\d+/.test(original)) {
    return original.replace(/worked on/i, "Delivered").replace(/\.$/, " with measurable results.");
  }
  
  if (lower.includes("helped") && !/\d+/.test(original)) {
    return original.replace(/helped/i, "Enabled").replace(/\.$/, " leading to improved performance.");
  }
  
  // Generic improvement
  if (!/\d+/.test(original)) {
    return original.replace(/\.$/, " resulting in measurable improvements and positive impact.");
  }
  
  return original;
}

