"use client";

import { useCallback, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Single-thread core: no SharedArrayBuffer / COOP-COEP headers required.
const CORE_VERSION = "0.12.10";
const CORE_BASE = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

let instance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

async function loadFFmpeg(): Promise<FFmpeg> {
  if (instance) return instance;
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const ff = new FFmpeg();
    // Let the bundler resolve the ESM class-worker (./worker.js) from our own
    // origin; only the core + wasm come from the CDN.
    await ff.load({
      coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
    });
    instance = ff;
    return ff;
  })();
  return loadPromise;
}

export { fetchFile };

export type FFmpegState = {
  ready: boolean;
  loading: boolean;
  progress: number; // 0..1
  busy: boolean;
  error: string;
};

export function useFFmpeg() {
  const ref = useRef<FFmpeg | null>(instance);
  const [state, setState] = useState<FFmpegState>({
    ready: !!instance,
    loading: false,
    progress: 0,
    busy: false,
    error: "",
  });

  const ensure = useCallback(async () => {
    if (ref.current) return ref.current;
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const ff = await loadFFmpeg();
      ff.on("progress", ({ progress }) =>
        setState((s) => ({ ...s, progress: Math.min(1, Math.max(0, progress)) })),
      );
      ref.current = ff;
      setState((s) => ({ ...s, ready: true, loading: false }));
      return ff;
    } catch (e) {
      console.error("[ffmpeg] load failed:", e);
      setState((s) => ({
        ...s,
        loading: false,
        error: "Couldn't load the video engine. Check your connection and try again.",
      }));
      throw new Error("ffmpeg load failed");
    }
  }, []);

  /** Run one ffmpeg job: write input, exec args, read output. */
  const run = useCallback(
    async (input: File, args: (inName: string, outName: string) => string[], outName: string) => {
      const ff = await ensure();
      setState((s) => ({ ...s, busy: true, progress: 0, error: "" }));
      try {
        const inName = "input" + (input.name.match(/\.[^.]+$/)?.[0] ?? "");
        await ff.writeFile(inName, await fetchFile(input));
        await ff.exec(args(inName, outName));
        const data = (await ff.readFile(outName)) as Uint8Array;
        await ff.deleteFile(inName).catch(() => {});
        await ff.deleteFile(outName).catch(() => {});
        setState((s) => ({ ...s, busy: false, progress: 1 }));
        return new Blob([data as BlobPart]);
      } catch {
        setState((s) => ({ ...s, busy: false, error: "Processing failed — the file or settings may be unsupported." }));
        throw new Error("ffmpeg exec failed");
      }
    },
    [ensure],
  );

  return { ...state, ensure, run, ffmpeg: ref };
}
