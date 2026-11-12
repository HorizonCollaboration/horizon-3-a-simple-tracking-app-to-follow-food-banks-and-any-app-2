"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Flash = { ok: boolean; message: string };

const SayContext = createContext<(flash: Flash) => void>(() => {});

/** Shows a short message after something changes, such as "Added UHT milk to your list." */
export function useFlash() {
  return useContext(SayContext);
}

export function FlashProvider({ initial, children }: { initial?: string; children: ReactNode }) {
  const [flash, setFlash] = useState<Flash | null>(initial ? { ok: true, message: initial } : null);
  const say = useCallback((next: Flash) => setFlash(next), []);

  useEffect(() => {
    if (!flash) return undefined;
    const timer = setTimeout(() => setFlash(null), 8000);

    return () => clearTimeout(timer);
  }, [flash]);

  return (
    <SayContext.Provider value={say}>
      {children}
      <div role="status" aria-live="polite" className="fixed inset-x-0 bottom-20 z-20 px-4 md:bottom-6">
        {flash && (
          <p
            className={`mx-auto flex max-w-xl items-center justify-between gap-3 rounded-card border p-3 text-base shadow-card ${
              flash.ok ? "border-success bg-success-soft text-success" : "border-danger bg-danger-soft text-danger"
            }`}
          >
            <span>
              <span aria-hidden="true">{flash.ok ? "✓ " : "! "}</span>
              {flash.message}
            </span>
            <button
              type="button"
              onClick={() => setFlash(null)}
              className="min-h-11 shrink-0 rounded-control px-2 font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Close
            </button>
          </p>
        )}
      </div>
    </SayContext.Provider>
  );
}
