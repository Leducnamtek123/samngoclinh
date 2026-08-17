export type Article = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  image?: string;
  coverImage?: string;
  category?: string;
  publishedAt: string;
  author?: string;
  views?: number;
  featured?: boolean;
};

export type Banner = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  linkUrl?: string;
  pageKey?: string;
  order?: number;
  isActive?: boolean;
};

export type ShippingSetting = {
  value?: string | number;
  fixedFee?: number;
  freeShippingThreshold?: number;
  [key: string]: unknown;
};
