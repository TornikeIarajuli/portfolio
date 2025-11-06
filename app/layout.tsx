import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tornike Iarajuli - Senior QA Engineer",
  description: "Portfolio of Tornike Iarajuli, QA Chapter Lead with 6+ years of experience in test automation, quality assurance, and team leadership.",
  keywords: [
    "QA Engineer",
    "Test Automation",
    "Selenium",
    "Python",
    "Quality Assurance",
    "Senior QA",
    "QA Chapter Lead",
    "Software Testing",
    "API Testing",
    "CI/CD",
    "Tornike Iarajuli",
  ],
  authors: [{ name: "Tornike Iarajuli" }],
  creator: "Tornike Iarajuli",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourwebsite.com",
    title: "Tornike Iarajuli - Senior QA Engineer",
    description: "Retro arcade-themed portfolio showcasing 6+ years of QA expertise, test automation, and leadership experience.",
    siteName: "Tornike Iarajuli Portfolio",
    images: [
      {
        url: "/og-image.png", // You'll need to create this
        width: 1200,
        height: 630,
        alt: "Tornike Iarajuli - QA Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tornike Iarajuli - Senior QA Engineer",
    description: "Retro arcade-themed portfolio showcasing 6+ years of QA expertise",
    images: ["/og-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics - Replace YOUR_GA_ID with your actual Google Analytics ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'YOUR_GA_ID');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
