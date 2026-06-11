// ============================================================
// SITE CONFIG — edit everything about the product here.
// ============================================================

export const site = {
  // Brand
  name: "ScoutFile",
  tagline: "The AI research agent skill for recruiters",
  domain: "scoutfile.ai", // used in metadata only - change to your domain

  // Product
  productName: "ScoutFile - Recruiter Research Agent Skill",
  priceUSD: 299, // displayed on the page
  priceCents: 29900, // charged by Stripe - keep in sync with priceUSD
  priceCompareUSD: 499, // shown as the "after launch" anchor (founder pricing)

  // Founder pricing: how many seats remain at $299 before it moves to priceCompareUSD.
  // Hand-edit as licenses sell, or wire to Stripe later.
  founderLicensesRemaining: 100,

  // The file buyers download after paying.
  // Drop your real package into /private and update this name.
  fileName: "scoutfile-skill-package.zip",

  // Support email shown post-purchase
  supportEmail: "hello@scoutfile.ai",

  // Founder
  founderName: "Jim Stephen",
  founderTitle: "Founder, ScoutFile",
};
