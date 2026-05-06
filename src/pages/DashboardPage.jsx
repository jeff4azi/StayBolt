import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Star,
  Home,
  LogOut,
  ToggleLeft,
  ToggleRight,
  Pencil,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentAgent, listings, toggleStatus, logout } = useApp();

  const agentListings = listings.filter((l) => l.agentId === currentAgent?.id);
  const totalViews = agentListings.reduce((sum, l) => sum + l.views, 0);
  const avgRating =
    agentListings.length > 0
      ? (
          agentListings.reduce((sum, l) => sum + l.rating, 0) /
          agentListings.length
        ).toFixed(1)
      : "—";

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-5 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentAgent?.avatar}
              alt={currentAgent?.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-green-100"
            />
            <div>
              <p className="font-bold text-gray-900 text-[15px]">
                {currentAgent?.name}
              </p>
              <p className="text-green-600 text-[12px] font-medium">
                Agent Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <LogOut size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <Home size={18} className="text-green-600 mx-auto" />
            <p className="text-xl font-bold text-gray-900 mt-1">
              {agentListings.length}
            </p>
            <p className="text-[11px] text-gray-400">Listings</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <Eye size={18} className="text-green-600 mx-auto" />
            <p className="text-xl font-bold text-gray-900 mt-1">{totalViews}</p>
            <p className="text-[11px] text-gray-400">Views</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <Star size={18} className="text-yellow-400 mx-auto" />
            <p className="text-xl font-bold text-gray-900 mt-1">{avgRating}</p>
            <p className="text-[11px] text-gray-400">Avg Rating</p>
          </div>
        </div>

        {/* Add property CTA */}
        <button
          onClick={() => navigate("/add-property")}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white rounded-2xl py-3.5 font-semibold text-[15px] shadow-sm active:scale-[0.98] transition-transform mb-5"
        >
          <Plus size={18} />
          Add New Property
        </button>

        {/* My listings */}
        <h2 className="font-semibold text-gray-800 mb-3">My Listings</h2>
        {agentListings.length === 0 ? (
          <p className="text-gray-400 text-[14px]">
            No listings yet. Add your first property!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {agentListings.map((l) => (
              <div
                key={l.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="flex gap-3 p-3">
                  <img
                    src={l.image}
                    alt={l.title}
                    className="w-20 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-[13px] truncate">
                      {l.title}
                    </p>
                    <p className="text-green-600 text-[13px] font-bold mt-0.5">
                      {l.price}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-gray-400 text-[11px]">
                      <Eye size={11} />
                      <span>{l.views} views</span>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="border-t border-gray-100 flex items-center justify-between px-3 py-2">
                  <button
                    onClick={() => toggleStatus(l.id)}
                    className="flex items-center gap-1.5 text-[12px] font-medium active:scale-95 transition-transform"
                  >
                    {l.status === "available" ? (
                      <>
                        <ToggleRight size={18} className="text-green-500" />
                        <span className="text-green-600">Available</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft size={18} className="text-gray-400" />
                        <span className="text-gray-400">Taken</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate(`/property/${l.id}`)}
                    className="flex items-center gap-1.5 text-[12px] text-gray-500 font-medium active:scale-95 transition-transform"
                  >
                    <Pencil size={13} />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
