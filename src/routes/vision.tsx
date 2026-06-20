import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vision")({
  head: () => ({
    meta: [{ title: "GeoRoute-Net — Vision Engine" }],
  }),
  component: VisionScreen,
});

function VisionScreen() {
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="mx-auto max-w-[1600px] p-4 anim-rise">
      <section className="panel border border-[var(--color-border)] shadow-lg">
        {/* Module Header */}
        <div className="border-b border-border px-6 py-5 bg-gradient-to-r from-background to-secondary/30">
          <div className="flex items-center gap-3">
            <span className="mono rounded border border-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Module 1
            </span>
            <h2 className="text-xl font-bold tracking-wide text-foreground flex items-center gap-2">
              Context-Aware Vision Engine (Perception Layer)
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
            Attention-Gated Pixel Segmentation Engine — extracts fine road trajectories beneath tree cover and shadows 
            using a customized dual-loss optimization framework.
          </p>
        </div>
        
        {/* Main Content Grid */}
        <div className="p-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          
          {/* Live Inference Feed */}
          <div className="space-y-4">
            <h3 className="mono text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
              LIVE SATELLITE INFERENCE FEED
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Raw Input */}
              <div className="panel-elevated rounded-lg overflow-hidden relative aspect-square border-border bg-black">
                <img 
                  src="/images/image.png" 
                  alt="Raw Satellite Feed" 
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 mix-blend-screen"
                />
                <div className="absolute inset-0 border border-border/50 rounded-lg pointer-events-none"></div>
                <div className="absolute top-3 left-3 flex gap-2 items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-warning)] anim-pulse-node"></span>
                  <span className="mono text-[10px] uppercase tracking-wider text-white drop-shadow-md">Raw Cartosat-3</span>
                </div>
                {/* Simulated scanline effect */}
                <div 
                  className="absolute left-0 right-0 h-[2px] bg-[var(--color-primary)]/50 blur-[1px] z-10"
                  style={{ top: `${scanLine}%`, boxShadow: "0 0 10px var(--color-primary)" }}
                />
              </div>

              {/* Inferred Mask */}
              <div className="panel-elevated rounded-lg overflow-hidden relative aspect-square border-border">
                <div className="absolute inset-0 bg-[#080808] grid place-items-center">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(var(--color-verified) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                  <svg className="w-full h-full opacity-90 drop-shadow-[0_0_8px_var(--color-verified)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Simulated neural network vector extraction */}
                    <path d="M 10 90 Q 30 50 50 50 T 90 10" fill="none" stroke="var(--color-verified)" strokeWidth="1.5" className="anim-dash" />
                    <path d="M 20 10 Q 20 40 50 50 T 80 90" fill="none" stroke="var(--color-verified)" strokeWidth="1.5" className="anim-dash" />
                    <path d="M 90 60 Q 60 70 50 50 T 10 30" fill="none" stroke="var(--color-verified)" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />
                  </svg>
                </div>
                <div className="absolute inset-0 scanline opacity-30"></div>
                <div className="absolute inset-0 border border-[var(--color-verified)]/30 rounded-lg pointer-events-none shadow-[inset_0_0_20px_rgba(var(--color-verified-rgb),0.1)]"></div>
                <div className="absolute top-3 left-3 flex gap-2 items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-verified)]"></span>
                  <span className="mono text-[10px] uppercase tracking-wider text-[var(--color-verified)] drop-shadow-md">Attention U-Net Mask</span>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture & Metrics */}
          <div className="space-y-6">
            <h3 className="mono text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
              ARCHITECTURE & METRICS
            </h3>
            
            <div className="space-y-4">
              <div className="panel-elevated p-3 border-l-2 border-l-[var(--color-primary)]">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Core Model</div>
                <div className="text-sm font-semibold mt-1">Attention U-Net (ResNet-50)</div>
                <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                  Spatial and channel attention gates ignore surrounding background urban clutter to focus specifically on tracing thin, low-contrast linear road structures.
                </p>
              </div>

              <div className="panel-elevated p-3 border-l-2 border-l-[var(--color-verified)]">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Dual-Loss Formulation</div>
                <div className="mono text-xs font-semibold text-[var(--color-verified)] mt-2 bg-secondary/50 p-2 rounded">
                  Loss = Dice Loss + Focal Loss
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                  Explicitly pushes the model to ignore massive rural/urban backgrounds and focus its gradients on thin, low-contrast boundary lanes.
                </p>
              </div>

              <div className="panel-elevated p-3 border-l-2 border-l-[var(--color-warning)]">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Albumentations</div>
                <div className="text-sm font-semibold mt-1">Shadow Augmentation</div>
                <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                  Drives heavy pixel contrast, blurring, and artificial lighting transformations to ensure robustness across multi-seasonal environments.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Relaxed IoU Buffer</span>
                <span className="mono text-xs font-bold text-[var(--color-verified)]">96.2%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-[var(--color-verified)] w-[96.2%] rounded-full"></div>
              </div>
              
              <div className="flex justify-between items-center mt-4 mb-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Length-Completeness</span>
                <span className="mono text-xs font-bold text-[var(--color-verified)]">94.0%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-[var(--color-verified)] w-[94%] rounded-full"></div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
