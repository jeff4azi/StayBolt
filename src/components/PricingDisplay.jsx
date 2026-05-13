import { PAYMENT_TYPES, formatCurrency } from "../lib/pricing";

export default function PricingDisplay({ listing, compact = false }) {
  const yearlyRent = formatCurrency(listing?.yearlyRentAmount);
  const firstPayment = formatCurrency(listing?.firstPaymentAmount);
  const isFirstAndYearly =
    listing?.paymentType === PAYMENT_TYPES.FIRST_AND_YEARLY;

  if (!yearlyRent && !firstPayment) {
    return <p className="text-gray-400">Price unavailable</p>;
  }

  const labelClass = compact
    ? "text-[11px] font-medium text-gray-500"
    : "text-[13px] font-medium text-gray-500";
  const amountClass = compact
    ? "text-[13px] font-bold text-green-600"
    : "text-xl font-bold text-green-600";
  const rowClass = compact ? "leading-tight" : "leading-snug";

  return (
    <div className={compact ? "space-y-0.5" : "space-y-1.5"}>
      {isFirstAndYearly && firstPayment && (
        <p className={rowClass}>
          <span className={labelClass}>First payment: </span>
          <span className={amountClass}>{firstPayment}</span>
        </p>
      )}
      {yearlyRent && (
        <p className={rowClass}>
          <span className={labelClass}>Yearly rent: </span>
          <span className={amountClass}>{yearlyRent}</span>
          <span className={amountClass}></span>
        </p>
      )}
    </div>
  );
}
