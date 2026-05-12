const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&q=60";

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
  const primary =
    row.cover_image_url ||
    gallery[0] ||
    FALLBACK_IMG;
  const images = gallery.length > 0 ? gallery : [primary];
  return {
    id: row.id,
    agentId: row.agent_id,
    title: row.title,
    price: row.price_text,
    location: row.location,
    description: row.description ?? "",
    image: primary,
    gallery: images,
    beds: row.beds ?? 0,
    baths: row.baths ?? 0,
    sqft: row.sqft ?? 0,
    status: row.status,
    views: row.views ?? 0,
    rating: Number(row.rating) || 0,
    ratingsCount: row.ratings_count ?? 0,
    agentName: row.agent_name,
    agentAvatarUrl: row.agent_avatar_url,
    agentPhone: row.agent_phone,
  };
}

export function mapAgentRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar_url || FALLBACK_IMG,
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
    avatar: row.avatar_url || FALLBACK_IMG,
    rating: row.rating,
    comment: row.comment,
    date,
  };
}
