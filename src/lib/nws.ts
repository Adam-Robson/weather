import { NWS_API_BASE, USER_AGENT } from "./constants.js";
import type { AlertFeature } from "./types.js";

export async function nwsRequest<T>(url: string): Promise<T | null> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/geo+json",
    },
  });

  if (!res.ok) {
    console.error(`NWS request failed: ${res.status} ${res.statusText} (${url})`);
    return null;
  }

  return (await res.json()) as T;
}

export function alertsUrl(stateCode: string): string {
  return `${NWS_API_BASE}/alerts?area=${stateCode}`;
}

export function pointsUrl(latitude: number, longitude: number): string {
  return `${NWS_API_BASE}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
}

export function formatAlert(feature: AlertFeature): string {
  const p = feature.properties;
  return [
    `Event: ${p.event ?? "Unknown"}`,
    `Area: ${p.areaDesc ?? "Unknown"}`,
    `Severity: ${p.severity ?? "Unknown"}`,
    `Status: ${p.status ?? "Unknown"}`,
    `Headline: ${p.headline ?? "No headline"}`,
    "---",
  ].join("\n");
}
