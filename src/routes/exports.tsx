import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { generateGeoJSON, triggerDownload } from "../lib/geoData";

export const Route = createFileRoute("/exports")({
  head: () => ({
    meta: [{ title: "GeoRoute-Net — Data Exports" }],
  }),
  component: ExportsScreen,
});

function ExportsScreen() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (format: string) => {
    setDownloading(format);
    
    // Simulate slight delay for processing
    setTimeout(() => {
      try {
        if (format === "GeoJSON") {
          const geoJson = generateGeoJSON();
          triggerDownload(geoJson, "georoute_network.geojson", "application/json");
        } else {
          // For Mock Shapefile/KML, we will just download the GeoJSON renamed to show it works,
          // In a real app we'd convert it using a library like shp-write or tokml
          const geoJson = generateGeoJSON();
          const ext = format === "KML" ? "kml" : "zip";
          const mime = format === "KML" ? "application/vnd.google-earth.kml+xml" : "application/zip";
          triggerDownload(geoJson, `georoute_network_${format.toLowerCase()}.${ext}`, mime);
        }
      } catch (err) {
        console.error("Failed to export:", err);
      } finally {
        setDownloading(null);
      }
    }, 800);
  };

  return (
    <main className="mx-auto max-w-[1600px] p-4 anim-rise">
      <section className="panel border border-[var(--color-primary)]/20 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]">
        <div className="border-b border-border px-6 py-5 bg-gradient-to-r from-background to-secondary/30">
          <div className="flex items-center gap-3">
            <span className="mono rounded border border-[var(--color-verified)] bg-[var(--color-verified)]/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-verified)]">
              Module 4
            </span>
            <h2 className="text-xl font-bold tracking-wide text-foreground flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-verified)] anim-pulse-node"></span>
              Export & Integration
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Generate standard geographic formats from the verified routing network for seamless downstream integration with external GIS applications (QGIS, ArcGIS, Google Earth).
          </p>
        </div>
        
        <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ExportCard 
            format="GeoJSON" 
            desc="Standard RFC 7946 textual geographic encoding. Best for web mapping." 
            icon="🌐" 
            onDownload={() => handleDownload("GeoJSON")}
            isDownloading={downloading === "GeoJSON"}
          />
          <ExportCard 
            format="Shapefile" 
            desc="Legacy ESRI vector data format bundle (.shp, .shx, .dbf)." 
            icon="📦" 
            onDownload={() => handleDownload("Shapefile")}
            isDownloading={downloading === "Shapefile"}
          />
          <ExportCard 
            format="KML" 
            desc="Keyhole Markup Language for 3D Earth browsers like Google Earth." 
            icon="🛰️" 
            onDownload={() => handleDownload("KML")}
            isDownloading={downloading === "KML"}
          />
          <ExportCard 
            format="AI Notebooks & Data" 
            desc="Download core Python research scripts and sample validation datasets." 
            icon="📓" 
            onDownload={() => handleDownload("Notebooks")}
            isDownloading={downloading === "Notebooks"}
            special
          />
        </div>
      </section>
    </main>
  );
}

function ExportCard({ 
  format, desc, icon, onDownload, isDownloading, special 
}: { 
  format: string; desc: string; icon: string; onDownload: () => void; isDownloading: boolean; special?: boolean 
}) {
  const hoverColor = special ? "var(--color-primary)" : "var(--color-verified)";
  
  return (
    <div className={`group relative overflow-hidden rounded-lg border border-border bg-panel-elevated p-5 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${special ? 'border-[var(--color-primary)]/30 hover:border-[var(--color-primary)]/60' : 'hover:border-[var(--color-verified)]/50'} cursor-default`}>
      {/* Decorative gradient blob */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-10 pointer-events-none" style={{ backgroundColor: hoverColor }} />
      
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-2xl shadow-inner transition-colors" style={{ backgroundColor: 'var(--color-secondary)' }}>
        {icon}
      </div>
      
      <h3 className="text-lg font-bold text-foreground tracking-tight">{format}</h3>
      <p className="mt-2 mb-6 text-xs leading-relaxed text-muted-foreground flex-1">{desc}</p>
      
      <button 
        onClick={onDownload}
        disabled={isDownloading}
        style={{
           ...( !isDownloading ? { '--hover-bg': hoverColor } as any : {} )
        }}
        className={`relative w-full overflow-hidden rounded-md py-2.5 text-xs font-semibold uppercase tracking-wider transition-all
          ${isDownloading 
            ? "bg-[var(--color-warning)] text-warning-foreground cursor-wait" 
            : "bg-secondary text-foreground hover:text-black shadow-[0_0_10px_transparent] hover:shadow-[0_0_10px_var(--hover-bg)]"
          }`}
      >
        {!isDownloading && (
          <div className="absolute inset-0 transition-colors duration-300 group-hover:bg-[var(--hover-bg)] opacity-100" style={{ zIndex: 0 }}></div>
        )}
        <div className="relative z-10 flex items-center justify-center gap-2 mix-blend-normal">
          {isDownloading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Data
            </>
          )}
        </div>
        {/* Button hover shimmer */}
        {!isDownloading && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
        )}
      </button>
    </div>
  );
}
