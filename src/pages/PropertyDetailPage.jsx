import { useParams, useNavigate } from "react-router-dom";
import { useListings } from "../context/ListingsContext";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function getAgentById(id) {
  try {
    const agents = JSON.parse(localStorage.getItem("sb_agents") || "[]");
    return agents.find((a) => a.id === id) || null;
  } catch {
    return null;
  }
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListing } = useListings();
  const listing = getListing(id);
  const [imgIdx, setImgIdx] = useState(0);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4 pt-14">
        <div>
          <p className="text-5xl mb-4">🏠</p>
          <h2 className="text-white text-xl font-semibold mb-2">
            Listing not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="text-[#AA3E8B] text-sm hover:underline mt-2"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const agent = getAgentById(listing.agentId);
  const images = listing.images || [];
  const isAvailable = listing.status === "available";

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi, I'm interested in your listing: ${listing.title} — ${listing.location}`,
    );
    window.open(
      `https://wa.me/${agent?.phone?.replace(/\D/g, "")}?text=${msg}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen pt-14 pb-20">
      {/* Image gallery */}
      <div className="relative bg-black aspect-[4/3] max-h-72 overflow-hidden">
        {images.length > 0 ? (
          <>
            <img
              src={images[imgIdx]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setImgIdx((i) => (i - 1 + images.length) % images.length)
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === imgIdx ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
            No photos
          </div>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Status */}
        <span
          className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full ${
            isAvailable
              ? "bg-emerald-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {isAvailable ? "Available" : "Taken"}
        </span>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-white text-xl font-bold leading-snug">
            {listing.title}
          </h1>
          <span className="text-[#AA3E8B] font-bold text-lg whitespace-nowrap">
            {listing.price}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-white/50 text-sm mb-4">
          <MapPin size={13} />
          <span>{listing.location}</span>
        </div>

        {listing.description && (
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            {listing.description}
          </p>
        )}

        {/* Agent info */}
        {agent && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
            <p className="text-white/40 text-xs mb-2">Listed by</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4E35D0] to-[#AA3E8B] flex items-center justify-center text-white font-bold text-sm">
                {agent.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{agent.name}</p>
                <p className="text-white/40 text-xs">{agent.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact actions */}
        {agent && (
          <div className="flex gap-3">
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb558] text-white font-medium py-3.5 rounded-2xl transition-colors"
            >
              <MessageCircle size={18} />
              WhatsApp Agent
            </button>
            <a
              href={`tel:${agent.phone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium py-3.5 rounded-2xl transition-colors"
            >
              <Phone size={18} />
              Call Agent
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
