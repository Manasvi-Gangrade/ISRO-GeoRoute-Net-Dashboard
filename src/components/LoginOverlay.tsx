import React, { useState, useEffect } from 'react';
import { sfx } from '../lib/audio';

export function LoginOverlay({ onAccessGranted }: { onAccessGranted: () => void }) {
  const [stage, setStage] = useState(0);
  const [terminalText, setTerminalText] = useState("");
  
  const lines = [
    "INITIATING SECURE UPLINK...",
    "CONNECTING TO NNRMS MAINFRAME...",
    "ESTABLISHING CARTOSAT-3 ENCRYPTED TUNNEL...",
    "HANDSHAKE PROTOCOL: SUCCESS",
    "AWAITING BIOMETRIC CLEARANCE..."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setTerminalText(prev => prev + (prev ? "\n" : "") + "> " + lines[currentLine]);
        sfx?.playTerminalBeep();
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => setStage(1), 800); // Move to biometric stage
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleAccess = () => {
    setStage(2); // Access granted state
    sfx?.playSuccessChime();
    setTimeout(() => {
      onAccessGranted();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30"></div>
      <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>

      {stage === 0 && (
        <div className="z-10 w-full max-w-2xl px-6">
          <div className="mono text-xs md:text-sm text-[var(--color-verified)] whitespace-pre-wrap leading-relaxed border border-[var(--color-verified)]/20 p-6 bg-[var(--color-verified)]/5 rounded drop-shadow-[0_0_10px_rgba(0,255,102,0.2)]">
            {terminalText}
            <span className="animate-pulse ml-1">_</span>
          </div>
        </div>
      )}

      {stage >= 1 && (
        <div className={`z-10 flex flex-col items-center transition-all duration-1000 ${stage === 2 ? "scale-150 opacity-0 blur-md" : "scale-100 opacity-100"}`}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-[0.3em] text-foreground mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              GEOROUTE-NET
            </h1>
            <p className="mono text-xs uppercase tracking-widest text-[var(--color-primary)]">
              Restricted NNRMS Access Node
            </p>
          </div>

          <button 
            onClick={handleAccess}
            className={`group relative flex h-32 w-32 items-center justify-center rounded-full border-2 transition-all duration-500
              ${stage === 1 ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 hover:shadow-[0_0_30px_var(--color-primary)]" : "border-[var(--color-verified)] bg-[var(--color-verified)]/20 shadow-[0_0_40px_var(--color-verified)]"}
            `}
          >
            <div className={`absolute inset-0 rounded-full border border-[var(--color-primary)] opacity-50 transition-all duration-700 ${stage === 1 ? "animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" : "border-[var(--color-verified)] opacity-0"}`}></div>
            
            {stage === 1 ? (
              <svg className="h-12 w-12 text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
            ) : (
              <svg className="h-12 w-12 text-[var(--color-verified)] animate-[bounce_0.5s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          <div className="mt-8 mono text-xs uppercase tracking-widest h-6">
            {stage === 1 ? (
              <span className="text-muted-foreground animate-pulse">Awaiting Authentication...</span>
            ) : (
              <span className="text-[var(--color-verified)] drop-shadow-[0_0_8px_var(--color-verified)]">Access Granted. Decrypting...</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
