import { Bookmark, Share2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&q=60";

export default function ListingCard({ listing }) {
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useApp();
  const saved = isSaved(listing.id);
  const agentName = listing.agentName ?? "Agent";
  const agentAvatar = listing.agentAvatarUrl || FALLBACK_AVATAR;

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(
      `${window.location.origin}/property/${listing.id}`,
    );
    alert("Link copied!");
  };

  const handleSave = (e) => {
    e.stopPropagation();
    toggleSave(listing.id);
  };

  return (
    <div
      onClick={() => navigate(`/property/${listing.id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform duration-150 cursor-pointer"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={listing.image}
          alt={listing.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = FALLBACK_AVATAR;
          }}
        />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
            listing.status === "available"
              ? "bg-green-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {listing.status === "available" ? "Available" : "Taken"}
        </span>
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleSave}
            className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow active:scale-90 transition-transform"
          >
            <Bookmark
              size={15}
              className={
                saved ? "fill-green-500 text-green-500" : "text-gray-600"
              }
            />
          </button>
          <button
            onClick={handleShare}
            className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow active:scale-90 transition-transform"
          >
            <Share2 size={15} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug">
          {listing.title}
        </h3>
        <div className="flex items-center gap-1 mt-1 text-gray-500 text-[13px]">
          <MapPin size={12} />
          <span>{listing.location}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-green-600 font-bold text-[15px]">
            {listing.price}
          </span>
          <div className="flex items-center gap-2">
            <img
              src={agentAvatar}
              alt={agentName}
              className="w-6 h-6 rounded-full object-cover border border-gray-200"
            />
            <span className="text-gray-500 text-[12px]">{agentName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
