import "./globals.css";
import { site } from "../config/site";

export const metadata = {
  title: `${site.name} - Client-ready candidate briefs in 12 minutes`,
  description:
    "A Claude skill for boutique recruiters. Turns a role spec into a 5-page candidate brief with honest competency flags and interview probes. Install once, run on every search.",
  openGraph: {
    title: `${site.name} - ${site.tagline}`,
    description:
      "5-page candidate briefs in ~12 minutes. Runs in your own Claude account. $299 one-time, founder pricing.",
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
