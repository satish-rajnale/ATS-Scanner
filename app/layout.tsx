import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { WebsiteStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Resumaze - Free ATS Resume Checker | Get Your ATS Score in Seconds",
  description: "Resumaze: Free AI-powered ATS resume scanner. Get instant ATS compatibility score, keyword matching analysis, and actionable improvements. Optimize your resume for applicant tracking systems.",
  keywords: "ATS scanner, resume checker, ATS score, resume analyzer, applicant tracking system, free resume scanner, resume ATS check, ATS resume test, resume optimization, ATS friendly resume",
  authors: [{ name: "Resumaze" }],
  creator: "Resumaze",
  publisher: "Resumaze",
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
    title: "Resumaze - Free ATS Resume Checker | Get Your ATS Score in Seconds",
    description: "Resumaze: Free AI-powered ATS resume scanner. Get instant ATS compatibility score, keyword matching analysis, and actionable improvements.",
    type: "website",
    url: "/",
    siteName: "Resumaze - ATS Resume Checker",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resumaze - ATS Resume Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resumaze - Free ATS Resume Checker | Get Your ATS Score in Seconds",
    description: "Resumaze: Free AI-powered ATS resume scanner. Get instant ATS compatibility score and keyword matching analysis.",
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

