import { Link, Outlet } from "@tanstack/react-router";
import React, { ReactNode, useState, useEffect } from "react";
import { LoginOverlay } from "./LoginOverlay";

export function AppLayout({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {!isLoggedIn && <LoginOverlay onAccessGranted={() => setIsLoggedIn(true)} />}
      <div className={`min-h-screen text-foreground flex flex-col transition-all duration-1000 ${!isLoggedIn ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <TopBar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
}

export function TopBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur shadow-sm">
      <div className="mx-auto flex flex-col md:flex-row max-w-[1600px] md:items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4 justify-between w-full md:w-auto">
          <Logo />
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-widest text-foreground">GEOROUTE-NET</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-primary)]">
              NNRMS Command Link · Active
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto mt-4 md:mt-0">
          {[
            { label: "Vision", to: "/vision" },
            { label: "Graph", to: "/graph" },
            { label: "Command", to: "/" },
            { label: "Operations", to: "/operations" },
            { label: "Exports", to: "/exports" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="relative overflow-hidden rounded px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-all hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] [&.active]:text-black [&.active]:bg-[var(--color-primary)] [&.active]:shadow-[0_0_10px_var(--color-primary)] group"
            >
              <span className="relative z-10">{item.label}</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="mono hidden text-[10px] text-right md:block">
            <div className="text-foreground tracking-widest">{time}</div>
            <div className="text-muted-foreground tracking-widest uppercase mt-0.5">LAT 17.4152°N · LNG 78.4867°E</div>
          </div>
          <div className="h-8 w-px bg-border mx-1"></div>
          <StatusPill dot="verified" label="Uplink OK" />
        </div>
      </div>
    </header>
  );
}

export function StatusPill({ dot, label }: { dot: "verified" | "warning" | "critical"; label: string }) {
  const color =
    dot === "verified" ? "var(--color-verified)" :
    dot === "warning"  ? "var(--color-warning)"  :
                         "var(--color-critical)";
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-panel px-2.5 py-1">
      <span
        className="anim-ticker inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

export function Logo() {
  return (
    <div className="relative grid h-9 w-9 place-items-center rounded border border-border bg-panel">
      <svg viewBox="0 0 40 40" className="h-6 w-6 text-foreground">
        <circle cx="20" cy="20" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
        <g className="anim-orbit" style={{ transformOrigin: "20px 20px" }}>
          <ellipse cx="20" cy="20" rx="16" ry="6" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
          <circle cx="36" cy="20" r="1.6" fill="var(--color-verified)" />
        </g>
        <path d="M6 30 Q 20 22 34 30" stroke="var(--color-warning)" strokeWidth="1.2" fill="none" opacity="0.8" />
      </svg>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto max-w-[1600px] px-4 pb-8 pt-2 text-[10px] text-muted-foreground">
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <div className="mono">
          GeoRoute-Net · Team Avyay · Bharatiya Antariksh Hackathon 2026 · Track 4
        </div>
        <div className="flex items-center gap-3">
          <span>ISRO NNRMS decision-support prototype</span>
          <span className="opacity-40">|</span>
          <span>Shapefile · GeoJSON exports</span>
        </div>
      </div>
    </footer>
  );
}
