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
