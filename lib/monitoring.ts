type Metrics = {
  analysis_total_ms?: number;
  analysis_success?: number;
  analysis_fallback_success?: number;
  analysis_failure?: number;
  live_frame_ms?: number;
};

const KEY = 'lune_metrics';

const read = (): Metrics => {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
};
const write = (m: Metrics) => { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch {} };

export const recordAnalysisTotalMs = (ms: number) => {
  const m = read();
  m.analysis_total_ms = Math.round(ms);
  write(m);
};

export const incSuccess = () => { const m = read(); m.analysis_success = (m.analysis_success || 0) + 1; write(m); };
export const incFallbackSuccess = () => { const m = read(); m.analysis_fallback_success = (m.analysis_fallback_success || 0) + 1; write(m); };
export const incFailure = () => { const m = read(); m.analysis_failure = (m.analysis_failure || 0) + 1; write(m); };

export const recordLiveFrameAvgMs = (avgMs: number) => {
  const m = read();
  m.live_frame_ms = Math.round(avgMs);
  write(m);
};

export const getMetrics = (): Metrics => read();