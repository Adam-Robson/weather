import { USER_AGENT } from "../constants/user-agent.js";

export async function NWSRequest<T>(url: string): Promise<T | null>{
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/geo+json",
  };

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json() as T;

  } catch (err) {
    console.error("Error encountered while making NWS request:", err);
    return null;
  }
}
