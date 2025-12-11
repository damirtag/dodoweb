import { makeRequest } from "@/shared/lib/http";
import type { Country } from "../model/country";

export async function getCountries(): Promise<Country[]> {
    const response = await makeRequest<{ countries: Country[] }>({
        domain: "global",
        endpoint: "countries/list",
    });

    return response.countries || [];
}
