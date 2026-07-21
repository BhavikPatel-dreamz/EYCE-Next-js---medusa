import type { Product, Category, Collection } from "@/types/product";

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!;
const MEDUSA_SALES_CHANNEL_ID = process.env.NEXT_PUBLIC_VAPE_SALES_CHANNEL_ID!;

const PRODUCT_FIELDS = [
  "id",
  "title",
  "subtitle",
  "description",
  "handle",
  "is_giftcard",
  "discountable",
  "thumbnail",
  "category_id",
  "created_at",
  "updated_at",
  "*options",
  "*options.values",
  "*tags",
  "*images",
  "*variants",
  "*variants.options",
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

function medusaToProduct(p: MedusaProduct): Product {
  const variant = p.variants?.[0];
  const price =
    variant?.calculated_price?.calculated_amount ??
    variant?.prices?.[0]?.amount ??
    0;
  const compareAt =
    variant?.calculated_price?.compare_at_amount ??
    variant?.prices?.[0]?.compare_at_amount;

  return {
    id: p.id,
    slug: p.handle,
    name: p.title,
    tagline: p.subtitle || p.description?.slice(0, 80) || "",
    description: p.description || "",
    longDescription: p.description || "",
    category: p.collection?.handle || (p.metadata?.category as string) || "uncategorized",
    price: Math.round(price / 100),
    compareAtPrice: compareAt ? Math.round(compareAt / 100) : undefined,
    currency: variant?.calculated_price?.currency_code?.toUpperCase() || "USD",
    rating: (p.metadata?.rating as number) || 0,
    reviewCount: (p.metadata?.review_count as number) || 0,
    images: p.images?.map((img) => img.url) || (p.thumbnail ? [p.thumbnail] : []),
    variants:
      p.variants?.map((v) => {
        const vPrice = v.calculated_price?.calculated_amount ?? v.prices?.[0]?.amount ?? 0;
        const vCompare = v.calculated_price?.compare_at_amount ?? v.prices?.[0]?.compare_at_amount;
        return {
          id: v.id,
          name: [v.title, ...v.options.map((o) => o.value)].filter(Boolean).join(" / "),
          price: Math.round(vPrice / 100),
          compareAtPrice: vCompare ? Math.round(vCompare / 100) : undefined,
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
      default:
        params.order = "-created_at";
        break;
    }
  }

  params.fields = PRODUCT_FIELDS;

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

  const data = await medusaFetch<{ products: MedusaProduct[] }>(
    "/products",
    params,
  );

  const match = data.products.find((p) => p.handle === slug);
  return match ? medusaToProduct(match) : null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  const params: Record<string, string | string[]> = {
    fields: PRODUCT_FIELDS,
    id: ids,
    limit: String(ids.length),
  };
  const data = await medusaFetch<{ products: MedusaProduct[] }>("/products", params);
  return data.products.map(medusaToProduct);
}

export async function getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
  const params: Record<string, string | string[]> = {};

  params.fields = PRODUCT_FIELDS;

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

// ─── Cart types ──────────────────────────────────────────────────────────────

export type MedusaCart = {
  id: string;
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

// ─── Cart helpers ────────────────────────────────────────────────────────────

function getCartHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
  };
  if (MEDUSA_SALES_CHANNEL_ID) {
    headers["x-sales-channel"] = MEDUSA_SALES_CHANNEL_ID;
  }
  return headers;
}

export async function createCart(): Promise<MedusaCart> {
  const res = await fetch(`${MEDUSA_BACKEND_URL}/store/carts`, {
    method: "POST",
    headers: getCartHeaders(),
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to create cart: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.cart;
}

export async function getCart(cartId: string): Promise<MedusaCart> {
  const res = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
    headers: getCartHeaders(),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to get cart: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1,
): Promise<MedusaCart> {
  const res = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items`, {
    method: "POST",
    headers: getCartHeaders(),
    body: JSON.stringify({ variant_id: variantId, quantity }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to add to cart: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.cart;
}

export async function updateCartItem(
  cartId: string,
  lineItemId: string,
  quantity: number,
): Promise<MedusaCart> {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${lineItemId}`,
    {
      method: "POST",
      headers: getCartHeaders(),
      body: JSON.stringify({ quantity }),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to update cart item: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.cart;
}

export async function removeCartItem(
  cartId: string,
  lineItemId: string,
): Promise<MedusaCart> {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${lineItemId}`,
    {
      method: "DELETE",
      headers: getCartHeaders(),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to remove cart item: ${res.status} ${body}`);
  }

  if (res.status === 204) {
    return getCart(cartId);
  }

  const data = await res.json();
  return data.cart;
}

// ─── Checkout helpers ────────────────────────────────────────────────────────

export type MedusaRegion = {
  id: string;
  name: string;
  currency_code: string;
  countries: { iso_2: string; name: string }[];
};

export async function getRegions(): Promise<MedusaRegion[]> {
  const res = await fetch(`${MEDUSA_BACKEND_URL}/store/regions`, {
    headers: getCartHeaders(),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to fetch regions: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.regions;
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
  const res = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
    method: "POST",
    headers: getCartHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to update cart: ${res.status} ${body}`);
  }

  const result = await res.json();
  return result.cart;
}

export async function listShippingOptions(
  cartId: string,
): Promise<MedusaShippingOption[]> {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/shipping-options?cart_id=${cartId}`,
    { headers: getCartHeaders() },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to list shipping options: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.shipping_options;
}

export async function setShippingMethod(
  cartId: string,
  shippingOptionId: string,
): Promise<MedusaCart> {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/shipping-methods`,
    {
      method: "POST",
      headers: getCartHeaders(),
      body: JSON.stringify({ option_id: shippingOptionId }),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to set shipping method: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.cart;
}

export async function listPaymentProviders(
  regionId: string,
): Promise<MedusaPaymentProvider[]> {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/payment-providers?region_id=${regionId}`,
    { headers: getCartHeaders() },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to list payment providers: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.payment_providers;
}

export async function createPaymentCollection(
  cartId: string,
  retries = 3,
): Promise<MedusaPaymentCollection> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/store/payment-collections`,
      {
        method: "POST",
        headers: getCartHeaders(),
        body: JSON.stringify({ cart_id: cartId }),
      },
    );

    if (res.ok) {
      const data = await res.json();
      return data.payment_collection;
    }

    if (res.status === 409 && attempt < retries) {
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      continue;
    }

    const body = await res.text().catch(() => "");
    throw new Error(`Failed to create payment collection: ${res.status} ${body}`);
  }

  throw new Error("Failed to create payment collection");
}

export async function initiatePaymentSession(
  paymentCollectionId: string,
  providerId: string,
): Promise<MedusaPaymentSession> {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/payment-collections/${paymentCollectionId}/payment-sessions`,
    {
      method: "POST",
      headers: getCartHeaders(),
      body: JSON.stringify({ provider_id: providerId }),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to initiate payment session: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.payment_session;
}

export async function completeCart(
  cartId: string,
): Promise<MedusaCompleteCartResponse> {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/complete`,
    {
      method: "POST",
      headers: getCartHeaders(),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to complete cart: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data;
}
