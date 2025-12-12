import { makeRequest } from "@/shared/lib/http";
import type { PizzeriaRevenueResponse, RevenuePeriod, PizzeriaRevenueDailyResponse } from "../model/pizzeriaRevenue";

export async function getPizzeriaRevenue(
    pizzeriaId: number,
    countryId: string,
    period: RevenuePeriod = "today"
): Promise<PizzeriaRevenueResponse> {
    return makeRequest<PizzeriaRevenueResponse>({
        domain: "global",
        endpoint: `revenue/pizzeria/${countryId}/${pizzeriaId}/${period}`,
    });
}

export async function getPizzeriaRevenueDaily(
    pizzeriaId: number,
    countryId: string,
    year: number,
    month: number,
    day: number
): Promise<PizzeriaRevenueDailyResponse> {
    return makeRequest<PizzeriaRevenueDailyResponse>({
        domain: "global",
        endpoint: `revenue/pizzeria/${countryId}/${pizzeriaId}/daily/${year}/${month}/${day}`,
    });
}
