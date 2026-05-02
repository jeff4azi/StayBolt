import { useParams } from "react-router-dom";
import { useListings } from "../context/ListingsContext";
import PropertyCard from "../components/PropertyCard";
import { Phone, MessageCircle } from "lucide-react";

function getAgentBySlug(slug) {
  try {
    const agents = JSON.parse(localStorage.getItem("sb_agents") || "[]");
    return agents.find((a) => a.slug === slug) || null;
  } catch {
    return null;
  }
}

export default function AgentProfilePage() {
  const { slug } = useParams();
  const agent = getAgentBySlug(slug);
  const { getAgentListings } = useListings();

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4 pt-14">
        <div>
          <p className="text-5xl mb-4">🏠</p>
          <h2 className="text-white text-xl font-semibold mb-2">
            Agent not found
          </h2>
          <p className="text-white/50 text-sm">
            This profile doesn't exist or the link may be incorrect.
          </p>
        </div>
      </div>
    );
  }

  const listings = getAgentListings(agent.id);
  const available = listings.filter((l) => l.status === "available");
  const taken = listings.filter((l) => l.status === "taken");

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi ${agent.name}, I found your listings on Staybolt and I'm interested.`,
    );
    window.open(
      `https://wa.me/${agent.phone?.replace(/\D/g, "")}?text=${msg}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Agent header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4E35D0] to-[#AA3E8B] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
            {agent.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-white text-xl font-bold">{agent.name}</h1>
          <p className="text-white/50 text-sm mt-1">Real Estate Agent</p>

          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-sm font-medium px-4 py-2 rounded-full transition-colors"
            >
              <MessageCircle size={15} />
              WhatsApp
            </button>
            <a
              href={`tel:${agent.phone}`}
              className="flex items-center gap-2 bg-white/8 hover:bg-white/15 text-white/80 text-sm font-medium px-4 py-2 rounded-full transition-colors"
            >
              <Phone size={15} />
              Call
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <p className="text-white font-bold text-lg">{listings.length}</p>
            <p className="text-white/50 text-xs">Total</p>
          </div>
          <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
            <p className="text-emerald-400 font-bold text-lg">
              {available.length}
            </p>
            <p className="text-white/50 text-xs">Available</p>
          </div>
          <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
            <p className="text-red-400 font-bold text-lg">{taken.length}</p>
            <p className="text-white/50 text-xs">Taken</p>
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-sm">
            No listings yet.
          </div>
        ) : (
          <>
            {available.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">
                  Available
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {available.map((l) => (
                    <PropertyCard
                      key={l.id}
                      listing={l}
                      agentPhone={agent.phone}
                    />
                  ))}
                </div>
              </div>
            )}

            {taken.length > 0 && (
              <div>
                <h2 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">
                  Taken
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 opacity-70">
                  {taken.map((l) => (
                    <PropertyCard
                      key={l.id}
                      listing={l}
                      agentPhone={agent.phone}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer branding */}
        <div className="text-center mt-12 text-white/25 text-xs">
          Powered by <span className="text-white/40 font-medium">Staybolt</span>
        </div>
      </div>
    </div>
  );
}
