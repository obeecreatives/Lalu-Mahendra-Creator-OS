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

async function postAi<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || 'Gagal memproses permintaan AI.');
  }
  return data;
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
