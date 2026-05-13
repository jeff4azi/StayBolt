import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Star, Send, MessageSquarePlus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { mapAgentReviewRow, mapAgentRow } from "../lib/mappers";
import { supabase } from "../lib/supabase";
import ListingCard from "../components/ListingCard";
import StarRating from "../components/StarRating";

const COLLAPSE_THRESHOLD = 60;
const FALLBACK_AVATAR =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

function InitialAvatar({ name }) {
  const initial = name?.trim().charAt(0).toUpperCase() || "?";
  // Generate a consistent hue from the name string
  const hue = name
    ? [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360
    : 200;
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-[14px] font-bold"
      style={{ backgroundColor: `hsl(${hue}, 55%, 48%)` }}
    >
      {initial}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-2">
        <InitialAvatar name={review.author} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-[13px]">
            {review.author}
          </p>
          <p className="text-gray-400 text-[11px]">{review.date}</p>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-200"
              }
            />
          ))}
        </div>
      </div>
      <p className="text-gray-500 text-[13px] leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
}

export default function AgentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, user } = useApp();

  const [agent, setAgent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [agentLoading, setAgentLoading] = useState(true);

  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);
  const [showForm, setShowForm] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > COLLAPSE_THRESHOLD && currentY > lastScrollY.current) {
        setCollapsed(true);
      } else if (
        currentY < lastScrollY.current ||
        currentY <= COLLAPSE_THRESHOLD
      ) {
        setCollapsed(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setAgentLoading(true);
      const { data: agentRow } = await supabase
        .from("agents")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      const { data: reviewRows } = await supabase
        .from("agent_reviews")
        .select("*")
        .eq("agent_id", id)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      setAgent(mapAgentRow(agentRow));
      setReviews((reviewRows || []).map(mapAgentReviewRow));
      setAgentLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (agentLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading…
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Agent not found.
      </div>
    );
  }

  const agentListings = listings.filter((l) => l.agentId === id);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/agent/${id}`);
    alert("Profile link copied!");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!selectedStar || !reviewText.trim() || !authorName.trim()) return;
    const avatarUrl = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
    const { error } = await supabase.from("agent_reviews").insert({
      agent_id: id,
      user_id: user?.id ?? null,
      author: authorName.trim(),
      avatar_url: avatarUrl,
      rating: selectedStar,
      comment: reviewText.trim(),
    });
    if (error) {
      setSubmitError(error.message || "Could not post review");
      return;
    }
    const { data: reviewRows } = await supabase
      .from("agent_reviews")
      .select("*")
      .eq("agent_id", id)
      .order("created_at", { ascending: false });
    setReviews((reviewRows || []).map(mapAgentReviewRow));
    setSubmitted(true);
    setAuthorName("");
    setReviewText("");
    setSelectedStar(0);
    setShowForm(false);
    const { data: agentRow } = await supabase
      .from("agents")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    setAgent(mapAgentRow(agentRow));
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div
        className={`bg-white sticky top-0 z-40 shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${
          collapsed ? "pt-3 pb-3" : "pt-5 pb-5"
        }`}
      >
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform shrink-0"
            >
              <ArrowLeft size={18} className="text-gray-700" />
            </button>
            <span
              className={`font-semibold text-gray-900 text-[15px] transition-all duration-300 ${
                collapsed
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {agent.name}
            </span>
            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform shrink-0"
            >
              <Share2 size={16} className="text-gray-600" />
            </button>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              collapsed ? "max-h-0 opacity-0 mt-0" : "max-h-72 opacity-100 mt-4"
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={agent.avatar || FALLBACK_AVATAR}
                alt={agent.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-green-100 shrink-0"
              />
              <div className="flex-1">
                <h1 className="text-[18px] font-bold text-gray-900">
                  {agent.name}
                </h1>
                <StarRating rating={agent.rating} size={14} />
                <p className="text-gray-400 text-[12px] mt-0.5">
                  {reviews.length} reviews
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-[13px] mt-3 leading-relaxed">
              {agent.bio || "—"}
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { label: "Listings", value: agentListings.length },
                { label: "Rating", value: Number(agent.rating).toFixed(1) },
                { label: "Reviews", value: reviews.length },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex-1 bg-green-50 rounded-2xl py-2.5 text-center"
                >
                  <p className="text-[16px] font-bold text-green-600">
                    {value}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-5 flex flex-col gap-6">
        <section>
          <h2 className="font-semibold text-gray-800 mb-3">
            Properties ({agentListings.length})
          </h2>
          {agentListings.length === 0 ? (
            <p className="text-gray-400 text-[14px]">No listings yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {agentListings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">
              Reviews ({reviews.length})
            </h2>
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-green-600 active:scale-95 transition-transform"
            >
              <MessageSquarePlus size={15} />
              {showForm ? "Cancel" : "Write a review"}
            </button>
          </div>

          {submitted && (
            <div className="mb-3 bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium px-4 py-2.5 rounded-2xl">
              ✓ Your review was posted!
            </div>
          )}
          {submitError && (
            <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-2.5 rounded-2xl">
              {submitError}
            </div>
          )}

          {showForm && (
            <form
              onSubmit={handleSubmitReview}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-col gap-3"
            >
              <p className="font-semibold text-gray-800 text-[14px]">
                Leave a review
              </p>

              <div>
                <p className="text-[12px] text-gray-400 mb-1.5">Your rating</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverStar(s)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setSelectedStar(s)}
                      className="active:scale-90 transition-transform"
                    >
                      <Star
                        size={26}
                        className={
                          s <= (hoverStar || selectedStar)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-200"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  Your name
                </p>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Tunde B."
                  required
                  className="w-full bg-transparent text-[14px] text-gray-800 placeholder-gray-300 outline-none"
                />
              </div>

              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  Your review
                </p>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this agent..."
                  rows={3}
                  required
                  className="w-full bg-transparent text-[14px] text-gray-800 placeholder-gray-300 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white rounded-xl py-3 font-semibold text-[14px] active:scale-[0.98] transition-transform"
              >
                <Send size={15} />
                Post Review
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-400">
              <MessageSquarePlus
                size={28}
                strokeWidth={1.5}
                className="mx-auto mb-2 text-gray-300"
              />
              <p className="text-[14px] font-medium">No reviews yet</p>
              <p className="text-[12px] mt-1">
                Be the first to review this agent.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
