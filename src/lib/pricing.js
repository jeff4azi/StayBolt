export const PAYMENT_TYPES = {
  YEARLY: "yearly",
  FIRST_AND_YEARLY: "first_and_yearly",
};

export const PAYMENT_TYPE_LABELS = {
  [PAYMENT_TYPES.FIRST_AND_YEARLY]: "First payment then yearly rent",
  [PAYMENT_TYPES.YEARLY]: "Yearly rent only",
};

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function toAmount(value) {
  if (value === null || value === undefined || value === "") return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function formatCurrency(value) {
  const amount = toAmount(value);
  return amount === null ? "" : currencyFormatter.format(amount);
}
