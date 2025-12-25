export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Resumaze",
    description: "Resumaze: Free AI-powered ATS resume checker that analyzes your resume for applicant tracking system compatibility. Get instant ATS scores and improvement suggestions.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://your-app.vercel.app",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
  };

  return <StructuredData data={data} />;
}

export function FAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <StructuredData data={data} />;
}

export function ArticleStructuredData({
  title,
  description,
  datePublished,
  author,
}: {
  title: string;
  description: string;
  datePublished: string;
  author?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    author: {
      "@type": "Organization",
      name: author || "Resumaze",
    },
    publisher: {
      "@type": "Organization",
      name: "Resumaze",
    },
  };

  return <StructuredData data={data} />;
}

