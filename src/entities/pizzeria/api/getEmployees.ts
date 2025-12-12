import { makeRequest } from "@/shared/lib/http";
import type { Employee } from "../model/employees";

export async function getEmployeesOnShift(pizzeriaId: number, countryCode: string): Promise<Employee[]> {
    const response = await makeRequest<Employee[]>({
        domain: "public",
        endpoint: `${countryCode}/api/v1/AllEmployeesOnShift/${pizzeriaId}`,
    });

    return response;
}
