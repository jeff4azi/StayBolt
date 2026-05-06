import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import { agents } from "../data/listings";
import { useApp } from "../context/AppContext";
import ListingCard from "../components/ListingCard";
import StarRating from "../components/StarRating";

export default function AgentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings } = useApp();

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
    alert("Agent profile link copied!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-5 shadow-sm">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-green-100"
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
            <button
              onClick={handleShare}
              className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            >
              <Share2 size={16} className="text-gray-600" />
            </button>
          </div>

          <p className="text-gray-500 text-[13px] mt-3 leading-relaxed">
            {agent.bio}
          </p>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-md mx-auto px-4 pt-5">
        <h2 className="font-semibold text-gray-800 mb-3">
          Listings ({agentListings.length})
        </h2>
        {agentListings.length === 0 ? (
          <p className="text-gray-400 text-[14px]">No listings yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {agentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
