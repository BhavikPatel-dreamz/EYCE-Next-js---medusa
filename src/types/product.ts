export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  sku: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  variants: ProductVariant[];
  features: string[];
  specs: { label: string; value: string }[];
  tags: string[];
  featured?: boolean;
  new?: boolean;
  bestseller?: boolean;
};
