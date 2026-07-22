export function formatPrice(value: number, currency = "EUR") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency ?? "EUR").toUpperCase(),
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}
