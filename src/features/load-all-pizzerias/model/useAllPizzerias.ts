import { useQuery } from "@tanstack/react-query";
import { getCountries } from "@/entities/country";
import { getPizzerias } from "@/entities/pizzeria";

export function useAllPizzerias() {
    return useQuery({
        queryKey: ["all-pizzerias"],
        queryFn: async () => {
            const countries = await getCountries();

            const limit = 5;
            const results: any[] = [];

            for (let i = 0; i < countries.length; i += limit) {
                const slice = countries.slice(i, i + limit);

                const batch = await Promise.all(
                    slice.map(async (country) => {
                        const pizzerias = await getPizzerias(country.id);

                        return pizzerias.map((p) => ({
                            ...p,
                            countryId: country.id,
                        }));
                    })
                );

                for (const p of batch) results.push(...p);
            }

            return results;
        },

        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });
}
