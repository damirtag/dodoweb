import { useQuery } from "@tanstack/react-query";
import { getCountries } from "./api/getCountries";
import type { Country } from "./model/country";

export function useCountries() {
    return useQuery<Country[]>({
        queryKey: ["countries"],
        queryFn: getCountries,
        staleTime: 1000 * 60 * 60,
    });
}
