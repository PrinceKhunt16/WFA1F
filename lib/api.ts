import type {
  AccuracyResponse,
  ActualResponse,
  ComparisonResponse,
  ForecastResponse,
  HealthResponse,
  SummaryResponse,
} from "@/types/api";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function get<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  } catch {
    throw new ApiError("The analytics service is unavailable.");
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message ?? body?.detail ?? `Request failed with status ${response.status}.`;
    throw new ApiError(message, response.status);
  }
  return body as T;
}

export function getHealth() {
  return get<HealthResponse>("/health");
}

export function getSummary() {
  return get<SummaryResponse>("/api/v1/summary");
}

export function getComparison(date: string) {
  return get<ComparisonResponse>(`/api/v1/comparison?date=${encodeURIComponent(date)}`);
}

export function getAccuracy(startDate: string, endDate: string) {
  return get<AccuracyResponse>(
    `/api/v1/accuracy?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`,
  );
}

export function getForecasts(date: string) {
  return get<ForecastResponse>(`/api/v1/forecasts?date=${encodeURIComponent(date)}`);
}

export function getActuals(date: string) {
  return get<ActualResponse>(`/api/v1/actuals?date=${encodeURIComponent(date)}`);
}
