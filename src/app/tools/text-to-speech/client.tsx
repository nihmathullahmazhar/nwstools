"use client";

import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";

export default function TextToSpeech() {
  const [text, setText] = useState("Hello! This text is being read aloud, entirely on your device.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  // Assume supported for SSR + first client render (avoids hydration mismatch),
  // then correct after mount.
  const [supported, setSupported] = useState(true);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported("speechSynthesis" in window);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => {
      const v = speechSynthesis.getVoices();
      setVoices(v);
      if (v.length && !voiceName) {
        setVoiceName(v.find((x) => x.default)?.name ?? v[0].name);
      }
    };
    load();
    speechSynthesis.onvoiceschanged = load;
    return () => {
      speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported]);

  function speak() {
    if (!text.trim()) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === voiceName);
    if (voice) u.voice = voice;
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utterRef.current = u;
    speechSynthesis.speak(u);
    setSpeaking(true);
    setPaused(false);
  }
  function toggle() {
    if (paused) {
      speechSynthesis.resume();
      setPaused(false);
    } else {
      speechSynthesis.pause();
      setPaused(true);
    }
  }
  function stop() {
    speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }

  if (!supported)
    return <p className="panel p-6 text-center text-fg-muted">Speech synthesis isn’t supported in this browser.</p>;

  return (
    <div className="space-y-5">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text to read aloud…"
        className="min-h-[180px] text-[15px]"
        autoFocus
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <div className="mb-1.5 text-sm font-medium">Voice</div>
          <select
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-panel px-3 text-sm outline-none focus:border-accent"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
        <Slider label="Speed" value={rate} min={0.5} max={2} step={0.1} onChange={setRate} />
        <Slider label="Pitch" value={pitch} min={0} max={2} step={0.1} onChange={setPitch} />
      </div>

      <div className="flex gap-2">
        <Button onClick={speak} size="lg">
          <Play className="h-4 w-4" /> {speaking ? "Restart" : "Speak"}
        </Button>
        {speaking && (
          <>
            <Button variant="secondary" size="lg" onClick={toggle}>
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {paused ? "Resume" : "Pause"}
            </Button>
            <Button variant="secondary" size="lg" onClick={stop}>
              <Square className="h-4 w-4" /> Stop
            </Button>
          </>
        )}
      </div>
      <p className="text-xs text-fg-faint">
        Uses your browser’s built-in voices — available offline, nothing is sent anywhere.
      </p>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="text-accent">{value.toFixed(1)}×</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-10 w-full accent-[hsl(var(--accent))]"
      />
    </div>
  );
}
