import { useApp } from "../context/AppContext";
import ListingCard from "../components/ListingCard";
import { Bookmark } from "lucide-react";

export default function SavedPage() {
  const { listings, saved } = useApp();
  const savedListings = listings.filter((l) => saved.includes(l.id));

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm sticky top-0 z-40">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Saved</h1>
          <p className="text-gray-400 text-[13px]">
            {savedListings.length} saved{" "}
            {savedListings.length === 1 ? "property" : "properties"}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4">
        {savedListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-300">
            <Bookmark size={48} strokeWidth={1.2} />
            <p className="mt-4 text-[15px] font-medium text-gray-400">
              No saved properties yet
            </p>
            <p className="text-[13px] text-gray-400 mt-1">
              Tap the bookmark icon on any listing to save it here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {savedListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
