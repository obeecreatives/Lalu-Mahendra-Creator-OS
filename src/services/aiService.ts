export interface ReframedAngle {
  title: string;
  hook3s: string;
  angleType: string;
  whyItWorks: string;
}

export interface GeneratedScriptPack {
  hook3s: string;
  body30s: string;
  cta15s: string;
  carouselOutline: string;
  seoCaption: string;
  hashtags: string;
}

export interface AiDiagnosisResult {
  verdict: string;
  diagnosis: string;
  nextAction: string;
  followUpEpisodeTitle: string;
  followUpHook: string;
}

function cleanClientAiError(raw: string | undefined, status: number): string {
  if (!raw) {
    return status === 503
      ? 'Server AI Gemini sedang padat sementara (503). Silakan coba klik ulang beberapa detik lagi.'
      : 'Gagal memproses permintaan AI.';
  }
  if (raw.includes('503') || raw.includes('UNAVAILABLE') || raw.toLowerCase().includes('high demand')) {
    return 'Server AI Gemini sedang padat sementara (503). Sistem sudah mencoba ulang otomatis—silakan coba lagi beberapa detik lagi.';
  }
  if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED')) {
    return 'Batas permintaan AI sementara tercapai (429). Tunggu 30–60 detik lalu coba lagi.';
  }
  return raw;
}

async function postAi<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data: (T & { error?: string }) | null = null;
  try {
    data = (await res.json()) as T & { error?: string };
  } catch {
    throw new Error(cleanClientAiError(undefined, res.status));
  }
  if (!res.ok) {
    throw new Error(cleanClientAiError(data?.error, res.status));
  }
  return data as T;
}

export async function requestAngleReframe(params: {
  rawTopic: string;
  pillar: string;
  researchSource: string;
}): Promise<{ angles: ReframedAngle[] }> {
  return postAi<{ angles: ReframedAngle[] }>({
    action: 'reframe',
    ...params,
  });
}

export async function requestScriptPack(params: {
  title: string;
  pillar: string;
  targetAccount: string;
  format: string;
  researchSource: string;
  researchInsight: string;
  audienceTier: string;
  viralTrigger: string;
}): Promise<GeneratedScriptPack> {
  return postAi<GeneratedScriptPack>({
    action: 'script',
    ...params,
  });
}

export async function requestPostDiagnosis(params: {
  title: string;
  pillar: string;
  views: number;
  reach: number;
  nonFollowerPct: number;
  holdRate3s: number;
  avgWatchPct: number;
  shares: number;
  saves: number;
  profileVisits: number;
  newFollows: number;
}): Promise<AiDiagnosisResult> {
  return postAi<AiDiagnosisResult>({
    action: 'diagnose',
    ...params,
  });
}
