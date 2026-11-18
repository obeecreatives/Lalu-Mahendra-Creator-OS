import {
  GoogleGenAI,
  ThinkingLevel,
  Type,
  type GenerateContentParameters,
  type GenerateContentResponse,
} from '@google/genai';

export interface AiReframeInput {
  action: 'reframe';
  rawTopic: string;
  pillar: string;
  researchSource: string;
}

export interface AiScriptInput {
  action: 'script';
  title: string;
  pillar: string;
  targetAccount: string;
  format: string;
  researchSource: string;
  researchInsight: string;
  audienceTier: string;
  viralTrigger: string;
}

export interface AiDiagnoseInput {
  action: 'diagnose';
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
}

export type AiRequestPayload = AiReframeInput | AiScriptInput | AiDiagnoseInput;

export class AiHttpError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'AiHttpError';
    this.statusCode = statusCode;
  }
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new AiHttpError(
      500,
      'GEMINI_API_KEY belum dikonfigurasi. Silakan periksa panel Secrets di AI Studio atau Environment Variables di Vercel.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const CREATOR_PERSONA = `Anda adalah Expert Content Strategist pribadi untuk Lalu Mahendra Ali Akbar (@lalumahendra), Founder Obee Creatives Group (@obeecreatives) & @obeephotography, serta Mentor di Millenial Job Center (MJC) Bakorwil III Malang & narasumber Kemenkop UKM.
Gaya komunikasi Lalu Mahendra:
- Berbasis bukti lapangan dan proyek nyata (studio foto/video produk, desain kemasan siap cetak, web, mentoring UMKM/mahasiswa).
- Anti-tutorial dasar pemula (tidak pernah memberi tips level operator kamera yang dangkal). Selalu mengangkat sudut pandang Creative Director, psikologi visual, nilai komersial, dan realitas agensi.
- Bahasa Indonesia lugas, tajam, berwibawa namun tetap membumi dan praktis.
- Selalu patuhi aturan algoritma modern: 3 detik pertama bebas basa-basi ("Halo teman-teman" dilarang keras), struktur padat 20-45 detik, memicu DM Shares dan Saves, serta maksimal 5 tagar niche.`;

interface ModelAttemptConfig {
  model: string;
  thinkingLevel: ThinkingLevel;
  maxAttemptMs: number;
}

const ATTEMPT_PLAN: ModelAttemptConfig[] = [
  {
    model: 'gemini-4-hydrogen',
    thinkingLevel: ThinkingLevel.LOW,
    maxAttemptMs: 3900,
  },
  {
    model: 'gemini-3.1-flash-lite',
    thinkingLevel: ThinkingLevel.MINIMAL,
    maxAttemptMs: 5000,
  },
];

// Keep total serverless execution safely inside Vercel Hobby's 10s timeout
const TOTAL_SERVER_BUDGET_MS = 9200;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`AI_TIMEOUT_${timeoutMs}ms`));
    }, timeoutMs);

    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

function parseUpstreamError(err: unknown): { code: number; status: string; message: string } {
  const rawMessage = err instanceof Error ? err.message : String(err || '');
  const numericStatus =
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    typeof (err as { status: unknown }).status === 'number'
      ? (err as { status: number }).status
      : 0;

  try {
    const parsed = JSON.parse(rawMessage) as {
      error?: { code?: number; status?: string; message?: string };
    };
    if (parsed?.error) {
      return {
        code: parsed.error.code || numericStatus || 500,
        status: parsed.error.status || '',
        message: parsed.error.message || rawMessage,
      };
    }
  } catch {
    // Raw message is plain text
  }

  let inferredCode = numericStatus || 500;
  if (rawMessage.includes('AI_TIMEOUT')) inferredCode = 504;
  else if (rawMessage.includes('503') || rawMessage.includes('UNAVAILABLE')) inferredCode = 503;
  else if (rawMessage.includes('429') || rawMessage.includes('RESOURCE_EXHAUSTED')) inferredCode = 429;
  else if (rawMessage.includes('403') || rawMessage.includes('PERMISSION_DENIED')) inferredCode = 403;
  else if (rawMessage.includes('400') || rawMessage.includes('API_KEY_INVALID')) inferredCode = 400;
  else if (rawMessage.includes('404') || rawMessage.includes('NOT_FOUND')) inferredCode = 404;

  return {
    code: inferredCode,
    status: '',
    message: rawMessage,
  };
}

function isTransientError(code: number, message: string): boolean {
  if (code === 503 || code === 429 || code === 500 || code === 502 || code === 504) return true;
  const lower = message.toLowerCase();
  return (
    lower.includes('high demand') ||
    lower.includes('unavailable') ||
    lower.includes('temporarily') ||
    lower.includes('timeout') ||
    lower.includes('ai_timeout') ||
    lower.includes('fetch failed') ||
    lower.includes('econnreset')
  );
}

export function formatReadableAiError(err: unknown): { statusCode: number; message: string } {
  if (err instanceof AiHttpError) {
    return { statusCode: err.statusCode, message: err.message };
  }

  const parsed = parseUpstreamError(err);

  if (parsed.code === 504 || parsed.message.includes('AI_TIMEOUT')) {
    return {
      statusCode: 504,
      message:
        'Respons server AI melebihi batas waktu karena trafik padat. Silakan klik tombol lagi untuk mencoba ulang.',
    };
  }

  if (parsed.code === 503 || parsed.status === 'UNAVAILABLE') {
    return {
      statusCode: 503,
      message:
        'Server AI Gemini sedang padat sementara (503). Sistem sudah mencoba ulang otomatis—silakan klik ulang beberapa detik lagi.',
    };
  }

  if (parsed.code === 429 || parsed.status === 'RESOURCE_EXHAUSTED') {
    return {
      statusCode: 429,
      message:
        'Batas permintaan AI sementara tercapai (429). Tunggu sekitar 30–60 detik sebelum mencoba lagi.',
    };
  }

  if (
    parsed.code === 403 ||
    parsed.code === 400 ||
    parsed.message.includes('API_KEY_INVALID') ||
    parsed.message.includes('API key not valid')
  ) {
    return {
      statusCode: parsed.code,
      message:
        'API key Gemini tidak valid atau belum memiliki akses. Periksa GEMINI_API_KEY di panel Secrets AI Studio / Environment Variables Vercel.',
    };
  }

  if (parsed.code === 404 || parsed.status === 'NOT_FOUND') {
    return {
      statusCode: 404,
      message: 'Model AI yang diminta tidak tersedia saat ini (404).',
    };
  }

  return {
    statusCode: parsed.code >= 400 && parsed.code < 600 ? parsed.code : 500,
    message: parsed.message || 'Terjadi kesalahan saat memproses permintaan AI.',
  };
}

async function generateWithRetryAndFallback(
  ai: GoogleGenAI,
  buildParams: (model: string, thinkingLevel: ThinkingLevel) => GenerateContentParameters
): Promise<GenerateContentResponse> {
  const deadline = Date.now() + TOTAL_SERVER_BUDGET_MS;
  let lastError: unknown;

  for (let i = 0; i < ATTEMPT_PLAN.length; i++) {
    const remaining = deadline - Date.now();
    if (remaining < 1200) break;

    const step = ATTEMPT_PLAN[i];
    const timeoutMs = Math.min(step.maxAttemptMs, remaining);

    try {
      return await withTimeout(
        ai.models.generateContent(buildParams(step.model, step.thinkingLevel)),
        timeoutMs
      );
    } catch (err) {
      lastError = err;
      const parsed = parseUpstreamError(err);
      if (!isTransientError(parsed.code, parsed.message)) {
        throw err;
      }
      if (i < ATTEMPT_PLAN.length - 1 && deadline - Date.now() > 1500) {
        await sleep(250);
      }
    }
  }

  const formatted = formatReadableAiError(lastError);
  throw new AiHttpError(formatted.statusCode, formatted.message);
}

export async function handleAiRequest(payload: AiRequestPayload) {
  const ai = getAiClient();

  if (payload.action === 'reframe') {
    const response = await generateWithRetryAndFallback(ai, (model, thinkingLevel) => ({
      model,
      contents: `Ubah ide mentah berikut menjadi 3 opsi sudut pandang (angle) berotoritas tinggi level Creative Director & Educator:
Topik Mentah: "${payload.rawTopic}"
Pilar Target: ${payload.pillar}
Sumber Riset / Konteks: ${payload.researchSource || 'Observasi lapangan studio & mentoring'}`,
      config: {
        systemInstruction: CREATOR_PERSONA,
        thinkingConfig: { thinkingLevel },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            angles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Judul ringkas konten.' },
                  hook3s: {
                    type: Type.STRING,
                    description: 'Kalimat pembuka 3 detik pertama yang tajam tanpa basa-basi.',
                  },
                  angleType: {
                    type: Type.STRING,
                    description:
                      'Jenis sudut pandang, misal Kontrarian, Dampak Komersial, atau Bedah Kasus Studio.',
                  },
                  whyItWorks: {
                    type: Type.STRING,
                    description: 'Alasan psikologis dan algoritmik mengapa angle ini berpotensi viral.',
                  },
                },
                required: ['title', 'hook3s', 'angleType', 'whyItWorks'],
              },
            },
          },
          required: ['angles'],
        },
      },
    }));
    return JSON.parse((response.text ?? '{}').trim());
  }

  if (payload.action === 'script') {
    const response = await generateWithRetryAndFallback(ai, (model, thinkingLevel) => ({
      model,
      contents: `Susun skrip lengkap Formula 3-30-15 dan ekspansi 1-to-Many untuk konten berikut:
Judul: ${payload.title}
Pilar: ${payload.pillar}
Akun Target: ${payload.targetAccount}
Format: ${payload.format}
Sumber Riset: ${payload.researchSource}
Insight Riset: ${payload.researchInsight}
Segmen Audiens: ${payload.audienceTier}
Pemicu Utama: ${payload.viralTrigger}`,
      config: {
        systemInstruction: CREATOR_PERSONA,
        thinkingConfig: { thinkingLevel },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook3s: {
              type: Type.STRING,
              description:
                '0-3 detik: Hook verbal + arahan visual pembuka yang langsung menghentikan scroll.',
            },
            body30s: {
              type: Type.STRING,
              description:
                '3-35 detik: Isi utama padat dengan bukti studio/lapangan dan transisi visual.',
            },
            cta15s: {
              type: Type.STRING,
              description:
                '15 detik akhir: Kesimpulan prinsip strategis + CTA pemicu DM Share atau komentar diskusi.',
            },
            carouselOutline: {
              type: Type.STRING,
              description:
                'Turunan 1-to-Many: Kerangka 5 slide Carousel Instagram yang siap didesain tim.',
            },
            seoCaption: {
              type: Type.STRING,
              description:
                'Caption kaya kata kunci SEO Instagram/TikTok yang ringkas dan memancing interaksi.',
            },
            hashtags: {
              type: Type.STRING,
              description: 'Maksimal 5 tagar niche spesifik dipisahkan spasi.',
            },
          },
          required: ['hook3s', 'body30s', 'cta15s', 'carouselOutline', 'seoCaption', 'hashtags'],
        },
      },
    }));
    return JSON.parse((response.text ?? '{}').trim());
  }

  if (payload.action === 'diagnose') {
    const shareRate = payload.reach > 0 ? ((payload.shares / payload.reach) * 1000).toFixed(1) : '0';
    const saveRate = payload.reach > 0 ? ((payload.saves / payload.reach) * 1000).toFixed(1) : '0';
    const followConv =
      payload.profileVisits > 0
        ? ((payload.newFollows / payload.profileVisits) * 100).toFixed(1)
        : '0';

    const response = await generateWithRetryAndFallback(ai, (model, thinkingLevel) => ({
      model,
      contents: `Analisis performa konten Lalu Mahendra yang sudah tayang dan berikan diagnosa konkret serta ide Episode Lanjutan (Serial):
Judul Konten: ${payload.title}
Pilar: ${payload.pillar}
Views: ${payload.views}
Reach: ${payload.reach}
Non-Follower %: ${payload.nonFollowerPct}%
3-Second Hold Rate: ${payload.holdRate3s}%
Average Watch %: ${payload.avgWatchPct}%
Shares: ${payload.shares} (${shareRate} per 1K reach)
Saves: ${payload.saves} (${saveRate} per 1K reach)
Profile Visits: ${payload.profileVisits} -> New Follows: ${payload.newFollows} (${followConv}%)`,
      config: {
        systemInstruction: CREATOR_PERSONA,
        thinkingConfig: { thinkingLevel },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.STRING,
              description:
                'Status singkat: Replikasi Serial, Perbaiki Hook 3 Detik, Perkuat Nilai Share, atau Optimasi CTA/Bio.',
            },
            diagnosis: {
              type: Type.STRING,
              description: 'Analisis tajam 2-3 kalimat mengenai penyebab angka metrik tersebut.',
            },
            nextAction: {
              type: Type.STRING,
              description: 'Langkah perbaikan teknis/strategis untuk produksi berikutnya.',
            },
            followUpEpisodeTitle: {
              type: Type.STRING,
              description:
                'Usulan judul episode lanjutan atau Reply-with-Reels berdasarkan performa ini.',
            },
            followUpHook: {
              type: Type.STRING,
              description: 'Hook 3 detik pertama untuk episode lanjutan.',
            },
          },
          required: ['verdict', 'diagnosis', 'nextAction', 'followUpEpisodeTitle', 'followUpHook'],
        },
      },
    }));
    return JSON.parse((response.text ?? '{}').trim());
  }

  throw new AiHttpError(400, 'Aksi AI tidak dikenali.');
}
