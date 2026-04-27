import { useCallback, useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "./lib/supabase";

type AuthBarProps = {
  onAccessTokenChange: (token: string | null) => void;
};

export function AuthBar({ onAccessTokenChange }: AuthBarProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [label, setLabel] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const refreshToken = useCallback(async () => {
    if (!supabase) {
      onAccessTokenChange(null);
      return;
    }
    const { data } = await supabase.auth.getSession();
    const tok = data.session?.access_token ?? null;
    onAccessTokenChange(tok);
    setLabel(data.session?.user.email ?? null);
  }, [onAccessTokenChange]);

  useEffect(() => {
    void refreshToken();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_evt, session) => {
      onAccessTokenChange(session?.access_token ?? null);
      setLabel(session?.user.email ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, [onAccessTokenChange, refreshToken]);

  if (!supabaseConfigured || !supabase) {
    return (
      <div className="rounded border border-slate-800/80 bg-slate-950/50 px-3 py-2 text-[11px] text-slate-500">
        Supabase not configured (set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY for auth + lobbies)
      </div>
    );
  }

  const signIn = async () => {
    if (!supabase) return;
    setErr(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setErr(error.message);
    else void refreshToken();
  };

  const signUp = async () => {
    if (!supabase) return;
    setErr(null);
    setBusy(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) setErr(error.message);
    else setErr("Check email to confirm, then sign in.");
  };

  const signOut = async () => {
    if (!supabase) return;
    setBusy(true);
    await supabase.auth.signOut();
    setBusy(false);
    setLabel(null);
    onAccessTokenChange(null);
  };

  return (
    <div className="flex max-w-xl flex-col gap-2 rounded border border-slate-800/80 bg-slate-950/50 p-3 text-xs">
      {label ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-slate-400">
            Signed in as <span className="text-slate-200">{label}</span>
          </span>
          <button
            type="button"
            disabled={busy}
            onClick={() => void signOut()}
            className="rounded border border-slate-700 px-2 py-1 text-slate-300 hover:bg-slate-900"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-w-[140px] flex-1 rounded border border-slate-700 bg-[#0c0e12] px-2 py-1 text-slate-200"
          />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-w-[120px] flex-1 rounded border border-slate-700 bg-[#0c0e12] px-2 py-1 text-slate-200"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void signIn()}
              className="rounded border border-emerald-800/60 bg-emerald-950/40 px-3 py-1 text-emerald-100"
            >
              Sign in
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void signUp()}
              className="rounded border border-slate-600 px-3 py-1 text-slate-300"
            >
              Sign up
            </button>
          </div>
        </div>
      )}
      {err && <p className="text-rose-300">{err}</p>}
    </div>
  );
}
