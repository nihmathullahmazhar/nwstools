"use client";

import type { PDFDocumentProxy } from "pdfjs-dist";

const PDFJS_VERSION = "6.1.200";
const WORKER = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

let libPromise: Promise<typeof import("pdfjs-dist")> | null = null;

async function lib() {
  if (!libPromise) {
    libPromise = import("pdfjs-dist").then((m) => {
      m.GlobalWorkerOptions.workerSrc = WORKER;
      return m;
    });
  }
  return libPromise;
}

export async function openPdf(data: ArrayBuffer): Promise<PDFDocumentProxy> {
  const pdfjs = await lib();
  return pdfjs.getDocument({ data }).promise;
}

/** Render a page to a fresh canvas at the given scale. */
export async function renderPage(
  pdf: PDFDocumentProxy,
  pageNum: number,
  scale: number,
): Promise<HTMLCanvasElement> {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext("2d")!;
  await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  return canvas;
}

/** Extract plain text from every page. */
export async function extractText(data: ArrayBuffer): Promise<string[]> {
  const pdf = await openPdf(data);
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let last = 0;
    let text = "";
    for (const item of content.items) {
      if ("str" in item) {
        const y = item.transform[5];
        if (last && Math.abs(y - last) > 2) text += "\n";
        text += item.str + (item.hasEOL ? "\n" : " ");
        last = y;
      }
    }
    pages.push(text.trim());
  }
  return pages;
}
