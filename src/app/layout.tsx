import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ServiceWorkerRegister } from "@/components/sw-register";
import { TopBanner } from "@/components/promo/top-banner";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

const sans = Hanken_Grotesk({ variable: "--font-sans", subsets: ["latin"] });
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — private, in-browser tools`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "free online tools",
    "browser tools",
    "private tools",
    "no sign-up tools",
    "pdf tools",
    "image tools",
    "converter",
    "calculator",
    "developer tools",
    SITE_NAME,
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — private, in-browser tools`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/og", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — private, in-browser tools`,
    description: SITE_DESCRIPTION,
    images: ["/og"],
  },
};

// Applied before paint to avoid a theme/accent flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);var a=localStorage.getItem('accent');if(a){var s=document.documentElement.style;s.setProperty('--accent',a);s.setProperty('--ring',a);s.setProperty('--accent-fg','0 0% 100%');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${display.variable} ${mono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <ServiceWorkerRegister />
        <TopBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
