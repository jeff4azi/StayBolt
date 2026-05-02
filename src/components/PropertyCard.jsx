import { useNavigate } from "react-router-dom";
import { MapPin, Phone, MessageCircle } from "lucide-react";

export default function PropertyCard({
  listing,
  agentPhone,
  showActions = true,
}) {
  const navigate = useNavigate();
  const isAvailable = listing.status === "available";

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Hi, I'm interested in your listing: ${listing.title} — ${listing.location}`,
    );
    window.open(
      `https://wa.me/${agentPhone?.replace(/\D/g, "")}?text=${msg}`,
      "_blank",
    );
  };

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${agentPhone}`;
  };

  return (
    <div
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#4E35D0]/60 hover:bg-white/8 transition-all duration-200 hover:shadow-lg hover:shadow-[#4E35D0]/10"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
            No image
          </div>
        )}
        {/* Status badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isAvailable
              ? "bg-emerald-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {isAvailable ? "Available" : "Taken"}
        </span>
        {/* Image count */}
        {listing.images && listing.images.length > 1 && (
          <span className="absolute top-3 right-3 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
            +{listing.images.length - 1}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-white font-semibold text-base leading-snug line-clamp-1">
            {listing.title}
          </h3>
          <span className="text-[#AA3E8B] font-bold text-sm whitespace-nowrap">
            {listing.price}
          </span>
        </div>

        <div className="flex items-center gap-1 text-white/50 text-xs mb-2">
          <MapPin size={11} />
          <span className="line-clamp-1">{listing.location}</span>
        </div>

        {listing.description && (
          <p className="text-white/60 text-xs line-clamp-2 mb-3">
            {listing.description}
          </p>
        )}

        {showActions && agentPhone && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-xs font-medium py-2 rounded-xl transition-colors"
            >
              <MessageCircle size={13} />
              WhatsApp
            </button>
            <button
              onClick={handleCall}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white/8 hover:bg-white/15 text-white/80 text-xs font-medium py-2 rounded-xl transition-colors"
            >
              <Phone size={13} />
              Call
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
