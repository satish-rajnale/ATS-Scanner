import type { Metadata } from "next";
import { SidebarAd, BottomBannerAd } from "@/components/AdSense";

export const metadata: Metadata = {
  title: "Privacy Policy - ATS Scanner",
  description: "Privacy policy for ATS Scanner. Learn how we handle your resume data and protect your privacy.",
};

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold text-black mb-6">Privacy Policy</h1>
          
          <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Introduction</h2>
          
          <p className="text-gray-700 mb-4">
            At ATS Scanner, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our resume scanning service.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Information We Collect</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">Resume Files</h3>
          <p className="text-gray-700 mb-4">
            When you upload a resume to our service, we process the file to extract text content and analyze it for ATS compatibility. <strong>We do not store your resume files on our servers.</strong> All processing is done in memory, and your resume data is deleted immediately after processing is complete.
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">Job Descriptions</h3>
          <p className="text-gray-700 mb-4">
            If you provide a job description, it is used solely for keyword matching analysis. Job descriptions are also processed in memory and not stored.
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">Payment Information</h3>
          <p className="text-gray-700 mb-4">
            When you make a payment, your payment information is processed by Stripe, our payment processor. We do not store or have access to your full credit card details. Stripe handles all payment data in accordance with their privacy policy and PCI DSS compliance standards.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">How We Use Your Information</h2>
          
          <p className="text-gray-700 mb-4">We use the information you provide to:</p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Analyze your resume for ATS compatibility</li>
            <li>Calculate ATS scores and keyword matching</li>
            <li>Generate improvement suggestions</li>
            <li>Process payments for premium features</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Data Storage and Retention</h2>
          
          <p className="text-gray-700 mb-4">
            <strong>We do not store your resume files or job descriptions.</strong> All processing occurs in memory on our servers, and data is immediately deleted after processing completes. This means:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Your resume is never saved to disk</li>
            <li>Your resume is not stored in any database</li>
            <li>Your resume is not accessible after your session ends</li>
            <li>We cannot retrieve or view your resume after processing</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Third-Party Services</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">Stripe</h3>
          <p className="text-gray-700 mb-4">
            We use Stripe to process payments. When you make a payment, you are redirected to Stripe's secure payment page. Stripe's privacy policy applies to payment transactions.
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">OpenAI</h3>
          <p className="text-gray-700 mb-4">
            For premium features, we use OpenAI's API to generate AI-powered explanations. When you unlock the full report, your resume text and analysis results are sent to OpenAI for processing. OpenAI's data usage policies apply. We do not store any data sent to OpenAI.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Cookies and Tracking</h2>
          
          <p className="text-gray-700 mb-4">
            We use minimal cookies and tracking technologies:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Session storage: Used temporarily to pass scan results to the results page</li>
            <li>No persistent cookies for tracking</li>
            <li>No third-party analytics or advertising trackers</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Your Rights</h2>
          
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Use our service without providing personal information (no account required)</li>
            <li>Upload resumes anonymously</li>
            <li>Request information about data processing (though we don't store data)</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Security</h2>
          
          <p className="text-gray-700 mb-4">
            We implement security measures to protect your data during processing:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>HTTPS encryption for all data transmission</li>
            <li>In-memory processing (no disk storage)</li>
            <li>Automatic data deletion after processing</li>
            <li>Secure payment processing through Stripe</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Children's Privacy</h2>
          
          <p className="text-gray-700 mb-4">
            Our service is not intended for users under the age of 13. We do not knowingly collect information from children.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Changes to This Policy</h2>
          
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. The "Last updated" date at the top indicates when changes were made. Continued use of our service after changes constitutes acceptance of the updated policy.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Contact Us</h2>
          
          <p className="text-gray-700 mb-6">
            If you have questions about this Privacy Policy, please <a href="/contact" className="text-indigo-600 hover:text-indigo-800">contact us</a>.
          </p>
        </article>
      </main>
      <BottomBannerAd />
    </div>
  );
}

