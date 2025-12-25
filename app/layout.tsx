import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { WebsiteStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Free ATS Resume Scanner – Get Your ATS Score in Seconds | Resume Checker",
  description: "Scan your resume for ATS compatibility. Get instant feedback on your resume's ATS score, keyword matching, and actionable improvements. Free resume analyzer for applicant tracking systems.",
  keywords: "ATS scanner, resume checker, ATS score, resume analyzer, applicant tracking system, free resume scanner, resume ATS check, ATS resume test, resume optimization, ATS friendly resume",
  authors: [{ name: "ATS Scanner" }],
  creator: "ATS Scanner",
  publisher: "ATS Scanner",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://your-app.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free ATS Resume Scanner – Get Your ATS Score in Seconds",
    description: "Scan your resume for ATS compatibility. Get instant feedback on your resume's ATS score, keyword matching, and actionable improvements.",
    type: "website",
    url: "/",
    siteName: "ATS Resume Scanner",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ATS Resume Scanner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ATS Resume Scanner – Get Your ATS Score in Seconds",
    description: "Scan your resume for ATS compatibility. Get instant feedback on your resume's ATS score.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <WebsiteStructuredData />
        {/* Google AdSense */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-YOUR_PUBLISHER_ID"}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Analytics (optional) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}

