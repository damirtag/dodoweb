import { useQuery, useQueries } from "@tanstack/react-query";
import { getPizzerias, getPizzeriaDetails } from "./api/getPizzerias";
import { getEmployeesOnShift } from "./api/getEmployees";
import type { Pizzeria } from "./model/pizzeria";

export function usePizzerias(countryId?: number) {
    return useQuery<Pizzeria[]>({
        queryKey: ["pizzerias", countryId],
        queryFn: () => getPizzerias(countryId!),
        enabled: Boolean(countryId),
        staleTime: 1000 * 60 * 60,
    });
}

export function usePizzeriaFullInfo(pizzeriaId: number, countryCode: string) {
    const enabled = Boolean(pizzeriaId && countryCode);

    const [detailsQuery, employeesQuery] = useQueries({
        queries: [
            {
                queryKey: ["pizzeriaDetails", pizzeriaId, countryCode],
                queryFn: () => getPizzeriaDetails(pizzeriaId, countryCode),
                enabled,
                staleTime: 1000 * 60 * 60,
            },
            {
                queryKey: ["employeesOnShift", pizzeriaId, countryCode],
                queryFn: () => getEmployeesOnShift(pizzeriaId, countryCode),
                enabled,
                staleTime: 1000 * 60 * 60,
            },
        ],
    });

    return {
        details: detailsQuery.data ?? null,
        employees: employeesQuery.data ?? [],
        isLoading: detailsQuery.isLoading || employeesQuery.isLoading,
        isError: detailsQuery.isError || employeesQuery.isError,
    };
}
