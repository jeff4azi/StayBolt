import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import { agents } from "../data/listings";
import { useApp } from "../context/AppContext";
import ListingCard from "../components/ListingCard";
import StarRating from "../components/StarRating";

const COLLAPSE_THRESHOLD = 60;

export default function AgentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);

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

  const agent = agents.find((a) => a.id === id);
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

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div
        className={`bg-white sticky top-0 z-40 shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${
          collapsed ? "pt-3 pb-3" : "pt-5 pb-5"
        }`}
      >
        <div className="max-w-md mx-auto px-4">
          {/* Top bar — back + share always visible */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform shrink-0"
            >
              <ArrowLeft size={18} className="text-gray-700" />
            </button>

            {/* Collapsed inline name */}
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
              onClick={handleShare}
              className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform shrink-0"
            >
              <Share2 size={16} className="text-gray-600" />
            </button>
          </div>

          {/* Expanded agent info — collapses on scroll */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              collapsed ? "max-h-0 opacity-0 mt-0" : "max-h-64 opacity-100 mt-4"
            }`}
          >
            {/* Avatar + name + rating */}
            <div className="flex items-center gap-4">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-green-100 shrink-0"
              />
              <div className="flex-1">
                <h1 className="text-[18px] font-bold text-gray-900">
                  {agent.name}
                </h1>
                <StarRating rating={agent.rating} size={14} />
                <p className="text-gray-400 text-[12px] mt-0.5">
                  {agent.reviews} reviews
                </p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-500 text-[13px] mt-3 leading-relaxed">
              {agent.bio}
            </p>

            {/* Stats row */}
            <div className="flex gap-3 mt-4">
              {[
                { label: "Listings", value: agentListings.length },
                { label: "Rating", value: agent.rating },
                { label: "Reviews", value: agent.reviews },
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

      {/* Listings */}
      <div className="max-w-md mx-auto px-4 mt-5">
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
      </div>
    </div>
  );
}
