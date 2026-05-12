import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Star,
  MessageCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { agents } from "../data/listings";
import StarRating from "../components/StarRating";

export default function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, isSaved, toggleSave } = useApp();
  const [activeImg, setActiveImg] = useState(0);
  const [userRating, setUserRating] = useState(0);

  const listing = listings.find((l) => l.id === id);
  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Property not found.
      </div>
    );
  }

  const agent = agents.find((a) => a.id === listing.agentId);
  const saved = isSaved(listing.id);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/property/${listing.id}`,
    );
    alert("Link copied!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Image hero */}
      <div className="relative">
        <img
          src={listing.gallery[activeImg]}
          alt={listing.title}
          className="w-full h-72 object-cover"
        />
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-5 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow active:scale-90 transition-transform"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div className="flex gap-2">
            <button
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
              onClick={handleShare}
              className="w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow active:scale-90 transition-transform"
            >
              <Share2 size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        {/* Status badge */}
        <span
          className={`absolute bottom-3 left-4 text-xs font-semibold px-2.5 py-1 rounded-full ${
            listing.status === "available"
              ? "bg-green-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {listing.status === "available" ? "Available" : "Taken"}
        </span>
      </div>

      {/* Gallery thumbnails */}
      {listing.gallery.length > 1 && (
        <div className="flex gap-2 px-4 mt-3 max-w-md mx-auto overflow-x-auto">
          {listing.gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                activeImg === i ? "border-green-500" : "border-transparent"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Details */}
      <div className="max-w-md mx-auto px-4 mt-4">
        <h1 className="text-xl font-bold text-gray-900">{listing.title}</h1>
        <div className="flex items-center gap-1 mt-1 text-gray-500 text-[13px]">
          <MapPin size={13} />
          <span>{listing.location}</span>
        </div>
        <p className="text-green-600 font-bold text-xl mt-2">{listing.price}</p>

        {/* Stats */}
        <div className="flex gap-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center flex-1">
            <Bed size={18} className="text-green-600" />
            <span className="text-[13px] font-semibold text-gray-800 mt-1">
              {listing.beds}
            </span>
            <span className="text-[11px] text-gray-400">Beds</span>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="flex flex-col items-center flex-1">
            <Bath size={18} className="text-green-600" />
            <span className="text-[13px] font-semibold text-gray-800 mt-1">
              {listing.baths}
            </span>
            <span className="text-[11px] text-gray-400">Baths</span>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="flex flex-col items-center flex-1">
            <Maximize2 size={18} className="text-green-600" />
            <span className="text-[13px] font-semibold text-gray-800 mt-1">
              {listing.sqft}
            </span>
            <span className="text-[11px] text-gray-400">Sq ft</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-500 text-[14px] leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Agent */}
        <div
          onClick={() => navigate(`/agent/${agent.id}`)}
          className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer active:bg-gray-50 transition-colors"
        >
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-green-100"
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-[14px]">
              {agent.name}
            </p>
            <StarRating rating={agent.rating} size={13} />
          </div>
          <span className="text-green-600 text-[13px] font-medium">
            View Profile →
          </span>
        </div>

        {/* Contact CTA */}
        <button
          onClick={() => {
            const propertyUrl = `${window.location.origin}/property/${listing.id}`;
            const message = `Hello ${agent.name},\n\nI came across the following property listing and I'm interested in learning more:\n\n🏠 *${listing.title}*\n📍 ${listing.location}\n💰 ${listing.price}\n\n🔗 ${propertyUrl}\n\nKindly get back to me at your earliest convenience. Thank you.`;
            window.open(
              `https://wa.me/${agent.phone}?text=${encodeURIComponent(message)}`,
              "_blank",
            );
          }}
          className="mt-4 w-full flex items-center justify-center gap-3 bg-green-600 text-white rounded-2xl py-3.5 font-semibold text-[15px] shadow-sm active:scale-[0.98] transition-transform"
        >
          <MessageCircle size={18} />
          Contact Agent on WhatsApp
        </button>

        {/* Rate this property */}
        <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3">
            Rate this property
          </h2>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setUserRating(s)}
                className="active:scale-90 transition-transform"
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
        </div>
      </div>
    </div>
  );
}
