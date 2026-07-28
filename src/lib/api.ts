import type { Product, Category, Collection } from "@/types/product";

// Deterministic pseudo-random rating based on product ID
function generateRating(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  const base = 4.0 + (Math.abs(hash) % 10) / 10; // 4.0 - 4.9
  return Math.round(base * 10) / 10;
}

function generateReviewCount(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 7) - hash + id.charCodeAt(i)) | 0;
  }
  return 20 + (Math.abs(hash) % 180); // 20 - 199 reviews
}

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!;
const MEDUSA_SALES_CHANNEL_ID = process.env.NEXT_PUBLIC_VAPE_SALES_CHANNEL_ID!;

// Dynamically resolved region ID — fetched once from Medusa and cached for the
// lifetime of the module. Prefers a EUR region; falls back to the first region
// returned. No env variable required.
let _regionIdPromise: Promise<string | undefined> | null = null;

function getDefaultRegionId(): Promise<string | undefined> {
  if (_regionIdPromise) return _regionIdPromise;
  _regionIdPromise = (async () => {
    try {
      const url = new URL("/store/regions", MEDUSA_BACKEND_URL);
      const res = await fetch(url.toString(), {
        headers: { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY },
        next: { revalidate: 3600 }, // cache for 1 hour
      });
      if (!res.ok) return undefined;
      const data: { regions: { id: string; currency_code: string }[] } = await res.json();
      const regions = data.regions ?? [];
      // Prefer EUR region, then fall back to first available
      const eur = regions.find((r) => r.currency_code?.toLowerCase() === "eur");
      return (eur ?? regions[0])?.id;
    } catch {
      return undefined;
    }
  })();
  return _regionIdPromise;
}

const PRODUCT_FIELDS = [
  "id",
  "title",
  "subtitle",
  "description",
  "handle",
  "is_giftcard",
  "discountable",
  "thumbnail",
  "created_at",
  "updated_at",
  "*tags",
  "*images",
  "*variants",
  "*variants.prices",
  "*variants.options",
  "*variants.calculated_price",
  "*variants.manage_inventory",
  "*variants.allow_backorder",
  "*variants.inventory_quantity",
  "*categories",
  "*collection",
].join(",");

interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  subtitle?: string;
  status: string;
  thumbnail?: string;
  is_giftcard?: boolean;
  discountable?: boolean;
  created_at: string;
  updated_at: string;
  images: { id: string; url: string }[];
  variants: {
    id: string;
    title: string;
    sku?: string;
    prices: { id: string; amount: number; currency_code: string; compare_at_amount?: number }[];
    options: { id: string; value: string; option: { id: string; title: string } }[];
    calculated_price?: { calculated_amount: number; compare_at_amount?: number; currency_code: string };
    manage_inventory?: boolean;
    allow_backorder?: boolean;
    inventory_quantity?: number;
  }[];
  options: {
    id: string;
    title: string;
    values: { id: string; value: string }[];
  }[];
  category_id: string;
  categories?: { id: string; handle: string }[];
  tags: { id: string; value: string }[];
  collection?: { id: string; title: string; handle: string };
  metadata?: Record<string, unknown>;
}

interface MedusaCategory {
  id: string;
  name: string;
  handle: string;
  description?: string;
  mpath?: string;
  metadata?: Record<string, unknown>;
  image?: string;
}

interface MedusaCollection {
  id: string;
  title: string;
  handle: string;
}

function pickPrice(
  prices: { amount: number; currency_code: string }[],
  fallback: number,
): { amount: number; currency: string } {
  const eur = prices.find((p) => p.currency_code?.toUpperCase() === "EUR");
  const picked = eur ?? prices[0];
  return {
    amount: picked?.amount ?? fallback,
    currency: picked?.currency_code?.toUpperCase() ?? "EUR",
  };
}

function pickCompareAt(
  prices: { compare_at_amount?: number; currency_code: string }[],
): number | undefined {
  const eur = prices.find((p) => p.currency_code?.toUpperCase() === "EUR");
  return (eur ?? prices[0])?.compare_at_amount;
}

function medusaToProduct(p: MedusaProduct): Product {
  const variant = p.variants?.[0];
  const allPrices = variant?.prices ?? [];
  const calc = variant?.calculated_price;

  const picked = pickPrice(allPrices, 0);
  const price = calc?.calculated_amount ?? picked.amount;
  const compareAt =
    calc?.compare_at_amount ??
    pickCompareAt(allPrices);
  const currency = calc?.currency_code?.toUpperCase() || picked.currency;

  return {
    id: p.id,
    slug: p.handle,
    name: p.title,
    tagline: p.subtitle || p.description?.slice(0, 80) || "",
    description: p.description || "",
    longDescription: p.description || "",
    category: p.collection?.handle || (p.metadata?.category as string) || "uncategorized",
    price,
    compareAtPrice: compareAt ?? undefined,
    currency,
    rating: (p.metadata?.rating as number) || generateRating(p.id),
    reviewCount: (p.metadata?.review_count as number) || generateReviewCount(p.id),
    images: p.images?.map((img) => img.url) || (p.thumbnail ? [p.thumbnail] : []),
    variants:
      p.variants?.map((v) => {
        const vPrices = v.prices ?? [];
        const vCalc = v.calculated_price;
        const vPicked = pickPrice(vPrices, 0);
        const vPrice = vCalc?.calculated_amount ?? vPicked.amount;
        const vCompare = vCalc?.compare_at_amount ?? pickCompareAt(vPrices);
        return {
          id: v.id,
          name: [v.title, ...v.options.map((o) => o.value)].filter(Boolean).join(" / "),
          price: vPrice,
          compareAtPrice: vCompare ?? undefined,
          inStock: v.manage_inventory === false || (v.manage_inventory === true && (v.inventory_quantity ?? 0) > 0) || !!v.allow_backorder,
          sku: v.sku || "",
        };
      }) || [],
    features: (p.metadata?.features as string[]) || [],
    specs:
      (p.metadata?.specs as { label: string; value: string }[]) ||
      p.options?.map((o) => ({
        label: o.title,
        value: o.values.map((v) => v.value).join(", "),
      })) ||
      [],
    tags: p.tags?.map((t) => t.value) || [],
    featured: p.metadata?.featured === true || p.metadata?.featured === "true",
    new: p.metadata?.new === true || p.metadata?.new === "true",
    bestseller: p.metadata?.bestseller === true || p.metadata?.bestseller === "true",
  };
}

function medusaCategoryToCategory(c: MedusaCategory) {
  return {
    id: c.id,
    slug: c.handle,
    name: c.name,
    description: c.description || "",
    image: "",
  };
}

async function medusaFetch<T>(
  path: string,
  params?: Record<string, string | string[] | undefined>,
): Promise<T> {
  const url = new URL(`/store${path}`, MEDUSA_BACKEND_URL);
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val === undefined || val === "") return;
      if (Array.isArray(val)) {
        val.forEach((v) => url.searchParams.append(`${key}[]`, v));
      } else {
        url.searchParams.set(key, val);
      }
    });
  }

  const headers: Record<string, string> = {
    "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
  };
  if (MEDUSA_SALES_CHANNEL_ID) {
    headers["x-sales-channel"] = MEDUSA_SALES_CHANNEL_ID;
  }

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Medusa API error: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`,
    );
  }

  return res.json();
}

export async function getProducts(opts?: {
  category?: string;
  collection?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  sort?: "price-asc" | "price-desc" | "newest" | "rating";
  search?: string;
}): Promise<{ products: Product[]; count: number }> {
  const params: Record<string, string | string[]> = {};

  if (opts?.search) {
    params.q = opts.search;
  }
  if (opts?.category) {
    const catId = CATEGORY_ID_MAP[opts.category];
    if (catId) {
      params.category_id = catId;
    }
  }
  if (opts?.limit) {
    params.limit = String(opts.limit);
  }
  if (opts?.offset) {
    params.offset = String(opts.offset);
  }
  if (opts?.sort) {
    switch (opts.sort) {
      case "newest":
        params.order = "-created_at";
        break;
      case "price-asc":
      case "price-desc":
      case "rating":
        // Price and rating sorting handled client-side after fetch
        params.order = "-created_at";
        break;
      default:
        params.order = "-created_at";
        break;
    }
  }

  params.fields = PRODUCT_FIELDS;
  const regionId = await getDefaultRegionId();
  if (regionId) params.region_id = regionId;

  const data = await medusaFetch<{ products: MedusaProduct[]; count: number }>(
    "/products",
    params,
  );

  let list = data.products.map(medusaToProduct);

  if (opts?.collection) {
    list = list.filter((p) => p.category === opts.collection);
  }
  if (opts?.featured) {
    params.featured = "true";
  }
  if (opts?.sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (opts?.sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (opts?.sort === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  }

  return { products: list, count: data.count };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const params: Record<string, string | string[]> = {};

  params.fields = PRODUCT_FIELDS;
  params.handle = slug;
  const regionId = await getDefaultRegionId();
  if (regionId) params.region_id = regionId;

  const data = await medusaFetch<{ products: MedusaProduct[] }>(
    "/products",
    params,
  );

  const match = data.products.find((p) => p.handle === slug);
  return match ? medusaToProduct(match) : null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  const regionId = await getDefaultRegionId();
  const params: Record<string, string | string[]> = {
    fields: PRODUCT_FIELDS,
    id: ids,
    limit: String(ids.length),
    ...(regionId ? { region_id: regionId } : {}),
  };
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      val.forEach((v) => searchParams.append(`${key}[]`, v));
    } else {
      searchParams.set(key, val);
    }
  });
  const data = await sdk.client.fetch<{ products: MedusaProduct[] }>(
    `/store/products?${searchParams.toString()}`,
  );
  return data.products.map(medusaToProduct);
}

export async function getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
  const params: Record<string, string | string[]> = {};

  params.fields = PRODUCT_FIELDS;
  const regionId = await getDefaultRegionId();
  if (regionId) params.region_id = regionId;

  const data = await medusaFetch<{ products: MedusaProduct[] }>("/products", params);

  return data.products
    .filter((p) => p.handle !== slug)
    .slice(0, limit)
    .map(medusaToProduct);
}

export async function getCategories(): Promise<Category[]> {
  const data = await medusaFetch<{ product_categories: (MedusaCategory & { category_children?: MedusaCategory[] })[] }>(
    "/product-categories",
    { fields: "id,name,handle,description,mpath,parent_category_id,image,metadata" },
  );

  const valid = new Set(["spoons", "bubblers&rigs", "bundles", "apparel", "accessories"]);

  const categories = data.product_categories
    .filter((c) => valid.has(c.handle.trim().toLowerCase()))
    .map((c) => {
      const slug = c.handle.trim().toLowerCase().replace(/&/g, "-");
      const apiImage = (c.metadata?.image as string) || c.image || "";
      return {
        id: c.id,
        slug,
        name: c.name.trim(),
        description: c.description || "",
        image: apiImage,
      };
    });

  const categoriesWithMissingImages = categories.filter((c) => !c.image);
  if (categoriesWithMissingImages.length > 0) {
    const productsData = await medusaFetch<{ products: MedusaProduct[] }>(
      "/products",
      { fields: "id,thumbnail,*images,*collection", limit: "50" },
    );
    const catSlugs = new Set(categoriesWithMissingImages.map((c) => c.slug.replace(/-/g, "")));
    const catFirstProduct = new Map<string, string>();
    for (const p of productsData.products) {
      const img = p.thumbnail || p.images?.[0]?.url;
      if (!img) continue;
      const catSlug = p.collection?.handle?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
      for (const c of categoriesWithMissingImages) {
        const target = c.slug.replace(/-/g, "");
        if (catSlug.includes(target) && !catFirstProduct.has(c.id)) {
          catFirstProduct.set(c.id, img);
        }
      }
      if (catFirstProduct.size >= categoriesWithMissingImages.length) break;
    }
    const fallbackImages = productsData.products
      .map((p) => p.thumbnail || p.images?.[0]?.url)
      .filter(Boolean) as string[];
    for (let i = 0; i < categoriesWithMissingImages.length; i++) {
      const c = categoriesWithMissingImages[i];
      c.image = catFirstProduct.get(c.id) || fallbackImages[i % fallbackImages.length] || "";
    }
  }

  return categories;
}

export async function getCategoryBySlug(slug: string) {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug) ?? null;
}

export async function getCollections(): Promise<Collection[]> {
  const data = await medusaFetch<{ collections: MedusaCollection[] }>(
    "/collections",
    { fields: "id,title,handle" },
  );

  return data.collections.map((c) => ({
    id: c.id,
    slug: c.handle.trim().toLowerCase(),
    name: c.title.trim(),
  }));
}

const CATEGORY_ID_MAP: Record<string, string> = {
  "spoons": "pcat_01KXZNW8QDKX2DK84AYTPEDPF4",
  "bubblers-rigs": "pcat_01KXZNPMY82K64A4F2FCK1J8QE",
  "bundles": "pcat_01KXZNJNMD0JR8HZJWD1MZTK4C",
  "apparel": "pcat_01KXZP0EAPFAD4NB5J2J0ZKRXW",
  "accessories": "pcat_01KXZBYS74DYK5EPNEGYMJGA37",
};

const CART_FIELDS =
  "id,completed_at,*items,items.id,items.title,items.quantity,items.unit_price,items.total,items.variant_id,items.variant,items.product,items.thumbnail,*items.variant,items.variant.id,items.variant.title,items.variant.product,items.variant.product.id,items.variant.product.title,items.variant.product.handle,items.variant.product.thumbnail,subtotal,total,currency_code,region_id,email,*shipping_address,*billing_address";

const CART_FIELDS_WITH_PAYMENT =
  "id,*items,items.id,items.title,items.quantity,items.unit_price,items.total,items.variant_id,items.variant,items.product,items.thumbnail,*items.variant,items.variant.id,items.variant.title,items.variant.product,items.variant.product.id,items.variant.product.title,items.variant.product.handle,items.variant.product.thumbnail,subtotal,total,currency_code,region_id,email,*shipping_address,*billing_address,payment_collection.id,payment_collection.cart_id,payment_collection.amount,*payment_collection.payment_sessions,payment_collection.payment_sessions.id,payment_collection.payment_sessions.provider_id,payment_collection.payment_sessions.status";

const ORDER_FIELDS = "id,display_id,status,email,total";

// ─── Cart types ──────────────────────────────────────────────────────────────

export type MedusaCart = {
  id: string;
  completed_at?: string | null;
  items: MedusaCartItem[];
  subtotal: number;
  total: number;
  currency_code: string;
  region_id?: string;
  email?: string;
  shipping_address?: MedusaAddress | null;
  billing_address?: MedusaAddress | null;
  shipping_methods?: MedusaShippingMethod[];
  payment_collection?: MedusaPaymentCollection | null;
};

/** Returns true if the Medusa cart has already been completed (converted to an order). */
export function isCartCompleted(cart: MedusaCart): boolean {
  return Boolean(cart.completed_at);
}

export type MedusaAddress = {
  id?: string;
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  postal_code: string;
  country_code: string;
  phone?: string;
};

export type MedusaCartItem = {
  id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  total: number;
  title: string;
  variant?: {
    id: string;
    title: string;
    product?: { id: string; title: string; handle: string; thumbnail?: string };
  };
};

export type MedusaShippingOption = {
  id: string;
  name: string;
  amount: number;
  price_type: "flat_rate" | "calculated";
  provider_id: string;
  data?: Record<string, unknown>;
};

export type MedusaShippingMethod = {
  id: string;
  shipping_option_id: string;
  name: string;
  amount: number;
};

export type MedusaPaymentProvider = {
  id: string;
  is_enabled: boolean;
};

export type MedusaPaymentSession = {
  id: string;
  provider_id: string;
  status: string;
  data?: Record<string, unknown>;
};

export type MedusaPaymentCollection = {
  id: string;
  cart_id: string;
  amount: number;
  payment_sessions?: MedusaPaymentSession[];
  payment?: MedusaPayment | null;
};

export type MedusaPayment = {
  id: string;
  provider_id: string;
  data?: Record<string, unknown>;
};

export type MedusaOrder = {
  id: string;
  display_id: number;
  status: string;
  email: string;
  total: number;
};

export type MedusaCompleteCartResponse =
  | { type: "order"; order: MedusaOrder }
  | { type: "cart"; cart: MedusaCart; error: { message: string; name: string; type: string } };

// ─── SDK client ──────────────────────────────────────────────────────────────
import { sdk } from "@/api/api";

// ─── Cart helpers (SDK-based, no CORS issues) ───────────────────────────────

function toMedusaCart(cart: unknown): MedusaCart {
  return cart as MedusaCart;
}

export async function createCart(): Promise<MedusaCart> {
  const regionId = await getDefaultRegionId();
  const { cart } = await sdk.store.cart.create(
    regionId ? { region_id: regionId } : {},
    { fields: CART_FIELDS },
  );
  return toMedusaCart(cart);
}

export async function getCart(cartId: string): Promise<MedusaCart> {
  const { cart } = await sdk.store.cart.retrieve(cartId, { fields: CART_FIELDS });
  return toMedusaCart(cart);
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1,
): Promise<MedusaCart> {
  const { cart } = await sdk.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  }, { fields: CART_FIELDS });
  return toMedusaCart(cart);
}

export async function updateCartItem(
  cartId: string,
  lineItemId: string,
  quantity: number,
): Promise<MedusaCart> {
  const { cart } = await sdk.store.cart.updateLineItem(cartId, lineItemId, {
    quantity,
  }, { fields: CART_FIELDS });
  return toMedusaCart(cart);
}

export async function removeCartItem(
  cartId: string,
  lineItemId: string,
): Promise<MedusaCart> {
  await sdk.store.cart.deleteLineItem(cartId, lineItemId);
  const { cart } = await sdk.store.cart.retrieve(cartId, { fields: CART_FIELDS });
  return toMedusaCart(cart);
}

// ─── Checkout helpers (SDK-based) ───────────────────────────────────────────

export type MedusaRegion = {
  id: string;
  name: string;
  currency_code: string;
  countries: { iso_2: string; name: string }[];
};

export async function getRegions(): Promise<MedusaRegion[]> {
  const { regions } = await sdk.store.region.list();
  return (regions ?? []) as MedusaRegion[];
}

export async function updateCart(
  cartId: string,
  data: {
    region_id?: string;
    email?: string;
    shipping_address?: Omit<MedusaAddress, "id">;
    billing_address?: Omit<MedusaAddress, "id">;
  },
): Promise<MedusaCart> {
  const { cart } = await sdk.store.cart.update(cartId, data, { fields: CART_FIELDS });
  return toMedusaCart(cart);
}

export async function listShippingOptions(
  cartId: string,
): Promise<MedusaShippingOption[]> {
  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: cartId,
  });
  return (shipping_options ?? []) as MedusaShippingOption[];
}

export async function setShippingMethod(
  cartId: string,
  shippingOptionId: string,
): Promise<MedusaCart> {
  const { cart } = await sdk.store.cart.addShippingMethod(cartId, {
    option_id: shippingOptionId,
  }, { fields: CART_FIELDS });
  return toMedusaCart(cart);
}

export async function listPaymentProviders(
  regionId: string,
): Promise<MedusaPaymentProvider[]> {
  const { payment_providers } = await sdk.store.payment.listPaymentProviders({
    region_id: regionId,
  });
  return (payment_providers ?? []) as MedusaPaymentProvider[];
}

export async function getCartWithPaymentCollection(cartId: string): Promise<MedusaCart> {
  const { cart } = await sdk.store.cart.retrieve(cartId, { fields: CART_FIELDS_WITH_PAYMENT });
  return toMedusaCart(cart);
}

// Per-cart in-flight promise — prevents concurrent POST /store/payment-collections
// requests for the same cart, which is the root cause of the 409 conflict error.
const _paymentCollectionPromises = new Map<string, Promise<MedusaPaymentCollection>>();

export function createPaymentCollection(cartId: string): Promise<MedusaPaymentCollection> {
  const inflight = _paymentCollectionPromises.get(cartId);
  if (inflight) return inflight;

  const promise = _createPaymentCollectionImpl(cartId).finally(() => {
    _paymentCollectionPromises.delete(cartId);
  });
  _paymentCollectionPromises.set(cartId, promise);
  return promise;
}

async function _createPaymentCollectionImpl(
  cartId: string,
): Promise<MedusaPaymentCollection> {
  // 1. Check whether a collection already exists before attempting to create.
  try {
    const cart = await getCartWithPaymentCollection(cartId);
    if (cart.payment_collection?.id) return cart.payment_collection;
  } catch {
    // ignore — will attempt creation below
  }

  const MAX_ATTEMPTS = 3;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const result = await sdk.client.fetch<{ payment_collection: MedusaPaymentCollection }>(
        "/store/payment-collections",
        { method: "POST", body: { cart_id: cartId } },
      );
      return result.payment_collection;
    } catch (err) {
      const isConflict =
        (err as { status?: number })?.status === 409 ||
        String(err).toLowerCase().includes("conflict");

      if (isConflict) {
        // Another request already created the collection — poll until we can
        // retrieve it (Medusa may need a moment to propagate it).
        for (let fetch = 0; fetch < 4; fetch++) {
          await new Promise((r) => setTimeout(r, 300 * (fetch + 1)));
          try {
            const cart = await getCartWithPaymentCollection(cartId);
            if (cart.payment_collection?.id) return cart.payment_collection;
          } catch {
            // keep polling
          }
        }
      }

      if (attempt < MAX_ATTEMPTS - 1) {
        await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Failed to create payment collection");
}

export async function initiatePaymentSession(
  paymentCollectionId: string,
  providerId: string,
): Promise<MedusaPaymentSession> {
  // A stable idempotency key scoped to this collection+provider pair prevents
  // Medusa from returning a 409 conflict when the same session is initiated
  // more than once (e.g. on retry or double-click).
  const idempotencyKey = `payment-session-${paymentCollectionId}-${providerId}`;
  const result = await sdk.client.fetch<{ payment_session: MedusaPaymentSession }>(
    `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
    {
      method: "POST",
      body: { provider_id: providerId },
      headers: { "Idempotency-Key": idempotencyKey },
    },
  );
  return result.payment_session;
}

/**
 * Ensures a payment collection and an active session for the given provider
 * exist on the cart. Safe to call multiple times — idempotent.
 */
export async function ensurePaymentSession(
  cartId: string,
  providerId: string,
): Promise<{ collection: MedusaPaymentCollection; session: MedusaPaymentSession }> {
  // 1. Get or create the payment collection.
  const collection = await createPaymentCollection(cartId);

  // 2. Check if a session for this provider already exists and is pending.
  const existingSession = collection.payment_sessions?.find(
    (s) => s.provider_id === providerId && s.status === "pending",
  );
  if (existingSession) {
    return { collection, session: existingSession };
  }

  // 3. Initiate (or re-initiate) the session.
  const session = await initiatePaymentSession(collection.id, providerId);
  return { collection, session };
}

export async function completeCart(
  cartId: string,
): Promise<MedusaCompleteCartResponse> {
  try {
    const result = await sdk.client.fetch<MedusaCompleteCartResponse>(
      `/store/carts/${cartId}/complete`,
      {
        method: "POST",
      },
    );
    if (result?.type === "order") {
      return { type: "order", order: result.order as MedusaOrder };
    }
    return {
      type: "cart",
      cart: toMedusaCart(result?.cart ?? result),
      error: { message: "Cart completion did not return an order", name: "cart_error", type: "cart" },
    };
  } catch (err) {
    return {
      type: "cart",
      cart: await getCart(cartId),
      error: {
        message: err instanceof Error ? err.message : "Failed to complete cart",
        name: "cart_error",
        type: "cart",
      },
    };
  }
}
