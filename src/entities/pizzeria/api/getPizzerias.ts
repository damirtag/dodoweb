import { makeRequest } from "@/shared/lib/http";
import type { Pizzeria, CountryResponse, PizzeriaDeatails } from "../model/pizzeria";

export async function getPizzerias(countryId: number): Promise<Pizzeria[]> {
    const response = await makeRequest<CountryResponse>({
        domain: "global",
        endpoint: `pizzerias/all/${countryId}`,
    });

    const country = response.countries.find((c) => c.countryId === countryId);
    return country?.pizzerias || [];
}

export async function getPizzeriaDetails(pizzeriaId: number, countryCode: string): Promise<PizzeriaDeatails | null> {
    const response = await makeRequest<PizzeriaDeatails>({
        domain: "public",
        endpoint: `${countryCode}/api/v1/unitinfo/${pizzeriaId}`,
    });

    return response;
}
