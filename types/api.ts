export type ApiStatus = "matched" | "missing_forecast" | "missing_actual" | string;

export interface SourceMetadata {
  dataset: string;
  endpoint: string;
  fetched_at: string;
  units: string;
  notes: string[];
}

export interface ComparisonPoint {
  delivery_time: string;
  forecast_generation: number | null;
  actual_generation: number | null;
  error: number | null;
  absolute_error: number | null;
  squared_error: number | null;
  forecast_publication_time: string | null;
  cutoff_satisfied: boolean;
  status: ApiStatus;
  reason: string | null;
  units: string;
}

export interface ComparisonResponse {
  date: string;
  decision_cutoff: string;
  cutoff_policy: string;
  records: ComparisonPoint[];
  source: SourceMetadata;
  limitations: string[];
}

export interface AccuracyResponse {
  start_date: string;
  end_date: string;
  decision_cutoff_policy: string;
  mae: number | null;
  rmse: number | null;
  bias: number | null;
  matched_intervals: number;
  expected_interval_count: number | null;
  coverage_percentage: number | null;
  missing_forecast_count: number;
  missing_actual_count: number;
  excluded_records: Array<{
    delivery_time: string | null;
    reason: string;
    count: number;
  }>;
  limitations: string[];
}

export interface SummaryResponse {
  evaluation_date_range: string;
  metrics: AccuracyResponse;
  evaluated_intervals: number;
  status: string;
}

export interface ForecastPoint {
  delivery_time: string;
  delivery_date: string;
  forecast_generation: number;
  forecast_publication_time: string;
  selected: boolean;
  selection_status: string;
  units: string;
  source: SourceMetadata;
}

export interface ForecastResponse {
  date: string;
  decision_cutoff: string;
  cutoff_policy: string;
  records: ForecastPoint[];
  coverage_note: string;
}

export interface ActualPoint {
  delivery_time: string;
  delivery_date: string;
  actual_generation: number;
  units: string;
  source: SourceMetadata;
}

export interface ActualResponse {
  date: string;
  records: ActualPoint[];
}

export interface HealthResponse {
  status: string;
  service: string;
}
