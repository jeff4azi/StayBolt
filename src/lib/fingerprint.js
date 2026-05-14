import FingerprintJS from "@fingerprintjs/fingerprintjs";

const STORAGE_KEY = "staybolt_browser_fingerprint";

let fingerprintPromise = null;

export async function getBrowserFingerprint() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;

  if (!fingerprintPromise) {
    fingerprintPromise = FingerprintJS.load()
      .then((fp) => fp.get())
      .then((result) => {
        localStorage.setItem(STORAGE_KEY, result.visitorId);
        return result.visitorId;
      })
      .catch((error) => {
        fingerprintPromise = null;
        throw error;
      });
  }

  return fingerprintPromise;
}
