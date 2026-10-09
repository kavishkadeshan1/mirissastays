"use client";

import { useState } from "react";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import EmbeddedMap from "./EmbeddedMap";

interface DestinationMapSectionProps {
  locationName: string;
  locationSlug: string;
  embedUrl: string;
  placesCount?: number;
}

export default function DestinationMapSection({
  locationName,
  embedUrl,
  placesCount,
}: DestinationMapSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-10 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
            <MapPin size={17} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 tracking-tight !font-sans">
              Explore {locationName} on the map
            </h2>
            <p className="text-xs text-slate-500">
              Interactive Google Map of {locationName} coast & surroundings
              {placesCount ? ` · ${placesCount} ${placesCount === 1 ? "place" : "places"} listed` : ""}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
          aria-expanded={isOpen}
        >
          <span>{isOpen ? "Hide map" : "Show map"}</span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isOpen && (
        <div className="p-3 md:p-4 bg-slate-50/30">
          <EmbeddedMap
            title={`${locationName}, Sri Lanka`}
            address={`${locationName}, Southern Province, Sri Lanka`}
            embedUrl={embedUrl}
            mapUrl={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName + ", Sri Lanka")}`}
            directionsUrl={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationName + ", Sri Lanka")}`}
            badge="Destination Area"
            heightClass="h-[340px] md:h-[400px]"
          />
        </div>
      )}
    </div>
  );
}
