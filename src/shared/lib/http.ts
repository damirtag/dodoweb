import axios, { AxiosError, type AxiosRequestConfig } from "axios";

const PUBLIC_API_URL = import.meta.env.VITE_PUBLIC_API_URL;
const GLOBAL_API_URL = import.meta.env.VITE_GLOBAL_API_URL;

type ApiDomain = "public" | "global";

interface MakeRequestProps<TBody = unknown> {
    domain: ApiDomain;
    endpoint: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: TBody;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    config?: AxiosRequestConfig;
}

export async function makeRequest<TResponse = any, TBody = unknown>(props: MakeRequestProps<TBody>): Promise<TResponse> {
    const { domain, endpoint, method = "GET", body, params, headers, config } = props;

    const baseURL = domain === "public" ? PUBLIC_API_URL : GLOBAL_API_URL;

    try {
        const response = await axios.request<TResponse>({
            baseURL,
            url: endpoint,
            method,
            data: body,
            params,
            headers,
            timeout: 8000,
            ...config,
        });

        return response.data;
    } catch (err) {
        const error = err as AxiosError;

        const normalizedError = {
            status: error.response?.status ?? null,
            message:
                error.response?.data && typeof error.response.data === "object"
                    ? (error.response.data as any).message ?? "Unknown API error"
                    : error.message,
            raw: error,
        };

        console.error("API Request Failed:", normalizedError);

        throw normalizedError;
    }
}
