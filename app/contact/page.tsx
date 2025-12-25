import type { Metadata } from "next";
import { SidebarAd, BottomBannerAd } from "@/components/AdSense";

export const metadata: Metadata = {
  title: "Contact Us - Resumaze",
  description: "Contact Resumaze for support, questions, or feedback about our resume scanning service.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <SidebarAd position="left" />
      <SidebarAd position="right" />
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="text-xl font-bold text-indigo-600">Resumaze</a>
            <a href="/" className="text-gray-600 hover:text-indigo-600">Home</a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Have questions or need support? We're here to help.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-700 mb-2">
                For general inquiries, support requests, or feedback, please email us at:
              </p>
              <a href="mailto:support@atsscanner.com" className="text-indigo-600 hover:text-indigo-800 font-medium">
                support@atsscanner.com
              </a>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-700">
                We aim to respond to all inquiries within 2-3 business days. For urgent payment or technical issues, we'll prioritize your request.
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-2">What to Include</h3>
              <p className="text-gray-700 mb-2">When contacting us, please include:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Your name and email address</li>
                <li>Description of your issue or question</li>
                <li>For payment issues: Transaction ID or receipt</li>
                <li>For technical issues: Screenshots or error messages if applicable</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-black mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is my resume stored?</h3>
              <p className="text-gray-700">
                No. Your resume is processed in memory and immediately deleted after analysis. We never store your resume files.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How accurate is the ATS score?</h3>
              <p className="text-gray-700">
                Our ATS score is an estimate based on common ATS compatibility factors. Different ATS systems may parse resumes slightly differently, but our score provides a good indication of overall compatibility.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I get a refund?</h3>
              <p className="text-gray-700">
                Please see our <a href="/refund-policy" className="text-indigo-600 hover:text-indigo-800">Refund Policy</a> for details on refund eligibility and the refund process.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What file formats are supported?</h3>
              <p className="text-gray-700">
                We support PDF and DOCX (Microsoft Word) files. PDFs should be text-based, not scanned images.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-indigo-600 text-white py-3 px-8 rounded-md font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </main>
      <BottomBannerAd />
    </div>
  );
}

