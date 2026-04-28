import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { alertsUrl, formatAlert, nwsRequest, pointsUrl } from "./nws.js";
import type {
  AlertsResponse,
  ForecastPeriod,
  ForecastResponse,
  PointsResponse,
} from "./types.js";

const text = (text: string) => ({ content: [{ type: "text" as const, text }] });

export function registerTools(server: McpServer): void {
  server.registerTool(
    "get_alerts",
    {
      description: "Get weather alerts for a state",
      inputSchema: {
        state: z
          .string()
          .length(2)
          .describe("Two-letter state code (e.g. CA, NY)"),
      },
    },
    async ({ state }) => {
      const stateCode = state.toUpperCase();
      const data = await nwsRequest<AlertsResponse>(alertsUrl(stateCode));

      if (!data) return text("Failed to retrieve alerts data");

      const features = data.features ?? [];
      if (features.length === 0) return text(`No active alerts for ${stateCode}`);

      return text(
        `Active alerts for ${stateCode}:\n\n${features.map(formatAlert).join("\n")}`,
      );
    },
  );

  server.registerTool(
    "get_forecast",
    {
      description: "Get weather forecast for a location",
      inputSchema: {
        latitude: z.number().min(-90).max(90).describe("Latitude of the location"),
        longitude: z.number().min(-180).max(180).describe("Longitude of the location"),
      },
    },
    async ({ latitude, longitude }) => {
      const points = await nwsRequest<PointsResponse>(pointsUrl(latitude, longitude));
      if (!points) {
        return text(
          `Failed to retrieve grid point data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`,
        );
      }

      const forecastUrl = points.properties?.forecast;
      if (!forecastUrl) return text("Failed to get forecast URL from grid point data");

      const forecast = await nwsRequest<ForecastResponse>(forecastUrl);
      if (!forecast) return text("Failed to retrieve forecast data");

      const periods = forecast.properties?.periods ?? [];
      if (periods.length === 0) return text("No forecast periods available");

      const formatted = periods.map((p: ForecastPeriod) =>
        [
          `${p.name ?? "Unknown"}:`,
          `Temperature: ${p.temperature ?? "Unknown"}°${p.temperatureUnit ?? "F"}`,
          `Wind: ${p.windSpeed ?? "Unknown"} ${p.windDirection ?? ""}`,
          `${p.shortForecast ?? "No forecast available"}`,
          "---",
        ].join("\n"),
      );

      return text(`Forecast for ${latitude}, ${longitude}:\n\n${formatted.join("\n")}`);
    },
  );
}
