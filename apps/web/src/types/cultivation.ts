export type TreeStatus =
  | 'available'
  | 'planted'
  | 'reserved'
  | 'sold'
  | 'harvested'
  | 'dead'
  | string;

export type TreeHealthStatus =
  | 'HEALTHY'
  | 'GOOD'
  | 'EXCELLENT'
  | 'WARNING'
  | 'DORMANT'
  | 'FAIR'
  | 'POOR'
  | string;

export interface CultivationTree {
  id: string;
  code: string;
  name?: string;
  ageYear: number;
  gardenId?: string | null;
  gardenCode?: string | null;
  bedId?: string | null;
  bedCode?: string | null;
  ownerId?: string | null;
  ownerName?: string | null;
  price?: number;
  unitPrice?: number;
  status: TreeStatus;
  healthStatus?: TreeHealthStatus;
  lat?: number | null;
  lng?: number | null;
  images?: string[];
  imageUrl?: string | null;
  qrCode?: string | null;
  plantedAt?: string | null;
  lastCaredAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export type Tree = CultivationTree;

export interface CultivationBed {
  id: string;
  code: string;
  name?: string;
  gardenId?: string | null;
  gardenCode?: string | null;
  capacity: number;
  currentCount?: number;
  treeCount?: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Bed = CultivationBed;

export interface CultivationGarden {
  id: string;
  code: string;
  name: string;
  location?: string;
  altitudeM?: number;
  areaM2?: number;
  totalBeds?: number;
  status: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type Garden = CultivationGarden;

export interface CultivationCareLog {
  id: string;
  treeId: string;
  treeCode?: string;
  gardenId?: string;
  actionType: string;
  notes?: string;
  healthStatus?: TreeHealthStatus;
  photos?: string[];
  performedBy?: string;
  loggedAt?: string;
  createdAt?: string;
}

export type CareLog = CultivationCareLog;

export interface QrCodeTraceability {
  code: string;
  tree?: CultivationTree;
  garden?: CultivationGarden;
  bed?: CultivationBed;
  careLogs?: CultivationCareLog[];
  origin?: string;
  verifiedAt?: string;
}
