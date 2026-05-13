/**
 * Thin wrapper around the StayBolt Express backend.
 * All image operations (upload / delete) go through here so that
 * Cloudinary credentials never touch the browser.
 */

import { compressImage } from "./imageUtils";

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error ?? `Request failed: ${res.status}`);
  }

  return json;
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

/**
 * Compress then upload a single image file (File | Blob) to Cloudinary via the backend.
 * @param {File|Blob} file
 * @param {string} [folder]  Cloudinary folder, defaults to "staybolt"
 * @returns {Promise<{ image_url: string, image_public_id: string }>}
 */
export async function uploadImage(file, folder = "staybolt") {
  const compressed = await compressImage(file);
  const base64 = await fileToBase64(compressed);
  return request("POST", "/upload-image", {
    file: base64,
    mimeType: file.type || "image/jpeg",
    fileName: file instanceof File ? file.name : undefined,
    folder,
  });
}

/**
 * Delete an image from Cloudinary by its URL (backend extracts the public_id).
 */
export async function deleteImageByUrl(url) {
  return request("DELETE", "/delete-image-by-url", { url });
}

/**
 * Delete an image from Cloudinary by its public_id.
 */
export async function deleteImage(publicId) {
  return request("DELETE", "/delete-image", { public_id: publicId });
}

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------

/**
 * Delete a listing and all its Cloudinary images in one call.
 */
export async function deleteListing(listingId) {
  return request("DELETE", "/delete-listing", { listingId });
}

/**
 * Delete a single gallery image from Cloudinary + listing_images table.
 */
export async function deleteListingImage(imageId, imageUrl) {
  return request("DELETE", "/delete-listing-image", { imageId, imageUrl });
}

/**
 * Remove a listing's cover image from Cloudinary and clear cover_image_url.
 */
export async function deleteCoverImage(listingId) {
  return request("DELETE", "/delete-cover-image", { listingId });
}

// ---------------------------------------------------------------------------
// Agents
// ---------------------------------------------------------------------------

/**
 * Remove an agent's avatar from Cloudinary and clear avatar_url.
 */
export async function deleteAgentAvatar(agentId) {
  return request("DELETE", "/delete-agent-avatar", { agentId });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // result is "data:<mime>;base64,<data>" — strip the prefix
      const result = reader.result;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
