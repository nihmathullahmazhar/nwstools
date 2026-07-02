/** Decode an audio File/Blob into an AudioBuffer. */
export async function decodeAudio(file: Blob): Promise<AudioBuffer> {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();
  const buf = await ctx.decodeAudioData(await file.arrayBuffer());
  ctx.close();
  return buf;
}

/** Encode an AudioBuffer to a 16-bit PCM WAV Blob. */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numCh = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numCh * 2 + 44;
  const ab = new ArrayBuffer(length);
  const view = new DataView(ab);
  const channels: Float32Array[] = [];
  let offset = 0;

  const writeStr = (s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset++, s.charCodeAt(i));
  };
  const write16 = (v: number) => {
    view.setUint16(offset, v, true);
    offset += 2;
  };
  const write32 = (v: number) => {
    view.setUint32(offset, v, true);
    offset += 4;
  };

  writeStr("RIFF");
  write32(length - 8);
  writeStr("WAVE");
  writeStr("fmt ");
  write32(16);
  write16(1); // PCM
  write16(numCh);
  write32(sampleRate);
  write32(sampleRate * numCh * 2); // byte rate
  write16(numCh * 2); // block align
  write16(16); // bits per sample
  writeStr("data");
  write32(buffer.length * numCh * 2);

  for (let i = 0; i < numCh; i++) channels.push(buffer.getChannelData(i));
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < numCh; c++) {
      let sample = Math.max(-1, Math.min(1, channels[c][i]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, sample, true);
      offset += 2;
    }
  }
  return new Blob([ab], { type: "audio/wav" });
}

/** Render an AudioBuffer through a gain value into a new AudioBuffer. */
export async function processBuffer(
  buffer: AudioBuffer,
  opts: { gain?: number; start?: number; end?: number },
): Promise<AudioBuffer> {
  const start = opts.start ?? 0;
  const end = opts.end ?? buffer.duration;
  const sr = buffer.sampleRate;
  const frames = Math.max(1, Math.floor((end - start) * sr));
  const offline = new OfflineAudioContext(buffer.numberOfChannels, frames, sr);
  const src = offline.createBufferSource();

  // slice the region into a new buffer
  const startFrame = Math.floor(start * sr);
  const sliced = offline.createBuffer(buffer.numberOfChannels, frames, sr);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    sliced.copyToChannel(
      buffer.getChannelData(c).slice(startFrame, startFrame + frames),
      c,
    );
  }
  src.buffer = sliced;

  const gainNode = offline.createGain();
  gainNode.gain.value = opts.gain ?? 1;
  src.connect(gainNode);
  gainNode.connect(offline.destination);
  src.start();
  return offline.startRendering();
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
