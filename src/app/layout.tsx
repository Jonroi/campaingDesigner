import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Campaign Designer - AI-Powered ICP & Campaign Generation",
  description:
    "Generate Ideal Customer Profiles and Marketing Campaigns with AI-powered insights. Transform your marketing strategy with data-driven intelligence.",
  keywords: [
    "ICP",
    "Ideal Customer Profile",
    "Marketing Campaigns",
    "AI",
    "Marketing Automation",
  ],
  authors: [{ name: "Campaign Designer" }],
  creator: "Campaign Designer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://campaign-designer.com",
    title: "Campaign Designer - AI-Powered ICP & Campaign Generation",
    description:
      "Generate Ideal Customer Profiles and Marketing Campaigns with AI-powered insights.",
    siteName: "Campaign Designer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campaign Designer - AI-Powered ICP & Campaign Generation",
    description:
      "Generate Ideal Customer Profiles and Marketing Campaigns with AI-powered insights.",
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="antialiased">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
