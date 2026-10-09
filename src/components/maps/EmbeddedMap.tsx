"use client";

import { useState } from "react";
import {
  MapPin,
  ExternalLink,
  Navigation,
  Copy,
  Check,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface EmbeddedMapProps {
  title: string;
  address?: string;
  embedUrl: string;
  mapUrl?: string;
  directionsUrl?: string;
  badge?: string;
  heightClass?: string;
  className?: string;
  caption?: string;
}

export default function EmbeddedMap({
  title,
  address,
  embedUrl,
  mapUrl,
  directionsUrl,
  badge,
  heightClass = "h-[360px] md:h-[430px]",
  className = "",
  caption,
}: EmbeddedMapProps) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function copyAddress() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore clipboard write rejection
    }
  }

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 p-4 md:p-8 bg-slate-900/80 backdrop-blur-md flex flex-col justify-center items-center"
    : `relative w-full ${className}`;

  const innerWrapperClasses = isFullscreen
    ? "w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
    : "w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col";

  return (
    <div className={containerClasses}>
      <div className={innerWrapperClasses}>
        {/* Map Header / Location Bar */}
        <div className="px-4 py-3.5 md:px-5 md:py-4 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
              <MapPin size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm truncate text-slate-900">
                  {title}
                </span>
                {badge && (
                  <span className="hidden sm:inline-block text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                    {badge}
                  </span>
                )}
              </div>
              {address && (
                <p className="text-xs text-slate-500 truncate max-w-md">
                  {address}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            {address && (
              <button
                type="button"
                onClick={copyAddress}
                aria-label="Copy address"
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
                title="Copy address"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span className="hidden xs:inline">Copy</span>
                  </>
                )}
              </button>
            )}

            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
                title="Get turn-by-turn directions"
              >
                <Navigation size={13} className="text-emerald-700" />
                <span className="hidden sm:inline">Directions</span>
              </a>
            )}

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-2xs"
                title="Open in Google Maps"
              >
                <span>Google Maps</span>
                <ExternalLink size={12} />
              </a>
            )}

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Expand map"}
              aria-label={isFullscreen ? "Exit fullscreen" : "Expand map"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>

        {/* Embedded Iframe Container */}
        <div
          className={`relative w-full ${isFullscreen ? "flex-1" : heightClass} bg-slate-100`}
        >
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-2 z-10 transition-opacity">
              <MapPin size={24} className="animate-bounce text-emerald-600" />
              <span className="text-xs font-medium text-slate-500">
                Loading interactive map…
              </span>
            </div>
          )}

          <iframe
            src={embedUrl}
            title={`Interactive map of ${title}`}
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setLoaded(true)}
            className="w-full h-full border-0 block"
          />
        </div>

        {/* Optional Caption / Context info */}
        {caption && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
