// Client-side image compression utilities and Cloudinary URL helpers.

const MAX_WIDTH = 1600;
const QUALITY = 0.75;
const TARGET_BYTES = 500 * 1024;

const AVATAR_SIZE = 128;
const AVATAR_QUALITY = 0.7;
const AVATAR_TARGET_BYTES = 50 * 1024;

// ---------------------------------------------------------------------------
// Listing image compression
// Max width 1600px, quality 0.75, target under 500KB
// ---------------------------------------------------------------------------
export async function compressImage(file) {
  const mimeType = file.type || "image/jpeg";
  const compressible = ["image/jpeg", "image/png", "image/webp"].includes(
    mimeType,
  );
  if (!compressible) return file;

  const bitmap = await createImageBitmap(file);
  const { width: origW, height: origH } = bitmap;

  const scale = origW > MAX_WIDTH ? MAX_WIDTH / origW : 1;
  const targetW = Math.round(origW * scale);
  const targetH = Math.round(origH * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  let blob = await canvasToBlob(canvas, mimeType, QUALITY);

  if (blob.size > TARGET_BYTES && mimeType !== "image/png") {
    const q = Math.max(
      0.4,
      Math.min(QUALITY, QUALITY * (TARGET_BYTES / blob.size)),
    );
    blob = await canvasToBlob(canvas, mimeType, q);
  }

  return blob;
}

// ---------------------------------------------------------------------------
// Avatar compression
// Fits inside 128x128, quality 0.7, target under 50KB
// ---------------------------------------------------------------------------
export async function compressAvatar(file) {
  const mimeType = file.type || "image/jpeg";
  const compressible = ["image/jpeg", "image/png", "image/webp"].includes(
    mimeType,
  );
  if (!compressible) return file;

  const bitmap = await createImageBitmap(file);
  const { width: origW, height: origH } = bitmap;

  const scale = Math.min(
    origW > AVATAR_SIZE ? AVATAR_SIZE / origW : 1,
    origH > AVATAR_SIZE ? AVATAR_SIZE / origH : 1,
  );
  const targetW = Math.round(origW * scale);
  const targetH = Math.round(origH * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  let blob = await canvasToBlob(canvas, mimeType, AVATAR_QUALITY);

  if (blob.size > AVATAR_TARGET_BYTES && mimeType !== "image/png") {
    const q = Math.max(
      0.3,
      Math.min(
        AVATAR_QUALITY,
        AVATAR_QUALITY * (AVATAR_TARGET_BYTES / blob.size),
      ),
    );
    blob = await canvasToBlob(canvas, mimeType, q);
  }

  return blob;
}

// ---------------------------------------------------------------------------
// Shared canvas helper
// ---------------------------------------------------------------------------
function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("canvas.toBlob returned null"));
      },
      mimeType,
      quality,
    );
  });
}

// ---------------------------------------------------------------------------
// Cloudinary URL optimisation
// Adds q_auto, f_auto, and optional width to any Cloudinary URL.
// Non-Cloudinary URLs pass through unchanged.
// ---------------------------------------------------------------------------
export function optimizeCloudinaryUrl(url, width) {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const uploadMarker = "/image/upload/";
  const idx = url.indexOf(uploadMarker);
  if (idx === -1) return url;

  const base = url.slice(0, idx + uploadMarker.length);
  const rest = url.slice(idx + uploadMarker.length);

  // Strip any existing q_, f_, w_ transforms to avoid double-applying
  const cleanRest = rest.replace(/^((?:[a-z_]+_[^,/]+,?)*\/)/, "");

  const transforms = ["q_auto", "f_auto"];
  if (width) transforms.push("w_" + width);

  return base + transforms.join(",") + "/" + cleanRest;
}
