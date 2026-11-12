"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Notice } from "@/kit";

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
      <Notice message={flash?.message} tone={flash && !flash.ok ? "problem" : "good"} onClose={() => setFlash(null)} />
    </SayContext.Provider>
  );
}
