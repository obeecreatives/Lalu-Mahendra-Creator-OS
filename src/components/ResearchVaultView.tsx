import { useState } from 'react';
import { Plus, Search, Sparkles } from 'lucide-react';
import { requestAngleReframe, type ReframedAngle } from '../services/aiService';
import {
  AUDIENCE_LABELS,
  PILLAR_META,
  STAGE_META,
  type ContentItem,
  type PillarId,
} from '../types/creator';

interface ResearchVaultViewProps {
  items: ContentItem[];
  onOpenItem: (item: ContentItem, tab?: 'research' | 'script' | 'metrics') => void;
  onQuickCreateFromAngle: (
    seed: Omit<ContentItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  onCreateBlank: () => void;
}

export function ResearchVaultView({
  items,
  onOpenItem,
  onQuickCreateFromAngle,
  onCreateBlank,
}: ResearchVaultViewProps) {
  const [search, setSearch] = useState('');
  const [pillarFilter, setPillarFilter] = useState<'all' | PillarId>('all');
  const [rawTopic, setRawTopic] = useState('');
  const [rawSource, setRawSource] = useState('');
  const [rawPillar, setRawPillar] = useState<PillarId>('pilar-3');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [angles, setAngles] = useState<ReframedAngle[]>([]);

  const filtered = items.filter((item) => {
    const matchPillar = pillarFilter === 'all' || item.pillar === pillarFilter;
    const q = search.trim().toLowerCase();
    const matchQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.researchSource.toLowerCase().includes(q) ||
      item.hook3s.toLowerCase().includes(q);
    return matchPillar && matchQuery;
  });

  const handleGenerateAngles = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawTopic.trim()) return;
    setLoadingAi(true);
    setAiError(null);
    try {
      const res = await requestAngleReframe({
        rawTopic,
        pillar: PILLAR_META[rawPillar].label,
        researchSource: rawSource || 'Observasi studio & mentoring',
      });
      setAngles(res.angles || []);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Gagal menjalankan AI Reframer.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">
            Gerbang Riset Sebelum Produksi
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
            Research &amp; Angle Vault
          </h1>
        </div>
        <button
          type="button"
          onClick={onCreateBlank}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Tambah Ide Riset</span>
        </button>
      </div>

      {/* Creative Director Angle Reframer Bar */}
      <form
        onSubmit={handleGenerateAngles}
        className="p-6 bg-[#F4F0E8]/70 border border-stone-200 space-y-4"
      >
        <div>
          <h2 className="font-serif text-lg font-semibold text-stone-900">
            Quick Capture &amp; Creative Director Reframer (AI)
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Masukkan topik mentah dari kelas MJC, revisi klien, atau tips teknis foto/video—AI akan
            mengubahnya menjadi 3 sudut pandang berotoritas tinggi siap rekam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_auto] gap-3">
          <input
            type="text"
            value={rawTopic}
            onChange={(e) => setRawTopic(e.target.value)}
            placeholder="Ide mentah (misal: Tips lighting produk botol biar gak mantul)"
            className="px-3.5 py-2.5 bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
          />
          <input
            type="text"
            value={rawSource}
            onChange={(e) => setRawSource(e.target.value)}
            placeholder="Sumber riset / kasus"
            className="px-3.5 py-2.5 bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
          />
          <select
            value={rawPillar}
            onChange={(e) => setRawPillar(e.target.value as PillarId)}
            className="px-3 py-2.5 bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
          >
            {(Object.keys(PILLAR_META) as PillarId[]).map((pid) => (
              <option key={pid} value={pid}>
                {PILLAR_META[pid].shortLabel}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loadingAi || !rawTopic.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{loadingAi ? 'Meracik...' : 'Ubah ke Angle Director'}</span>
          </button>
        </div>

        {aiError && <p className="text-xs text-red-700">{aiError}</p>}

        {angles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-stone-200">
            {angles.map((ang, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-stone-200 flex flex-col justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-semibold text-[#1E3A8A] mb-1">
                    {ang.angleType}
                  </p>
                  <h3 className="font-semibold text-sm text-stone-900 mb-1.5">
                    {ang.title}
                  </h3>
                  <p className="text-xs text-stone-700 italic mb-2">
                    &ldquo;{ang.hook3s}&rdquo;
                  </p>
                  <p className="text-xs text-stone-500 leading-relaxed">{ang.whyItWorks}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void onQuickCreateFromAngle({
                      title: ang.title,
                      pillar: rawPillar,
                      targetAccount:
                        rawPillar === 'pilar-3'
                          ? 'Collab @lalumahendra x @obeephotography'
                          : '@lalumahendra',
                      format: rawPillar === 'pilar-3' ? 'Collab Reels' : 'Reels',
                      stage: 'script',
                      researchSource: rawSource || `Reframe AI dari: ${rawTopic}`,
                      audienceTier: rawPillar === 'pilar-1' ? 'lapis-2' : 'lapis-1',
                      viralTrigger: rawPillar === 'pilar-2' ? 'Discussion' : 'DM Shares',
                      researchInsight: ang.whyItWorks,
                      hook3s: ang.hook3s,
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
                    });
                    setAngles([]);
                    setRawTopic('');
                    setRawSource('');
                  }}
                  className="w-full py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] cursor-pointer"
                >
                  Simpan ke Pipeline Skrip
                </button>
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F4F0E8] border border-stone-200">
          {(
            [
              { id: 'all', label: `Semua (${items.length})` },
              { id: 'pilar-1', label: 'Pilar 1 · Bedah' },
              { id: 'pilar-2', label: 'Pilar 2 · Opini' },
              { id: 'pilar-3', label: 'Pilar 3 · Craft' },
              { id: 'pilar-4', label: 'Pilar 4 · Mentoring' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPillarFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                pillarFilter === tab.id
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul, sumber riset, hook..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
          />
        </div>
      </div>

      {/* Research Table */}
      {filtered.length === 0 ? (
        <div className="p-10 bg-white border border-stone-200 text-center">
          <p className="text-sm text-stone-600 mb-3">
            Tidak ada item riset yang sesuai dengan filter saat ini.
          </p>
          <button
            type="button"
            onClick={onCreateBlank}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] cursor-pointer"
          >
            Buat Item Riset Pertama
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-stone-200">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-[#F4F0E8] text-xs uppercase tracking-wider text-stone-600">
                <th className="py-3 px-4 font-semibold">Judul &amp; Hook 3 Detik</th>
                <th className="py-3 px-4 font-semibold">Pilar &amp; Akun</th>
                <th className="py-3 px-4 font-semibold">Sumber Riset &amp; Pemicu</th>
                <th className="py-3 px-4 font-semibold">Tahap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filtered.map((item) => {
                const stageName =
                  STAGE_META.find((s) => s.id === item.stage)?.label || item.stage;
                return (
                  <tr
                    key={item.id}
                    onClick={() => onOpenItem(item, 'research')}
                    className="align-top hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-semibold text-stone-900 mb-1">
                        {item.title}
                      </div>
                      {item.hook3s && (
                        <p className="text-xs text-stone-600 italic line-clamp-2">
                          &ldquo;{item.hook3s}&rdquo;
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-xs font-medium text-stone-900">
                        {PILLAR_META[item.pillar].shortLabel}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {item.targetAccount} · {item.format}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-xs text-stone-700 line-clamp-2">
                        {item.researchSource || 'Belum diisi'}
                      </div>
                      <div className="text-xs text-[#1E3A8A] mt-0.5">
                        {item.viralTrigger} · {AUDIENCE_LABELS[item.audienceTier].split(' · ')[0]}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-stone-800">
                      {stageName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
