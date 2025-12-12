export interface PizzeriaRevenueResponse {
    countries: PizzeriaRevenue[];
    errors: string[];
}

export interface PizzeriaRevenue {
    countryId: number;
    countryCode: string;
    unitId: string;
    date: string;
    stationaryRevenue: number;
    stationaryOrderCount: number;
    deliveryRevenue: number;
    deliveryOrderCount: number;
    revenue: number;
    orderCount: number;
    avgCheck: number;
    monthes?: MonthlyRevenue[];
}

export interface MonthlyRevenue {
    year: number;
    month: number;
    revenue: number;
}

export type RevenuePeriod = "today" | "yesterday" | "monthes/last";

export interface PizzeriaRevenueDailyResponse {
    day: string;
    countries: PizzeriaRevenueDaily[];
    errors: string[];
}

export interface PizzeriaRevenueDaily {
    countryId: number;
    countryCode: string;
    metrics: DailyMetric[];
}
export interface DailyMetric {
    unitId: number;
    revenue: number;
    count: number;
    stationaryRevenue: number;
    stationaryCount: number;
    deliveryRevenue: number;
    deliveryCount: number;
    pickupRevenue: number;
    pickupCount: number;
    stationaryMobileRevenue: number;
    stationaryMobileCount: number;
    deliveryMobileRevenue: number;
    deliveryMobileCount: number;
    pickupMobileRevenue: number;
    pickupMobileCount: number;
}
