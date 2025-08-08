import React, { useEffect, useMemo, useState } from "react";
import MapGlobe from "@/components/hackwatch/MapGlobe";
import ThreatTicker from "@/components/hackwatch/ThreatTicker";
import SidebarFilters from "@/components/hackwatch/SidebarFilters";
import RoleToggle from "@/components/hackwatch/RoleToggle";
import SearchBar from "@/components/hackwatch/SearchBar";
import { Threat, Filters, Severity } from "@/components/hackwatch/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const seedThreats: Threat[] = [
  { id: "t1", source: "VirusTotal", type: "Malware", severity: "high", lat: 37.77, lng: -122.41, ioc: "198.51.100.22", description: "Malware C2 beacon detected", timestamp: Date.now() - 1000 * 60 * 3 },
  { id: "t2", source: "AbuseIPDB", type: "Brute Force", severity: "medium", lat: 51.5, lng: -0.12, ioc: "bruteforce.example.com", description: "SSH brute force attempts", timestamp: Date.now() - 1000 * 60 * 8 },
  { id: "t3", source: "Shodan", type: "Exposed Service", severity: "critical", lat: 35.68, lng: 139.69, ioc: "203.0.113.5", description: "Exposed RDP service with default creds", timestamp: Date.now() - 1000 * 60 * 12 },
];

type Role = "sysadmin" | "ceo";

const Index = () => {
  const [role, setRole] = useState<Role>("sysadmin");
  const [threats, setThreats] = useState<Threat[]>(seedThreats);
  const [filters, setFilters] = useState<Filters>({
    severities: ["critical", "high", "medium", "low"],
    timeframe: "24h",
    sources: ["VirusTotal", "AbuseIPDB", "Shodan"],
    types: ["Malware", "Brute Force", "Exposed Service", "Phishing"],
    display: "points",
    spin: true,
    refreshMs: 4500,
  });

  useEffect(() => {
    const severities: Severity[] = ["low", "medium", "high", "critical"];
    const sources = ["VirusTotal", "AbuseIPDB", "Shodan"] as const;
    const typeOptions = ["Malware", "Brute Force", "Exposed Service", "Phishing"] as const;

    const id = setInterval(() => {
      const s = severities[Math.floor(Math.random() * severities.length)];
      const src = sources[Math.floor(Math.random() * sources.length)];
      const typ = typeOptions[Math.floor(Math.random() * typeOptions.length)];
      const newT: Threat = {
        id: Math.random().toString(36).slice(2),
        source: src,
        type: typ,
        severity: s,
        lat: -60 + Math.random() * 120,
        lng: -180 + Math.random() * 360,
        ioc: Math.random() > 0.5 ? `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}` : `malicious-${Math.floor(Math.random()*999)}.example.net`,
        description: `${typ} activity detected`,
        timestamp: Date.now(),
      };
      setThreats((prev) => [newT, ...prev].slice(0, 60));
    }, filters.refreshMs);
    return () => clearInterval(id);
  }, [filters.refreshMs]);

  const visibleThreats = useMemo(
    () =>
      threats.filter(
        (t) =>
          filters.severities.includes(t.severity) &&
          filters.sources.includes(t.source as any) &&
          filters.types.includes(t.type as any)
      ),
    [threats, filters]
  );

  const onSearch = (query: string) => {
    toast(`Checking ${query}…`, { description: "API hookup coming next. Using sample data for now." });
    const sample: Threat = {
      id: `search-${Date.now()}`,
      source: "VirusTotal",
      type: "Investigation",
      severity: "high",
      lat: 40.71,
      lng: -74.0,
      ioc: query,
      description: "Aggregated risk from sample data",
      timestamp: Date.now(),
    };
    setThreats((prev) => [sample, ...prev].slice(0, 40));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="container flex flex-col gap-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-widest text-accent-foreground/70">LIVE CYBER THREAT TRACKER</p>
              <h1 className="text-3xl md:text-4xl font-bold">HackWatch — Live Cybersecurity Threat Tracker</h1>
            </div>
            <RoleToggle value={role} onChange={setRole} />
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <SearchBar onSearch={onSearch} />
            <div className="flex-1" />
            <Button variant="neon" onClick={() => toast("Impact analysis queued", { description: "Connect OpenAI in Supabase secrets to enable AI summaries." })}>
              Generate Impact Analysis
            </Button>
          </div>
        </div>
      </header>

      <main className="container grid md:grid-cols-[1fr_320px] gap-6 py-6" role="main">
        <section aria-label="Threat map" className="space-y-4">
          <MapGlobe threats={visibleThreats} display={filters.display} spin={filters.spin} />
          {role === "sysadmin" ? (
            <article className="p-4 rounded-lg border bg-card shadow-sm">
              <h2 className="text-lg font-semibold mb-2">SysAdmin Insights</h2>
              <p className="text-sm text-muted-foreground">Realtime anomalies, C2 detections, brute force spikes and exposed services are highlighted. Use the search to validate indicators.</p>
            </article>
          ) : (
            <article className="p-4 rounded-lg border bg-card shadow-sm">
              <h2 className="text-lg font-semibold mb-2">CEO Summary</h2>
              <p className="text-sm text-muted-foreground">High-level risk overview for your region and sector. Click “Generate Impact Analysis” for AI-driven recommendations.</p>
            </article>
          )}
        </section>
        <SidebarFilters filters={filters} onChange={setFilters} />
      </main>

      <ThreatTicker items={visibleThreats.slice(0, 12)} />
    </div>
  );
};

export default Index;
