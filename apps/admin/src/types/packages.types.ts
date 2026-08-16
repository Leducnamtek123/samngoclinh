export type PackageStatus = "active" | "inactive" | "archived"

export interface CarePackage {
  id: string
  code: string
  name: string
  description?: string
  durationMonths: number
  price: number
  pricePerMonth?: number
  pricePerYear?: number
  features?: string[]
  servicesIncluded?: string[]
  status: PackageStatus | string
  isPopular?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ProtectionPackage {
  id: string
  code: string
  name: string
  description?: string
  durationMonths: number
  price: number
  coveragePercentage?: number
  maxCompensation?: number
  terms?: string[]
  status: PackageStatus | string
  isPopular?: boolean
  createdAt?: string
  updatedAt?: string
}

export type ServicePackageUnion = CarePackage | ProtectionPackage
