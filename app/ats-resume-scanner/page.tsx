import type { Metadata } from "next";
import { SidebarAd, BottomBannerAd, InArticleAd } from "@/components/AdSense";
import { ArticleStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "ATS Resume Scanner - Free Applicant Tracking System Checker | Resume ATS Test",
  description: "Learn about ATS resume scanning and how our free tool helps you optimize your resume for applicant tracking systems. Get your ATS score instantly. Understand how ATS systems work and improve your resume compatibility.",
  keywords: "ATS resume scanner, applicant tracking system checker, free ATS test, resume ATS compatibility, ATS resume analyzer, how ATS works, resume optimization",
  openGraph: {
    title: "ATS Resume Scanner - Free Applicant Tracking System Checker",
    description: "Learn about ATS resume scanning and how our free tool helps you optimize your resume for applicant tracking systems.",
    type: "article",
  },
};

export default function ATSResumeScannerPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <SidebarAd position="left" />
      <SidebarAd position="right" />
      <ArticleStructuredData
        title="What is an ATS Resume Scanner?"
        description="Learn about ATS resume scanning and how our free tool helps you optimize your resume for applicant tracking systems."
        datePublished="2024-01-01"
      />
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="text-xl font-bold text-indigo-600">Resumaze</a>
            <a href="/" className="text-gray-600 hover:text-indigo-600">Home</a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-black mb-6">What is an ATS Resume Scanner?</h1>
          
          <p className="text-xl text-gray-700 mb-6">
            An Applicant Tracking System (ATS) resume scanner is a tool that evaluates how well your resume is optimized for automated recruitment software. These systems are used by over 98% of Fortune 500 companies to filter and rank job applications before they reach human recruiters.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Understanding Applicant Tracking Systems</h2>
          
          <p className="text-gray-700 mb-4">
            Applicant Tracking Systems are software platforms that help employers manage the hiring process. When you submit your resume through a job board or company website, it often goes through an ATS before a human ever sees it. These systems parse your resume, extract key information, and score it based on how well it matches the job requirements.
          </p>

          <p className="text-gray-700 mb-4">
            The problem? Most resumes aren't optimized for ATS compatibility. Common issues include:
          </p>

          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Complex formatting that ATS systems can't parse correctly</li>
            <li>Missing keywords from the job description</li>
            <li>Use of tables, columns, or graphics that break parsing</li>
            <li>Missing essential sections like Skills or Education</li>
            <li>Resumes that are too long or too short</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">How Our Free ATS Scanner Works</h2>
          
          <p className="text-gray-700 mb-4">
            Our ATS resume scanner analyzes your resume using the same principles that real ATS systems use. When you upload your resume, our tool:
          </p>

          <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Extracts text content</strong> from your PDF or DOCX file</li>
            <li><strong>Identifies key sections</strong> like Experience, Education, and Skills</li>
            <li><strong>Checks for formatting issues</strong> that could break ATS parsing</li>
            <li><strong>Matches keywords</strong> against the job description (if provided)</li>
            <li><strong>Calculates an ATS score</strong> from 0-100 based on compatibility factors</li>
          </ol>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Why ATS Optimization Matters</h2>
          
          <p className="text-gray-700 mb-4">
            Studies show that up to 75% of qualified candidates are rejected by ATS systems before their resumes reach hiring managers. This isn't because these candidates aren't qualified—it's because their resumes aren't formatted in a way that ATS systems can understand.
          </p>

          <p className="text-gray-700 mb-4">
            By optimizing your resume for ATS compatibility, you significantly increase your chances of:
          </p>

          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Passing the initial ATS screening</li>
            <li>Ranking higher in candidate rankings</li>
            <li>Getting your resume seen by human recruiters</li>
            <li>Receiving interview invitations</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Key Features of Our ATS Scanner</h2>
          
          <p className="text-gray-700 mb-4">
            Our free ATS resume scanner provides instant feedback on:
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <ul className="space-y-3 text-gray-700">
              <li><strong>ATS Score:</strong> A comprehensive score from 0-100 indicating overall ATS compatibility</li>
              <li><strong>Keyword Matching:</strong> Percentage of job description keywords found in your resume</li>
              <li><strong>Issue Detection:</strong> Identification of formatting problems, missing sections, and other red flags</li>
              <li><strong>Actionable Insights:</strong> Specific recommendations to improve your resume's ATS performance</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Privacy and Security</h2>
          
          <p className="text-gray-700 mb-4">
            We understand that your resume contains sensitive information. That's why our ATS scanner processes your resume entirely in memory—we never store your files on our servers. Your privacy is our priority, and your resume data is deleted immediately after processing.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Get Started Today</h2>
          
          <p className="text-gray-700 mb-6">
            Ready to optimize your resume for ATS systems? <a href="/" className="text-indigo-600 hover:text-indigo-800 font-semibold">Upload your resume</a> and get your free ATS score in seconds. No sign-up required, no credit card needed for the basic scan.
          </p>

          <p className="text-gray-700 mb-6">
            For more detailed insights, check out our guides on <a href="/how-to-pass-ats" className="text-indigo-600 hover:text-indigo-800">how to pass ATS screening</a> and <a href="/resume-ats-score-explained" className="text-indigo-600 hover:text-indigo-800">understanding your ATS score</a>.
          </p>
        </article>
        <InArticleAd />
      </main>
      <BottomBannerAd />
    </div>
  );
}

