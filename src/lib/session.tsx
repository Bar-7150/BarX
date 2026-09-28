"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Session = { name: string; email: string } | null;

const SessionContext = createContext<{
  session: Session;
  signIn: (name: string, email: string) => void;
  signOut: () => void;
} | null>(null);

const KEY = "barx-session";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSession(JSON.parse(raw) as Session);
    } catch {
      /* ignore */
    }
  }, []);

  const signIn = (name: string, email: string) => {
    const next = { name, email };
    setSession(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const signOut = () => {
    setSession(null);
    localStorage.removeItem(KEY);
  };

  return (
    <SessionContext.Provider value={{ session, signIn, signOut }}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be inside SessionProvider");
  return ctx;
}
