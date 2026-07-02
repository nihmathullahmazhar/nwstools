export const SITE_NAME = "NWS Tools";
export const SITE_DESCRIPTION =
  "NWS Tools — a fast, private collection of 100+ developer & everyday tools that run entirely in your browser. Built by nihmathullah.com. No sign-up, no uploads, no tracking.";
// Live URL — drives canonicals, OG images, sitemap & robots.
// Override with NEXT_PUBLIC_SITE_URL when the real domain (nwstools.dev) is ready.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://nwstools.vercel.app";

/** The studio behind NWS Tools — this is what the site promotes. */
export const BRAND_NAME = "nihmathullah.com";
export const BRAND_URL = "https://nihmathullah.com";
export const BRAND_TAGLINE = "Premium websites, web apps & CRMs, engineered.";
export const BRAND_CTA = "Work with us";

/** Google Form embed (respondent view). */
export const CONTACT_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScTP5xXvk_blljqJnmObHtCe-XODNkOXJyL69pqXzfxQunz2A/viewform?embedded=true";
