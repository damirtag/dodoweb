import { makeRequest } from "@/shared/lib/http";
import type { CountriesApiResponse, RevenueApiResponse } from "../model/countryRevenue";

export async function getCountryRevenue(): Promise<CountriesApiResponse> {
    return makeRequest<CountriesApiResponse>({
        domain: "global",
        endpoint: "revenue/monthes/last",
    });
}

export async function getCountryRevenueByCode(countryCode: string): Promise<RevenueApiResponse> {
    return makeRequest<RevenueApiResponse>({
        domain: "public",
        endpoint: `${countryCode}/api/v1/FinancialMetrics`,
    });
}
