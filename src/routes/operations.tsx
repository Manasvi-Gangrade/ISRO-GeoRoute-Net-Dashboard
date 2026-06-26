import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/operations")({
  head: () => ({
    meta: [{ title: "GeoRoute-Net — NDRF Operations" }],
  }),
  component: OperationsScreen,
});

function OperationsScreen() {
  const [droneDispatched, setDroneDispatched] = useState(false);
  const [activeTab, setActiveTab] = useState<"predictive" | "routing" | "uav">("predictive");

  return (
    <main className="mx-auto max-w-[1600px] p-4 anim-rise">
      <section className="panel border border-[var(--color-border)] shadow-lg">
        {/* Module Header */}
        <div className="border-b border-border px-6 py-5 bg-gradient-to-r from-background to-secondary/30">
          <div className="flex items-center gap-3">
            <span className="mono rounded border border-[#4c8bf5] bg-[#4c8bf5]/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#4c8bf5]">
              Advanced Module
            </span>
            <h2 className="text-xl font-bold tracking-wide text-foreground flex items-center gap-2">
              NDRF Dispatch & Predictive Intelligence
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
            Next-generation features for National Disaster Response Force (NDRF). Includes multi-temporal analysis, heavy-payload routing constraints, predictive AI vulnerability forecasting, and automated UAV dispatch.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border px-4 pt-4">
          <TabButton active={activeTab === "predictive"} onClick={() => setActiveTab("predictive")} icon="⛈️" label="Predictive Vulnerability" />
          <TabButton active={activeTab === "routing"} onClick={() => setActiveTab("routing")} icon="🚛" label="Heavy-Payload Routing" />
          <TabButton active={activeTab === "uav"} onClick={() => setActiveTab("uav")} icon="🚁" label="UAV Drone Dispatch" />
        </div>

        <div className="p-6 min-h-[400px]">
          {activeTab === "predictive" && (
            <div className="grid gap-6 md:grid-cols-2 anim-rise">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Monsoon Forecast</h3>
                <div className="panel-elevated p-4 border-l-4 border-l-[var(--color-critical)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-20 text-4xl">⚠️</div>
                  <div className="mono text-[10px] uppercase text-[var(--color-critical)] font-bold mb-1">High Probability Risk</div>
                  <div className="text-lg font-bold">Gatekeeper Node 12 (GK-12)</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Historical landslide data and current soil moisture readings predict a <strong>78% probability of structural failure</strong> within the next 48 hours.
                  </p>
                  <button className="mt-4 bg-[var(--color-critical)]/20 text-[var(--color-critical)] border border-[var(--color-critical)]/50 px-3 py-1.5 rounded text-xs font-semibold hover:bg-[var(--color-critical)] hover:text-black transition-colors">
                    Deploy Preventive SDRF Unit
                  </button>
                </div>
                
                <div className="panel-elevated p-4 border-l-4 border-l-[var(--color-warning)] relative overflow-hidden">
                  <div className="mono text-[10px] uppercase text-[var(--color-warning)] font-bold mb-1">Moderate Risk</div>
                  <div className="text-lg font-bold">Segment E15 (River Bridge)</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Multi-Temporal analysis (Pre vs Post-Monsoon) indicates a 42% risk of flood-level breach.
                  </p>
                </div>
              </div>

              <div className="panel-elevated bg-[#0a0a0a] rounded flex items-center justify-center p-4 relative overflow-hidden border border-border">
                <div className="absolute inset-0 grid-bg opacity-20"></div>
                <div className="absolute inset-0 scanline opacity-30"></div>
                <div className="z-10 text-center">
                  <div className="inline-block w-32 h-32 rounded-full border-2 border-[var(--color-critical)]/30 relative flex items-center justify-center bg-[var(--color-critical)]/5">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-critical)]/20 anim-pulse-ring"></div>
                    <div className="absolute w-3 h-3 rounded-full bg-[var(--color-critical)]"></div>
                  </div>
                  <div className="mt-4 mono text-[10px] text-[var(--color-critical)] uppercase tracking-widest">Target GK-12 Vulnerability Map</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "routing" && (
            <div className="grid gap-6 md:grid-cols-2 anim-rise">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">NDRF Fleet Constraints</h3>
                <div className="panel-elevated p-4">
                  <label className="text-xs font-semibold text-foreground">Select Rescue Vehicle Payload Class</label>
                  <select className="w-full mt-2 bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[var(--color-primary)]">
                    <option>Class 1: Light Rescue (Jeeps, Ambulances) - &lt; 5 Tons</option>
                    <option>Class 2: Medium Logistics (Supply Trucks) - 5 to 15 Tons</option>
                    <option>Class 3: Heavy Excavation (NDRF Earthmovers) - &gt; 15 Tons</option>
                  </select>
                  <p className="text-[10px] text-muted-foreground mt-3">
                    System automatically filters out low-capacity bridges (e.g., Segment E23) and narrow secondary streets to ensure heavy machinery does not get stuck or cause structural collapse.
                  </p>
                </div>

                <div className="panel-elevated p-4 border-l-4 border-l-[#4c8bf5]">
                  <div className="text-sm font-bold text-[#4c8bf5]">Route Optimized for Heavy Excavation</div>
                  <div className="mono text-xs mt-2 text-muted-foreground">
                    PATH: N1 → N6 → N11 → N18<br/>
                    EST. TIME: 45 Mins<br/>
                    STRUCTURAL LIMIT: Safe (Min capacity 25 Tons)
                  </div>
                </div>
              </div>
              <div className="panel-elevated bg-[#0a0a0a] rounded flex items-center justify-center p-4 relative overflow-hidden border border-border">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4c8bf5] via-background to-background"></div>
                <div className="z-10 w-full h-full p-4 flex flex-col gap-2">
                  {/* Fake routing list */}
                  <div className="flex items-center gap-3 bg-secondary/50 p-2 rounded">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-verified)]"></span>
                    <span className="mono text-[10px]">Segment E5 (Main Arterial) - PASS</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[var(--color-critical)]/10 p-2 rounded border border-[var(--color-critical)]/20">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-critical)]"></span>
                    <span className="mono text-[10px] text-[var(--color-critical)]">Segment E15 (Rural Bridge) - REJECTED (Capacity Exceeded)</span>
                  </div>
                  <div className="flex items-center gap-3 bg-secondary/50 p-2 rounded">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-verified)]"></span>
                    <span className="mono text-[10px]">Segment E28 (Highway Bypass) - PASS</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "uav" && (
            <div className="grid gap-6 md:grid-cols-2 anim-rise">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Automated Drone Dispatch</h3>
                <p className="text-xs text-muted-foreground">
                  When satellite imagery encounters extreme cloud cover (&gt;80%) over critical urban zones, the system can automatically relay GPS coordinates to local SDRF drone squads to capture missing topological data.
                </p>
                <div className="panel-elevated p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold">Target: Cloud Occlusion Zone 4</span>
                    <span className="mono text-xs text-muted-foreground">LAT 17.4082 · LNG 78.4880</span>
                  </div>
                  
                  <button 
                    onClick={() => setDroneDispatched(true)}
                    disabled={droneDispatched}
                    className={`w-full rounded py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                      droneDispatched 
                      ? "bg-[var(--color-verified)]/20 text-[var(--color-verified)] border border-[var(--color-verified)]/50 cursor-default" 
                      : "bg-[#4c8bf5] text-white hover:bg-[#3a70c4] shadow-[0_0_15px_rgba(76,139,245,0.4)]"
                    }`}
                  >
                    {droneDispatched ? "✓ UAV SQUAD DISPATCHED" : "INITIATE DRONE RECONNAISSANCE"}
                  </button>
                </div>

                {droneDispatched && (
                  <div className="panel-elevated p-3 border-l-4 border-l-[var(--color-verified)] anim-rise bg-[var(--color-verified)]/5">
                    <div className="mono text-[10px] text-[var(--color-verified)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-verified)] anim-pulse-node"></span>
                      Drone telemetry uplink established. ETA to target: 4m 12s.
                    </div>
                  </div>
                )}
              </div>
              
              <div className="panel-elevated bg-[#0a0a0a] rounded flex items-center justify-center p-4 relative overflow-hidden border border-border">
                <div className="absolute inset-0 grid-bg opacity-30"></div>
                <svg className="w-full h-full z-10" viewBox="0 0 100 100">
                  <circle cx="80" cy="80" r="15" fill="none" stroke="var(--color-warning)" strokeWidth="1" strokeDasharray="2 2" className="anim-orbit" />
                  <text x="80" y="70" fontSize="4" fill="var(--color-warning)" textAnchor="middle" className="mono uppercase">Cloud Cover</text>
                  
                  {droneDispatched && (
                    <g className="anim-rise">
                      <path d="M 20 20 L 75 75" fill="none" stroke="var(--color-verified)" strokeWidth="1" strokeDasharray="4 4" className="anim-dash" />
                      <circle cx="20" cy="20" r="2" fill="var(--color-primary)" />
                      <text x="20" y="15" fontSize="4" fill="var(--color-primary)" textAnchor="middle" className="mono uppercase">SDRF Base</text>
                      
                      <g transform="translate(50, 50)">
                        <circle cx="0" cy="0" r="1.5" fill="var(--color-verified)" className="anim-pulse-node" />
                        <text x="5" y="0" fontSize="3" fill="var(--color-verified)" className="mono">UAV-01</text>
                      </g>
                    </g>
                  )}
                </svg>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
        active 
        ? "border-[var(--color-primary)] text-foreground bg-[var(--color-primary)]/5" 
        : "border-transparent text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
      }`}
    >
      <span className="text-base">{icon}</span>
      <span className="uppercase tracking-wider">{label}</span>
    </button>
  );
}
