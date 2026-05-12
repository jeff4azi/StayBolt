import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import ListingCard from "../components/ListingCard";
import logo from "../assets/logo.png";

const FILTERS = ["all", "available", "taken"];
const COLLAPSE_THRESHOLD = 60;

export default function FeedPage() {
  const { listings } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > COLLAPSE_THRESHOLD && currentY > lastScrollY.current) {
        // Scrolling down past threshold — collapse
        setCollapsed(true);
      } else if (
        currentY < lastScrollY.current ||
        currentY <= COLLAPSE_THRESHOLD
      ) {
        // Scrolling up or near top — expand
        setCollapsed(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filtered = listings.filter((l) => {
    const q = query.toLowerCase();
    const matchesQuery =
      l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q);
    const matchesFilter = filter === "all" || l.status === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div
        className={`bg-white sticky top-0 z-40 shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${
          collapsed ? "pt-3 pb-3" : "pt-5 pb-4"
        }`}
      >
        <div className="max-w-md mx-auto px-4">
          {/* Brand — shrinks/hides on collapse */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              collapsed ? "max-h-0 opacity-0 mb-0" : "max-h-16 opacity-100 mb-3"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="StayBolt logo"
                className="w-9 h-9 rounded-xl"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">StayBolt</h1>
                <p className="text-gray-400 text-[13px]">
                  Find your perfect home
                </p>
              </div>
            </div>
          </div>

          {/* Search — always visible, compact when collapsed */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-[14px] text-gray-700 placeholder-gray-400 outline-none w-full"
            />
          </div>

          {/* Filter chips — hide on collapse */}
          <div
            className={`flex gap-2 transition-all duration-300 ease-in-out overflow-hidden ${
              collapsed ? "max-h-0 opacity-0 mt-0" : "max-h-12 opacity-100 mt-3"
            }`}
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-md mx-auto px-4 pt-4 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No listings found</p>
            <p className="text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        )}
      </div>
    </div>
  );
}
