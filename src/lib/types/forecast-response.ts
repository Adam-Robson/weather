import { ForecastPeriod } from "./forecast-period.js";

export interface ForecastResponse {
  properties: {
    periods: ForecastPeriod[];
  };
}