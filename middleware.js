const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = process.env.VITE_SITE_URL;

const BOT_REGEX =
  /bot|crawl|slurp|spider|mediapartners|facebookexternalhit|whatsapp|telegrambot|twitterbot|linkedinbot|slackbot|discordbot|iframely|embedly|preview/i;

function escapeHtml(str) {
  return (str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function optimizeCloudinaryUrl(url, width = 800) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto:eco,w_${width},c_limit/`,
  );
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

async function sbFetch(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.[0] ?? null;
}

async function fetchProperty(id) {
  // listings_with_agents is the view the app reads from
  return sbFetch(
    `listings_with_agents?id=eq.${id}&select=title,location,description,cover_image_url,gallery,agent_name,rating,status&limit=1`,
  );
}

async function fetchAgent(id) {
  return sbFetch(
    `agents?id=eq.${id}&select=name,bio,avatar_url,rating&limit=1`,
  );
}

// ── HTML builder ──────────────────────────────────────────────────────────────

function buildHtml({
  title,
  description,
  image,
  pageUrl,
  siteName = "StayBolt",
}) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const img = escapeHtml(image);
  const u = escapeHtml(pageUrl);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${t}</title>
    <meta name="description" content="${d}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:url" content="${u}" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:image" content="${img}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${t}" />
    <meta name="twitter:description" content="${d}" />
    <meta name="twitter:image" content="${img}" />
    <meta http-equiv="refresh" content="0;url=${u}" />
  </head>
  <body><p>Redirecting to <a href="${u}">${t}</a>…</p></body>
</html>`;
}

// ── Route handlers ────────────────────────────────────────────────────────────

async function handleProperty(id, pageUrl) {
  const row = await fetchProperty(id);

  const title = row?.title ? `${row.title} – StayBolt` : "Property – StayBolt";

  const desc = row?.description
    ? row.description.slice(0, 200) + (row.description.length > 200 ? "…" : "")
    : row?.location
      ? `${row.location} · Listed on StayBolt`
      : "Find your next place on StayBolt";

  // Prefer cover image, fall back to first gallery item
  let rawImage = row?.cover_image_url ?? null;
  if (!rawImage && row?.gallery) {
    try {
      const g =
        typeof row.gallery === "string" ? JSON.parse(row.gallery) : row.gallery;
      rawImage = Array.isArray(g) ? g[0] : null;
    } catch {
      rawImage = null;
    }
  }
  const image = rawImage
    ? optimizeCloudinaryUrl(rawImage, 1200)
    : `${SITE_URL}/og-default.jpg`;

  return buildHtml({ title, description: desc, image, pageUrl });
}

async function handleAgent(id, pageUrl) {
  const row = await fetchAgent(id);

  const name = row?.name ?? "Agent";
  const title = `${name} – StayBolt Agent`;

  const desc = row?.bio
    ? row.bio.slice(0, 200) + (row.bio.length > 200 ? "…" : "")
    : `View ${name}'s listings and reviews on StayBolt`;

  const image = row?.avatar_url
    ? optimizeCloudinaryUrl(row.avatar_url, 600)
    : `${SITE_URL}/og-default.jpg`;

  return buildHtml({ title, description: desc, image, pageUrl });
}

// ── Middleware entry point ────────────────────────────────────────────────────

export default async function middleware(request) {
  const url = new URL(request.url);
  const { pathname } = url;

  const propertyMatch = pathname.match(/^\/property\/([a-f0-9-]{36})$/i);
  const agentMatch = pathname.match(/^\/agent\/([a-f0-9-]{36})$/i);

  if (!propertyMatch && !agentMatch) return; // not our routes — pass through

  const userAgent = request.headers.get("user-agent") ?? "";
  if (!BOT_REGEX.test(userAgent)) return; // real user — let Vite/React handle it

  const pageUrl = `${SITE_URL}${pathname}`;

  let html;
  if (propertyMatch) {
    html = await handleProperty(propertyMatch[1], pageUrl);
  } else {
    html = await handleAgent(agentMatch[1], pageUrl);
  }

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export const config = {
  matcher: ["/property/:id*", "/agent/:id*"],
};
