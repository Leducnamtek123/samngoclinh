export type CultivationStatus = "active" | "inactive" | "maintenance" | "harvested" | "archived"
export type TreeHealthStatus = "healthy" | "good" | "warning" | "critical" | "dormant"
export type GrowthStage = "seedling" | "young" | "mature" | "flowering" | "ready_to_harvest" | "harvested"
export type CareActivityType = "watering" | "fertilizing" | "pruning" | "soil_check" | "pest_control" | "inspection" | "harvesting" | "other"

export interface Garden {
  id: string
  code: string
  name: string
  status: CultivationStatus | string
  totalBeds: number
  activeBeds: number
  totalTrees: number
  createdAt: string
  location?: string
  description?: string
  area?: number
  images?: string[]
  latitude?: number
  longitude?: number
  managerName?: string
  managerPhone?: string
  establishedAt?: string
  maxBeds?: number
}

export interface Bed {
  id: string
  code: string
  name: string
  gardenId?: string
  gardenCode?: string
  gardenName?: string
  garden?: {
    id: string
    code: string
    name: string
  }
  status: CultivationStatus | string
  totalTrees: number
  treeCount?: number
  activeTrees?: number
  maxTrees?: number
  ageYear?: number
  area?: number
  soilType?: string
  width?: number | string
  length?: number | string
  orientation?: string
  description?: string
  lastWateredAt?: string
  lastFertilizedAt?: string
  createdAt?: string
}

export interface Tree {
  id: string
  code: string
  name?: string
  bedId?: string
  bedCode?: string
  bedName?: string
  bed?: {
    id: string
    code: string
    name: string
    gardenId?: string
    garden?: {
      id: string
      code: string
      name: string
    }
  }
  gardenId?: string
  gardenCode?: string
  gardenName?: string
  ageYears?: number
  ageYear?: number
  ageMonths?: number
  quantity?: number
  healthStatus?: TreeHealthStatus | string
  growthStage?: GrowthStage | string
  plantedDate?: string
  plantedAt?: string
  lastCareDate?: string
  nextCareDate?: string
  estimatedHarvestDate?: string
  expectedHarvestAt?: string
  status?: CultivationStatus | string
  userId?: string
  ownerUserId?: string
  userName?: string
  priceBought?: number
  owner?: {
    id: string
    name: string
    email?: string
    username?: string
  }
  carePackageCode?: string
  images?: string[]
  notes?: string
  createdAt?: string
}

export interface CareLogMetrics {
  temperature?: number
  humidity?: number
  soilPh?: number
  soilMoisture?: number
  lightLux?: number
}

export interface CareLog {
  id: string
  title?: string
  treeId?: string
  treeCode?: string
  bedId?: string
  bedCode?: string
  gardenId?: string
  gardenName?: string
  activityType: CareActivityType | string
  logDate: string
  healthStatus?: TreeHealthStatus | string
  description: string
  notes?: string
  performedBy?: string
  images?: string[]
  metrics?: CareLogMetrics
  createdAt: string
}

export interface QrCodeTraceability {
  treeCode: string
  treeName?: string
  gardenName: string
  gardenLocation?: string
  bedCode: string
  plantedDate?: string
  ageMonths?: number
  healthStatus: string
  originCert: string
  blockchainHash?: string
  totalCareLogs: number
  lastCareActivity?: string
  lastCareDate?: string
  ownerName?: string
  isVerified: boolean
}
