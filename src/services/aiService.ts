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
    if (status === 503) {
      return 'Server AI Gemini sedang padat sementara (503). Silakan coba klik ulang beberapa detik lagi.';
    }
    if (status === 504 || status === 502) {
      return 'Server membutuhkan waktu terlalu lama saat menghubungi AI. Silakan coba klik ulang.';
    }
    return 'Gagal memproses permintaan AI.';
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
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('Perangkat Anda sedang offline. Sambungkan internet untuk memakai fitur AI.');
  }

  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 18000);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      window.clearTimeout(timer);

      let data: (T & { error?: string }) | null = null;
      try {
        data = (await res.json()) as T & { error?: string };
      } catch {
        if ((res.status === 502 || res.status === 504) && attempt === 0) {
          await new Promise((r) => setTimeout(r, 450));
          continue;
        }
        throw new Error(cleanClientAiError(undefined, res.status));
      }

      if (!res.ok) {
        if ((res.status === 502 || res.status === 504) && attempt === 0) {
          await new Promise((r) => setTimeout(r, 450));
          continue;
        }
        throw new Error(cleanClientAiError(data?.error, res.status));
      }

      return data as T;
    } catch (err) {
      window.clearTimeout(timer);
      lastErr = err;
      const isNetworkOrAbort =
        err instanceof TypeError ||
        (err instanceof DOMException && err.name === 'AbortError');
      if (isNetworkOrAbort && attempt === 0) {
        await new Promise((r) => setTimeout(r, 450));
        continue;
      }
      if (isNetworkOrAbort) {
        throw new Error(
          'Koneksi ke server AI terputus atau melewati batas waktu (Failed to fetch). Pastikan koneksi internet stabil lalu klik tombol ulang.'
        );
      }
      throw err;
    }
  }

  throw lastErr instanceof Error
    ? lastErr
    : new Error('Gagal menghubungi server AI. Silakan coba lagi.');
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
