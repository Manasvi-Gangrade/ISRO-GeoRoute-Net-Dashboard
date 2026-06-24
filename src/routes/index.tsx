import { createFileRoute } from "@tanstack/react-router";
import React, { useMemo, useState, useEffect } from "react";
import { NODES, EDGES, type NodeId, type GeoNode as Node, type GeoEdge as Edge } from "../lib/geoData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GeoRoute-Net — Command Center" },
      {
        name: "description",
        content:
          "Reliability-gated road extraction, gatekeeper node analysis, and disaster reroute simulation for urban mobility.",
      },
    ],
  }),
  component: CommandCenter,
});

/* ------------------------------------------------------------------ */
/* Mock spatial model — a tiny hand-tuned road graph for the demo map */
/* ------------------------------------------------------------------ */

// NODES and EDGES are imported from lib/geoData.ts

/* Occlusion patches (canopy / shadow / cloud) rendered as amber overlays */
const OCCLUSIONS = [
  { x: 340, y:  80, w: 90, h: 70,  kind: "Canopy"  },
  { x: 630, y: 110, w: 90, h: 70,  kind: "Shadow"  },
  { x: 240, y: 340, w: 120, h: 80, kind: "Canopy"  },
  { x: 460, y: 460, w: 90, h: 60,  kind: "Cloud"   },
];

/* Detour path (for simulation demo) as a sequence of node ids */
const DETOUR: NodeId[] = ["N7", "N11", "N12", "N16", "N13", "N9"];

/* ------------------------------------------------------------------ */
/* Utility                                                            */
/* ------------------------------------------------------------------ */

function tierOf(R: number): "verified" | "review" | "reject" {
  if (R >= 0.75) return "verified";
  if (R >= 0.5)  return "review";
  return "reject";
}

function edgeStroke(tier: string, overridden?: boolean) {
  if (overridden) return "var(--color-verified)";
  if (tier === "verified") return "var(--color-verified)";
  if (tier === "review")   return "var(--color-warning)";
  return "var(--color-critical)";
}

/* ------------------------------------------------------------------ */

function CommandCenter() {
  const [hazard, setHazard]         = useState<"Flooding" | "Landslide" | "Structural Accident">("Flooding");
  const [disabled, setDisabled]     = useState<NodeId | null>(null);
  const [approvals, setApprovals]   = useState<Record<string, "approved" | "rejected" | undefined>>({});
  const [inspecting, setInspecting] = useState<Edge | null>(null);

  const reviewEdges = useMemo(
    () => EDGES.filter((e) => tierOf(e.R) === "review" && !approvals[e.id]),
    [approvals],
  );

  const gatekeepers = NODES.filter((n) => n.gatekeeper);

  /* Very small ablation model — a monotonic score, not a real solver.
     Baseline avg path length = 1.00 reference; disabling a gatekeeper node
     inflates it and reduces the ratio. */
  const resilienceIndex = useMemo(() => {
    if (!disabled) return 1.0;
    const gk = NODES.find((n) => n.id === disabled)?.gatekeeper;
    return gk ? 0.62 : 0.86;
  }, [disabled]);

  const stats = useMemo(() => {
    const total    = EDGES.length;
    const verified = EDGES.filter((e) => tierOf(e.R) === "verified").length;
    const review   = EDGES.filter((e) => tierOf(e.R) === "review").length;
    const healed   = EDGES.filter((e) => e.healed).length;
    return { total, verified, review, healed };
  }, []);

  return (
    <>
      <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        {/* SECTION A — Interactive map canvas */}
        <MapCanvas
          disabled={disabled}
          onToggleNode={(id) => setDisabled((d) => (d === id ? null : id))}
          onInspectEdge={setInspecting}
          approvals={approvals}
          hazard={hazard}
          showDetour={disabled !== null}
        />

        {/* Right column: B, C */}
        <div className="flex flex-col gap-4">
          <TrustIndicators
            edges={reviewEdges}
            onApprove={(id) => setApprovals((a) => ({ ...a, [id]: "approved" }))}
            onReject={(id) => setApprovals((a) => ({ ...a, [id]: "rejected" }))}
            approvedCount={Object.values(approvals).filter((v) => v === "approved").length}
            rejectedCount={Object.values(approvals).filter((v) => v === "rejected").length}
          />

          <DisasterToolkit
            hazard={hazard}
            setHazard={setHazard}
            gatekeepers={gatekeepers}
            disabled={disabled}
            setDisabled={setDisabled}
            resilienceIndex={resilienceIndex}
          />
        </div>

        {/* SECTION D — Benchmark strip spans full width */}
        <div className="lg:col-span-2">
          <BenchmarkStrip stats={stats} />
        </div>

        {/* SECTION E & F — Live Terminal and Chart */}
        <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
          <SystemTelemetry />
          <TerminalLogs />
        </div>
      </main>

      {inspecting && (
        <InspectModal edge={inspecting} onClose={() => setInspecting(null)} />
      )}
    </>
  );
}

function SystemTelemetry() {
  const data = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    time: i,
    cpu: 30 + Math.random() * 20,
    ram: 60 + Math.random() * 10
  })), []);
  
  return (
    <section className="panel p-4 flex flex-col h-48 border-[var(--color-primary)]/20">
      <div className="flex justify-between items-center mb-2">
        <h3 className="mono text-[10px] uppercase tracking-widest text-muted-foreground">System Telemetry</h3>
        <span className="mono text-[9px] text-[var(--color-verified)] anim-pulse-node">LIVE</span>
      </div>
      <div className="flex-1 w-full text-[10px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            {/* @ts-expect-error recharts types */}
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="time" hide />
            {/* @ts-expect-error recharts types */}
            <YAxis stroke="var(--color-muted-foreground)" fontSize={9} />
            {/* @ts-expect-error recharts types */}
            <Line type="monotone" dataKey="cpu" stroke="var(--color-verified)" strokeWidth={2} dot={false} isAnimationActive={false} />
            {/* @ts-expect-error recharts types */}
            <Line type="monotone" dataKey="ram" stroke="var(--color-warning)" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function TerminalLogs() {
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] INGESTING CARTOSAT-3 TILE 17.4152°N 78.4867°E...",
    "[VISION] ATTENTION U-NET MASK GENERATED. RELAXED IOU: 96.2%",
    "[GRAPH] EXTRACTING SKELETONIZED VECTORS...",
    "[GRAPH] TOPOLOGY MAPPED. GATEKEEPERS IDENTIFIED: 3",
  ]);

  useEffect(() => {
    const messages = [
      "[ROUTING] CALCULATING BETWEENNESS CENTRALITY...",
      "[WARNING] GATEKEEPER 03 (GK-03) STRUCTURAL LOAD CRITICAL.",
      "[SYSTEM] AWAITING HUMAN-IN-THE-LOOP VALIDATION...",
      "[NET] UPLINK PING: 24ms",
      "[GRAPH] RE-EVALUATING MULTIPLICATIVE GATE...",
    ];
    let i = 0;
    const int = setInterval(() => {
      if (i < messages.length) {
        setLogs(prev => [...prev.slice(-4), messages[i++]]);
      } else {
        i = 0;
      }
    }, 2500);
    return () => clearInterval(int);
  }, []);

  return (
    <section className="panel p-4 h-48 bg-[#0a0a0a] border-border overflow-hidden flex flex-col font-mono">
      <div className="flex justify-between items-center mb-3 border-b border-border/50 pb-2">
        <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground">Terminal Log</h3>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-border"></div>
          <div className="w-2 h-2 rounded-full bg-border"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-verified)] anim-pulse-node"></div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end text-[10px] text-[var(--color-verified)] space-y-1.5">
        {logs.map((log, idx) => (
          <div key={idx} className="opacity-80 break-all">{log}</div>
        ))}
        <div className="animate-pulse">_</div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Map canvas                                                          */
/* ================================================================== */

function MapCanvas(props: {
  disabled: NodeId | null;
  onToggleNode: (id: NodeId) => void;
  onInspectEdge: (e: Edge) => void;
  approvals: Record<string, "approved" | "rejected" | undefined>;
  hazard: string;
  showDetour: boolean;
}) {
  const { disabled, onToggleNode, onInspectEdge, approvals, hazard, showDetour } = props;
  const nodeById = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);

  const detourPath = useMemo(() => {
    const pts = DETOUR.map((id) => nodeById[id]).filter(Boolean);
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [nodeById]);

  return (
    <section className="panel scanline relative overflow-hidden">
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-3">
          <SectionTag>Section A</SectionTag>
          <h2 className="text-sm font-semibold tracking-wide">Interactive Map Canvas</h2>
          <span className="mono text-[10px] text-muted-foreground">
            TILE · 17.4152°N 78.4867°E · z14
          </span>
        </div>
        <div className="flex items-center gap-1">
          {["Sat", "Vector", "Heat"].map((l, i) => (
            <button
              key={l}
              className={
                "rounded px-2 py-1 text-[10px] font-medium tracking-wide " +
                (i === 1 ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60")
              }
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative">
        <div className="grid-bg relative h-[560px] w-full overflow-hidden">
          {/* Ambient scene: rocket launch + astronaut + orbit */}
          <SceneOverlay />

          {/* Legend (top-left) */}
          <Legend />

          {/* Compass (top-right) */}
          <Compass />

          {/* Coordinates readout (bottom-left) */}
          <CoordReadout />

          <svg viewBox="0 0 780 560" className="relative h-full w-full">
            <defs>
              <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-warning)" strokeWidth="1" opacity="0.35" />
              </pattern>
              <radialGradient id="hazardGrad">
                <stop offset="0%"  stopColor="var(--color-critical)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="var(--color-critical)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Occlusion patches */}
            {OCCLUSIONS.map((o, i) => (
              <g key={i}>
                <rect
                  x={o.x} y={o.y} width={o.w} height={o.h}
                  fill="url(#hatch)"
                  stroke="var(--color-warning)"
                  strokeDasharray="4 3"
                  strokeWidth="1"
                  opacity="0.85"
                  rx="2"
                />
                <text
                  x={o.x + 6} y={o.y + 14}
                  className="mono"
                  fontSize="9"
                  fill="var(--color-warning)"
                  opacity="0.9"
                >
                  {o.kind.toUpperCase()}
                </text>
              </g>
            ))}

            {/* Hazard aura around disabled node */}
            {disabled && (() => {
              const n = nodeById[disabled];
              if (!n) return null;
              return (
                <>
                  <circle cx={n.x} cy={n.y} r="70" fill="url(#hazardGrad)" />
                  <text
                    x={n.x} y={n.y - 78}
                    textAnchor="middle"
                    fontSize="10"
                    className="mono"
                    fill="var(--color-critical)"
                  >
                    {hazard.toUpperCase()} · IMPACT ZONE
                  </text>
                </>
              );
            })()}

            {/* Edges */}
            {EDGES.map((e) => {
              const a = nodeById[e.a];
              const b = nodeById[e.b];
              const tier = tierOf(e.R);
              const override = approvals[e.id];
              const isDisabled =
                disabled && (e.a === disabled || e.b === disabled);
              const stroke = isDisabled
                ? "var(--color-critical)"
                : edgeStroke(tier, override === "approved");
              const isReviewInteractive = tier === "review" && !override;

              return (
                <g key={e.id}>
                  <line
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={stroke}
                    strokeWidth={tier === "verified" ? 2.2 : 1.8}
                    strokeLinecap="round"
                    opacity={isDisabled ? 0.35 : 0.95}
                    strokeDasharray={
                      isDisabled ? "3 5" :
                      tier === "review" && !override ? "6 4" :
                      undefined
                    }
                    className={
                      isReviewInteractive ? "cursor-pointer" : undefined
                    }
                    onClick={() => isReviewInteractive && onInspectEdge(e)}
                  />
                  {/* invisible fat hit line for easier click */}
                  {isReviewInteractive && (
                    <line
                      x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      stroke="transparent" strokeWidth="14"
                      onClick={() => onInspectEdge(e)}
                      className="cursor-pointer"
                    />
                  )}
                </g>
              );
            })}

            {/* Detour path */}
            {showDetour && (
              <path
                d={detourPath}
                fill="none"
                stroke="#4c8bf5"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="anim-dash"
                opacity="0.95"
              />
            )}

            {/* Nodes */}
            {NODES.map((n) => {
              const isGK = n.gatekeeper;
              const isDown = disabled === n.id;
              const fill = isDown
                ? "var(--color-critical)"
                : isGK
                  ? "var(--color-critical)"
                  : "var(--color-verified)";
              return (
                <g
                  key={n.id}
                  onClick={() => isGK && onToggleNode(n.id)}
                  className={isGK ? "cursor-pointer" : undefined}
                >
                  {isGK && !isDown && (
                    <circle
                      cx={n.x} cy={n.y} r="10"
                      fill="none"
                      stroke="var(--color-critical)"
                      strokeWidth="1.2"
                      className="anim-pulse-ring"
                      opacity="0.6"
                    />
                  )}
                  <circle
                    cx={n.x} cy={n.y}
                    r={isGK ? 6 : 3.5}
                    fill={fill}
                    stroke="rgba(0,0,0,0.6)"
                    strokeWidth="1"
                    className={isGK && !isDown ? "anim-pulse-node" : undefined}
                    style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                  />
                  {n.label && (
                    <text
                      x={n.x + 10} y={n.y - 8}
                      fontSize="9"
                      className="mono"
                      fill={isDown ? "var(--color-critical)" : "var(--color-foreground)"}
                      opacity="0.85"
                    >
                      {n.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Scanning sweep bar */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 anim-sweep bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
        </div>
      </div>
    </section>
  );
}

function Legend() {
  return (
    <div className="panel-elevated pointer-events-none absolute left-3 top-3 z-10 px-3 py-2 text-[10px]">
      <div className="mb-1 font-semibold tracking-wide text-foreground">LEGEND</div>
      <LegendRow color="var(--color-verified)" label="Verified Roads" />
      <LegendRow color="var(--color-warning)"  label="Cloud/Canopy Shadows" swatch />
      <LegendRow color="var(--color-critical)" label="Gatekeeper Nodes: Vulnerable Bottleneck" ring />
      <LegendRow color="#4c8bf5"               label="Alternative Detour Track" thick />
    </div>
  );
}

function LegendRow({
  color, label, dashed, ring, thick, swatch,
}: { color: string; label: string; dashed?: boolean; ring?: boolean; thick?: boolean; swatch?: boolean }) {
  return (
    <div className="flex items-center gap-2 py-0.5 text-muted-foreground">
      <span className="inline-flex h-3 w-6 items-center justify-center">
        {swatch ? (
          <span className="h-2.5 w-5 rounded-[2px]" style={{ backgroundColor: color, opacity: 0.5 }} />
        ) : ring ? (
          <span className="h-2.5 w-2.5 rounded-full border" style={{ borderColor: color }} />
        ) : (
          <span
            className="block w-5"
            style={{
              height: thick ? 3 : 2,
              backgroundColor: color,
              opacity: dashed ? 0.9 : 1,
              backgroundImage: dashed
                ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 7px)`
                : undefined,
            }}
          />
        )}
      </span>
      <span>{label}</span>
    </div>
  );
}

function Compass() {
  return (
    <div className="panel-elevated absolute right-3 top-3 z-10 grid h-14 w-14 place-items-center">
      <svg viewBox="0 0 40 40" className="h-10 w-10 text-muted-foreground">
        <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
        <polygon points="20,5 23,20 20,17 17,20" fill="var(--color-critical)" opacity="0.9" />
        <polygon points="20,35 23,20 20,23 17,20" fill="currentColor" opacity="0.6" />
        <text x="20" y="10" textAnchor="middle" fontSize="6" className="mono" fill="currentColor">N</text>
      </svg>
    </div>
  );
}

function CoordReadout() {
  return (
    <div className="panel-elevated mono absolute bottom-3 left-3 z-10 flex items-center gap-3 px-3 py-1.5 text-[10px] text-muted-foreground">
      <span className="anim-ticker inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-verified)]" />
      <span>17.41521 N · 78.48670 E</span>
      <span className="opacity-40">|</span>
      <span>ALT 0.42 km</span>
      <span className="opacity-40">|</span>
      <span>SAT · CARTOSAT-3</span>
    </div>
  );
}

/* Rocket + astronaut + orbit — subtle background scene */
function SceneOverlay() {
  return (
    <svg
      viewBox="0 0 780 560"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09]"
      aria-hidden
    >
      {/* Orbit */}
      <g className="anim-orbit" style={{ transformOrigin: "620px 460px" }}>
        <ellipse cx="620" cy="460" rx="140" ry="42" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="760" cy="460" r="3" fill="var(--color-verified)" />
      </g>
      {/* Rocket bottom-left drifting */}
      <g className="anim-rocket" transform="translate(60 460) rotate(-18)">
        <path d="M0 0 L14 -50 L28 0 Z" fill="currentColor" />
        <path d="M0 0 L14 -50 L14 0 Z" fill="currentColor" opacity="0.6" />
        <circle cx="14" cy="-28" r="3" fill="var(--color-warning)" />
        <path d="M0 0 L-6 20 L6 12 Z" fill="var(--color-critical)" opacity="0.85" />
        <path d="M28 0 L34 20 L22 12 Z" fill="var(--color-critical)" opacity="0.85" />
        <path d="M14 -50 Q 20 -70 12 -90" stroke="currentColor" strokeWidth="1" fill="none" />
      </g>
      {/* Astronaut top-right */}
      <g transform="translate(680 60) scale(1.1)">
        <circle cx="0" cy="0" r="12" fill="currentColor" />
        <circle cx="-3" cy="-2" r="6" fill="var(--color-background)" opacity="0.9" />
        <rect x="-10" y="10" width="20" height="16" rx="4" fill="currentColor" />
        <rect x="-14" y="12" width="6"  height="10" rx="2" fill="currentColor" />
        <rect x="8"   y="12" width="6"  height="10" rx="2" fill="currentColor" />
      </g>
    </svg>
  );
}

/* ================================================================== */
/* Trust indicators                                                    */
/* ================================================================== */

function TrustIndicators(props: {
  edges: Edge[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  approvedCount: number;
  rejectedCount: number;
}) {
  const { edges, onApprove, onReject, approvedCount, rejectedCount } = props;
  return (
    <section className="panel">
      <SectionHeader
        tag="Section B"
        title="Reliability Trust Indicators"
        subtitle="Multiplicative gate: R = C · A · f(D)"
      />
      <div className="grid grid-cols-3 gap-2 px-3 pt-3">
        <MiniStat label="Auto-verified"  value={EDGES.filter(e => tierOf(e.R) === "verified").length + approvedCount} tone="verified" />
        <MiniStat label="Awaiting review" value={edges.length} tone="warning" />
        <MiniStat label="Rejected"        value={rejectedCount} tone="critical" />
      </div>

      <ul className="max-h-[320px] divide-y divide-border overflow-auto px-3 py-2">
        {edges.length === 0 && (
          <li className="py-6 text-center text-xs text-muted-foreground">
            No pending links — every gate has cleared.
          </li>
        )}
        {edges.map((e) => (
          <li key={e.id} className="anim-rise flex items-center gap-3 py-2.5">
            <MeterBar value={e.R} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="mono text-[11px] text-foreground">SEG {e.id}</span>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
                  Healed
                </span>
              </div>
              <div className="mono text-[10px] text-muted-foreground">
                C {e.C.toFixed(2)} · A {e.A.toFixed(2)} · D {e.D}m · R {e.R.toFixed(2)}
              </div>
            </div>
            <button
              onClick={() => onApprove(e.id)}
              className="rounded border border-border bg-panel-elevated px-2 py-1 text-[10px] font-medium text-foreground hover:bg-[color-mix(in_oklab,var(--color-verified)_18%,var(--color-panel-elevated))]"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(e.id)}
              className="rounded border border-border bg-panel-elevated px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-[color-mix(in_oklab,var(--color-critical)_18%,var(--color-panel-elevated))]"
            >
              Reject
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MeterBar({ value }: { value: number }) {
  const tier = tierOf(value);
  const color =
    tier === "verified" ? "var(--color-verified)" :
    tier === "review"   ? "var(--color-warning)"  :
                          "var(--color-critical)";
  return (
    <div className="flex w-14 flex-col items-end gap-1">
      <span className="mono text-[10px]" style={{ color }}>{Math.round(value * 100)}%</span>
      <div className="h-1.5 w-full rounded-full bg-secondary">
        <div
          className="h-full rounded-full"
          style={{ width: `${value * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: number; tone: "verified" | "warning" | "critical" }) {
  const color =
    tone === "verified" ? "var(--color-verified)" :
    tone === "warning"  ? "var(--color-warning)"  :
                          "var(--color-critical)";
  return (
    <div className="panel-elevated px-2.5 py-2">
      <div className="mono text-lg font-semibold" style={{ color }}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

/* ================================================================== */
/* Disaster toolkit                                                    */
/* ================================================================== */

function DisasterToolkit(props: {
  hazard: "Flooding" | "Landslide" | "Structural Accident";
  setHazard: (h: "Flooding" | "Landslide" | "Structural Accident") => void;
  gatekeepers: Node[];
  disabled: NodeId | null;
  setDisabled: (id: NodeId | null) => void;
  resilienceIndex: number;
}) {
  const { hazard, setHazard, gatekeepers, disabled, setDisabled, resilienceIndex } = props;
  const pct = Math.round(resilienceIndex * 100);
  const tone =
    resilienceIndex >= 0.85 ? "var(--color-verified)" :
    resilienceIndex >= 0.65 ? "var(--color-warning)"  :
                              "var(--color-critical)";

  return (
    <section className="panel">
      <SectionHeader
        tag="Section C"
        title="Disaster Toolkit · Ablation Simulator"
        subtitle="Disable a gatekeeper, re-run Dijkstra, quantify system cost"
      />

      <div className="grid gap-3 p-3">
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Simulate Infrastructure Failure
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(["Flooding", "Landslide", "Structural Accident"] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHazard(h)}
              className={
                "rounded border px-2 py-2 text-[11px] font-medium transition-colors " +
                (hazard === h
                  ? "border-transparent bg-secondary text-foreground"
                  : "border-border bg-panel-elevated text-muted-foreground hover:text-foreground")
              }
            >
              {h}
            </button>
          ))}
        </div>

        <label className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          Target gatekeeper node
        </label>
        <div className="grid gap-1.5">
          {gatekeepers.map((n) => {
            const active = disabled === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setDisabled(active ? null : n.id)}
                className={
                  "flex items-center justify-between rounded border px-2.5 py-2 text-left text-[11px] transition-colors " +
                  (active
                    ? "border-[color-mix(in_oklab,var(--color-critical)_60%,transparent)] bg-[color-mix(in_oklab,var(--color-critical)_14%,var(--color-panel-elevated))]"
                    : "border-border bg-panel-elevated hover:bg-secondary/60")
                }
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--color-critical)" }}
                  />
                  <span className="mono">{n.id}</span>
                  <span className="text-muted-foreground">· {n.label}</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {active ? "Disabled" : "Active"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Resilience readout */}
        <div className="panel-elevated mt-1 p-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Resilience Index (R)
              </div>
              <div className="text-[10px] text-muted-foreground">
                Avg path length · baseline ÷ disrupted
              </div>
            </div>
            <div className="mono text-3xl font-semibold" style={{ color: tone }}>
              {resilienceIndex.toFixed(2)}
            </div>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full transition-[width] duration-500"
              style={{ width: `${pct}%`, backgroundColor: tone }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{disabled ? `${hazard} · Node ${disabled} offline` : "Baseline network · nominal"}</span>
            <span className="mono">Δ {(1 - resilienceIndex).toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => setDisabled(null)}
          className="rounded border border-border bg-panel-elevated px-3 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground"
        >
          Reset simulation
        </button>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Section D — benchmark strip                                         */
/* ================================================================== */

function BenchmarkStrip({ stats }: { stats: { total: number; verified: number; review: number; healed: number } }) {
  return (
    <section className="panel">
      <SectionHeader
        tag="Section D"
        title="Performance Benchmark Strip"
      />
      <div className="flex items-center gap-6 p-4 bg-secondary/20">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-verified)]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-verified)]/20">✓</span>
          Relaxed IoU Buffer: 96.2%
        </div>
        <div className="text-muted-foreground opacity-50">|</div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-verified)]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-verified)]/20">✓</span>
          Length-Completeness Recovery: 94%
        </div>
      </div>
    </section>
  );
}

function Benchmark({ label, value, tone, note }: { label: string; value: string; tone: "verified" | "warning" | "critical"; note?: string }) {
  const color =
    tone === "verified" ? "var(--color-verified)" :
    tone === "warning"  ? "var(--color-warning)"  :
                          "var(--color-critical)";
  return (
    <div className="panel-elevated px-3 py-2.5">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </div>
      <div className="mono mt-1 flex items-baseline gap-2">
        <span className="text-xl font-semibold text-foreground">{value}</span>
        {note && <span className="text-[10px] text-muted-foreground">{note}</span>}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Inspect modal for review edges                                      */
/* ================================================================== */

function InspectModal({ edge, onClose }: { edge: Edge; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-background/70 backdrop-blur-sm">
      <div className="panel-elevated anim-rise w-[min(420px,92vw)] p-5">
        <div className="flex items-center justify-between">
          <SectionTag>Analyst review</SectionTag>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">
            Close
          </button>
        </div>
        <h3 className="mt-2 text-base font-semibold">Segment {edge.id}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Reliability below the 0.75 auto-approve threshold. Confirm this link before it enters the production
          topology.
        </p>

        <div className="mono mt-4 grid grid-cols-3 gap-3 text-center">
          <MetricBlock k="C" v={edge.C} caption="pixel conf." />
          <MetricBlock k="A" v={edge.A} caption="cos θ align" />
          <MetricBlock k="f(D)" v={Math.exp(-0.03 * edge.D)} caption={`d=${edge.D}m`} />
        </div>

        <div className="mt-4 flex items-center justify-between rounded border border-border bg-panel px-3 py-2">
          <span className="text-xs text-muted-foreground">Score R = C · A · f(D)</span>
          <span className="mono text-lg font-semibold" style={{ color: "var(--color-warning)" }}>
            {edge.R.toFixed(2)}
          </span>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded border border-border bg-panel px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            Later
          </button>
          <button
            onClick={onClose}
            className="rounded border border-transparent px-3 py-1.5 text-xs font-medium text-background"
            style={{ backgroundColor: "var(--color-verified)" }}
          >
            Approve link
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricBlock({ k, v, caption }: { k: string; v: number; caption: string }) {
  return (
    <div className="rounded border border-border bg-panel px-2 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="text-lg font-semibold text-foreground">{v.toFixed(2)}</div>
      <div className="text-[10px] text-muted-foreground">{caption}</div>
    </div>
  );
}

/* ================================================================== */
/* Small primitives                                                    */
/* ================================================================== */

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="mono rounded border border-border bg-panel-elevated px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </span>
  );
}

function SectionHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start justify-between border-b border-border px-3 py-2.5">
      <div>
        <div className="flex items-center gap-2">
          <SectionTag>{tag}</SectionTag>
          <h2 className="text-sm font-semibold tracking-wide">{title}</h2>
        </div>
        {subtitle && (
          <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
