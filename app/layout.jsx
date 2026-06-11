import "./globals.css";
import { site } from "../config/site";

export const metadata = {
  title: `${site.name} — Candidate research in 12 minutes, not 2 hours`,
  description:
    "A Claude skill that turns role specs into client-ready candidate and company briefs. Install once, run on every search.",
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description:
      "Client-ready candidate briefs in ~12 minutes. One-time purchase, instant download.",
    url: `https://${site.domain}`,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700&family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
