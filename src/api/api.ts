import Medusa from "@medusajs/js-sdk";

export const sdk = new Medusa({
  baseUrl: "",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});
