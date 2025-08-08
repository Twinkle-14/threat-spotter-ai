import React, { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Threat, Severity } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const colorFromToken = (token: string) => {
  const val = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return val ? `hsl(${val})` : "#22d3ee"; // fallback cyan
};

const severityColor = (sev: Severity) => {
  switch (sev) {
    case "low":
      return colorFromToken("--sev-low");
    case "medium":
      return colorFromToken("--sev-medium");
    case "high":
      return colorFromToken("--sev-high");
    case "critical":
      return colorFromToken("--sev-critical");
  }
};

function toGeoJSON(threats: Threat[]) {
  return {
    type: "FeatureCollection",
    features: threats.map((t) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [t.lng, t.lat] },
      properties: {
        id: t.id,
        severity: t.severity,
        source: t.source,
        ioc: t.ioc,
        description: t.description,
        color: severityColor(t.severity),
      },
    })),
  } as any;
}

interface MapGlobeProps {
  threats: Threat[];
}

const MapGlobe: React.FC<MapGlobeProps> = ({ threats }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState<string>(() => localStorage.getItem("mapbox_public_token") || "");
  const [tempToken, setTempToken] = useState<string>(token);

  const geojson = useMemo(() => toGeoJSON(threats), [threats]);

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      projection: "globe",
      zoom: 1.6,
      center: [10, 15],
      pitch: 45,
      bearing: 0,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
    mapRef.current.scrollZoom.disable();

    mapRef.current.on("style.load", () => {
      mapRef.current?.setFog({
        color: "rgb(3,7,18)",
        "high-color": "rgb(15,23,42)",
        "horizon-blend": 0.1,
      });

      if (!mapRef.current?.getSource("threats")) {
        mapRef.current?.addSource("threats", {
          type: "geojson",
          data: geojson,
        });

        mapRef.current?.addLayer({
          id: "threat-points",
          type: "circle",
          source: "threats",
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 2,
              4, 6,
            ],
            "circle-color": ["get", "color"],
            "circle-opacity": 0.9,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#0a0f1a",
          },
        });

        mapRef.current?.addLayer({
          id: "threat-pulse",
          type: "circle",
          source: "threats",
          paint: {
            "circle-radius": [
              "interpolate", ["linear"], ["zoom"],
              0, 4,
              4, 14
            ],
            "circle-color": ["get", "color"],
            "circle-opacity": 0.15,
          },
        });
      }
    });

    const onMoveEnd = () => {
      // idle spin
      const map = mapRef.current;
      if (!map) return;
      const zoom = map.getZoom();
      if (zoom < 3) {
        const center = map.getCenter();
        center.lng -= 0.5;
        map.easeTo({ center, duration: 1500, easing: (n) => n });
      }
    };

    mapRef.current.on("moveend", onMoveEnd);

    return () => {
      mapRef.current?.off("moveend", onMoveEnd);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && map.isStyleLoaded() && map.getSource("threats")) {
      (map.getSource("threats") as mapboxgl.GeoJSONSource).setData(geojson as any);
    }
  }, [geojson]);

  const saveToken = () => {
    localStorage.setItem("mapbox_public_token", tempToken.trim());
    setToken(tempToken.trim());
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] rounded-lg overflow-hidden ring-1 ring-border">
      {!token && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur">
          <div className="max-w-md w-full p-6 rounded-lg border bg-card text-card-foreground shadow-neon">
            <h3 className="text-lg font-semibold mb-2">Add Mapbox public token</h3>
            <p className="text-sm text-muted-foreground mb-4">Paste your Mapbox public token to enable the interactive globe.</p>
            <div className="flex gap-2">
              <Input
                placeholder="pk.eyJ..."
                value={tempToken}
                onChange={(e) => setTempToken(e.target.value)}
              />
              <Button variant="neon" onClick={saveToken}>Save</Button>
            </div>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10" />
    </div>
  );
};

export default MapGlobe;
