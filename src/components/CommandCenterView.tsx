import { ArrowUpRight, Layers, Plus } from 'lucide-react';
import {
  PHASE_LABELS,
  PILLAR_META,
  STAGE_META,
  evaluatePostPerformance,
  type ContentItem,
  type PillarId,
  type PortfolioAsset,
  type StrategyPhase,
} from '../types/creator';

interface CommandCenterViewProps {
  items: ContentItem[];
  assets: PortfolioAsset[];
  activePhase: StrategyPhase;
  onOpenItem: (item: ContentItem, tab?: 'research' | 'script' | 'metrics') => void;
  onCreateNew: () => void;
  onNavigate: (view: 'research' | 'batching' | 'showcase' | 'analytics' | 'blueprint') => void;
}

export function CommandCenterView({
  items,
  assets,
  activePhase,
  onOpenItem,
  onCreateNew,
  onNavigate,
}: CommandCenterViewProps) {
  const totalItems = items.length;
  const publishedItems = items.filter((i) => i.stage === 'published');
  const batchingItems = items.filter(
    (i) => i.stage === 'batching' || i.stage === 'ready'
  );
  const recycledCount = assets.filter((a) => a.recycledToReels).length;

  const avgNonFollower =
    publishedItems.length > 0
      ? publishedItems.reduce((acc, i) => acc + i.nonFollowerPct, 0) /
        publishedItems.length
      : 0;

  const totalLeads = publishedItems.reduce((acc, i) => acc + i.inboundLeads, 0);

  const pillarCounts: Record<PillarId, number> = {
    'pilar-1': items.filter((i) => i.pillar === 'pilar-1').length,
    'pilar-2': items.filter((i) => i.pillar === 'pilar-2').length,
    'pilar-3': items.filter((i) => i.pillar === 'pilar-3').length,
    'pilar-4': items.filter((i) => i.pillar === 'pilar-4').length,
  };

  return (
    <div className="space-y-8">
      {/* Editorial Welcome Strip */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">
            {PHASE_LABELS[activePhase]} <span aria-hidden="true">·</span> Ekosistem 3 Akun
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
            Pusat Kendali Konten Lalu Mahendra
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('blueprint')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 sm:py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <span>Buka Dokumen Blueprint &amp; PDF</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-white border border-stone-200">
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-stone-500 mb-2">
            Total Pipeline Riset
          </p>
          <p className="font-mono tabular-nums text-2xl sm:text-3xl font-semibold text-stone-900">
            {totalItems}
          </p>
          <p className="text-xs text-stone-600 mt-1.5">
            {batchingItems.length} siap rekam / tayang
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-white border border-stone-200">
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-stone-500 mb-2">
            Konten Terpublikasi
          </p>
          <p className="font-mono tabular-nums text-2xl sm:text-3xl font-semibold text-stone-900">
            {publishedItems.length}
          </p>
          <p className="text-xs text-stone-600 mt-1.5">
            Total {totalLeads} inbound DM leads
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-white border border-stone-200">
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-stone-500 mb-2">
            Rata-Rata Non-Follower
          </p>
          <p className="font-mono tabular-nums text-2xl sm:text-3xl font-semibold text-[#1E3A8A]">
            {avgNonFollower.toFixed(0)}%
          </p>
          <p className="text-xs text-stone-600 mt-1.5">Target Fase 1: &gt;= 50%</p>
        </div>

        <div className="p-4 sm:p-5 bg-white border border-stone-200">
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-stone-500 mb-2">
            Daur Ulang @obeephotography
          </p>
          <p className="font-mono tabular-nums text-2xl sm:text-3xl font-semibold text-stone-900">
            {recycledCount}/{assets.length}
          </p>
          <button
            type="button"
            onClick={() => onNavigate('showcase')}
            className="text-xs text-[#1E3A8A] font-medium hover:underline mt-1.5 cursor-pointer text-left"
          >
            Buka Showcase Vault →
          </button>
        </div>
      </div>

      {/* Main 2-Column Operational Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
        {/* 60-30-10 Portfolio Balance */}
        <div className="p-4 sm:p-6 bg-white border border-stone-200">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="font-serif text-lg font-semibold text-stone-900">
                Keseimbangan Portofolio 60-30-10
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Menjaga rasio aktual konten Anda agar tidak melenceng ke tutorial dasar.
              </p>
            </div>
            <Layers className="w-4 h-4 text-stone-400 shrink-0" aria-hidden="true" />
          </div>

          <div className="space-y-4">
            {(Object.keys(PILLAR_META) as PillarId[]).map((pid) => {
              const meta = PILLAR_META[pid];
              const count = pillarCounts[pid];
              const actualPct = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
              return (
                <div key={pid} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5 text-xs">
                    <span className="font-medium text-stone-800">{meta.label}</span>
                    <span className="font-mono tabular-nums text-stone-600">
                      Aktual {actualPct}% ({count}) · Target {meta.targetPct}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-[#1E3A8A] transition-all"
                      style={{ width: `${Math.min(100, actualPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Antrean Batching & Siap Posting */}
        <div className="p-4 sm:p-6 bg-white border border-stone-200">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-serif text-lg font-semibold text-stone-900">
                Prioritas Sesi Batching &amp; Posting
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Konten siap masuk sesi rekaman 2,5 jam minggu ini.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('batching')}
              className="text-xs font-medium text-[#1E3A8A] hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              Lihat Kanban →
            </button>
          </div>

          {batchingItems.length === 0 ? (
            <div className="py-8 px-4 text-center border border-dashed border-stone-200">
              <p className="text-sm text-stone-600 mb-3">
                Belum ada konten di tahap Siap Rekam atau Siap Posting.
              </p>
              <button
                type="button"
                onClick={onCreateNew}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Tambah Konten Riset</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-200 border-t border-stone-200">
              {batchingItems.slice(0, 5).map((item) => {
                const stageLabel =
                  STAGE_META.find((s) => s.id === item.stage)?.label || item.stage;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onOpenItem(item, 'script')}
                    className="w-full text-left py-3 hover:bg-stone-50 transition-colors cursor-pointer block min-h-[44px]"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-1">
                      <span className="truncate">
                        {PILLAR_META[item.pillar].shortLabel} · {item.targetAccount}
                      </span>
                      <span className="font-mono text-[#1E3A8A] shrink-0">
                        {stageLabel}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-stone-900 line-clamp-1">
                      {item.title}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Published Content Quick Diagnostics */}
      <div className="p-4 sm:p-6 bg-white border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-stone-900">
              Log Performa Konten Terpublikasi Terbaru
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Klik baris mana saja untuk mencatat metrik 48 jam atau menjalankan AI Coach.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('analytics')}
            className="text-xs font-medium text-[#1E3A8A] hover:underline cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            Buka Analytics &amp; Scorecard →
          </button>
        </div>

        {publishedItems.length === 0 ? (
          <div className="py-8 px-4 text-center border border-dashed border-stone-200">
            <p className="text-sm text-stone-600">
              Belum ada konten berstatus Terpublikasi. Pindahkan kartu yang sudah tayang
              ke kolom <strong>6. Tayang &amp; Analisis</strong> untuk mulai melacak
              metriknya.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards (< md) */}
            <div className="md:hidden divide-y divide-stone-200 border-t border-stone-200">
              {publishedItems.slice(0, 5).map((item) => {
                const diag = evaluatePostPerformance(item);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onOpenItem(item, 'metrics')}
                    className="w-full text-left py-3.5 space-y-2 hover:bg-stone-50 cursor-pointer block"
                  >
                    <div className="font-medium text-sm text-stone-900 leading-snug">
                      {item.title}
                    </div>
                    <div className="text-xs text-stone-500">
                      {PILLAR_META[item.pillar].shortLabel} · {item.targetAccount}
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 font-mono tabular-nums text-xs">
                      <div>
                        <span className="block text-[10px] text-stone-500 uppercase">
                          Views
                        </span>
                        <span className="font-semibold text-stone-900">
                          {item.views.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-stone-500 uppercase">
                          3s Hold
                        </span>
                        <span className="font-semibold text-stone-900">
                          {item.holdRate3s}%
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-stone-500 uppercase">
                          Share/1K
                        </span>
                        <span className="font-semibold text-stone-900">
                          {diag.shareRate1k.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-[#1E3A8A]">
                      {diag.statusLabel}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Tablet & Desktop Table (md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500">
                    <th className="py-2.5 pr-4 font-semibold">Judul Konten</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Views</th>
                    <th className="py-2.5 px-3 font-semibold text-right">3s Hold</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Share/1K</th>
                    <th className="py-2.5 pl-3 font-semibold">Diagnosa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {publishedItems.slice(0, 5).map((item) => {
                    const diag = evaluatePostPerformance(item);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => onOpenItem(item, 'metrics')}
                        className="hover:bg-stone-50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 pr-4">
                          <div className="font-medium text-stone-900">{item.title}</div>
                          <div className="text-xs text-stone-500">
                            {PILLAR_META[item.pillar].shortLabel} · {item.targetAccount}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {item.views.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {item.holdRate3s}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {diag.shareRate1k.toFixed(1)}
                        </td>
                        <td className="py-3 pl-3 text-xs font-medium text-stone-800">
                          {diag.statusLabel}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
