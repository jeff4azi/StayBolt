import { optimizeCloudinaryUrl } from "./imageUtils";

const FALLBACK_IMG =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

function normalizeGallery(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Map a row from `listings_with_agents` to the shape the UI expects */
export function mapListingFromView(row) {
  const gallery = normalizeGallery(row.gallery);
  const rawPrimary = row.cover_image_url || gallery[0] || FALLBACK_IMG;
  const rawImages = gallery.length > 0 ? gallery : [rawPrimary];

  // Apply Cloudinary delivery optimisations (q_auto, f_auto, w_1200)
  // Non-Cloudinary URLs (Unsplash fallback, etc.) pass through unchanged
  const primary = optimizeCloudinaryUrl(rawPrimary, 1200);
  const images = rawImages.map((url) => optimizeCloudinaryUrl(url, 1200));

  return {
    id: row.id,
    agentId: row.agent_id,
    title: row.title,
    price: row.price_text,
    location: row.location,
    description: row.description ?? "",
    image: primary,
    gallery: images,
    minutesToCampus: row.minutes_to_campus ?? 0,
    electricityStatus: row.electricity_status ?? "moderate",
    waterSupply: row.water_supply ?? "borehole",
    status: row.status,
    views: row.views ?? 0,
    rating: Number(row.rating) || 0,
    ratingsCount: row.ratings_count ?? 0,
    agentName: row.agent_name,
    // Agent avatars are small — 200px is plenty for thumbnails
    agentAvatarUrl: optimizeCloudinaryUrl(row.agent_avatar_url, 200),
    agentPhone: row.agent_phone,
  };
}

export function mapAgentRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    // Agent profile avatar — 400px covers the largest display size used
    avatar: optimizeCloudinaryUrl(row.avatar_url, 400) || FALLBACK_IMG,
    rating: Number(row.rating) || 0,
    reviews: row.reviews_count ?? 0,
    bio: row.bio ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
  };
}

export function mapAgentReviewRow(row) {
  const d = row.created_at ? new Date(row.created_at) : null;
  const date = d
    ? d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "";
  return {
    id: row.id,
    author: row.author,
    avatar: optimizeCloudinaryUrl(row.avatar_url, 100) || FALLBACK_IMG,
    rating: row.rating,
    comment: row.comment,
    date,
  };
}
