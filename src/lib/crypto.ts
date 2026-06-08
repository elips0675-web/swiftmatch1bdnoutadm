const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const ITERATIONS = 100000;
const SALT_KEY = 'swiftchat_salt';

function getKeyMaterial(): string {
  return localStorage.getItem('authToken') || 'anonymous';
}

function getSalt(): Uint8Array {
  try {
    const raw = localStorage.getItem(SALT_KEY);
    if (raw) {
      const parts = raw.split(',');
      return new Uint8Array(parts.map(Number));
    }
  } catch {}
  const salt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(SALT_KEY, Array.from(salt).join(','));
  return salt;
}

async function deriveKey(material: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyData = await crypto.subtle.importKey(
    'raw', enc.encode(material), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyData,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(plaintext: string): Promise<string> {
  try {
    const salt = getSalt();
    const key = await deriveKey(getKeyMaterial(), salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      enc.encode(plaintext)
    );
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    return btoa(String.fromCharCode(...combined));
  } catch {
    return '';
  }
}

export async function decrypt(ciphertext: string): Promise<string> {
  try {
    const salt = getSalt();
    const key = await deriveKey(getKeyMaterial(), salt);
    const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      data
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return '';
  }
}

export async function encryptStorage<T>(key: string, value: T): Promise<void> {
  try {
    const json = JSON.stringify(value);
    const encrypted = await encrypt(json);
    if (encrypted) localStorage.setItem(key, encrypted);
  } catch {}
}

export async function decryptStorage<T>(key: string): Promise<T | null> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const decrypted = await decrypt(raw);
    if (!decrypted) return null;
    return JSON.parse(decrypted) as T;
  } catch {
    return null;
  }
}

export function clearEncryptionSalt(): void {
  localStorage.removeItem(SALT_KEY);
}
