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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      <SidebarAd position="left" />
      <SidebarAd position="right" />
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-indigo-600">ATS Scanner</div>
            <div className="space-x-4">
              <a href="/ats-resume-scanner" className="text-gray-600 hover:text-indigo-600">About</a>
              <a href="/contact" className="text-gray-600 hover:text-indigo-600">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Free ATS Resume Scanner
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Get Your ATS Score in Seconds
          </p>
          <p className="text-gray-500">
            Upload your resume and get instant feedback on ATS compatibility
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (PDF or DOCX)
              </label>
              <input
                type="file"
                id="resume"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                disabled={loading}
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description (Optional)
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Paste the job description here to get keyword matching analysis..."
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Scanning Resume..." : "Scan My Resume"}
            </button>
          </form>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Instant Analysis</h3>
            <p className="text-gray-600 text-sm">
              Get your ATS score and keyword match percentage in seconds
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Actionable Insights</h3>
            <p className="text-gray-600 text-sm">
              Identify issues and get suggestions to improve your resume
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Privacy First</h3>
            <p className="text-gray-600 text-sm">
              Your resume is processed in memory and never stored
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Product</h4>
              <ul className="space-y-1 text-gray-600">
                <li><a href="/ats-resume-scanner" className="hover:text-indigo-600">About ATS Scanner</a></li>
                <li><a href="/how-to-pass-ats" className="hover:text-indigo-600">How to Pass ATS</a></li>
                <li><a href="/resume-ats-score-explained" className="hover:text-indigo-600">ATS Score Explained</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Legal</h4>
              <ul className="space-y-1 text-gray-600">
                <li><a href="/privacy-policy" className="hover:text-indigo-600">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-indigo-600">Terms of Service</a></li>
                <li><a href="/refund-policy" className="hover:text-indigo-600">Refund Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Support</h4>
              <ul className="space-y-1 text-gray-600">
                <li><a href="/contact" className="hover:text-indigo-600">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-600">
                © {new Date().getFullYear()} ATS Scanner. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

