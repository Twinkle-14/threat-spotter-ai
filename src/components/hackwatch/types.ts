export type Severity = "low" | "medium" | "high" | "critical";

export interface Threat {
  id: string;
  source: "VirusTotal" | "AbuseIPDB" | "Shodan" | string;
  severity: Severity;
  lat: number;
  lng: number;
  ioc: string; // IP or domain
  description: string;
  timestamp: number; // epoch ms
  locationName?: string;
}

export interface Filters {
  severities: Severity[];
  timeframe: "1h" | "24h" | "7d" | "30d";
  types?: string[];
}
