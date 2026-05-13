import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { PAYMENT_TYPES, PAYMENT_TYPE_LABELS, toAmount } from "../lib/pricing";

const ELECTRICITY_OPTIONS = [
  { value: "steady", label: "Steady" },
  { value: "moderate", label: "Moderate" },
  { value: "poor", label: "Poor" },
];

const WATER_OPTIONS = [
  { value: "borehole", label: "Borehole" },
  { value: "well water", label: "Well Water" },
  { value: "unstable", label: "Unstable" },
];

export default function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    listings,
    listingsLoading,
    updateListing,
    currentAgent,
    isLoggedIn,
    sessionReady,
  } = useApp();

  const listing = listings.find((l) => l.id === id);

  const [form, setForm] = useState({
    title: "",
    paymentType: PAYMENT_TYPES.YEARLY,
    firstPaymentAmount: "",
    yearlyRentAmount: "",
    location: "",
    description: "",
    minutesToCampus: "",
    electricityStatus: "moderate",
    waterSupply: "borehole",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionReady || isLoggedIn) return;
    navigate("/profile", { replace: true });
  }, [sessionReady, isLoggedIn, navigate]);

  useEffect(() => {
    if (!listing) return;
    setForm({
      title: listing.title,
      paymentType: listing.paymentType ?? PAYMENT_TYPES.YEARLY,
      firstPaymentAmount: listing.firstPaymentAmount ?? "",
      yearlyRentAmount: listing.yearlyRentAmount ?? "",
      location: listing.location,
      description: listing.description || "",
      minutesToCampus: listing.minutesToCampus ?? "",
      electricityStatus: listing.electricityStatus ?? "moderate",
      waterSupply: listing.waterSupply ?? "borehole",
    });
  }, [listing]);

  if (sessionReady && !isLoggedIn) return null;

  if (listingsLoading && !listing) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 pb-24">
        Loading...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Property not found.
      </div>
    );
  }

  if (currentAgent && listing.agentId !== currentAgent.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 px-6 pb-24">
        <p className="text-center">You can only edit your own listings.</p>
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="mt-4 text-green-600 font-semibold text-[14px]"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/", { replace: true });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const yearlyRentAmount = toAmount(form.yearlyRentAmount);
    const firstPaymentAmount = toAmount(form.firstPaymentAmount);
    const needsFirstPayment =
      form.paymentType === PAYMENT_TYPES.FIRST_AND_YEARLY;

    if (
      !form.title ||
      !form.location ||
      yearlyRentAmount === null ||
      (needsFirstPayment && firstPaymentAmount === null)
    )
      return;
    const { error: err } = await updateListing(id, {
      title: form.title,
      paymentType: form.paymentType,
      firstPaymentAmount: needsFirstPayment ? firstPaymentAmount : null,
      yearlyRentAmount,
      location: form.location,
      description: form.description,
      minutesToCampus: Number(form.minutesToCampus) || 0,
      electricityStatus: form.electricityStatus,
      waterSupply: form.waterSupply,
    });
    if (err) {
      setError(err.message || "Could not save");
      return;
    }
    setSaved(true);
    setTimeout(() => navigate("/profile"), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 pt-5 pb-4 shadow-sm sticky top-0 z-40">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleBack()}
            className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Edit Property</h1>
            <p className="text-gray-400 text-[12px] truncate max-w-[220px]">
              {listing.title}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto px-4 mt-5 flex flex-col gap-4"
      >
        {/* Cover image preview */}
        <div className="relative rounded-2xl overflow-hidden h-40">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-1">
            <ImagePlus size={24} className="text-white" />
            <p className="text-white text-[12px] font-medium">Cover image</p>
          </div>
        </div>

        {/* Title / Location */}
        {[
          {
            name: "title",
            label: "Property Title",
            placeholder: "e.g. Self Contain in Ijagun",
          },
          {
            name: "location",
            label: "Location",
            placeholder: "e.g. Imaweje, TASUED",
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
              required
              className="w-full mt-1 text-[14px] text-gray-800 placeholder-gray-300 outline-none bg-transparent"
            />
          </div>
        ))}

        {/* Pricing */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            Payment Type
          </label>
          <select
            name="paymentType"
            value={form.paymentType}
            onChange={handleChange}
            className="w-full mt-1 text-[14px] text-gray-800 outline-none bg-transparent"
          >
            {Object.entries(PAYMENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {form.paymentType === PAYMENT_TYPES.FIRST_AND_YEARLY && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              First Payment Amount
            </label>
            <input
              name="firstPaymentAmount"
              type="number"
              min="0"
              value={form.firstPaymentAmount}
              onChange={handleChange}
              placeholder="e.g. 200000"
              required
              className="w-full mt-1 text-[14px] text-gray-800 placeholder-gray-300 outline-none bg-transparent"
            />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            Yearly Rent Amount
          </label>
          <input
            name="yearlyRentAmount"
            type="number"
            min="0"
            value={form.yearlyRentAmount}
            onChange={handleChange}
            placeholder="e.g. 150000"
            required
            className="w-full mt-1 text-[14px] text-gray-800 placeholder-gray-300 outline-none bg-transparent"
          />
        </div>

        {/* Minutes to campus */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            Minutes to TASUED Campus
          </label>
          <input
            name="minutesToCampus"
            type="number"
            min="0"
            value={form.minutesToCampus}
            onChange={handleChange}
            placeholder="e.g. 10"
            className="w-full mt-1 text-[14px] text-gray-800 placeholder-gray-300 outline-none bg-transparent"
          />
        </div>

        {/* Electricity & Water */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Electricity
            </label>
            <select
              name="electricityStatus"
              value={form.electricityStatus}
              onChange={handleChange}
              className="w-full mt-1 text-[14px] text-gray-800 outline-none bg-transparent"
            >
              {ELECTRICITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Water Supply
            </label>
            <select
              name="waterSupply"
              value={form.waterSupply}
              onChange={handleChange}
              className="w-full mt-1 text-[14px] text-gray-800 outline-none bg-transparent"
            >
              {WATER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

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

        {error && <p className="text-red-600 text-[13px] px-1">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white rounded-2xl py-3.5 font-semibold text-[15px] shadow-sm active:scale-[0.98] transition-transform"
        >
          {saved ? "Changes Saved!" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
