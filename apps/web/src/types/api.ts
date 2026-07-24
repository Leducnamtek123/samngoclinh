export interface PlantItem {
  id: string;
  name: string;
  code?: string;
  price: number;
  ageYear: number;
  status?: string;
  image?: string;
  description?: string;
  garden?: {
    id: string;
    name: string;
  };
  bed?: {
    id: string;
    code: string;
  };
  careLogs?: Array<{
    date: string;
    action: string;
  }>;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  stock?: number;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  category?: string;
  image?: string;
  publishedAt?: string;
  author?: string;
}

export interface UserProfile {
  id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role?: string | { id: string; name: string };
  verified?: boolean;
  rank?: string;
  referralCode?: string;
}

export interface MarketplaceListing {
  id: string;
  treeId: string;
  treeCode: string;
  ageYear: number;
  price: number;
  expectedProfit?: string;
  ownerName?: string;
  status: 'ACTIVE' | 'SOLD' | 'PENDING';
}
