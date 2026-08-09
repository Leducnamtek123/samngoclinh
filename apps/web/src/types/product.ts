export interface ProductItem {
  id: string;
  name: string;
  price: number;
  code?: string;
  image?: string;
  imageUrl?: string;
  images?: string[];
  category?: string;
  description?: string;
  ageYear?: number;
  ageYears?: number;
  origin?: string;
  stock?: number;
}

export interface GinsengPlantItem extends ProductItem {
  gardenName?: string;
  gardenLocation?: string;
  treeCount?: number;
  plantedAt?: string;
}
