import type { Timestamp } from 'firebase/firestore';

export type PillarId = 'pilar-1' | 'pilar-2' | 'pilar-3' | 'pilar-4';
export type ContentStage = 'research' | 'script' | 'batching' | 'editing' | 'ready' | 'published';
export type ContentFormat = 'Reels' | 'Carousel' | 'TikTok' | 'IG Story' | 'Collab Reels';
export type TargetAccount =
  | '@lalumahendra'
  | '@obeecreatives'
  | '@obeephotography'
  | 'Collab @lalumahendra x @obeephotography'
  | 'Collab @lalumahendra x @obeecreatives';
export type AudienceTier = 'lapis-1' | 'lapis-2' | 'lapis-3';
export type ViralTrigger = 'DM Shares' | 'Watch Time' | 'Saves' | 'Discussion';
export type PublishStatus = 'manual' | 'queued' | 'draft' | 'published';
export type StrategyPhase = 'phase-1' | 'phase-2' | 'phase-3';
export type WorkspaceRole = 'owner' | 'assistant';

export interface UserProfile {
  ownerId: string;
  displayName: string;
  activePhase: StrategyPhase;
  seededDefaultData: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Workspace {
  id: string;
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  activePhase: StrategyPhase;
  assistantEmails: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  ownerId: string;
  email: string;
  displayName: string;
  role: 'assistant';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ContentItem {
  id: string;
  ownerId: string;
  sharedEmails?: string[];
  lastEditedBy?: string;
  title: string;
  pillar: PillarId;
  targetAccount: TargetAccount;
  format: ContentFormat;
  stage: ContentStage;
  researchSource: string;
  audienceTier: AudienceTier;
  viralTrigger: ViralTrigger;
  researchInsight: string;
  hook3s: string;
  body30s: string;
  cta15s: string;
  carouselOutline: string;
  seoCaption: string;
  hashtags: string;
  driveAssetUrl: string;
  scheduledDate: string;
  publishedUrl: string;
  igPublishStatus: PublishStatus;
  tiktokPublishStatus: PublishStatus;
  sourcePortfolioRef: string;
  views: number;
  reach: number;
  nonFollowerPct: number;
  holdRate3s: number;
  avgWatchPct: number;
  shares: number;
  saves: number;
  comments: number;
  profileVisits: number;
  newFollows: number;
  inboundLeads: number;
  creatorMinutes: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface WeeklySnapshot {
  id: string;
  ownerId: string;
  sharedEmails?: string[];
  lastEditedBy?: string;
  weekLabel: string;
  phase: StrategyPhase;
  startDate: string;
  endDate: string;
  publishedCount: number;
  totalViews: number;
  totalReach: number;
  avgNonFollowerPct: number;
  avgHoldRate3s: number;
  avgWatchPct: number;
  totalShares: number;
  totalSaves: number;
  qualityCommentPct: number;
  profileVisits: number;
  newFollows: number;
  inboundLeads: number;
  ctaKeywordComments: number;
  creatorHours: number;
  notes: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface PortfolioAsset {
  id: string;
  ownerId: string;
  sharedEmails?: string[];
  lastEditedBy?: string;
  title: string;
  sourceAccount: '@obeephotography' | '@obeecreatives';
  category: string;
  imagePath: string;
  craftAngle: string;
  recycledToReels: boolean;
  linkedContentId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const PILLAR_META: Record<
  PillarId,
  { label: string; shortLabel: string; targetPct: number; role: string }
> = {
  'pilar-1': {
    label: 'Pilar 1 · Bedah Kasus & Transformasi',
    shortLabel: 'Bedah Kasus',
    targetPct: 25,
    role: 'Mesin Views & Shares',
  },
  'pilar-2': {
    label: 'Pilar 2 · Realitas Agensi & Opini',
    shortLabel: 'Opini Agensi',
    targetPct: 20,
    role: 'Mesin Komentar & Otoritas',
  },
  'pilar-3': {
    label: 'Pilar 3 · Applied Technical Craft',
    shortLabel: 'Applied Craft',
    targetPct: 30,
    role: 'Mesin Saves & Proof of Craft',
  },
  'pilar-4': {
    label: 'Pilar 4 · Live Mentoring & Studio Collab',
    shortLabel: 'Mentoring & Collab',
    targetPct: 25,
    role: 'Social Proof & Konversi',
  },
};

export const STAGE_META: { id: ContentStage; label: string; description: string }[] = [
  { id: 'research', label: '1. Riset & Validasi', description: 'Validasi sumber masalah & angle' },
  { id: 'script', label: '2. Skrip 3-30-15', description: 'Susun hook, isi & turunan 1-to-Many' },
  { id: 'batching', label: '3. Siap Rekam (Batch)', description: 'Antrean sesi rekaman mingguan' },
  { id: 'editing', label: '4. Editing & Polish', description: 'Cut, B-roll, teks layar & sound design' },
  { id: 'ready', label: '5. Siap Posting', description: 'Caption SEO, jadwal & staging API' },
  { id: 'published', label: '6. Tayang & Analisis', description: 'Input metrik 48j/7h & diagnosa' },
];

export const AUDIENCE_LABELS: Record<AudienceTier, string> = {
  'lapis-1': 'Lapis 1 · Kreator & Mahasiswa Kreatif',
  'lapis-2': 'Lapis 2 · Pelaku UMKM & Brand Owner',
  'lapis-3': 'Lapis 3 · Korporat, Kampus & EO',
};

export const PHASE_LABELS: Record<StrategyPhase, string> = {
  'phase-1': 'Fase 1 (Minggu 1–4) · Kalibrasi Sinyal',
  'phase-2': 'Fase 2 (Minggu 5–8) · Serialisasi & Viralitas',
  'phase-3': 'Fase 3 (Minggu 9–12+) · Flywheel Otoritas',
};

export function clampStr(val: string, maxLen: number): string {
  return (val ?? '').trim().slice(0, maxLen);
}

export function clampNum(val: number, min = 0, max = 100000000): number {
  const num = Number.isFinite(val) ? val : 0;
  return Math.min(max, Math.max(min, num));
}

export function evaluatePostPerformance(item: ContentItem): {
  shareRate1k: number;
  saveRate1k: number;
  followConvPct: number;
  statusLabel: string;
  tone: 'positive' | 'warning' | 'critical' | 'neutral';
  recommendation: string;
} {
  const reach = item.reach > 0 ? item.reach : item.views;
  const shareRate1k = reach > 0 ? (item.shares / reach) * 1000 : 0;
  const saveRate1k = reach > 0 ? (item.saves / reach) * 1000 : 0;
  const followConvPct =
    item.profileVisits > 0 ? (item.newFollows / item.profileVisits) * 100 : 0;

  if (item.views === 0 && item.reach === 0) {
    return {
      shareRate1k: 0,
      saveRate1k: 0,
      followConvPct: 0,
      statusLabel: 'Menunggu Data 48 Jam',
      tone: 'neutral',
      recommendation:
        'Catat angka Views, Reach, 3s Hold Rate, Shares, dan Saves setelah 48 jam tayang untuk memicu diagnosa otomatis.',
    };
  }

  if (item.holdRate3s > 0 && item.holdRate3s < 55) {
    return {
      shareRate1k,
      saveRate1k,
      followConvPct,
      statusLabel: 'Perbaiki Hook 3 Detik',
      tone: 'critical',
      recommendation:
        'Hold Rate di bawah 55% menandakan audiens skip sebelum mendengar isi materi. Ulangi topik ini dengan visual kontras dan kalimat pembuka tanpa basa-basi.',
    };
  }

  if (shareRate1k >= 12 || (item.nonFollowerPct >= 55 && item.avgWatchPct >= 75)) {
    return {
      shareRate1k,
      saveRate1k,
      followConvPct,
      statusLabel: 'Pemenang — Replikasi Serial',
      tone: 'positive',
      recommendation:
        'Performa melampaui target fase. Segera jadikan serial bernomor atau balas komentar terbaik menggunakan fitur Reply with Reels.',
    };
  }

  if (item.profileVisits >= 20 && followConvPct < 5) {
    return {
      shareRate1k,
      saveRate1k,
      followConvPct,
      statusLabel: 'Optimasi Bio & Pinned Post',
      tone: 'warning',
      recommendation:
        'Konten berhasil mendatangkan kunjungan profil, tetapi konversi Follow rendah (< 5%). Perkuat kejelasan janji nilai di Bio & 3 Pinned Posts.',
    };
  }

  return {
    shareRate1k,
    saveRate1k,
    followConvPct,
    statusLabel: 'Stabil — Tingkatkan Nilai Share',
    tone: 'neutral',
    recommendation:
      'Retensi cukup sehat. Pada episode berikutnya, pertajam argumen atau tambahkan rangkuman framework di layar agar Share & Save Rate menembus >= 15/1K.',
  };
}
