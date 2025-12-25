import type { Metadata } from "next";
import { SidebarAd, BottomBannerAd } from "@/components/AdSense";

export const metadata: Metadata = {
  title: "Terms of Service - ATS Scanner",
  description: "Terms of service for ATS Scanner. Read our terms and conditions for using our resume scanning service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <SidebarAd position="left" />
      <SidebarAd position="right" />
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="text-xl font-bold text-indigo-600">ATS Scanner</a>
            <a href="/" className="text-gray-600 hover:text-indigo-600">Home</a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-black mb-6">Terms of Service</h1>
          
          <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Acceptance of Terms</h2>
          
          <p className="text-gray-700 mb-4">
            By accessing and using ATS Scanner, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Description of Service</h2>
          
          <p className="text-gray-700 mb-4">
            ATS Scanner is a web-based service that analyzes resumes for Applicant Tracking System (ATS) compatibility. We provide:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Free basic ATS score and keyword matching analysis</li>
            <li>Preview of detected issues (first 2 issues)</li>
            <li>Premium full reports with AI-powered explanations (paid feature)</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">User Responsibilities</h2>
          
          <p className="text-gray-700 mb-4">You agree to:</p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Upload only resumes that you own or have permission to analyze</li>
            <li>Not upload malicious files, viruses, or harmful content</li>
            <li>Use the service in compliance with all applicable laws</li>
            <li>Not attempt to reverse engineer or interfere with the service</li>
            <li>Not use the service for any illegal or unauthorized purpose</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Data Processing</h2>
          
          <p className="text-gray-700 mb-4">
            Your resume files are processed in memory and are not stored on our servers. By using our service, you acknowledge that:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Your resume data is processed temporarily for analysis purposes</li>
            <li>Data is deleted immediately after processing</li>
            <li>For premium features, resume text may be sent to OpenAI for AI analysis</li>
            <li>We are not responsible for data loss or corruption during processing</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Payment Terms</h2>
          
          <p className="text-gray-700 mb-4">
            Premium features require a one-time payment. By making a payment, you agree to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Pay the stated price for the full report</li>
            <li>Provide accurate payment information</li>
            <li>Understand that payments are processed through Stripe</li>
            <li>Accept our refund policy as stated</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Service Availability</h2>
          
          <p className="text-gray-700 mb-4">
            We strive to provide reliable service but do not guarantee:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Uninterrupted or error-free service</li>
            <li>100% accuracy of ATS scores or analysis</li>
            <li>Compatibility with all resume formats or ATS systems</li>
            <li>Availability at all times</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Intellectual Property</h2>
          
          <p className="text-gray-700 mb-4">
            The ATS Scanner service, including its design, functionality, and content, is owned by us and protected by intellectual property laws. You may not:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Copy, modify, or distribute our service</li>
            <li>Use our service to create competing products</li>
            <li>Remove or alter copyright notices</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Limitation of Liability</h2>
          
          <p className="text-gray-700 mb-4">
            To the maximum extent permitted by law:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>We provide the service "as is" without warranties</li>
            <li>We are not liable for any damages arising from use of the service</li>
            <li>We are not responsible for job application outcomes</li>
            <li>ATS scores are estimates and not guarantees of ATS compatibility</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Third-Party Services</h2>
          
          <p className="text-gray-700 mb-4">
            Our service uses third-party services:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Stripe:</strong> Payment processing (subject to Stripe's terms)</li>
            <li><strong>OpenAI:</strong> AI analysis (subject to OpenAI's terms)</li>
            <li><strong>Vercel:</strong> Hosting and infrastructure</li>
          </ul>
          <p className="text-gray-700 mb-6">
            We are not responsible for the actions or policies of these third-party services.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Modifications to Service</h2>
          
          <p className="text-gray-700 mb-4">
            We reserve the right to modify, suspend, or discontinue the service at any time without notice. We may also update these terms, and continued use constitutes acceptance of changes.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Termination</h2>
          
          <p className="text-gray-700 mb-4">
            We may terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these Terms of Service.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Governing Law</h2>
          
          <p className="text-gray-700 mb-4">
            These Terms of Service are governed by applicable laws. Any disputes will be resolved in accordance with applicable jurisdiction.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Contact</h2>
          
          <p className="text-gray-700 mb-6">
            For questions about these Terms of Service, please <a href="/contact" className="text-indigo-600 hover:text-indigo-800">contact us</a>.
          </p>
        </article>
      </main>
      <BottomBannerAd />
    </div>
  );
}

