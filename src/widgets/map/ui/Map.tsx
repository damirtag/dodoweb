"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Pizzeria } from "@/entities/pizzeria";
import { buttonVariants } from "@/shared/ui/button";

interface PizzeriaMapWidgetProps {
    pizzerias: Pizzeria[];
    className?: string;
}

export const PizzeriaMapWidget: React.FC<PizzeriaMapWidgetProps> = ({ pizzerias, className = "" }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    "carto-dark": {
                        type: "raster",
                        tiles: [
                            "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
                            "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
                            "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
                            "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
                        ],
                        tileSize: 256,
                        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
                    },
                },
                layers: [
                    {
                        id: "carto-dark-layer",
                        type: "raster",
                        source: "carto-dark",
                        minzoom: 0,
                        maxzoom: 22,
                    },
                ],
            },
            center: [0, 0],
            zoom: 2,
        });

        map.current.on("load", () => setIsMapLoaded(true));

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    useEffect(() => {
        if (!map.current || !isMapLoaded || !pizzerias.length) return;
        const currentMap = map.current;

        // Filter pizzerias with valid coordinates
        const validPizzerias = pizzerias.filter((p) => p.coords?.lat != null && p.coords?.long != null);

        // Create GeoJSON with proper typing
        const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
            type: "FeatureCollection",
            features: validPizzerias.map((p) => ({
                type: "Feature" as const,
                geometry: {
                    type: "Point" as const,
                    coordinates: [p.coords!.long, p.coords!.lat] as [number, number],
                },
                properties: {
                    id: p.id,
                    name: p.name,
                    address: p.address,
                    country_id: p.countryId,
                },
            })),
        };

        // Add or update source
        const source = currentMap.getSource("pizzerias") as maplibregl.GeoJSONSource | undefined;
        if (source) {
            source.setData(geojsonData);
        } else {
            currentMap.addSource("pizzerias", {
                type: "geojson",
                data: geojsonData,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50,
            });
        }

        // Helper to add layer if missing
        const addLayerIfMissing = (id: string, layer: maplibregl.LayerSpecification) => {
            if (!currentMap.getLayer(id)) currentMap.addLayer(layer);
        };

        addLayerIfMissing("clusters", {
            id: "clusters",
            type: "circle",
            source: "pizzerias",
            filter: ["has", "point_count"],
            paint: {
                "circle-color": ["step", ["get", "point_count"], "#3b82f6", 10, "#8b5cf6", 30, "#ec4899"],
                "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 30, 40],
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
            },
        });

        addLayerIfMissing("cluster-count", {
            id: "cluster-count",
            type: "symbol",
            source: "pizzerias",
            filter: ["has", "point_count"],
            layout: {
                "text-field": "{point_count_abbreviated}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-size": 12,
            },
            paint: { "text-color": "#ffffff" },
        });

        addLayerIfMissing("unclustered-point", {
            id: "unclustered-point",
            type: "circle",
            source: "pizzerias",
            filter: ["!", ["has", "point_count"]],
            paint: {
                "circle-color": "#3b82f6",
                "circle-radius": 10,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
            },
        });

        // Popup
        const popup = new maplibregl.Popup({
            closeButton: true,
            closeOnClick: true,
            className: "pizzeria-popup",
        });

        const showPopup = (e: maplibregl.MapMouseEvent) => {
            const features = currentMap.queryRenderedFeatures(e.point, {
                layers: ["unclustered-point"],
            });
            if (!features.length) return;

            const feature = features[0];
            const geometry = feature.geometry;

            // Type guard and safe coordinate extraction
            if (geometry.type !== "Point") return;
            const coords = geometry.coordinates as [number, number];

            const props = feature.properties || {};

            let addr: any = null;
            try {
                addr = typeof props.address === "string" ? JSON.parse(props.address) : props.address;
            } catch {
                addr = null;
            }
            const humanAddress = [addr?.street?.name, addr?.house?.number, addr?.locality?.name].filter(Boolean).join(", ");
            const buttonClass = buttonVariants({ variant: "default", size: "sm" });

            popup
                .setLngLat(coords)
                .setHTML(
                    `
                        <div class="space-y-2">
                            <div class="font-semibold text-white text-sm mb-1">${props.name}</div>
                            <div class="text-gray-400 text-xs mb-2">${humanAddress}</div>

                            <a 
                                href="/pizzeria/${props.country_id}/${props.id}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="${buttonClass} block text-center"
                            >
                                Перейти
                            </a>
                        </div>
                    `
                )
                .addTo(currentMap);
        };

        currentMap.on("click", "unclustered-point", showPopup);

        // Fit bounds safely
        if (validPizzerias.length) {
            const bounds = new maplibregl.LngLatBounds();
            validPizzerias.forEach((p) => {
                bounds.extend([p.coords!.long, p.coords!.lat] as [number, number]);
            });
            currentMap.fitBounds(bounds, { padding: 50, maxZoom: 15 });
        }

        return () => {
            popup.remove();
        };
    }, [pizzerias, isMapLoaded]);

    return (
        <>
            <style>{`
        .pizzeria-popup .maplibregl-popup-content { background-color: #18181b; border: 1px solid #18181b; border-radius: 0.5rem; padding: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); }
        .pizzeria-popup .maplibregl-popup-close-button { color: #9ca3af; font-size: 1.25rem; padding: 0.25rem 0.5rem; }
        .pizzeria-popup .maplibregl-popup-close-button:hover { background-color: #18181b; color: #fff; }
        .pizzeria-popup .maplibregl-popup-tip { border-top-color: #18181b; }
      `}</style>
            <div
                ref={mapContainer}
                className={`w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-zinc-900 ${className}`}
            />
        </>
    );
};
