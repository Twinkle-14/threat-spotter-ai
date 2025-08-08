import React from "react";
import { Filters, Severity } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SidebarFiltersProps {
  filters: Filters;
  onChange: (next: Filters) => void;
}

const sevOrder: Severity[] = ["critical", "high", "medium", "low"];

const SidebarFilters: React.FC<SidebarFiltersProps> = ({ filters, onChange }) => {
  const toggleSeverity = (sev: Severity) => {
    const has = filters.severities.includes(sev);
    const severities = has ? filters.severities.filter((s) => s !== sev) : [...filters.severities, sev];
    onChange({ ...filters, severities });
  };

  return (
    <aside className="w-full md:w-80 shrink-0 space-y-6">
      <section aria-labelledby="filters-title" className="p-4 rounded-lg border bg-card shadow-sm">
        <h2 id="filters-title" className="text-sm font-semibold mb-4">Filters</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Severity</p>
            <div className="grid grid-cols-2 gap-2">
              {sevOrder.map((s) => (
                <Label key={s} className="flex items-center gap-2 rounded-md border px-2 py-1.5 cursor-pointer">
                  <Checkbox checked={filters.severities.includes(s)} onCheckedChange={() => toggleSeverity(s)} />
                  <span className="capitalize">{s}</span>
                </Label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Time</p>
            <Select value={filters.timeframe} onValueChange={(v: any) => onChange({ ...filters, timeframe: v })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Last 24h" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
      <section className="p-4 rounded-lg border bg-card shadow-sm">
        <h3 className="text-sm font-semibold mb-2">Alerts</h3>
        <p className="text-xs text-muted-foreground mb-3">Connect Slack/Email/Discord to receive live alerts.</p>
        <a href="#" className="text-sm text-primary underline underline-offset-4">Open Integrations (coming soon)</a>
      </section>
    </aside>
  );
};

export default SidebarFilters;
