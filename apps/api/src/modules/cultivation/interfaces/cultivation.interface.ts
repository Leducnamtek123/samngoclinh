import { CultivationBed, CultivationCareLog, CultivationTree } from '@generated/prisma-client';

export type ICultivationBedDetail = CultivationBed & { trees: CultivationTree[] };

export type ICultivationTreeDetail = CultivationTree & { careLogs: CultivationCareLog[] };

export interface ICultivationBedLocationsGenerateResult {
    count: number;
}

export interface ICultivationBedItem {
    id: string;
    code: string;
    gardenCode: string;
    name: string;
    ageYear: number;
    treeCount: number;
    status: string;
    createdAt: Date;
}

export interface ICultivationGardenSummary {
    total: number;
    activeBeds: number;
}

export interface ICultivationTreeAgeItem {
    ageYear: number;
    count: number;
}

export interface ICultivationPublicGardenItem {
    code: string;
    name: string;
}

export interface ICultivationPurchaseBed {
    code: string;
    name: string;
}

export interface ICultivationPurchaseTreeGroup {
    bedCode: string;
    ageYear: number;
    quantity: number;
}

export interface ICultivationPurchaseData {
    garden: { code: string; name: string } | null;
    beds: ICultivationPurchaseBed[];
    treeGroups: ICultivationPurchaseTreeGroup[];
    priceByAge: Record<number, number>;
}

export interface ICultivationPublicBedItem {
    code: string;
    name: string;
    gardenCode: string;
    gardenName: string;
    ageYear: number;
    treeCount: number;
    price: number;
    images: string[];
    status: string;
}

export interface ICultivationPublicBedDetail {
    code: string;
    name: string;
    gardenCode: string;
    gardenName: string;
    ageYear: number;
    treeCount: number;
    status: string;
    price: number;
    plantedAt: Date | null;
    healthStatus: string | null;
    images: string[];
    description: string | null;
    careLogs: CultivationCareLog[];
}
