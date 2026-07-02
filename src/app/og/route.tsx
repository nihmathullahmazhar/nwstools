import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? SITE_NAME).slice(0, 70);
  const subtitle = (searchParams.get("subtitle") ?? "Free, private tools that run in your browser").slice(0, 120);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f0f17",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#6d5efc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            n
          </div>
          <div style={{ color: "#a9a9b8", fontSize: 30, fontWeight: 600 }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: "#fff", fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            {title}
          </div>
          <div style={{ color: "#b4b4c4", fontSize: 34, lineHeight: 1.25 }}>{subtitle}</div>
        </div>

        <div style={{ display: "flex", gap: 28, color: "#8a8a99", fontSize: 26 }}>
          <span>Free</span>
          <span>·</span>
          <span>No sign-up</span>
          <span>·</span>
          <span>Runs in your browser</span>
          <span>·</span>
          <span>Works offline</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
