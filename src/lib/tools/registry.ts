import {
  Image as ImageIcon,
  FileText,
  Video,
  AudioLines,
  Type,
  ArrowLeftRight,
  Code2,
  Search,
  Calculator,
  Landmark,
  Sparkles,
  ShieldCheck,
  Timer,
  Globe2,
  type LucideIcon,
} from "lucide-react";

export type Badge = "popular" | "new" | "essential";

export type Tool = {
  slug: string;
  name: string;
  tagline: string;
  keywords?: string[];
  /** true when the tool page is actually built */
  ready?: boolean;
  badge?: Badge;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  /** HSL triple used to tint the category accent */
  accent: string;
  tools: Tool[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "images",
    name: "Image",
    description: "Edit, convert, and clean up images — entirely in your browser.",
    icon: ImageIcon,
    accent: "255 85% 62%",
    tools: [
      { slug: "background-remover", name: "Background Remover", tagline: "Cut out subjects with on-device AI.", keywords: ["cutout", "transparent", "remove bg"] },
      { slug: "add-text-to-image", name: "Text Behind Image", tagline: "Place text behind photo subjects for a depth effect.", keywords: ["text behind", "depth", "poster"] },
      { slug: "image-resize", name: "Image Resizer", tagline: "Resize by pixels or percentage with aspect lock.", keywords: ["scale", "dimensions"], ready: true },
      { slug: "image-compress", name: "Image Compressor", tagline: "Shrink JP/PNG/WebP with a live quality preview.", keywords: ["optimize", "reduce size"], ready: true },
      { slug: "image-convert", name: "Image Converter", tagline: "Convert between PNG, JPG, WebP and AVIF.", keywords: ["format", "png", "jpg", "webp"], ready: true },
      { slug: "color-picker", name: "Color Picker", tagline: "Pick colors and convert HEX / RGB / HSL / OKLCH.", keywords: ["eyedropper", "hex", "rgb"], ready: true },
      { slug: "color-palette", name: "Palette Extractor", tagline: "Pull a dominant color palette from any image.", keywords: ["colors", "dominant", "swatches"] },
      { slug: "image-watermark", name: "Image Watermark", tagline: "Stamp text or a logo across your images.", keywords: ["logo", "protect"] },
      { slug: "pixelate", name: "Pixelate & Blur", tagline: "Redact faces and sensitive regions.", keywords: ["censor", "redact", "blur"] },
      { slug: "favicon", name: "Favicon Generator", tagline: "Generate every favicon size from one image.", keywords: ["icon", "app icon"] },
    ],
  },
  {
    slug: "pdf",
    name: "PDF & Docs",
    description: "Merge, sign, compress and edit PDFs without uploading a thing.",
    icon: FileText,
    accent: "356 72% 56%",
    tools: [
      { slug: "merge-split-pdf", name: "Merge & Split PDF", tagline: "Combine files or pull pages apart, drag to reorder.", keywords: ["combine", "join", "extract pages"] },
      { slug: "compress-pdf", name: "Compress PDF", tagline: "Reduce PDF size while keeping it readable.", keywords: ["shrink", "optimize"] },
      { slug: "sign-pdf", name: "Sign PDF", tagline: "Draw or type a signature and place it anywhere.", keywords: ["signature", "esign"] },
      { slug: "fill-pdf-forms", name: "Fill PDF Forms", tagline: "Type into form fields and flatten the result.", keywords: ["form", "acroform"] },
      { slug: "pdf-images", name: "PDF ↔ Images", tagline: "Export pages to PNG or build a PDF from images.", keywords: ["export", "convert"] },
      { slug: "pdf-to-text", name: "PDF to Text", tagline: "Extract selectable text from a PDF.", keywords: ["extract", "ocr"] },
      { slug: "watermark-pdf", name: "Watermark PDF", tagline: "Overlay text or an image watermark on pages.", keywords: ["stamp", "draft"] },
      { slug: "pdf-header-footer", name: "Header & Footer", tagline: "Add page numbers, dates and running headers.", keywords: ["page numbers"] },
      { slug: "resize-pdf", name: "Resize PDF", tagline: "Change page size and scale content to fit.", keywords: ["a4", "letter", "scale"] },
    ],
  },
  {
    slug: "video",
    name: "Video",
    description: "Trim, convert and compress video locally with WebCodecs.",
    icon: Video,
    accent: "24 92% 55%",
    tools: [
      { slug: "video-compressor", name: "Video Compressor", tagline: "Cut file size with a target bitrate.", keywords: ["shrink", "bitrate"] },
      { slug: "video-converter", name: "Video Converter", tagline: "Convert between MP4, WebM and MOV.", keywords: ["format", "mp4", "webm"] },
      { slug: "video-trim-crop", name: "Trim & Crop", tagline: "Cut clips and crop the frame.", keywords: ["cut", "clip"] },
      { slug: "video-to-gif", name: "Video to GIF", tagline: "Turn a clip into a shareable GIF.", keywords: ["gif", "loop"] },
      { slug: "video-to-audio", name: "Video to Audio", tagline: "Extract the audio track as MP3 or WAV.", keywords: ["extract", "mp3"] },
      { slug: "merge-video", name: "Merge Video", tagline: "Join clips end to end.", keywords: ["combine", "concat"] },
      { slug: "mute-video", name: "Mute Video", tagline: "Strip audio from a video.", keywords: ["remove sound"] },
      { slug: "video-watermark", name: "Video Watermark", tagline: "Overlay a logo or text on video.", keywords: ["logo"] },
      { slug: "gif-to-video", name: "GIF to Video", tagline: "Convert an animated GIF into MP4.", keywords: ["gif", "mp4"] },
    ],
  },
  {
    slug: "audio",
    name: "Audio",
    description: "Record, convert and clean up audio in the browser.",
    icon: AudioLines,
    accent: "292 70% 60%",
    tools: [
      { slug: "audio-trim-merge", name: "Trim & Merge", tagline: "Cut, join and fade audio clips.", keywords: ["cut", "join"] },
      { slug: "audio-volume", name: "Volume & Normalize", tagline: "Boost, lower, or normalize loudness.", keywords: ["gain", "loudness"] },
      { slug: "voice-recorder", name: "Voice Recorder", tagline: "Record from your mic and download.", keywords: ["record", "mic"] },
      { slug: "text-to-speech", name: "Text to Speech", tagline: "Read text aloud and export audio.", keywords: ["tts", "narrate"] },
      { slug: "tuner", name: "Instrument Tuner", tagline: "Tune by pitch using your mic.", keywords: ["guitar", "pitch"] },
    ],
  },
  {
    slug: "text",
    name: "Text & Writing",
    description: "Transform, compare and clean up text fast.",
    icon: Type,
    accent: "199 89% 52%",
    tools: [
      { slug: "word-counter", name: "Word & Character Counter", tagline: "Live counts, reading time and keyword density.", keywords: ["count", "words", "characters"], ready: true },
      { slug: "case-converter", name: "Case Converter", tagline: "UPPER, lower, Title, camelCase, snake and more.", keywords: ["uppercase", "lowercase", "title case"], ready: true },
      { slug: "text-compare", name: "Diff Checker", tagline: "Compare two texts line by line.", keywords: ["diff", "compare", "changes"], ready: true },
      { slug: "find-replace", name: "Find & Replace", tagline: "Bulk replace with regex support.", keywords: ["replace", "regex"] },
      { slug: "sort-lines", name: "Sort Lines", tagline: "Alphabetize, reverse and randomize lines.", keywords: ["order", "alphabetize"], ready: true },
      { slug: "remove-duplicate-lines", name: "Remove Duplicates", tagline: "Strip duplicate lines instantly.", keywords: ["dedupe", "unique"], ready: true },
      { slug: "remove-extra-spaces", name: "Clean Whitespace", tagline: "Trim and collapse extra spaces.", keywords: ["trim", "whitespace"], ready: true },
      { slug: "markdown-to-html", name: "Markdown to HTML", tagline: "Preview and export Markdown as HTML.", keywords: ["md", "html"] },
      { slug: "morse-code", name: "Morse Code", tagline: "Translate text to and from Morse.", keywords: ["morse", "dots dashes"] },
      { slug: "nato-alphabet", name: "NATO Phonetic", tagline: "Spell text with the phonetic alphabet.", keywords: ["phonetic", "alpha bravo"] },
      { slug: "braille-translator", name: "Braille Translator", tagline: "Convert text to Braille characters.", keywords: ["braille"] },
      { slug: "pig-latin", name: "Pig Latin", tagline: "Translate to and from Pig Latin.", keywords: ["fun"] },
    ],
  },
  {
    slug: "converters",
    name: "Converters",
    description: "Convert units, data formats, currencies and time zones.",
    icon: ArrowLeftRight,
    accent: "162 72% 42%",
    tools: [
      { slug: "unit-converter", name: "Unit Converter", tagline: "Length, weight, temperature, area, speed and more.", keywords: ["units", "metric", "imperial"], ready: true },
      { slug: "csv-json", name: "CSV ↔ JSON", tagline: "Convert tabular data both ways.", keywords: ["csv", "json", "table"], ready: true },
      { slug: "base-converter", name: "Number Base", tagline: "Binary, octal, decimal and hex.", keywords: ["binary", "hex", "radix"], ready: true },
      { slug: "currency-converter", name: "Currency Converter", tagline: "Convert with recent exchange rates.", keywords: ["forex", "money"] },
      { slug: "timezone-converter", name: "Timezone Converter", tagline: "Compare times across cities.", keywords: ["time zone", "utc"] },
    ],
  },
  {
    slug: "developers",
    name: "Developers",
    description: "The everyday format, encode and inspect toolkit.",
    icon: Code2,
    accent: "217 91% 60%",
    tools: [
      { slug: "json-formatter", name: "JSON Formatter", tagline: "Format, validate, minify and tree-view JSON.", keywords: ["json", "prettify", "validate"], ready: true },
      { slug: "code-formatter", name: "Code Formatter", tagline: "Beautify or minify JSON, CSS, JS, SQL and XML.", keywords: ["beautify", "prettify", "format", "minify", "code"] },
      { slug: "base64", name: "Base64 Encode/Decode", tagline: "Encode and decode text or files.", keywords: ["base64", "encode"], ready: true },
      { slug: "url-encode", name: "URL Encode/Decode", tagline: "Escape and unescape URL components.", keywords: ["percent", "encode", "uri"], ready: true },
      { slug: "jwt-decoder", name: "JWT Decoder", tagline: "Decode and inspect JWT payloads.", keywords: ["token", "jwt", "auth"], ready: true },
      { slug: "uuid", name: "UUID Generator", tagline: "Generate v4 / v7 UUIDs in bulk.", keywords: ["guid", "id"], ready: true },
      { slug: "hash", name: "Hash Generator", tagline: "MD5, SHA-1, SHA-256, SHA-512.", keywords: ["md5", "sha", "checksum"], ready: true },
      { slug: "regex-tester", name: "Regex Tester", tagline: "Test patterns with live match highlighting.", keywords: ["regexp", "pattern"], ready: true },
      { slug: "cron-builder", name: "Cron Builder", tagline: "Build and explain cron expressions.", keywords: ["crontab", "schedule"] },
      { slug: "fake-data", name: "Fake Data Generator", tagline: "Mock names, emails, addresses and JSON.", keywords: ["mock", "seed", "faker"] },
    ],
  },
  {
    slug: "seo",
    name: "SEO & Social",
    description: "Meta tags, previews and content checks for the web.",
    icon: Search,
    accent: "142 71% 45%",
    tools: [
      { slug: "meta-tag-generator", name: "Meta & OG Tags", tagline: "Generate SEO and Open Graph meta tags.", keywords: ["og", "meta", "seo"] },
      { slug: "social-card-preview", name: "Social Card Preview", tagline: "Preview how links look when shared.", keywords: ["og image", "twitter card"] },
      { slug: "keyword-density", name: "Keyword Density", tagline: "Analyze word frequency in content.", keywords: ["frequency", "seo"] },
      { slug: "robots-txt-generator", name: "Robots.txt Generator", tagline: "Build a valid robots.txt visually.", keywords: ["crawler", "disallow"] },
      { slug: "sitemap-generator", name: "Sitemap Generator", tagline: "Create an XML sitemap from URLs.", keywords: ["xml", "sitemap"] },
    ],
  },
  {
    slug: "calculators",
    name: "Calculators",
    description: "Everyday math, dates, health and grades.",
    icon: Calculator,
    accent: "255 85% 62%",
    tools: [
      { slug: "percentage-calculator", name: "Percentage Calculator", tagline: "Every percentage question, one screen.", keywords: ["percent", "increase"], ready: true },
      { slug: "date-difference", name: "Date Difference", tagline: "Days, weeks and months between dates.", keywords: ["days between", "duration"], ready: true },
      { slug: "age-calculator", name: "Age Calculator", tagline: "Exact age in years, months and days.", keywords: ["birthday", "age"], ready: true },
      { slug: "bmi-calculator", name: "BMI Calculator", tagline: "Body mass index with metric or US units.", keywords: ["health", "weight"], ready: true },
      { slug: "tip-calculator", name: "Tip Calculator", tagline: "Tip and split the bill fairly.", keywords: ["gratuity", "split"], ready: true },
      { slug: "gpa-calculator", name: "GPA Calculator", tagline: "Weighted GPA from your courses.", keywords: ["grades", "college"] },
      { slug: "grade-calculator", name: "Grade Calculator", tagline: "Final grade and what you need to score.", keywords: ["exam", "weighted"] },
      { slug: "business-days-calculator", name: "Business Days", tagline: "Count working days between dates.", keywords: ["workdays", "weekdays"] },
      { slug: "random-number", name: "Random Number", tagline: "Generate numbers in any range.", keywords: ["rng", "dice"], ready: true },
    ],
  },
  {
    slug: "finance",
    name: "Money & Finance",
    description: "Loans, mortgages, interest and paychecks.",
    icon: Landmark,
    accent: "152 62% 42%",
    tools: [
      { slug: "loan-calculator", name: "Loan & EMI", tagline: "Monthly payment and full amortization.", keywords: ["emi", "amortization"], ready: true },
      { slug: "mortgage-calculator", name: "Mortgage Calculator", tagline: "Payment with taxes, insurance and PMI.", keywords: ["home loan", "house"] },
      { slug: "compound-interest", name: "Compound Interest", tagline: "Growth with contributions over time.", keywords: ["savings", "invest"], ready: true },
      { slug: "car-loan-calculator", name: "Car Loan", tagline: "Auto payment with taxes and trade-in.", keywords: ["auto", "vehicle"] },
      { slug: "credit-card-payoff", name: "Credit Card Payoff", tagline: "Months to zero and interest paid.", keywords: ["debt", "payoff"] },
      { slug: "bill-splitter", name: "Bill Splitter", tagline: "Split shared costs unevenly.", keywords: ["split", "group"] },
      { slug: "gas-cost-calculator", name: "Trip Fuel Cost", tagline: "Estimate fuel cost for any drive.", keywords: ["gas", "mileage"] },
    ],
  },
  {
    slug: "generators",
    name: "Generators",
    description: "Codes, passwords, names and mock data.",
    icon: Sparkles,
    accent: "38 92% 50%",
    tools: [
      { slug: "qr-code-generator", name: "QR Code Generator", tagline: "Styled QR codes for links, wifi and more.", keywords: ["qr", "barcode", "wifi"], ready: true },
      { slug: "password-generator", name: "Password Generator", tagline: "Strong passwords with a strength meter.", keywords: ["password", "secure"], ready: true },
      { slug: "barcode-generator", name: "Barcode Generator", tagline: "Generate EAN, UPC and Code 128.", keywords: ["ean", "upc"] },
      { slug: "business-name-generator", name: "Business Name Ideas", tagline: "Brandable name suggestions.", keywords: ["brand", "startup"] },
      { slug: "username-generator", name: "Username Generator", tagline: "Handles and usernames on demand.", keywords: ["handle", "nickname"] },
      { slug: "lorem-ipsum", name: "Lorem Ipsum", tagline: "Placeholder text by words or paragraphs.", keywords: ["placeholder", "dummy"], ready: true },
    ],
  },
  {
    slug: "security",
    name: "Security & Privacy",
    description: "Encrypt, hash and scrub — all offline.",
    icon: ShieldCheck,
    accent: "173 70% 40%",
    tools: [
      { slug: "password-generator", name: "Password Generator", tagline: "Strong passwords with a strength meter.", keywords: ["password"], ready: true },
      { slug: "hash", name: "Hash Generator", tagline: "Checksums with SHA and MD5.", keywords: ["sha", "md5"], ready: true },
      { slug: "text-encrypt", name: "Text Encrypt", tagline: "AES-encrypt notes with a passphrase.", keywords: ["aes", "encrypt"] },
      { slug: "secret-note", name: "Secret Note", tagline: "Local-only encrypted scratch note.", keywords: ["private", "note"] },
      { slug: "metadata-remover", name: "Metadata Remover", tagline: "Strip EXIF and hidden metadata.", keywords: ["exif", "scrub"] },
      { slug: "key-generator", name: "Key Generator", tagline: "Random API keys and tokens.", keywords: ["api key", "token"], ready: true },
    ],
  },
  {
    slug: "productivity",
    name: "Time & Productivity",
    description: "Timers, notes and trackers that just work.",
    icon: Timer,
    accent: "255 85% 62%",
    tools: [
      { slug: "pomodoro", name: "Pomodoro Timer", tagline: "Focus sessions with breaks.", keywords: ["focus", "timer"], ready: true },
      { slug: "stopwatch", name: "Stopwatch", tagline: "Precise stopwatch with laps.", keywords: ["timer", "laps"], ready: true },
      { slug: "countdown-timer", name: "Countdown Timer", tagline: "Count down to any moment.", keywords: ["countdown", "alarm"], ready: true },
      { slug: "notepad", name: "Notepad", tagline: "Distraction-free note that autosaves.", keywords: ["notes", "scratch"], ready: true },
      { slug: "to-do-list", name: "To-Do List", tagline: "Simple checklist saved on this device.", keywords: ["tasks", "checklist"], ready: true },
      { slug: "habit-tracker", name: "Habit Tracker", tagline: "Track daily habits and streaks.", keywords: ["streak", "daily"] },
    ],
  },
  {
    slug: "reference",
    name: "Reference",
    description: "US & world lookups, codes and quick facts.",
    icon: Globe2,
    accent: "217 91% 60%",
    tools: [
      { slug: "us-state-abbreviations", name: "US State Abbreviations", tagline: "Two-letter codes for every state.", keywords: ["states", "codes"] },
      { slug: "federal-holidays", name: "Federal Holidays", tagline: "US federal holiday calendar.", keywords: ["holidays"] },
      { slug: "nato-alphabet", name: "Phonetic Alphabet", tagline: "The full NATO phonetic reference.", keywords: ["alpha bravo"] },
      { slug: "ein-formatter", name: "EIN Formatter", tagline: "Format and validate an EIN.", keywords: ["tax id"] },
      { slug: "salary-to-hourly", name: "Salary to Hourly", tagline: "Convert annual pay to an hourly rate.", keywords: ["wage", "pay"], ready: true },
    ],
  },
];

// ------- built tools (single source of truth) -------
// A tool is "ready" only when its page exists here. Inline `ready` flags in
// the catalog above are treated as intent; this set is the truth.
export const BUILT = new Set<string>([
  // text
  "word-counter",
  "case-converter",
  "text-compare",
  "sort-lines",
  "remove-duplicate-lines",
  "remove-extra-spaces",
  // developers
  "json-formatter",
  "code-formatter",
  "base64",
  "url-encode",
  "jwt-decoder",
  "uuid",
  "hash",
  "regex-tester",
  // converters
  "base-converter",
  "unit-converter",
  "csv-json",
  "timezone-converter",
  "currency-converter",
  // text (reference-ish)
  "morse-code",
  "nato-alphabet",
  "find-replace",
  "markdown-to-html",
  "pig-latin",
  "braille-translator",
  // generators
  "barcode-generator",
  "username-generator",
  "business-name-generator",
  // security
  "text-encrypt",
  "key-generator",
  "metadata-remover",
  // more developers
  "cron-builder",
  "fake-data",
  // calculators
  "percentage-calculator",
  "date-difference",
  "tip-calculator",
  "age-calculator",
  "bmi-calculator",
  "random-number",
  "business-days-calculator",
  "gpa-calculator",
  "grade-calculator",
  // finance
  "loan-calculator",
  "compound-interest",
  "mortgage-calculator",
  "car-loan-calculator",
  "credit-card-payoff",
  "bill-splitter",
  "gas-cost-calculator",
  // reference
  "salary-to-hourly",
  "us-state-abbreviations",
  "federal-holidays",
  "ein-formatter",
  // generators
  "qr-code-generator",
  "password-generator",
  "lorem-ipsum",
  // video
  "video-converter",
  "video-compressor",
  "video-to-gif",
  "video-to-audio",
  "mute-video",
  "video-trim-crop",
  "gif-to-video",
  "video-watermark",
  "merge-video",
  // seo
  "meta-tag-generator",
  "social-card-preview",
  "keyword-density",
  "robots-txt-generator",
  "sitemap-generator",
  // audio
  "voice-recorder",
  "text-to-speech",
  "audio-volume",
  "audio-trim-merge",
  "tuner",
  // pdf
  "merge-split-pdf",
  "pdf-images",
  "watermark-pdf",
  "pdf-header-footer",
  "pdf-to-text",
  "compress-pdf",
  "resize-pdf",
  "sign-pdf",
  "fill-pdf-forms",
  // images
  "background-remover",
  "add-text-to-image",
  "color-picker",
  "image-resize",
  "image-compress",
  "image-convert",
  "image-watermark",
  "pixelate",
  "favicon",
  "color-palette",
  // productivity
  "pomodoro",
  "stopwatch",
  "countdown-timer",
  "notepad",
  "to-do-list",
  "secret-note",
  "habit-tracker",
]);

/** Corner badges shown on tool cards. */
export const BADGES: Record<string, Badge> = {
  "json-formatter": "essential",
  "word-counter": "essential",
  "password-generator": "essential",
  "unit-converter": "essential",
  "background-remover": "popular",
  "qr-code-generator": "popular",
  "merge-split-pdf": "popular",
  "image-compress": "popular",
  "code-formatter": "new",
  "tuner": "new",
  "secret-note": "new",
  "currency-converter": "new",
  "sign-pdf": "new",
};

for (const category of CATEGORIES) {
  for (const tool of category.tools) {
    tool.ready = BUILT.has(tool.slug);
    tool.badge = BADGES[tool.slug];
  }
}

// ------- derived lookups -------

export const ALL_TOOLS: (Tool & { category: Category })[] = CATEGORIES.flatMap(
  (category) => category.tools.map((tool) => ({ ...tool, category })),
);

/** De-duplicated ready tools (some tools appear in two categories). */
export const READY_TOOLS = ALL_TOOLS.filter((t) => t.ready);

export const TOTAL_TOOL_COUNT = new Set(ALL_TOOLS.map((t) => t.slug)).size;

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getTool(slug: string) {
  return ALL_TOOLS.find((t) => t.slug === slug);
}

export function relatedTools(slug: string, limit = 6) {
  const tool = getTool(slug);
  if (!tool) return [];
  return tool.category.tools.filter((t) => t.slug !== slug).slice(0, limit);
}
