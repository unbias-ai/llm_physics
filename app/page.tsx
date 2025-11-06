// app/page.tsx
// PR #1 — llmphysics warp‑UI baseline
// Minimal, reproducible layout using Vercel defaults and Tailwind utilities.
// Future PRs: resizable panels, D3/Three placeholders, audit console, AI chat.

import React from 'react';

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_2px_rgba(34,211,238,0.6)]" />
          <h1 className="text-lg font-semibold tracking-wide">llmphysics — warp UI</h1>
        </div>
        <nav className="flex items-center gap-3 text-xs">
          <span className="opacity-70">Mode:</span>
          <span className="rounded border border-white/10 px-2 py-1">Beginner</span>
          <span className="rounded border border-white/10 px-2 py-1 opacity-50">Advanced</span>
        </nav>
      </header>

      {/* Workspace placeholder */}
      <section className="px-6 py-10">
        <div className="grid gap-6">
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium opacity-80">Workspace</h2>
              <span className="text-[10px] opacity-60">PR #1 baseline</span>
            </div>

            {/* Panels (non-resizable yet) */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md border border-white/10 bg-black/50 p-4">
                <div className="text-[11px] opacity-60 mb-2">Editor (future)</div>
                <pre className="text-[12px] leading-6 opacity-80">
{`# Roadmap:

- Python + SymPy (Pyodide) editor

- Live compile to D3/Three panels

- Audit console logs`}
                </pre>
              </div>

              <div className="rounded-md border border-white/10 bg-black/50 p-4">
                <div className="text-[11px] opacity-60 mb-2">Visualization (future)</div>
                <div className="h-40 w-full bg-gradient-to-br from-cyan-900/40 via-black to-fuchsia-900/40 rounded-md border border-white/10" />
                <p className="mt-3 text-[12px] opacity-80">
                  Reserved for D3.js graphs and Three.js scenes (double slit, wave function, spacetime grids).
                </p>
              </div>
            </div>

            {/* Audit note */}
            <div className="mt-6 text-[11px] opacity-60">
              audit: baseline layout only; Vercel defaults; no external assets; Tailwind utilities.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-white/10 text-[11px] opacity-60">
        Deployed on Vercel • Next.js App Router • Tailwind utilities • Ready for resizable panels in PR #2
      </footer>
    </main>
  );
}
