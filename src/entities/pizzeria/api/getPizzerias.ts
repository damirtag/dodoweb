import { makeRequest } from "@/shared/lib/http";
import type { Pizzeria, CountryResponse } from "../model/pizzeria";

export async function getPizzerias(countryId: number): Promise<Pizzeria[]> {
    const response = await makeRequest<CountryResponse>({
        domain: "global",
        endpoint: `pizzerias/all/${countryId}`,
    });

    const country = response.countries.find((c) => c.countryId === countryId);
    return country?.pizzerias || [];
}
