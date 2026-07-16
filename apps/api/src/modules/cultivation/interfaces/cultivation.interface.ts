export interface ICultivationBedItem {
    id: string;
    name: string;
    status: string;
}

export interface ICultivationGardenSummary {
    total: number;
    activeBeds: number;
}

export interface ICultivationTreeAgeItem {
    ageYear: number;
    count: number;
}
