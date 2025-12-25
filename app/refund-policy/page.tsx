import type { Metadata } from "next";
import { SidebarAd, BottomBannerAd } from "@/components/AdSense";

export const metadata: Metadata = {
  title: "Refund Policy - ATS Scanner",
  description: "Refund policy for ATS Scanner premium reports. Learn about our refund terms and conditions.",
};

export default function RefundPolicyPage() {
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
          <h1 className="text-4xl font-bold text-black mb-6">Refund Policy</h1>
          
          <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Overview</h2>
          
          <p className="text-gray-700 mb-4">
            At ATS Scanner, we offer a one-time payment service for unlocking full resume analysis reports. This refund policy outlines the terms and conditions for refunds.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Refund Eligibility</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">Eligible for Refund</h3>
          <p className="text-gray-700 mb-4">You may be eligible for a refund if:</p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>The service fails to process your resume due to a technical error on our end</li>
            <li>You are unable to access the full report after successful payment due to a system error</li>
            <li>You experience a duplicate charge</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">Not Eligible for Refund</h3>
          <p className="text-gray-700 mb-4">Refunds are not available for:</p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Dissatisfaction with your ATS score or results</li>
            <li>Change of mind after purchasing</li>
            <li>Inability to use the service due to user error (e.g., incorrect file format)</li>
            <li>Issues with third-party services (Stripe, OpenAI) beyond our control</li>
            <li>If you have successfully accessed and viewed the full report</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Refund Process</h2>
          
          <p className="text-gray-700 mb-4">
            To request a refund, please <a href="/contact" className="text-indigo-600 hover:text-indigo-800">contact us</a> with:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Your payment transaction ID or receipt</li>
            <li>Date and time of purchase</li>
            <li>Description of the issue you encountered</li>
            <li>Any relevant screenshots or error messages</li>
          </ul>

          <p className="text-gray-700 mb-4">
            We will review your request within 5 business days and respond via email. If approved, refunds will be processed to the original payment method within 7-10 business days.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Free Service</h2>
          
          <p className="text-gray-700 mb-4">
            Our basic ATS scanning service is free and does not require payment. You can scan your resume and view the basic score and preview issues at no cost. Payment is only required to unlock the full detailed report with AI-powered explanations.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Payment Processing</h2>
          
          <p className="text-gray-700 mb-4">
            Payments are processed securely through Stripe. All transactions are subject to Stripe's terms of service. In case of payment disputes, Stripe's dispute resolution process may apply.
          </p>

          <h2 className="text-3xl font-bold text-black mt-8 mb-4">Contact</h2>
          
          <p className="text-gray-700 mb-6">
            For refund requests or questions about this policy, please <a href="/contact" className="text-indigo-600 hover:text-indigo-800">contact us</a>.
          </p>
        </article>
      </main>
      <BottomBannerAd />
    </div>
  );
}

