import { NextRequest, NextResponse } from "next/server";
import { parsePDF, parseDOCX } from "@/lib/resume-parser";
import { analyzeResume } from "@/lib/ats-scorer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF or DOCX file." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse resume based on file type
    let parsedResume;
    if (file.type === "application/pdf") {
      parsedResume = await parsePDF(buffer);
    } else {
      parsedResume = await parseDOCX(buffer);
    }

    // Analyze resume
    const analysis = analyzeResume(parsedResume, jobDescription || undefined);

    // Return only first 2 issues for preview
    const previewIssues = analysis.detectedIssues.slice(0, 2);

    return NextResponse.json({
      atsScore: analysis.atsScore,
      keywordMatchPercentage: analysis.keywordMatchPercentage,
      detectedIssues: analysis.detectedIssues,
      previewIssues,
      rawFindings: {
        ...analysis.rawFindings,
        resumeText: parsedResume.text, // Include full resume text
      },
    });
  } catch (error) {
    console.error("Error scanning resume:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process resume. Please ensure your file is a valid PDF or DOCX.",
      },
      { status: 500 }
    );
  }
}

