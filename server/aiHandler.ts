import { GoogleGenAI, Type } from '@google/genai';

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

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error(
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

export async function handleAiRequest(payload: AiRequestPayload) {
  const ai = getAiClient();

  if (payload.action === 'reframe') {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Ubah ide mentah berikut menjadi 3 opsi sudut pandang (angle) berotoritas tinggi level Creative Director & Educator:
Topik Mentah: "${payload.rawTopic}"
Pilar Target: ${payload.pillar}
Sumber Riset / Konteks: ${payload.researchSource || 'Observasi lapangan studio & mentoring'}`,
      config: {
        systemInstruction: CREATOR_PERSONA,
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
                  hook3s: { type: Type.STRING, description: 'Kalimat pembuka 3 detik pertama yang tajam tanpa basa-basi.' },
                  angleType: { type: Type.STRING, description: 'Jenis sudut pandang, misal Kontrarian, Dampak Komersial, atau Bedah Kasus Studio.' },
                  whyItWorks: { type: Type.STRING, description: 'Alasan psikologis dan algoritmik mengapa angle ini berpotensi viral.' },
                },
                required: ['title', 'hook3s', 'angleType', 'whyItWorks'],
              },
            },
          },
          required: ['angles'],
        },
      },
    });
    return JSON.parse((response.text ?? '{}').trim());
  }

  if (payload.action === 'script') {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
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
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook3s: { type: Type.STRING, description: '0-3 detik: Hook verbal + arahan visual pembuka yang langsung menghentikan scroll.' },
            body30s: { type: Type.STRING, description: '3-35 detik: Isi utama padat dengan bukti studio/lapangan dan transisi visual.' },
            cta15s: { type: Type.STRING, description: '15 detik akhir: Kesimpulan prinsip strategis + CTA pemicu DM Share atau komentar diskusi.' },
            carouselOutline: { type: Type.STRING, description: 'Turunan 1-to-Many: Kerangka 5 slide Carousel Instagram yang siap didesain tim.' },
            seoCaption: { type: Type.STRING, description: 'Caption kaya kata kunci SEO Instagram/TikTok yang ringkas dan memancing interaksi.' },
            hashtags: { type: Type.STRING, description: 'Maksimal 5 tagar niche spesifik dipisahkan spasi.' },
          },
          required: ['hook3s', 'body30s', 'cta15s', 'carouselOutline', 'seoCaption', 'hashtags'],
        },
      },
    });
    return JSON.parse((response.text ?? '{}').trim());
  }

  if (payload.action === 'diagnose') {
    const shareRate = payload.reach > 0 ? ((payload.shares / payload.reach) * 1000).toFixed(1) : '0';
    const saveRate = payload.reach > 0 ? ((payload.saves / payload.reach) * 1000).toFixed(1) : '0';
    const followConv =
      payload.profileVisits > 0
        ? ((payload.newFollows / payload.profileVisits) * 100).toFixed(1)
        : '0';

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
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
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, description: 'Status singkat: Replikasi Serial, Perbaiki Hook 3 Detik, Perkuat Nilai Share, atau Optimasi CTA/Bio.' },
            diagnosis: { type: Type.STRING, description: 'Analisis tajam 2-3 kalimat mengenai penyebab angka metrik tersebut.' },
            nextAction: { type: Type.STRING, description: 'Langkah perbaikan teknis/strategis untuk produksi berikutnya.' },
            followUpEpisodeTitle: { type: Type.STRING, description: 'Usulan judul episode lanjutan atau Reply-with-Reels berdasarkan performa ini.' },
            followUpHook: { type: Type.STRING, description: 'Hook 3 detik pertama untuk episode lanjutan.' },
          },
          required: ['verdict', 'diagnosis', 'nextAction', 'followUpEpisodeTitle', 'followUpHook'],
        },
      },
    });
    return JSON.parse((response.text ?? '{}').trim());
  }

  throw new Error('Aksi AI tidak dikenali.');
}
