import { useQuery } from "@tanstack/react-query";
import { getCountryRevenue, getCountryRevenueByCode } from "./api/getCountryRevenue";
import type { CountriesApiResponse, RevenueApiResponse } from "./model/countryRevenue";

export function useCountryRevenue() {
    return useQuery<CountriesApiResponse>({
        queryKey: ["countryRevenue"],
        queryFn: getCountryRevenue,
        staleTime: 1000 * 60 * 10,
    });
}

export function useCountryRevenueByCode(countryCode: string) {
    return useQuery<RevenueApiResponse>({
        queryKey: ["countryRevenue", countryCode],
        queryFn: () => getCountryRevenueByCode(countryCode),
        enabled: Boolean(countryCode),
        staleTime: 1000 * 60 * 10,
    });
}
