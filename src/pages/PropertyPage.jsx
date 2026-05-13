import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MapPin,
  Clock,
  Zap,
  Droplets,
  Star,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabase";
import { PAYMENT_TYPES, formatCurrency } from "../lib/pricing";
import StarRating from "../components/StarRating";
import PricingDisplay from "../components/PricingDisplay";

const FALLBACK_IMG =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft")
        setCurrent((c) => (c - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % images.length);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [images.length, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="flex items-center justify-between px-4 pt-5 pb-3 shrink-0">
        <span className="text-white/60 text-[13px] font-medium">
          {current + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center active:bg-white/20"
        >
          <X size={18} className="text-white" />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <img
          key={current}
          src={images[current]}
          alt=""
          className="max-w-full max-h-full object-contain animate-fade-in"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 w-9 h-9 bg-white/10 rounded-full flex items-center justify-center active:bg-white/20"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 w-9 h-9 bg-white/10 rounded-full flex items-center justify-center active:bg-white/20"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 px-4 py-4 overflow-x-auto shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                current === i ? "border-white" : "border-white/20"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    listings,
    listingsLoading,
    isSaved,
    toggleSave,
    user,
    refreshListings,
  } = useApp();
  const [activeImg, setActiveImg] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [ratingSaving, setRatingSaving] = useState(false);
  const [agentRatingRow, setAgentRatingRow] = useState(null);
  const viewRecorded = useRef(false);

  const listing = listings.find((l) => l.id === id);

  useEffect(() => {
    viewRecorded.current = false;
  }, [id]);

  useEffect(() => {
    if (!id || viewRecorded.current) return;
    const key = `staybolt_view_${id}`;
    if (sessionStorage.getItem(key)) {
      console.log("[views] skipped — already recorded this session:", id);
      return;
    }

    viewRecorded.current = true;
    console.log("[views] calling increment_listing_views for:", id);

    supabase
      .rpc("increment_listing_views", { target_listing_id: id })
      .then(({ data, error }) => {
        if (error) {
          console.error("[views] RPC error:", error.message, error);
          viewRecorded.current = false;
        } else {
          console.log("[views] incremented successfully, response:", data);
          sessionStorage.setItem(key, "1");
        }
      });
  }, [id]);

  useEffect(() => {
    setActiveImg(0);
    setImgLoaded(false);
    setUserRating(0);
  }, [listing?.id]);

  useEffect(() => {
    if (!user?.id || !listing?.id) return;
    supabase
      .from("property_ratings")
      .select("rating")
      .eq("listing_id", listing.id)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.rating) setUserRating(data.rating);
      });
  }, [user?.id, listing?.id]);

  useEffect(() => {
    if (!listing?.agentId) return;
    supabase
      .from("agents")
      .select("rating, reviews_count")
      .eq("id", listing.agentId)
      .maybeSingle()
      .then(({ data }) => setAgentRatingRow(data));
  }, [listing?.agentId]);

  if (listingsLoading && !listing) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading…
      </div>
    );
  }
  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Property not found.
      </div>
    );
  }

  const agentName = listing.agentName ?? "Agent";
  const agentAvatar = listing.agentAvatarUrl || FALLBACK_IMG;
  const agentPhone = listing.agentPhone?.replace(/\D/g, "") || "";
  const saved = isSaved(listing.id);
  const pricingMessageLines = [
    listing.paymentType === PAYMENT_TYPES.FIRST_AND_YEARLY &&
    listing.firstPaymentAmount !== null
      ? `First payment: ${formatCurrency(listing.firstPaymentAmount)}`
      : null,
    listing.yearlyRentAmount !== null
      ? `Yearly rent: ${formatCurrency(listing.yearlyRentAmount)}/year`
      : null,
  ].filter(Boolean);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/", { replace: true });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/property/${listing.id}`,
    );
    alert("Link copied!");
  };

  const submitRating = async (stars) => {
    if (!user?.id) {
      alert("Sign in to rate properties.");
      navigate("/profile");
      return;
    }
    setRatingSaving(true);
    const { error } = await supabase.from("property_ratings").upsert(
      {
        listing_id: listing.id,
        user_id: user.id,
        rating: stars,
      },
      { onConflict: "listing_id,user_id" },
    );
    setRatingSaving(false);
    if (error) {
      console.error(error);
      alert(error.message || "Could not save rating");
      return;
    }
    setUserRating(stars);
    refreshListings();
  };

  const waLink =
    agentPhone.length > 0
      ? `https://wa.me/${agentPhone}?text=${encodeURIComponent(
          `Hello ${agentName},\n\nI came across the following property listing and I'm interested in learning more:\n\nProperty: ${listing.title}\nLocation: ${listing.location}\n${pricingMessageLines.join("\n")}\n\n${window.location.origin}/property/${listing.id}\n\nKindly get back to me at your earliest convenience. Thank you.`,
        )}`
      : null;

  return (
    <>
      {lightboxOpen && (
        <Lightbox
          images={listing.gallery}
          startIndex={activeImg}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="relative w-full aspect-[4/3] bg-gray-200 overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <img
            src={listing.gallery[activeImg]}
            alt={listing.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 cursor-pointer ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              e.target.src = FALLBACK_IMG;
              setImgLoaded(true);
            }}
            onClick={() => setLightboxOpen(true)}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-5 pointer-events-none">
            <button
              type="button"
              onClick={() => handleBack()}
              className="pointer-events-auto w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow active:scale-90 transition-transform"
            >
              <ArrowLeft size={18} className="text-gray-700" />
            </button>
            <div className="flex gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => toggleSave(listing.id)}
                className="w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow active:scale-90 transition-transform"
              >
                <Bookmark
                  size={16}
                  className={
                    saved ? "fill-green-500 text-green-500" : "text-gray-600"
                  }
                />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow active:scale-90 transition-transform"
              >
                <Share2 size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                listing.status === "available"
                  ? "bg-green-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {listing.status === "available" ? "Available" : "Taken"}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="pointer-events-auto flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-[12px] font-medium px-3 py-1.5 rounded-full active:bg-black/60"
            >
              <ZoomIn size={13} />
              {listing.gallery.length} photos
            </button>
          </div>
        </div>

        {listing.gallery.length > 1 && (
          <div className="flex gap-2 px-4 mt-3 max-w-md mx-auto overflow-x-auto pb-1">
            {listing.gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setActiveImg(i);
                  setImgLoaded(false);
                }}
                className={`shrink-0 w-16 rounded-xl overflow-hidden border-2 transition-all aspect-[4/3] ${
                  activeImg === i ? "border-green-500" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="max-w-md mx-auto px-4 mt-4">
          <h1 className="text-xl font-bold text-gray-900">{listing.title}</h1>
          <div className="flex items-center gap-1 mt-1 text-gray-500 text-[13px]">
            <MapPin size={13} />
            <span>{listing.location}</span>
          </div>
          <div className="mt-2">
            <PricingDisplay listing={listing} />
          </div>

          <div className="flex gap-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center flex-1">
              <Clock size={18} className="text-green-600" />
              <span className="text-[13px] font-semibold text-gray-800 mt-1">
                {listing.minutesToCampus} min
              </span>
              <span className="text-[11px] text-gray-400">To Campus</span>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="flex flex-col items-center flex-1">
              <Zap size={18} className="text-green-600" />
              <span className="text-[13px] font-semibold text-gray-800 mt-1 capitalize">
                {listing.electricityStatus}
              </span>
              <span className="text-[11px] text-gray-400">Electricity</span>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="flex flex-col items-center flex-1">
              <Droplets size={18} className="text-green-600" />
              <span className="text-[13px] font-semibold text-gray-800 mt-1 capitalize">
                {listing.waterSupply}
              </span>
              <span className="text-[11px] text-gray-400">Water</span>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-500 text-[14px] leading-relaxed">
              {listing.description}
            </p>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/agent/${listing.agentId}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                navigate(`/agent/${listing.agentId}`);
            }}
            className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer active:bg-gray-50 transition-colors"
          >
            <img
              src={agentAvatar}
              alt={agentName}
              className="w-12 h-12 rounded-full object-cover border-2 border-green-100"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-[14px]">
                {agentName}
              </p>
              <StarRating
                rating={Number(agentRatingRow?.rating) || 0}
                size={13}
              />
            </div>
            <span className="text-green-600 text-[13px] font-medium">
              View Profile →
            </span>
          </div>

          <button
            type="button"
            disabled={!waLink}
            onClick={() => waLink && window.open(waLink, "_blank")}
            className="mt-4 w-full flex items-center justify-center gap-3 bg-green-600 text-white rounded-2xl py-3.5 font-semibold text-[15px] shadow-sm active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle size={18} />
            {waLink ? "Contact Agent on WhatsApp" : "Phone not available"}
          </button>

          <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-3">
              Rate this property
            </h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={ratingSaving}
                  onClick={() => submitRating(s)}
                  className="active:scale-90 transition-transform disabled:opacity-50"
                >
                  <Star
                    size={28}
                    className={
                      s <= userRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
            {userRating > 0 && (
              <p className="text-green-600 text-[13px] mt-2 font-medium">
                Thanks for rating!
              </p>
            )}
            {!user && (
              <p className="text-gray-400 text-[12px] mt-2">
                Sign in to submit a rating.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
