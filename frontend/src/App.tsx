import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { AuthBar } from "./AuthBar";

type SessionState = "idle" | "starting" | "ready" | "error";

type SessionResponse = {
  sessionId: string;
  terminalAuth?: boolean;
  briefing?: string;
  artifactPath?: string;
  scenarioSource?: string;
  cve?: { id: string; description?: string };
};

function wsUrl(sessionId: string, accessToken: string | null, terminalAuth: boolean): string {
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  let u = `${proto}//${window.location.host}/ws/sessions/${sessionId}/terminal`;
  if (terminalAuth && accessToken) {
    u += `?access_token=${encodeURIComponent(accessToken)}`;
  }
  return u;
}

export default function App() {
  const hostRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<SessionState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [artifactPath, setArtifactPath] = useState<string | null>(null);
  const [cveId, setCveId] = useState<string | null>(null);
  const [scenarioSource, setScenarioSource] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: "JetBrains Mono, Consolas, monospace",
      fontSize: 14,
      theme: {
        background: "#0c0e12",
        foreground: "#c8d0e0",
        cursor: "#00d4aa",
        selectionBackground: "#00d4aa33",
      },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(el);
    fit.fit();
    termRef.current = term;
    fitRef.current = fit;

    const ro = new ResizeObserver(() => fit.fit());
    ro.observe(el);

    const onData = term.onData((data) => {
      const ws = wsRef.current;
      if (ws?.readyState === WebSocket.OPEN) ws.send(data);
    });

    return () => {
      ro.disconnect();
      onData.dispose();
      term.dispose();
      termRef.current = null;
      fitRef.current = null;
    };
  }, []);

  const clearMission = useCallback(() => {
    setBriefing(null);
    setArtifactPath(null);
    setCveId(null);
    setScenarioSource(null);
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setSessionId(null);
    setStatus("idle");
    clearMission();
  }, [clearMission]);

  const startSession = useCallback(async () => {
    setError(null);
    clearMission();
    setStatus("starting");
    const term = termRef.current;
    const fit = fitRef.current;
    if (term) {
      term.reset();
      term.writeln("\x1b[90mProvisioning isolated sandbox…\x1b[0m");
    }

    try {
      const headers: Record<string, string> = {};
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
      const res = await fetch("/api/sessions", { method: "POST", headers });
      if (!res.ok) {
        const text = await res.text();
        let msg = text || res.statusText;
        try {
          const j = JSON.parse(text) as { detail?: unknown };
          if (typeof j.detail === "string") msg = j.detail;
        } catch {
          /* use msg */
        }
        throw new Error(msg);
      }
      const data = (await res.json()) as SessionResponse;
      setSessionId(data.sessionId);
      if (data.briefing) setBriefing(data.briefing);
      if (data.artifactPath) setArtifactPath(data.artifactPath);
      if (data.cve?.id) setCveId(data.cve.id);
      if (data.scenarioSource) setScenarioSource(data.scenarioSource);

      const ws = new WebSocket(
        wsUrl(data.sessionId, accessToken, Boolean(data.terminalAuth)),
      );
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("ready");
        fit?.fit();
        const dims = term?.cols && term?.rows ? { cols: term.cols, rows: term.rows } : null;
        if (dims) ws.send(JSON.stringify({ type: "resize", ...dims }));
        if (data.artifactPath) {
          term?.writeln(
            `\r\n\x1b[90mHint: \x1b[36mcat ${data.artifactPath}\x1b[90m — artifact from AI/CVE pipeline\x1b[0m`,
          );
        }
      };

      ws.onmessage = (ev) => {
        if (typeof ev.data === "string") return;
        const u8 = new Uint8Array(ev.data as ArrayBuffer);
        const text = new TextDecoder().decode(u8);
        term?.write(text);
      };

      ws.onerror = () => {
        setError("WebSocket error — is the backend running on port 8000?");
        setStatus("error");
      };

      ws.onclose = () => {
        wsRef.current = null;
        setStatus("idle");
        setSessionId(null);
        clearMission();
        term?.writeln("\r\n\x1b[90mSession closed.\x1b[0m");
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to start session";
      setError(msg);
      setStatus("error");
      term?.writeln(`\r\n\x1b[31m${msg}\x1b[0m`);
    }
  }, [accessToken, clearMission]);

  useEffect(() => {
    const term = termRef.current;
    if (!term || status !== "ready") return;

    const sub = term.onResize(({ cols, rows }) => {
      const ws = wsRef.current;
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "resize", cols, rows }));
      }
    });

    return () => sub.dispose();
  }, [status]);

  return (
    <div className="flex min-h-full flex-col bg-[#06080c] text-slate-200">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-emerald-950/60 px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            ThreatSim
          </h1>
          <p className="text-xs text-slate-500">
            Phase 3 — Supabase telemetry + auth + siege lobbies (optional)
          </p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
          <AuthBar onAccessTokenChange={setAccessToken} />
          <div className="flex shrink-0 items-center gap-3">
            {sessionId && (
              <span className="hidden font-mono text-[10px] text-slate-600 sm:inline">
                {sessionId.slice(0, 8)}…
              </span>
            )}
            {status === "ready" ? (
              <button
                type="button"
                onClick={disconnect}
                className="rounded border border-rose-900/60 bg-rose-950/40 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-950/70"
              >
                End session
              </button>
            ) : (
              <button
                type="button"
                disabled={status === "starting"}
                onClick={startSession}
                className="rounded border border-emerald-700/50 bg-emerald-950/50 px-4 py-2 text-sm font-medium text-emerald-100 transition enabled:hover:bg-emerald-900/50 disabled:opacity-50"
              >
                {status === "starting" ? "Starting…" : "Start sandbox"}
              </button>
            )}
          </div>
        </div>
      </header>

      {error && (
        <div className="border-b border-rose-900/40 bg-rose-950/30 px-6 py-2 text-sm text-rose-200">
          {error}
        </div>
      )}

      {briefing && (
        <section className="max-h-[40vh] shrink-0 overflow-y-auto border-b border-slate-800/80 bg-slate-950/40 px-6 py-4">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500">
            <span>Mission briefing</span>
            {cveId && (
              <span className="rounded bg-slate-800/80 px-2 py-0.5 font-mono normal-case text-emerald-300/90">
                {cveId}
              </span>
            )}
            {scenarioSource && (
              <span className="normal-case text-slate-600">source: {scenarioSource}</span>
            )}
            {artifactPath && (
              <span className="font-mono normal-case text-slate-500">{artifactPath}</span>
            )}
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300">
            {briefing}
          </pre>
        </section>
      )}

      <main className="flex min-h-0 flex-1 flex-col p-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-800/80 bg-[#0c0e12] shadow-[0_0_40px_rgba(0,212,170,0.06)]">
          <div className="border-b border-slate-800/80 px-3 py-2 text-[11px] uppercase tracking-wider text-slate-500">
            Live terminal
          </div>
          <div ref={hostRef} className="min-h-[320px] flex-1 p-2" />
        </div>
      </main>
    </div>
  );
}
