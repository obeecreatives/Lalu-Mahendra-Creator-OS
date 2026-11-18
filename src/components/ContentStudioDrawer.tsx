import { useEffect, useState } from 'react';
import { Copy, Sparkles, Trash2, X } from 'lucide-react';
import {
  requestAngleReframe,
  requestPostDiagnosis,
  requestScriptPack,
  type AiDiagnosisResult,
  type ReframedAngle,
} from '../services/aiService';
import {
  AUDIENCE_LABELS,
  PILLAR_META,
  STAGE_META,
  evaluatePostPerformance,
  type AudienceTier,
  type ContentFormat,
  type ContentItem,
  type ContentStage,
  type PillarId,
  type PublishStatus,
  type TargetAccount,
  type ViralTrigger,
} from '../types/creator';

interface ContentStudioDrawerProps {
  item: ContentItem | null;
  isOpen: boolean;
  initialTab?: 'research' | 'script' | 'metrics';
  canDelete?: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<ContentItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>,
    existingId?: string
  ) => Promise<void>;
  onDelete?: (itemId: string) => Promise<void>;
  onCreateFollowUp: (
    seed: Omit<ContentItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
}

const EMPTY_FORM: Omit<ContentItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'> = {
  title: '',
  pillar: 'pilar-1',
  targetAccount: '@lalumahendra',
  format: 'Reels',
  stage: 'research',
  researchSource: '',
  audienceTier: 'lapis-2',
  viralTrigger: 'DM Shares',
  researchInsight: '',
  hook3s: '',
  body30s: '',
  cta15s: '',
  carouselOutline: '',
  seoCaption: '',
  hashtags: '',
  driveAssetUrl: '',
  scheduledDate: '',
  publishedUrl: '',
  igPublishStatus: 'manual',
  tiktokPublishStatus: 'manual',
  sourcePortfolioRef: '',
  views: 0,
  reach: 0,
  nonFollowerPct: 0,
  holdRate3s: 0,
  avgWatchPct: 0,
  shares: 0,
  saves: 0,
  comments: 0,
  profileVisits: 0,
  newFollows: 0,
  inboundLeads: 0,
  creatorMinutes: 30,
};

export function ContentStudioDrawer({
  item,
  isOpen,
  initialTab = 'research',
  canDelete = true,
  onClose,
  onSave,
  onDelete,
  onCreateFollowUp,
}: ContentStudioDrawerProps) {
  const [activeTab, setActiveTab] = useState<'research' | 'script' | 'metrics'>(initialTab);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [reframeOptions, setReframeOptions] = useState<ReframedAngle[]>([]);
  const [aiDiagnosis, setAiDiagnosis] = useState<AiDiagnosisResult | null>(null);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab(initialTab);
    setAiError(null);
    setReframeOptions([]);
    setAiDiagnosis(null);
    setConfirmDelete(false);
    if (item) {
      const { id: _id, ownerId: _ownerId, createdAt: _c, updatedAt: _u, ...rest } = item;
      setForm(rest);
    } else {
      setForm(EMPTY_FORM);
    }
  }, [item, isOpen, initialTab]);

  if (!isOpen) return null;

  const hashtagCount = form.hashtags
    .trim()
    .split(/\s+/)
    .filter((t) => t.startsWith('#')).length;

  const evalMetrics = evaluatePostPerformance({
    ...form,
    id: item?.id || 'draft',
    ownerId: item?.ownerId || 'draft',
  });

  const handleCopy = (text: string, label: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(null), 2000);
  };

  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSave(form, item?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleAiReframe = async () => {
    if (!form.title.trim() && !form.researchInsight.trim()) {
      setAiError('Isi Judul/Topik Mentah atau Insight Riset terlebih dahulu.');
      return;
    }
    setAiError(null);
    setAiLoading('reframe');
    try {
      const res = await requestAngleReframe({
        rawTopic: form.title || form.researchInsight,
        pillar: PILLAR_META[form.pillar].label,
        researchSource: form.researchSource,
      });
      setReframeOptions(res.angles || []);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Gagal menjalankan AI Reframer.');
    } finally {
      setAiLoading(null);
    }
  };

  const handleAiGenerateScript = async () => {
    if (!form.title.trim()) {
      setAiError('Isi Judul Konten di tab Riset terlebih dahulu.');
      return;
    }
    setAiError(null);
    setAiLoading('script');
    try {
      const pack = await requestScriptPack({
        title: form.title,
        pillar: PILLAR_META[form.pillar].label,
        targetAccount: form.targetAccount,
        format: form.format,
        researchSource: form.researchSource || 'Observasi lapangan & studio',
        researchInsight: form.researchInsight || form.title,
        audienceTier: AUDIENCE_LABELS[form.audienceTier],
        viralTrigger: form.viralTrigger,
      });
      setForm((prev) => ({
        ...prev,
        hook3s: pack.hook3s || prev.hook3s,
        body30s: pack.body30s || prev.body30s,
        cta15s: pack.cta15s || prev.cta15s,
        carouselOutline: pack.carouselOutline || prev.carouselOutline,
        seoCaption: pack.seoCaption || prev.seoCaption,
        hashtags: pack.hashtags || prev.hashtags,
      }));
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Gagal menyusun skrip AI.');
    } finally {
      setAiLoading(null);
    }
  };

  const handleAiDiagnose = async () => {
    setAiError(null);
    setAiLoading('diagnose');
    try {
      const result = await requestPostDiagnosis({
        title: form.title,
        pillar: PILLAR_META[form.pillar].label,
        views: form.views,
        reach: form.reach,
        nonFollowerPct: form.nonFollowerPct,
        holdRate3s: form.holdRate3s,
        avgWatchPct: form.avgWatchPct,
        shares: form.shares,
        saves: form.saves,
        profileVisits: form.profileVisits,
        newFollows: form.newFollows,
      });
      setAiDiagnosis(result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Gagal menganalisis performa.');
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-[1px]">
      <div className="w-full sm:max-w-3xl bg-[#FBF9F5] h-full sm:border-l border-stone-200 flex flex-col">
        {/* Drawer Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-white border-b border-stone-200 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs uppercase tracking-wider text-stone-500 truncate">
              {item ? 'Studio Konten Kreator' : 'Buat Konten Riset Baru'}
              {item?.lastEditedBy ? ` · Terakhir diubah: ${item.lastEditedBy}` : ''}
            </p>
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-stone-900 truncate">
              {form.title || 'Topik Konten Baru'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup studio konten"
            className="p-2.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Tab Selector */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-stone-200 flex items-center gap-2 overflow-x-auto">
          {(
            [
              { id: 'research', label: '1. Research Gate & Angle' },
              { id: 'script', label: '2. Skrip 3-30-15 & 1-to-Many' },
              { id: 'metrics', label: '3. Analisis Metrik & Iterasi' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 sm:py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-[#F4F0E8] text-stone-700 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveClick} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-safe">
          {aiError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-xs text-red-800">
              {aiError}
            </div>
          )}

          {activeTab === 'research' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Judul / Topik Konten *
                </label>
                <input
                  type="text"
                  required
                  maxLength={160}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Kenapa Foto Produk Skincare Ini Gagal Menarik Pembeli"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Pilar Strategi (60-30-10)
                  </label>
                  <select
                    value={form.pillar}
                    onChange={(e) => setForm({ ...form, pillar: e.target.value as PillarId })}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                  >
                    {Object.entries(PILLAR_META).map(([key, meta]) => (
                      <option key={key} value={key}>
                        {meta.label} ({meta.targetPct}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Tahap Pipeline Kreator
                  </label>
                  <select
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value as ContentStage })}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                  >
                    {STAGE_META.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Akun Target &amp; Collab
                  </label>
                  <select
                    value={form.targetAccount}
                    onChange={(e) =>
                      setForm({ ...form, targetAccount: e.target.value as TargetAccount })
                    }
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                  >
                    <option value="@lalumahendra">@lalumahendra</option>
                    <option value="Collab @lalumahendra x @obeephotography">
                      Collab @lalumahendra × @obeephotography
                    </option>
                    <option value="Collab @lalumahendra x @obeecreatives">
                      Collab @lalumahendra × @obeecreatives
                    </option>
                    <option value="@obeephotography">@obeephotography</option>
                    <option value="@obeecreatives">@obeecreatives</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Format Utama
                  </label>
                  <select
                    value={form.format}
                    onChange={(e) =>
                      setForm({ ...form, format: e.target.value as ContentFormat })
                    }
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                  >
                    <option value="Reels">Reels</option>
                    <option value="Collab Reels">Collab Reels</option>
                    <option value="Carousel">Carousel</option>
                    <option value="TikTok">TikTok</option>
                    <option value="IG Story">IG Story</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Segmen Audiens
                  </label>
                  <select
                    value={form.audienceTier}
                    onChange={(e) =>
                      setForm({ ...form, audienceTier: e.target.value as AudienceTier })
                    }
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                  >
                    {Object.entries(AUDIENCE_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Target Pemicu Algoritma
                  </label>
                  <select
                    value={form.viralTrigger}
                    onChange={(e) =>
                      setForm({ ...form, viralTrigger: e.target.value as ViralTrigger })
                    }
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                  >
                    <option value="DM Shares">DM Shares (Kirim ke Teman/Tim)</option>
                    <option value="Watch Time">Watch Time &amp; Loop</option>
                    <option value="Saves">Saves (Referensi Praktis)</option>
                    <option value="Discussion">Discussion (Comment Velocity)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Sumber Riset / Bukti Lapangan
                </label>
                <input
                  type="text"
                  maxLength={240}
                  value={form.researchSource}
                  onChange={(e) => setForm({ ...form, researchSource: e.target.value })}
                  placeholder="Misal: Pertanyaan UMKM di MJC, Proyek Kemasan KTH, atau Showcase @obeephotography"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Insight Riset &amp; Masalah Utama yang Dipecahkan
                </label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={form.researchInsight}
                  onChange={(e) => setForm({ ...form, researchInsight: e.target.value })}
                  placeholder="Kenapa topik ini penting, kesalahan umum apa yang terjadi di lapangan, dan apa sudut pandang Creative Director Anda?"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              {/* AI Creative Director Reframer */}
              <div className="p-4 bg-[#F4F0E8] border border-stone-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-stone-900">
                      Creative Director Angle Reframer (AI)
                    </p>
                    <p className="text-xs text-stone-600">
                      Ubah topik mentah atau teknis biasa menjadi 3 angle otoritas tinggi siap viral.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={aiLoading !== null}
                    onClick={() => void handleAiReframe()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {aiLoading === 'reframe' ? 'Meracik Angle...' : 'Reframe Angle AI'}
                    </span>
                  </button>
                </div>

                {reframeOptions.length > 0 && (
                  <div className="space-y-2.5 pt-2 border-t border-stone-200">
                    {reframeOptions.map((opt, idx) => (
                      <div key={idx} className="p-3 bg-white border border-stone-200">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <span className="text-xs font-semibold text-[#1E3A8A]">
                            {opt.angleType}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                title: opt.title,
                                hook3s: opt.hook3s,
                              }));
                            }}
                            className="text-xs font-semibold text-stone-900 underline hover:text-[#1E3A8A] cursor-pointer whitespace-nowrap"
                          >
                            Pakai Angle Ini
                          </button>
                        </div>
                        <p className="text-base sm:text-sm font-semibold text-stone-900 mb-1">
                          {opt.title}
                        </p>
                        <p className="text-xs text-stone-700 italic mb-1">
                          Hook: &ldquo;{opt.hook3s}&rdquo;
                        </p>
                        <p className="text-xs text-stone-500">{opt.whyItWorks}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#F4F0E8] border border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-stone-900">
                    Studio Skrip Formula 3-30-15 &amp; Turunan 1-to-Many
                  </p>
                  <p className="text-xs text-stone-600">
                    Susun naskah lengkap + kerangka Carousel + Caption SEO otomatis dari data riset Anda.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `[HOOK 0-3 DTK]\n${form.hook3s}\n\n[ISI 3-35 DTK]\n${form.body30s}\n\n[CTA 15 DTK]\n${form.cta15s}`,
                        'script'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 cursor-pointer whitespace-nowrap"
                  >
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{copiedLabel === 'script' ? 'Tersalin' : 'Salin Teleprompter'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={aiLoading !== null}
                    onClick={() => void handleAiGenerateScript()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {aiLoading === 'script' ? 'Menyusun Skrip...' : 'Generate Skrip AI'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  0–3 Detik: Visual &amp; Verbal Hook (Tanpa Basa-Basi)
                </label>
                <textarea
                  rows={2}
                  maxLength={400}
                  value={form.hook3s}
                  onChange={(e) => setForm({ ...form, hook3s: e.target.value })}
                  placeholder="Mulai langsung dari konflik, hasil final studio, atau klaim kontrarian..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  3–35 Detik: Daging Materi &amp; Arahan B-Roll Studio
                </label>
                <textarea
                  rows={5}
                  maxLength={3000}
                  value={form.body30s}
                  onChange={(e) => setForm({ ...form, body30s: e.target.value })}
                  placeholder="Jabarkan 2–3 poin bukti visual nyata, perbandingan Before–After, atau demonstrasi di set..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  15 Detik Akhir: Insight &amp; CTA Pemicu Share / Komentar
                </label>
                <textarea
                  rows={2}
                  maxLength={600}
                  value={form.cta15s}
                  onChange={(e) => setForm({ ...form, cta15s: e.target.value })}
                  placeholder="Tutup dengan prinsip bisnis/kreatif dan ajak audiens berdiskusi atau menyimpan video..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 space-y-4">
                <h3 className="font-serif text-base font-semibold text-stone-900">
                  Ekspansi 1-to-Many &amp; Staging Publikasi
                </h3>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Kerangka Carousel Turunan (Untuk Tim Desain)
                  </label>
                  <textarea
                    rows={3}
                    maxLength={2500}
                    value={form.carouselOutline}
                    onChange={(e) => setForm({ ...form, carouselOutline: e.target.value })}
                    placeholder="Slide 1 (Cover) | Slide 2 (Masalah) | Slide 3 (Bukti) | Slide 4 (Framework) | Slide 5 (CTA)..."
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                      Caption SEO IG / TikTok
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(`${form.seoCaption}\n\n${form.hashtags}`, 'caption')
                      }
                      className="text-xs text-[#1E3A8A] hover:underline cursor-pointer"
                    >
                      {copiedLabel === 'caption' ? 'Caption Tersalin' : 'Salin Caption + Tagar'}
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={2200}
                    value={form.seoCaption}
                    onChange={(e) => setForm({ ...form, seoCaption: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                        Tagar Niche (Maks. 5)
                      </label>
                      <span
                        className={`text-xs font-mono tabular-nums ${
                          hashtagCount > 5 ? 'text-red-700 font-semibold' : 'text-stone-500'
                        }`}
                      >
                        {hashtagCount}/5
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={200}
                      value={form.hashtags}
                      onChange={(e) => setForm({ ...form, hashtags: e.target.value })}
                      placeholder="#brandingumkm #fotoproduk #obeecreatives"
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                      Tanggal Jadwal Tayang
                    </label>
                    <input
                      type="date"
                      value={form.scheduledDate}
                      onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                      Link Aset Video / Drive (Hemat Kuota Gratis)
                    </label>
                    <input
                      type="url"
                      maxLength={500}
                      value={form.driveAssetUrl}
                      onChange={(e) => setForm({ ...form, driveAssetUrl: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                      URL Post Terpublikasi
                    </label>
                    <input
                      type="url"
                      maxLength={500}
                      value={form.publishedUrl}
                      onChange={(e) => setForm({ ...form, publishedUrl: e.target.value })}
                      placeholder="https://www.instagram.com/reel/..."
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                      Status Distribusi Instagram
                    </label>
                    <select
                      value={form.igPublishStatus}
                      onChange={(e) =>
                        setForm({ ...form, igPublishStatus: e.target.value as PublishStatus })
                      }
                      className="w-full px-3 py-2 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                    >
                      <option value="manual">Manual / Native Collab</option>
                      <option value="queued">Antrean Siap Posting</option>
                      <option value="draft">Draft Business Suite</option>
                      <option value="published">Sudah Terpublikasi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                      Status Distribusi TikTok
                    </label>
                    <select
                      value={form.tiktokPublishStatus}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          tiktokPublishStatus: e.target.value as PublishStatus,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-stone-300 text-base sm:text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                    >
                      <option value="manual">Manual Upload</option>
                      <option value="draft">Draft Inbox (Sound Trending)</option>
                      <option value="queued">Antrean Siap Posting</option>
                      <option value="published">Sudah Terpublikasi</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Live Diagnostic Strip */}
              <div className="p-5 bg-white border border-stone-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone-500">
                      Diagnosa Performa Konten
                    </p>
                    <h3
                      className={`font-serif text-xl font-semibold ${
                        evalMetrics.tone === 'positive'
                          ? 'text-green-800'
                          : evalMetrics.tone === 'critical'
                            ? 'text-red-700'
                            : evalMetrics.tone === 'warning'
                              ? 'text-amber-700'
                              : 'text-stone-900'
                      }`}
                    >
                      {evalMetrics.statusLabel}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-right font-mono tabular-nums text-xs">
                    <div>
                      <span className="block text-stone-500">Share/1K</span>
                      <span className="font-semibold text-stone-900">
                        {evalMetrics.shareRate1k.toFixed(1)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-stone-500">Save/1K</span>
                      <span className="font-semibold text-stone-900">
                        {evalMetrics.saveRate1k.toFixed(1)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-stone-500">Follow Conv</span>
                      <span className="font-semibold text-stone-900">
                        {evalMetrics.followConvPct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-base sm:text-sm text-stone-700 leading-relaxed">
                  {evalMetrics.recommendation}
                </p>

                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={aiLoading !== null}
                    onClick={() => void handleAiDiagnose()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {aiLoading === 'diagnose'
                        ? 'Menganalisis Angka...'
                        : 'Analisis Mendalam AI Coach'}
                    </span>
                  </button>

                  {item && (
                    <button
                      type="button"
                      onClick={() => {
                        void onCreateFollowUp({
                          ...EMPTY_FORM,
                          title:
                            aiDiagnosis?.followUpEpisodeTitle ||
                            `${form.title} — Episode Lanjutan`,
                          pillar: form.pillar,
                          targetAccount: form.targetAccount,
                          format: form.format,
                          stage: 'script',
                          researchSource: `Iterasi performa dari: ${form.title}`,
                          audienceTier: form.audienceTier,
                          viralTrigger: form.viralTrigger,
                          researchInsight:
                            aiDiagnosis?.diagnosis ||
                            `Melanjutkan topik pemenang dengan hook yang lebih tajam (${form.views} views, ${form.shares} shares).`,
                          hook3s: aiDiagnosis?.followUpHook || '',
                        });
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-[#1E3A8A] bg-[#F4F0E8] border border-stone-300 hover:bg-stone-200/70 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Jadikan Episode Lanjutan (Serial)
                    </button>
                  )}
                </div>

                {aiDiagnosis && (
                  <div className="p-4 bg-[#F4F0E8] border border-stone-200 space-y-2 text-base sm:text-sm">
                    <p className="font-semibold text-stone-900">
                      Vonis AI Coach: {aiDiagnosis.verdict}
                    </p>
                    <p className="text-stone-700 leading-relaxed">{aiDiagnosis.diagnosis}</p>
                    <p className="text-stone-800">
                      <strong>Tindakan:</strong> {aiDiagnosis.nextAction}
                    </p>
                    <div className="pt-2 border-t border-stone-200 text-xs text-stone-700">
                      <p className="font-semibold text-stone-900">
                        Usulan Episode Berikutnya: {aiDiagnosis.followUpEpisodeTitle}
                      </p>
                      <p className="italic mt-0.5">Hook: &ldquo;{aiDiagnosis.followUpHook}&rdquo;</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Numeric Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(
                  [
                    ['views', 'Views'],
                    ['reach', 'Reach'],
                    ['nonFollowerPct', 'Non-Follower (%)'],
                    ['holdRate3s', '3s Hold Rate (%)'],
                    ['avgWatchPct', 'Avg Watch (%)'],
                    ['shares', 'DM Shares'],
                    ['saves', 'Saves'],
                    ['comments', 'Comments'],
                    ['profileVisits', 'Profile Visits'],
                    ['newFollows', 'New Follows'],
                    ['inboundLeads', 'Inbound DM Leads'],
                    ['creatorMinutes', 'Waktu Anda (Menit)'],
                  ] as const
                ).map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={form[field]}
                      onChange={(e) =>
                        setForm({ ...form, [field]: Number(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 bg-white border border-stone-300 text-base sm:text-sm font-mono tabular-nums text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drawer Footer */}
          <div className="pt-4 pb-6 sm:pb-0 border-t border-stone-200 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {item && onDelete && canDelete && (
                confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        void onDelete(item.id).then(onClose);
                      }}
                      className="px-3 py-2.5 sm:py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 cursor-pointer"
                    >
                      Konfirmasi Hapus
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-2.5 sm:py-2 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 sm:py-2 text-xs font-medium text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Hapus Konten</span>
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 cursor-pointer min-h-[44px] sm:min-h-0"
              >
                Tutup
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-none px-5 py-2.5 sm:py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] disabled:opacity-50 transition-colors cursor-pointer min-h-[44px] sm:min-h-0"
              >
                {saving ? 'Menyimpan...' : item ? 'Simpan Perubahan' : 'Simpan ke Pipeline'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
