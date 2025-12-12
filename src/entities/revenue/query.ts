import { useQuery } from "@tanstack/react-query";
import { getCountryRevenue, getCountryRevenueByCode } from "./api/getCountryRevenue";
import type { CountriesApiResponse, RevenueApiResponse } from "./model/countryRevenue";
import { getPizzeriaRevenue, getPizzeriaRevenueDaily } from "./api/getPizzeriaRevenue";
import type { PizzeriaRevenueResponse, RevenuePeriod, PizzeriaRevenueDailyResponse } from "./model/pizzeriaRevenue";

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
export function usePizzeriaRevenue(pizzeriaId: number, countryId: string, period: RevenuePeriod = "today") {
    return useQuery<PizzeriaRevenueResponse>({
        queryKey: ["pizzeriaRevenue", pizzeriaId, countryId, period],
        queryFn: () => getPizzeriaRevenue(pizzeriaId, countryId, period),
        staleTime: 1000 * 60 * 10,
    });
}

/**
 * Hook to fetch daily revenue for a specific pizzeria on a specific date
 * @param pizzeriaId - ID of the pizzeria
 * @param countryId - ID of the country
 * @param year - year of the day
 * @param month - month of the day (1-12)
 * @param day - day of the month (1-31)
 */
export function usePizzeriaRevenueDaily(pizzeriaId: number, countryId: string, year: number, month: number, day: number) {
    const enabled = Boolean(pizzeriaId && countryId && year && month && day);

    return useQuery<PizzeriaRevenueDailyResponse>({
        queryKey: ["pizzeriaRevenueDaily", pizzeriaId, countryId, year, month, day],
        queryFn: () => getPizzeriaRevenueDaily(pizzeriaId, countryId, year, month, day),
        enabled,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}
