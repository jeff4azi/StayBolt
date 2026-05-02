import { createContext, useContext, useState } from "react";

const ListingsContext = createContext(null);

function getListings() {
  try {
    return JSON.parse(localStorage.getItem("sb_listings") || "[]");
  } catch {
    return [];
  }
}

function saveListings(listings) {
  localStorage.setItem("sb_listings", JSON.stringify(listings));
}

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState(getListings);

  const addListing = (agentId, data) => {
    const newListing = {
      id: Date.now().toString(),
      agentId,
      ...data,
      status: data.status || "available",
      createdAt: new Date().toISOString(),
    };
    const updated = [newListing, ...listings];
    saveListings(updated);
    setListings(updated);
    return newListing;
  };

  const updateListing = (id, data) => {
    const updated = listings.map((l) => (l.id === id ? { ...l, ...data } : l));
    saveListings(updated);
    setListings(updated);
  };

  const deleteListing = (id) => {
    const updated = listings.filter((l) => l.id !== id);
    saveListings(updated);
    setListings(updated);
  };

  const getAgentListings = (agentId) =>
    listings.filter((l) => l.agentId === agentId);

  const getListing = (id) => listings.find((l) => l.id === id) || null;

  return (
    <ListingsContext.Provider
      value={{
        listings,
        addListing,
        updateListing,
        deleteListing,
        getAgentListings,
        getListing,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  return useContext(ListingsContext);
}
