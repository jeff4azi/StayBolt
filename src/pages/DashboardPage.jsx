import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useListings } from "../context/ListingsContext";
import PropertyForm from "../components/PropertyForm";
import { Plus, Pencil, Trash2, ExternalLink, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { agent } = useAuth();
  const { getAgentListings, addListing, updateListing, deleteListing } =
    useListings();
  const listings = getAgentListings(agent.id);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // listing object
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [copied, setCopied] = useState(false);

  const profileUrl = `${window.location.origin}/${agent.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdd = (data) => {
    addListing(agent.id, data);
    setShowForm(false);
  };

  const handleEdit = (data) => {
    updateListing(editing.id, data);
    setEditing(null);
  };

  const handleDelete = (id) => {
    deleteListing(id);
    setConfirmDelete(null);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white mb-1">
            Hey, {agent.name.split(" ")[0]} 👋
          </h1>
          <p className="text-white/50 text-sm">Manage your property listings</p>
        </div>

        {/* Share link card */}
        <div className="bg-gradient-to-r from-[#4E35D0]/30 to-[#AA3E8B]/20 border border-white/15 rounded-2xl p-4 mb-6">
          <p className="text-white/60 text-xs mb-2">
            Your shareable profile link
          </p>
          <div className="flex items-center gap-2">
            <span className="flex-1 text-white text-sm font-mono truncate">
              {profileUrl}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <Link
              to={`/${agent.slug}`}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              <ExternalLink size={13} />
              View
            </Link>
          </div>
        </div>

        {/* Add listing button */}
        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-white/20 hover:border-[#4E35D0] text-white/60 hover:text-white py-4 rounded-2xl text-sm transition-colors mb-6"
          >
            <Plus size={18} />
            Add new listing
          </button>
        )}

        {/* Add form */}
        {showForm && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
            <h2 className="text-white font-semibold text-sm mb-4">
              New Listing
            </h2>
            <PropertyForm
              onSubmit={handleAdd}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Edit form */}
        {editing && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
            <h2 className="text-white font-semibold text-sm mb-4">
              Edit Listing
            </h2>
            <PropertyForm
              initial={editing}
              onSubmit={handleEdit}
              onCancel={() => setEditing(null)}
            />
          </div>
        )}

        {/* Listings */}
        <div className="space-y-3">
          {listings.length === 0 && !showForm && (
            <div className="text-center py-12 text-white/30 text-sm">
              No listings yet. Add your first property above.
            </div>
          )}

          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="flex gap-3 p-3">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                      No img
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-white text-sm font-semibold line-clamp-1">
                      {listing.title}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        listing.status === "available"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {listing.status === "available" ? "Available" : "Taken"}
                    </span>
                  </div>
                  <p className="text-[#AA3E8B] text-xs font-medium mt-0.5">
                    {listing.price}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5 line-clamp-1">
                    {listing.location}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex border-t border-white/8">
                <button
                  onClick={() => {
                    setEditing(listing);
                    setShowForm(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-white/60 hover:text-white hover:bg-white/5 text-xs transition-colors"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <div className="w-px bg-white/8" />
                <button
                  onClick={() => setConfirmDelete(listing.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-white/60 hover:text-red-400 hover:bg-red-500/5 text-xs transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1030] border border-white/15 rounded-2xl p-6 max-w-xs w-full">
            <h3 className="text-white font-semibold mb-2">Delete listing?</h3>
            <p className="text-white/50 text-sm mb-5">
              This can't be undone. The listing will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/70 text-sm hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
