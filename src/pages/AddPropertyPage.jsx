import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const { currentAgent, addListing } = useApp();

  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location) return;

    const newListing = {
      id: `p${Date.now()}`,
      agentId: currentAgent?.id,
      title: form.title,
      price: form.price,
      location: form.location,
      description: form.description,
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      ],
      beds: 2,
      baths: 1,
      sqft: 800,
      status: "available",
      views: 0,
      rating: 0,
    };

    addListing(newListing);
    setSubmitted(true);
    setTimeout(() => navigate("/profile"), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-4 shadow-sm sticky top-0 z-40">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Add Property</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto px-4 mt-5 flex flex-col gap-4"
      >
        {/* Image upload mock */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center py-10 gap-2 cursor-pointer active:bg-gray-50 transition-colors">
          <ImagePlus size={28} className="text-gray-300" />
          <p className="text-gray-400 text-[13px]">Tap to upload images</p>
          <p className="text-gray-300 text-[11px]">(Mock — no upload yet)</p>
        </div>

        {/* Fields */}
        {[
          {
            name: "title",
            label: "Property Title",
            placeholder: "e.g. 2 Bedroom Apartment in Lekki",
          },
          { name: "price", label: "Price", placeholder: "e.g. ₦350,000/yr" },
          {
            name: "location",
            label: "Location",
            placeholder: "e.g. Lekki Phase 1, Lagos",
          },
        ].map(({ name, label, placeholder }) => (
          <div
            key={name}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3"
          >
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              {label}
            </label>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              required={name !== "description"}
              className="w-full mt-1 text-[14px] text-gray-800 placeholder-gray-300 outline-none bg-transparent"
            />
          </div>
        ))}

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the property..."
            rows={4}
            className="w-full mt-1 text-[14px] text-gray-800 placeholder-gray-300 outline-none bg-transparent resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white rounded-2xl py-3.5 font-semibold text-[15px] shadow-sm active:scale-[0.98] transition-transform"
        >
          {submitted ? "✓ Property Added!" : "Submit Property"}
        </button>
      </form>
    </div>
  );
}
