import { Bookmark, Share2, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { formatCurrency } from "../lib/pricing";

const FALLBACK_AVATAR =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

export default function ListingCard({ listing }) {
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useApp();
  const saved = isSaved(listing.id);
  const agentName = listing.agentName ?? "Agent";
  const agentAvatar = listing.agentAvatarUrl || FALLBACK_AVATAR;
  const annualRent = formatCurrency(listing.yearlyRentAmount);

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
      className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => (e.target.src = FALLBACK_AVATAR)}
        />

        {/* Gradient Overlay for better button visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg backdrop-blur-md shadow-sm ${
              listing.status === "available"
                ? "bg-green-500/90 text-white"
                : "bg-gray-800/80 text-white"
            }`}
          >
            {listing.status === "available" ? "Available" : "Taken"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleSave}
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-gray-50 active:scale-90 transition-all"
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
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-gray-50 active:scale-90 transition-all"
          >
            <Share2 size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-gray-500">
              <MapPin size={14} className="text-gray-400" />
              <span className="text-sm font-medium">{listing.location}</span>
            </div>
          </div>
        </div>

        <div className="mt-1.5 pt-1.5 border-t border-gray-50 flex items-center justify-between">
          <p className="leading-tight">
            <span className="text-[11px] font-medium text-gray-500">
              Annual rent:{" "}
            </span>
            <span className="text-[13px] font-bold text-green-600">
              {annualRent || "Unavailable"}
            </span>
            {annualRent && (
              <span className="text-[13px] font-bold text-green-600">
                /year
              </span>
            )}
          </p>

          <div className="flex flex-col items-end gap-1">
            {/* Rating */}
            {listing.rating > 0 && (
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md">
                <Star size={10} className="fill-yellow-500 text-yellow-500" />
                <span className="text-yellow-700 text-[11px] font-bold">
                  {Number(listing.rating).toFixed(1)}
                </span>
              </div>
            )}
            {/* Agent */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-[11px] font-medium">
                {agentName}
              </span>
              <img
                src={agentAvatar}
                alt={agentName}
                className="w-6 h-6 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
