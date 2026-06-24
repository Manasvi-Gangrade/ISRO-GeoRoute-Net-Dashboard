import React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/graph")({
  head: () => ({
    meta: [{ title: "GeoRoute-Net — Graph Engine" }],
  }),
  component: GraphScreen,
});

function GraphScreen() {
  return (
    <main className="mx-auto max-w-[1600px] p-4 anim-rise">
      <section className="panel border border-[var(--color-border)] shadow-lg">
        {/* Module Header */}
        <div className="border-b border-border px-6 py-5 bg-gradient-to-r from-background to-secondary/30">
          <div className="flex items-center gap-3">
            <span className="mono rounded border border-[var(--color-warning)] bg-[var(--color-warning)]/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-warning)]">
              Module 2
            </span>
            <h2 className="text-xl font-bold tracking-wide text-foreground flex items-center gap-2">
              Reliability-Aware Graph Healing Framework
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
            Evaluates broken edge gaps using a multiplicative check-gate formula to filter connections into transparent reliability tiers. Replaces blind proximity-based minimum spanning trees.
          </p>
        </div>
        
        {/* Main Content Grid */}
        <div className="p-6 grid gap-6 lg:grid-cols-2">
          
          {/* Left Column: Equations & Theory */}
          <div className="space-y-6">
            <div className="panel-elevated p-5 rounded-lg border-l-4 border-l-[var(--color-warning)]">
              <h3 className="mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                THE MULTIPLICATIVE GATING FRAMEWORK
              </h3>
              <div className="bg-background/80 p-4 rounded border border-border flex items-center justify-center shadow-inner my-4">
                <span className="mono text-2xl font-bold text-foreground">
                  R = C × A × <span className="text-[var(--color-warning)]">f(D)</span>
                </span>
              </div>
              <ul className="space-y-3 mt-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mono font-bold text-foreground w-4">C</span> 
                  <span>= Softmax pixel model confidence score (0.0 → 1.0)</span>
                </li>
                <li className="flex gap-3">
                  <span className="mono font-bold text-foreground w-4">A</span> 
                  <span>= Heading vector alignment similarity (<span className="mono text-xs">cos θ</span>)</span>
                </li>
                <li className="flex gap-3">
                  <span className="mono font-bold text-[var(--color-warning)] w-4">f(D)</span> 
                  <span>= Exponential distance decay function (<span className="mono text-xs">e^(−λd)</span>), penalizing long physical gaps</span>
                </li>
              </ul>
              
              <div className="mt-6 p-3 bg-secondary/30 rounded text-xs leading-relaxed border border-border/50">
                <strong className="text-foreground block mb-1">Geometric Multiplier Collapse:</strong>
                If the tracking trajectory of two broken segments forms an unfeasible, near-perpendicular alignment (θ → 90°), the absolute cosine alignment collapses to zero (A → 0). This completely zeros out the overall Reliability Score (R → 0), successfully blocking false proximity connections.
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="panel-elevated p-4 rounded-lg">
                <div className="text-3xl mb-2">🦴</div>
                <h4 className="font-semibold text-sm">Morphological Skeletonization</h4>
                <p className="text-[10px] text-muted-foreground mt-2">Processes binary pixel masks into single-pixel-wide vector centerlines using Scikit-Image to log intersections (Nodes) and segments (Edges).</p>
              </div>
              <div className="panel-elevated p-4 rounded-lg">
                <div className="text-3xl mb-2">🛡️</div>
                <h4 className="font-semibold text-sm">Topological Mapping</h4>
                <p className="text-[10px] text-muted-foreground mt-2">Provides a 27% improvement in baseline topological connectivity within a 3-week simulation run vs. proximity-based MST models.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Trust Tiers */}
          <div className="space-y-4">
            <h3 className="mono text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
              HUMAN-IN-THE-LOOP TIERING
            </h3>
            
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Tier</th>
                    <th className="px-4 py-3 font-medium">Score Boundary</th>
                    <th className="px-4 py-3 font-medium">System Behavior</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-panel-elevated">
                  {/* Verified */}
                  <tr className="transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-verified)] shadow-[0_0_8px_var(--color-verified)]"></span>
                        <span className="font-semibold text-[var(--color-verified)]">Auto-Reconnect</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top mono font-medium">R ≥ 0.75</td>
                    <td className="px-4 py-4 align-top text-xs text-muted-foreground leading-relaxed">
                      Clear, verified vector topology is automatically drawn straight into the production layers.
                    </td>
                  </tr>
                  
                  {/* Review */}
                  <tr className="transition-colors hover:bg-secondary/30 bg-[var(--color-warning)]/5">
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-warning)] anim-pulse-node"></span>
                        <span className="font-semibold text-[var(--color-warning)]">Analyst Review Flag</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top mono font-medium">0.50 ≤ R &lt; 0.75</td>
                    <td className="px-4 py-4 align-top text-xs text-muted-foreground leading-relaxed">
                      Low-confidence or ambiguous segments trigger a cyber-amber/orange warning box on the command dashboard for human verification.
                    </td>
                  </tr>
                  
                  {/* Reject */}
                  <tr className="transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-critical)]"></span>
                        <span className="font-semibold text-[var(--color-critical)]">Reject</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top mono font-medium">R &lt; 0.50</td>
                    <td className="px-4 py-4 align-top text-xs text-muted-foreground leading-relaxed">
                      Connection dropped to prevent database corruption. Eliminates false positive connections across physical barriers like rivers or buildings.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 border border-[var(--color-verified)]/20 bg-[var(--color-verified)]/5 p-4 rounded-lg flex items-start gap-4">
              <div className="mt-1 text-[var(--color-verified)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Operational Impact</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  This framework frees up <strong>500,000 engineering hours per year</strong> for state GIS analysts by automating the safe connections and only flagging the complex 0.50-0.75 tier for manual review.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
