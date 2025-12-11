export interface CountryRevenue {
    countryId: number;
    countryCode: string;
    currency: string;
    revenue: number;
}

export interface CountriesApiResponse {
    countries: CountryRevenue[];
    errors: string[];
}

export interface RevenueApiResponse {
    meta: Meta;
    response: RevenueResponse;
}

export interface Meta {
    Code: string;
    StatusDetail: string;
}

export interface RevenueResponse {
    currency: string;
    current_year_progressive_total: number;
    previous_year_revenue: number;
    current_month_progressive_total: number;
    previous_month: MonthRevenue;
    year_ago: MonthRevenue;
    today_progressive_total: number;
    working_pizzerias: number;
}

export interface MonthRevenue {
    revenue: number;
    name: string;
    year: number;
}
