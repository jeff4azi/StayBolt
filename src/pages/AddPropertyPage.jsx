import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { uploadImage } from "../lib/api";
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

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const { currentAgent, isLoggedIn, sessionReady, addListing } = useApp();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    paymentType: PAYMENT_TYPES.FIRST_AND_YEARLY,
    firstPaymentAmount: "",
    yearlyRentAmount: "",
    location: "",
    description: "",
    minutesToCampus: "",
    electricityStatus: "moderate",
    waterSupply: "borehole",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionReady || isLoggedIn) return;
    navigate("/profile", { replace: true });
  }, [sessionReady, isLoggedIn, navigate]);

  useEffect(() => {
    return () => {
      imageFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [imageFiles]);

  if (sessionReady && !isLoggedIn) return null;

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/", { replace: true });
  };

  if (sessionReady && isLoggedIn && !currentAgent) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 pb-24">
        Loading...
      </div>
    );
  }

  if (currentAgent && !currentAgent.phone?.trim()) {
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
            <h1 className="text-lg font-bold text-gray-900">Add Property</h1>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 mt-16 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
            <span className="text-3xl">📞</span>
          </div>
          <h2 className="text-[17px] font-bold text-gray-900">
            Phone number required
          </h2>
          <p className="text-gray-500 text-[14px] leading-relaxed max-w-xs">
            Renters need a way to contact you. Add a WhatsApp / phone number to
            your profile before listing a property.
          </p>
          <button
            type="button"
            onClick={() => navigate("/edit-profile")}
            className="mt-2 w-full max-w-xs bg-green-600 text-white rounded-2xl py-3.5 font-semibold text-[15px] shadow-sm active:scale-[0.98] transition-transform"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={() => handleBack()}
            className="text-gray-400 text-[13px] font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue =
      name === "firstPaymentAmount" || name === "yearlyRentAmount"
        ? value.replace(/\D/g, "")
        : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleFilePick = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newEntries = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImageFiles((prev) => [...prev, ...newEntries]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImageFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const yearlyRentAmount = toAmount(form.yearlyRentAmount);
    const firstPaymentAmount = toAmount(form.firstPaymentAmount);
    const needsFirstPayment =
      form.paymentType === PAYMENT_TYPES.FIRST_AND_YEARLY;

    // Validate everything first
    if (imageFiles.length === 0) {
      setError("Please upload at least one image.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!form.title.trim()) {
      setError("Property title is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!form.location.trim()) {
      setError("Location is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!form.minutesToCampus) {
      setError("Minutes to campus is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (yearlyRentAmount === null) {
      setError("Yearly rent amount is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (needsFirstPayment && firstPaymentAmount === null) {
      setError("First payment amount is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!form.description.trim()) {
      setError("Please add a description.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Upload images
    setUploading(true);
    let coverUrl = null;
    let galleryUrls = [];

    try {
      const results = await Promise.all(
        imageFiles.map((entry) => uploadImage(entry.file, "staybolt/listings")),
      );
      coverUrl = results[0].image_url;
      galleryUrls = results.map((r) => r.image_url);
    } catch (err) {
      setError(err.message ?? "Image upload failed. Please try again.");
      setUploading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setUploading(false);

    // Submit listing
    const { error: err } = await addListing({
      title: form.title,
      paymentType: form.paymentType,
      firstPaymentAmount: needsFirstPayment ? firstPaymentAmount : null,
      yearlyRentAmount,
      location: form.location,
      description: form.description,
      image: coverUrl,
      galleryUrls,
      minutesToCampus: Number(form.minutesToCampus) || 0,
      electricityStatus: form.electricityStatus,
      waterSupply: form.waterSupply,
    });

    if (err) {
      setError(err.message || "Could not add property. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitted(true);
    setTimeout(() => navigate("/profile"), 1500);
  };
  const busy = uploading || submitted;

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
          <h1 className="text-lg font-bold text-gray-900">Add Property</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto px-4 mt-5 flex flex-col gap-4"
      >
        {/* Image picker */}
        <div>
          {imageFiles.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {imageFiles.map((entry, i) => (
                <div
                  key={entry.preview}
                  className="relative shrink-0 w-24 h-20 rounded-xl overflow-hidden border border-gray-200"
                >
                  <img
                    src={entry.preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-green-600/80 text-white text-[9px] font-semibold text-center py-0.5">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 w-24 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 active:bg-gray-50 transition-colors"
              >
                <ImagePlus size={18} className="text-gray-300" />
                <span className="text-gray-300 text-[10px]">Add more</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center py-10 gap-2 active:bg-gray-50 transition-colors"
            >
              <ImagePlus size={28} className="text-gray-300" />
              <p className="text-gray-400 text-[13px]">Tap to upload images</p>
              <p className="text-gray-300 text-[11px]">
                First image becomes the cover photo
              </p>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFilePick}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-2xl">
            ⚠️ {error}
          </div>
        )}

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
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
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
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
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

        {/* Electricity & Water — side by side */}
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

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-green-600 text-white rounded-2xl py-3.5 font-semibold text-[15px] shadow-sm active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          {submitted
            ? "Property Added!"
            : uploading
              ? "Uploading images..."
              : "Submit Property"}
        </button>
      </form>
    </div>
  );
}
