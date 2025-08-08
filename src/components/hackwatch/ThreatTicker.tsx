import React from "react";
import { Threat } from "./types";

interface ThreatTickerProps {
  items: Threat[];
}

const SeverityDot: React.FC<{ sev: Threat["severity"] }> = ({ sev }) => {
  const colorClass = {
    low: "bg-[hsl(var(--sev-low))]",
    medium: "bg-[hsl(var(--sev-medium))]",
    high: "bg-[hsl(var(--sev-high))]",
    critical: "bg-[hsl(var(--sev-critical))]",
  }[sev];
  return <span className={`inline-block w-2 h-2 rounded-full ${colorClass}`} aria-hidden />;
};

const TickerRow: React.FC<{ items: Threat[] }> = ({ items }) => (
  <div className="flex gap-8 px-6 py-2 whitespace-nowrap">
    {items.map((t) => (
      <div key={t.id} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        <SeverityDot sev={t.severity} />
        <span className="mx-2 font-medium">{t.source}</span>
        <span className="text-foreground">{t.ioc}</span>
        <span className="mx-2">·</span>
        <span className="opacity-70">{new Date(t.timestamp).toLocaleTimeString()}</span>
      </div>
    ))}
  </div>
);

const ThreatTicker: React.FC<ThreatTickerProps> = ({ items }) => {
  const doubled = [...items, ...items];
  return (
    <aside aria-label="Live threat ticker" className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur">
      <div className="overflow-hidden">
        <div className="flex animate-ticker" style={{ width: "200%" }}>
          <TickerRow items={doubled} />
          <TickerRow items={doubled} />
        </div>
      </div>
    </aside>
  );
};

export default ThreatTicker;
