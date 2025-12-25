import type { Metadata } from "next";
import { SidebarAd, BottomBannerAd, InArticleAd } from "@/components/AdSense";
import { ArticleStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Resume ATS Score Explained - What Your Score Means | ATS Score Guide",
  description: "Understand what your ATS score means and how to improve it. Learn about the factors that affect your resume's ATS compatibility score. Free guide to interpreting ATS scores.",
  keywords: "ATS score explained, resume ATS score, what is ATS score, ATS score meaning, how to improve ATS score, ATS compatibility score",
  openGraph: {
    title: "Resume ATS Score Explained - What Your Score Means",
    description: "Understand what your ATS score means and how to improve it.",
    type: "article",
  },
};

export default function ResumeATSScoreExplainedPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <SidebarAd position="left" />
      <SidebarAd position="right" />
      <ArticleStructuredData
        title="Resume ATS Score Explained"
        description="Understand what your ATS score means and how to improve it."
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
          <h1 className="text-4xl font-bold text-black mb-6">Resume ATS Score Explained</h1>
          
          <p className="text-xl text-gray-700 mb-6">
            Your ATS score is a numerical rating (0-100) that indicates how well your resume is optimized for Applicant Tracking Systems. Understanding what this score means and how it's calculated can help you improve your resume's chances of passing ATS screening.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">How ATS Scores Work</h2>
          
          <p className="text-gray-700 mb-4">
            ATS scores are calculated based on multiple factors that affect how well an Applicant Tracking System can parse, understand, and rank your resume. Our scoring system evaluates:
          </p>

          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Presence of essential resume sections</li>
            <li>Keyword matching with job descriptions</li>
            <li>Formatting compatibility</li>
            <li>Resume length and structure</li>
            <li>Absence of ATS-unfriendly elements</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Score Ranges and What They Mean</h2>
          
          <div className="space-y-6 mb-8">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
              <h3 className="text-2xl font-bold text-green-900 mb-2">80-100: Excellent</h3>
              <p className="text-green-800 mb-2">
                Your resume is highly optimized for ATS systems. It has all essential sections, good keyword matching, and clean formatting. You have a very high chance of passing ATS screening.
              </p>
              <p className="text-green-700 text-sm">
                <strong>Action:</strong> Your resume is ready to submit. Continue to tailor keywords for each specific job application.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
              <h3 className="text-2xl font-bold text-yellow-900 mb-2">60-79: Good</h3>
              <p className="text-yellow-800 mb-2">
                Your resume is mostly ATS-friendly but has some areas for improvement. You may pass ATS screening, but optimizing further will increase your chances and ranking.
              </p>
              <p className="text-yellow-700 text-sm">
                <strong>Action:</strong> Review detected issues and make recommended improvements. Focus on missing sections or low keyword matching.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
              <h3 className="text-2xl font-bold text-red-900 mb-2">0-59: Needs Improvement</h3>
              <p className="text-red-800 mb-2">
                Your resume has significant ATS compatibility issues. It may be rejected by ATS systems or ranked very low, reducing your chances of being seen by recruiters.
              </p>
              <p className="text-red-700 text-sm">
                <strong>Action:</strong> Address all detected issues. Restructure your resume with proper formatting, add missing sections, and improve keyword matching.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Factors That Affect Your ATS Score</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">1. Essential Sections (30 points)</h3>
          <p className="text-gray-700 mb-4">
            ATS systems expect certain sections. Missing sections significantly impact your score:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>Contact Information (-5 points if missing)</li>
            <li>Work Experience (-10 points if missing)</li>
            <li>Education (-5 points if missing)</li>
            <li>Skills (-10 points if missing)</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">2. Keyword Matching (40 points)</h3>
          <p className="text-gray-700 mb-4">
            When a job description is provided, keyword matching is crucial:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>90-100% match: Full points (40)</li>
            <li>70-89% match: 30 points</li>
            <li>50-69% match: 20 points</li>
            <li>30-49% match: 10 points</li>
            <li>Below 30%: 0 points</li>
          </ul>
          <p className="text-gray-700 mb-6">
            Without a job description, this factor is not penalized, but including relevant keywords still helps.
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">3. Formatting Issues (20 points)</h3>
          <p className="text-gray-700 mb-4">
            ATS systems struggle with certain formatting elements:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>Tables detected: -10 points</li>
            <li>Columns detected: -5 points</li>
            <li>Image-only resume: -20 points (automatic rejection risk)</li>
            <li>Complex headers/footers: -5 points</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">4. Resume Length (10 points)</h3>
          <p className="text-gray-700 mb-4">
            Appropriate length matters:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>1-2 pages: Full points (10)</li>
            <li>More than 2 pages: -5 points</li>
            <li>Less than 0.5 pages: -5 points</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Understanding Keyword Match Percentage</h2>
          
          <p className="text-gray-700 mb-4">
            The keyword match percentage shows how many important terms from the job description appear in your resume. This is calculated by:
          </p>

          <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-2">
            <li>Extracting key terms from the job description (skills, technologies, qualifications)</li>
            <li>Searching for these terms in your resume (case-insensitive, including variations)</li>
            <li>Calculating the percentage of matched keywords</li>
          </ol>

          <p className="text-gray-700 mb-6">
            A higher keyword match percentage means your resume is more relevant to the specific job, which improves your ATS ranking.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">How to Improve Your ATS Score</h2>
          
          <p className="text-gray-700 mb-4">
            Based on your score, here are targeted improvement strategies:
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">Quick Wins:</h3>
            <ul className="space-y-2 text-blue-800">
              <li>✓ Add missing sections (Skills, Education, etc.)</li>
              <li>✓ Remove tables and use simple formatting</li>
              <li>✓ Use standard section headers</li>
              <li>✓ Ensure your resume is 1-2 pages</li>
            </ul>
          </div>

          <div className="bg-indigo-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-indigo-900 mb-3">For Better Keyword Matching:</h3>
            <ul className="space-y-2 text-indigo-800">
              <li>✓ Analyze the job description carefully</li>
              <li>✓ Include exact phrases from the job posting</li>
              <li>✓ Add relevant skills to your Skills section</li>
              <li>✓ Integrate keywords naturally into experience descriptions</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Limitations of ATS Scores</h2>
          
          <p className="text-gray-700 mb-4">
            It's important to understand that:
          </p>

          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>ATS scores predict compatibility, not job fit or qualifications</li>
            <li>Different ATS systems may parse resumes slightly differently</li>
            <li>A high ATS score doesn't guarantee an interview—your resume must also impress humans</li>
            <li>Scores are most accurate when a job description is provided</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Get Your ATS Score</h2>
          
          <p className="text-gray-700 mb-6">
            Ready to see how your resume performs? <a href="/" className="text-indigo-600 hover:text-indigo-800 font-semibold">Upload your resume</a> and get your free ATS score in seconds. For detailed improvement suggestions, unlock the full report with AI-powered analysis.
          </p>

          <p className="text-gray-700 mb-6">
            Learn more about <a href="/how-to-pass-ats" className="text-indigo-600 hover:text-indigo-800">how to pass ATS screening</a> or <a href="/ats-resume-scanner" className="text-indigo-600 hover:text-indigo-800">how ATS scanners work</a>.
          </p>
        </article>
        <InArticleAd />
      </main>
      <BottomBannerAd />
    </div>
  );
}

