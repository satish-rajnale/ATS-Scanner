/**
 * SEO utility functions for better search engine ranking
 */

export function generateMetaDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\w*$/, "") + "...";
}

export function generateKeywords(baseKeywords: string[], additional: string[] = []): string {
  const allKeywords = [...baseKeywords, ...additional];
  return allKeywords.join(", ");
}

export const BASE_KEYWORDS = [
  "ATS scanner",
  "resume checker",
  "ATS score",
  "resume analyzer",
  "applicant tracking system",
  "free resume scanner",
  "resume ATS check",
  "ATS resume test",
  "resume optimization",
  "ATS friendly resume",
];

export function createBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ATS Scanner",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://your-app.vercel.app",
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-app.vercel.app"}/logo.png`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@atsscanner.com",
    },
  };
}

