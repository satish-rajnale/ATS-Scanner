import type { Metadata } from "next";
import { SidebarAd, BottomBannerAd, InArticleAd } from "@/components/AdSense";
import { ArticleStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "How to Pass ATS Screening - Complete Guide 2024 | ATS Resume Tips",
  description: "Learn proven strategies to pass ATS screening and get your resume seen by recruiters. Expert tips on formatting, keywords, and ATS optimization. Free guide to improve your resume's ATS compatibility.",
  keywords: "how to pass ATS, ATS screening tips, ATS resume guide, pass applicant tracking system, ATS optimization guide, resume ATS tips",
  openGraph: {
    title: "How to Pass ATS Screening - Complete Guide 2024",
    description: "Learn proven strategies to pass ATS screening and get your resume seen by recruiters.",
    type: "article",
  },
};

export default function HowToPassATSPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <SidebarAd position="left" />
      <SidebarAd position="right" />
      <ArticleStructuredData
        title="How to Pass ATS Screening: A Complete Guide"
        description="Learn proven strategies to pass ATS screening and get your resume seen by recruiters."
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
          <h1 className="text-4xl font-bold text-black mb-6">How to Pass ATS Screening: A Complete Guide</h1>
          
          <p className="text-xl text-gray-700 mb-6">
            Getting past Applicant Tracking Systems (ATS) is the first hurdle in modern job applications. This comprehensive guide will teach you everything you need to know to optimize your resume for ATS compatibility.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">1. Use Simple, Clean Formatting</h2>
          
          <p className="text-gray-700 mb-4">
            ATS systems struggle with complex layouts. Here's what to avoid and what to use instead:
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="font-semibold text-red-900 mb-2">Avoid:</p>
            <ul className="list-disc list-inside text-red-800 space-y-1">
              <li>Tables and columns</li>
              <li>Graphics, charts, or images</li>
              <li>Headers and footers</li>
              <li>Text boxes or shapes</li>
              <li>Multiple columns</li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="font-semibold text-green-900 mb-2">Use Instead:</p>
            <ul className="list-disc list-inside text-green-800 space-y-1">
              <li>Standard fonts (Arial, Calibri, Times New Roman)</li>
              <li>Simple bullet points</li>
              <li>Clear section headers (Experience, Education, Skills)</li>
              <li>Consistent formatting throughout</li>
              <li>Standard margins (1 inch)</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">2. Include Essential Sections</h2>
          
          <p className="text-gray-700 mb-4">
            ATS systems look for specific sections. Make sure your resume includes:
          </p>

          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Contact Information:</strong> Name, phone, email, LinkedIn (optional)</li>
            <li><strong>Professional Summary or Objective:</strong> Brief overview of your qualifications</li>
            <li><strong>Work Experience:</strong> Company names, job titles, dates, and bullet points describing achievements</li>
            <li><strong>Education:</strong> Degree, institution, graduation date</li>
            <li><strong>Skills:</strong> Technical and soft skills relevant to the position</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">3. Optimize for Keywords</h2>
          
          <p className="text-gray-700 mb-4">
            Keyword matching is crucial for ATS ranking. Here's how to do it effectively:
          </p>

          <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-3">
            <li><strong>Analyze the job description:</strong> Identify key terms, skills, and qualifications mentioned</li>
            <li><strong>Use exact phrases:</strong> If the job requires "project management," use that exact phrase, not just "managed projects"</li>
            <li><strong>Include variations:</strong> Use both "JavaScript" and "JS" if relevant</li>
            <li><strong>Natural integration:</strong> Don't keyword stuff—integrate keywords naturally into your experience descriptions</li>
            <li><strong>Skills section:</strong> List important technical skills in a dedicated section</li>
          </ol>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">4. Use Standard Section Headers</h2>
          
          <p className="text-gray-700 mb-4">
            ATS systems recognize standard section names. Use these exact headers:
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <ul className="space-y-2 text-gray-700">
              <li>• Experience (or Work Experience)</li>
              <li>• Education</li>
              <li>• Skills (or Technical Skills)</li>
              <li>• Summary (or Professional Summary)</li>
              <li>• Certifications</li>
            </ul>
          </div>

          <p className="text-gray-700 mb-6">
            Avoid creative headers like "Where I've Been" or "My Journey"—ATS systems won't recognize them.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">5. Keep Your Resume Length Appropriate</h2>
          
          <p className="text-gray-700 mb-4">
            Resume length matters for ATS compatibility:
          </p>

          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Entry-level:</strong> 1 page is ideal</li>
            <li><strong>Mid-level:</strong> 1-2 pages maximum</li>
            <li><strong>Senior-level:</strong> 2 pages is acceptable, but keep it concise</li>
            <li><strong>Never exceed 2 pages</strong> unless you're in academia or have 15+ years of highly relevant experience</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">6. Save in the Right File Format</h2>
          
          <p className="text-gray-700 mb-4">
            File format can impact ATS parsing:
          </p>

          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>PDF:</strong> Best choice if it's a text-based PDF (not scanned or image-based)</li>
            <li><strong>DOCX:</strong> Also excellent, and some ATS systems prefer it</li>
            <li><strong>Avoid:</strong> DOC (older format), TXT (loses formatting), or image files</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">7. Use Action Verbs and Quantify Achievements</h2>
          
          <p className="text-gray-700 mb-4">
            While ATS systems focus on keywords, human recruiters will eventually see your resume. Use strong action verbs and quantify your achievements:
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="font-semibold mb-2">Examples:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• "Increased sales by 30% in Q2 2023"</li>
              <li>• "Managed a team of 12 developers"</li>
              <li>• "Reduced costs by $50,000 annually"</li>
              <li>• "Improved customer satisfaction scores from 3.2 to 4.7"</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">8. Test Your Resume</h2>
          
          <p className="text-gray-700 mb-4">
            Before submitting your resume, test it with an ATS scanner like ours. This will help you identify:
          </p>

          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Formatting issues that could break parsing</li>
            <li>Missing keywords from the job description</li>
            <li>Missing essential sections</li>
            <li>Overall ATS compatibility score</li>
          </ul>

          <p className="text-gray-700 mb-6">
            <a href="/" className="text-indigo-600 hover:text-indigo-800 font-semibold">Use our free ATS scanner</a> to check your resume before submitting applications.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Common ATS Mistakes to Avoid</h2>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
            <ul className="space-y-3 text-gray-700">
              <li>❌ Using images or graphics in your resume</li>
              <li>❌ Submitting a scanned PDF (image-based)</li>
              <li>❌ Using fancy fonts or decorative elements</li>
              <li>❌ Including headers/footers with page numbers</li>
              <li>❌ Using tables for layout</li>
              <li>❌ Missing contact information</li>
              <li>❌ Not tailoring keywords to each job</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Final Tips</h2>
          
          <p className="text-gray-700 mb-4">
            Remember that passing ATS is just the first step. Your resume also needs to impress human recruiters. Balance ATS optimization with readability and compelling content.
          </p>

          <p className="text-gray-700 mb-6">
            For more information, check out our guide on <a href="/resume-ats-score-explained" className="text-indigo-600 hover:text-indigo-800">understanding your ATS score</a> or <a href="/" className="text-indigo-600 hover:text-indigo-800">scan your resume</a> to see how it performs.
          </p>
        </article>
        <InArticleAd />
      </main>
      <BottomBannerAd />
    </div>
  );
}

