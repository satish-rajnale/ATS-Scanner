"use client";

import { useEffect } from "react";
import Script from "next/script";

interface AdSenseProps {
  slot: string;
  style?: React.CSSProperties;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  className?: string;
}

export function AdSense({ slot, style, format = "auto", className = "" }: AdSenseProps) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-YOUR_PUBLISHER_ID"}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className={`adsbygoogle ${className}`}
        style={{
          display: "block",
          ...style,
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-YOUR_PUBLISHER_ID"}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </>
  );
}

// Sidebar Ad Component
export function SidebarAd({ position }: { position: "left" | "right" }) {
  return (
    <div className={`hidden lg:block fixed ${position === "left" ? "left-0" : "right-0"} top-20 w-32 z-10`}>
      <AdSense
        slot={`${position === "left" ? "LEFT_SIDEBAR" : "RIGHT_SIDEBAR"}`}
        format="vertical"
        style={{ width: "160px", height: "600px" }}
      />
    </div>
  );
}

// Bottom Banner Ad Component
export function BottomBannerAd() {
  return (
    <div className="w-full flex justify-center py-4 bg-gray-50">
      <AdSense
        slot="BOTTOM_BANNER"
        format="horizontal"
        style={{ width: "728px", height: "90px" }}
        className="max-w-full"
      />
    </div>
  );
}

// In-Article Ad Component
export function InArticleAd() {
  return (
    <div className="w-full flex justify-center my-8">
      <AdSense
        slot="IN_ARTICLE"
        format="auto"
        style={{ width: "100%", height: "250px" }}
      />
    </div>
  );
}

