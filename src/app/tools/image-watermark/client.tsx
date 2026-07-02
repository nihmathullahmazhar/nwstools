"use client";

import { useEffect, useRef, useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Input, Segmented } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { loadImage, canvasToBlob } from "@/lib/image";
import { Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Pos = "tl" | "tc" | "tr" | "cl" | "cc" | "cr" | "bl" | "bc" | "br" | "tile";

export default function ImageWatermark() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("image");
  const [text, setText] = useState("© Toolkit");
  const [size, setSize] = useState(6);
  const [opacity, setOpacity] = useState(0.5);
  const [color, setColor] = useState("#ffffff");
  const [pos, setPos] = useState<Pos>("br");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function onFile(file: File) {
    const image = await loadImage(file);
    setImg(image);
    setName(file.name.replace(/\.[^.]+$/, ""));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const fontSize = (size / 100) * Math.min(canvas.width, canvas.height);
    ctx.font = `600 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.textBaseline = "middle";
    const pad = fontSize * 0.6;
    const m = ctx.measureText(text);

    if (pos === "tile") {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.textAlign = "center";
      const stepX = m.width + fontSize * 3;
      const stepY = fontSize * 3;
      for (let y = -canvas.height; y < canvas.height; y += stepY)
        for (let x = -canvas.width; x < canvas.width; x += stepX)
          ctx.fillText(text, x, y);
      ctx.restore();
    } else {
      const left = pos[1] === "l" ? "left" : pos[1] === "r" ? "right" : "center";
      ctx.textAlign = left;
      const x = pos[1] === "l" ? pad : pos[1] === "r" ? canvas.width - pad : canvas.width / 2;
      const y = pos[0] === "t" ? pad + fontSize / 2 : pos[0] === "b" ? canvas.height - pad - fontSize / 2 : canvas.height / 2;
      ctx.fillText(text, x, y);
    }
    ctx.globalAlpha = 1;
  }, [img, text, size, opacity, color, pos]);

  async function save() {
    if (!canvasRef.current) return;
    download(await canvasToBlob(canvasRef.current, "image/png"), `${name}-watermarked.png`);
  }

  if (!img) return <Dropzone onFile={onFile} />;

  const grid: Pos[] = ["tl", "tc", "tr", "cl", "cc", "cr", "bl", "bc", "br"];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="panel grid place-items-center overflow-hidden p-4">
        <canvas ref={canvasRef} className="max-h-[440px] w-auto rounded-lg" />
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-medium">{name}</span>
          <button onClick={() => setImg(null)} className="text-fg-faint hover:text-fg">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div>
          <div className="mb-1.5 text-sm font-medium">Text</div>
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <div>
          <div className="mb-1.5 text-sm font-medium">Placement</div>
          <div className="grid w-24 grid-cols-3 gap-1">
            {grid.map((g) => (
              <button
                key={g}
                onClick={() => setPos(g)}
                className={cn(
                  "aspect-square rounded border text-[0]",
                  pos === g ? "border-accent bg-accent" : "border-border hover:bg-panel-raised",
                )}
                aria-label={g}
              />
            ))}
          </div>
          <Button
            variant={pos === "tile" ? "primary" : "secondary"}
            size="sm"
            className="mt-2"
            onClick={() => setPos("tile")}
          >
            Tile / repeat
          </Button>
        </div>

        <Slider label="Size" value={size} min={2} max={20} onChange={setSize} suffix="%" />
        <Slider
          label="Opacity"
          value={Math.round(opacity * 100)}
          min={5}
          max={100}
          onChange={(v) => setOpacity(v / 100)}
          suffix="%"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Color</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent"
          />
        </div>

        <Button onClick={save} className="w-full" size="lg">
          <Download className="h-4 w-4" /> Download PNG
        </Button>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="text-accent">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[hsl(var(--accent))]"
      />
    </div>
  );
}
