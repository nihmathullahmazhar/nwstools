/* Passphrase-based AES-256-GCM encryption, all in the browser. */
const enc = new TextEncoder();
const dec = new TextDecoder();

function toB64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}
function fromB64(s: string) {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

async function deriveKey(pass: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 150000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptText(text: string, pass: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pass, salt);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(text)));
  const packed = new Uint8Array(salt.length + iv.length + ct.length);
  packed.set(salt);
  packed.set(iv, salt.length);
  packed.set(ct, salt.length + iv.length);
  return toB64(packed);
}

export async function decryptText(payload: string, pass: string): Promise<string> {
  const packed = fromB64(payload.trim());
  const salt = packed.slice(0, 16);
  const iv = packed.slice(16, 28);
  const ct = packed.slice(28);
  const key = await deriveKey(pass, salt);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct as BufferSource);
  return dec.decode(pt);
}
