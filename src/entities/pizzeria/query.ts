import { useQuery } from "@tanstack/react-query";
import { getPizzerias } from "./api/getPizzerias";
import type { Pizzeria } from "./model/pizzeria";

export function usePizzerias(countryId?: number) {
    return useQuery<Pizzeria[]>({
        queryKey: ["pizzerias", countryId],
        queryFn: () => getPizzerias(countryId!),
        enabled: Boolean(countryId),
        staleTime: 1000 * 60 * 60,
    });
}
