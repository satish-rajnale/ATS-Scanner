"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarAd, BottomBannerAd } from "@/components/AdSense";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF or DOCX file");
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a resume file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim());
      }

      const response = await fetch("/api/scan-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to scan resume");
      }

      const data = await response.json();
      
      // Store results in sessionStorage for results page
      sessionStorage.setItem("scanResults", JSON.stringify(data));
      
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SidebarAd position="left" />
      <SidebarAd position="right" />
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-indigo-600">Resumaze</div>
            <div className="space-x-4">
              <a href="/ats-resume-scanner" className="text-gray-600 hover:text-indigo-600">About</a>
              <a href="/contact" className="text-gray-600 hover:text-indigo-600">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              {/* Dotted line leading to icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-purple-400"></div>
                  ))}
                </div>
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-sm text-purple-600 font-medium">Resume Scanner</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find Out if Your Resume is ATS-Optimized with Resumaze
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get your ATS compatibility score instantly with our free, AI-powered resume scanner.
              </p>

              {/* Upload Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="resume" className="sr-only">Upload Resume</label>
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                    disabled={loading}
                  />
                  {file && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !file}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? "Scanning Resume..." : "Upload Your Resume"}
                </button>
              </form>
            </div>

            {/* Right Visual Elements */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Person working on laptop illustration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl transform rotate-6 shadow-xl">
                  <div className="p-6">
                    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">RESUME GRADER</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full mb-2">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-8 w-1 bg-purple-300 rounded" style={{ height: `${20 + i * 10}px` }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resume mockup */}
                <div className="absolute top-32 left-0 w-56 bg-white rounded-lg shadow-2xl p-4 border border-gray-200 transform -rotate-3">
                  <div className="text-xs font-semibold text-gray-900 mb-2">LARRY LIANG</div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div>
                      <div className="font-semibold text-gray-800">Summary</div>
                      <div className="text-gray-500">Experienced professional...</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Education</div>
                      <div className="text-gray-500">Bachelor's Degree...</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Work Experience</div>
                      <div className="text-gray-500">Software Engineer...</div>
                    </div>
                  </div>
                </div>

                {/* Resume Checker interface */}
                <div className="absolute bottom-0 right-20 w-64 bg-white rounded-lg shadow-xl p-6 border border-gray-200">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-red-500 mb-1">28/100</div>
                    <div className="text-sm text-gray-600">ATS Score</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-900">
                      ⚠️ Oh, no! Your experience section lacks quantified achievements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Resume Mockup */}
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto">
                {/* Circular frame effect */}
                <div className="absolute inset-0 rounded-full border-8 border-green-100 transform scale-110"></div>
                <div className="relative bg-white rounded-lg shadow-2xl p-6 border border-gray-200">
                  <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 mb-3">VANESSA FORD</div>
                  <div className="space-y-3 text-xs text-gray-600">
                    <div>
                      <div className="font-semibold text-gray-800 mb-1">Contact Information</div>
                      <div className="text-gray-500">Email, Phone, Location</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 mb-1">Summary</div>
                      <div className="text-gray-500">Professional summary...</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 mb-1">Experience</div>
                      <div className="text-gray-500">Work history with achievements...</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 mb-1">Education</div>
                      <div className="text-gray-500">Educational background...</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 mb-1">Skills</div>
                      <div className="text-gray-500">Technical and soft skills...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Benefits Text */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Ensure your resume makes it past the Applicant Tracking Systems with the help of AI
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-700">
                    Avoid your resume being ignored due to a lack of relevant keywords
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-700">
                    Maximize your content's impact by optimizing for industry-specific keywords
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-700">
                    Upgrade your skills section to align perfectly with job requirements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              A free resume scanner that generates a bespoke ATS compatibility report based on your resume
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Upload your resume and you'll get a personalized report with an actionable tasklist. Here's the run-down of what you get.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Analysis</h3>
              <p className="text-gray-600">
                Get your ATS score and keyword match percentage in seconds with our AI-powered analysis.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Actionable Insights</h3>
              <p className="text-gray-600">
                Identify issues and get specific suggestions to improve your resume's ATS compatibility.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy First</h3>
              <p className="text-gray-600">
                Your resume is processed securely in memory and never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/ats-resume-scanner" className="hover:text-indigo-600">About Resumaze</a></li>
                <li><a href="/how-to-pass-ats" className="hover:text-indigo-600">How to Pass ATS</a></li>
                <li><a href="/resume-ats-score-explained" className="hover:text-indigo-600">ATS Score Explained</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/privacy-policy" className="hover:text-indigo-600">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-indigo-600">Terms of Service</a></li>
                <li><a href="/refund-policy" className="hover:text-indigo-600">Refund Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/contact" className="hover:text-indigo-600">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-600">
                © {new Date().getFullYear()} Resumaze. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <BottomBannerAd />
    </div>
  );
}
