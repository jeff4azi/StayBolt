import { useState } from "react";
import { Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import ListingCard from "../components/ListingCard";

const FILTERS = ["all", "available", "taken"];

export default function FeedPage() {
  const { listings } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

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
      <div className="bg-white px-4 pt-5 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900">
            Stay<span className="text-green-600">Bolt</span>
          </h1>
          <p className="text-gray-400 text-[13px] mb-3">
            Find your perfect home
          </p>
          {/* Search */}
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
          {/* Filter chips */}
          <div className="flex gap-2 mt-3">
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
