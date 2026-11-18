import { useState } from 'react';
import { BarChart3, Plus, Trash2 } from 'lucide-react';
import {
  PHASE_LABELS,
  PILLAR_META,
  evaluatePostPerformance,
  type ContentItem,
  type StrategyPhase,
  type WeeklySnapshot,
} from '../types/creator';

interface AnalyticsScorecardViewProps {
  items: ContentItem[];
  snapshots: WeeklySnapshot[];
  activePhase: StrategyPhase;
  canDeleteSnapshot?: boolean;
  onOpenItem: (item: ContentItem, tab?: 'research' | 'script' | 'metrics') => void;
  onSaveSnapshot: (
    data: Omit<WeeklySnapshot, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  onDeleteSnapshot: (snapshotId: string) => Promise<void>;
}

export function AnalyticsScorecardView({
  items,
  snapshots,
  activePhase,
  canDeleteSnapshot = true,
  onOpenItem,
  onSaveSnapshot,
  onDeleteSnapshot,
}: AnalyticsScorecardViewProps) {
  const published = items.filter((i) => i.stage === 'published');

  const [weekLabel, setWeekLabel] = useState(`Minggu ${snapshots.length + 1}`);
  const [phase, setPhase] = useState<StrategyPhase>(activePhase);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [publishedCount, setPublishedCount] = useState(published.length || 3);
  const [totalViews, setTotalViews] = useState(
    published.reduce((s, i) => s + i.views, 0)
  );
  const [totalReach, setTotalReach] = useState(
    published.reduce((s, i) => s + i.reach, 0)
  );
  const [avgNonFollowerPct, setAvgNonFollowerPct] = useState(
    published.length > 0
      ? Math.round(
          published.reduce((s, i) => s + i.nonFollowerPct, 0) / published.length
        )
      : 0
  );
  const [avgHoldRate3s, setAvgHoldRate3s] = useState(
    published.length > 0
      ? Math.round(
          published.reduce((s, i) => s + i.holdRate3s, 0) / published.length
        )
      : 0
  );
  const [avgWatchPct, setAvgWatchPct] = useState(
    published.length > 0
      ? Math.round(
          published.reduce((s, i) => s + i.avgWatchPct, 0) / published.length
        )
      : 0
  );
  const [totalShares, setTotalShares] = useState(
    published.reduce((s, i) => s + i.shares, 0)
  );
  const [totalSaves, setTotalSaves] = useState(
    published.reduce((s, i) => s + i.saves, 0)
  );
  const [qualityCommentPct, setQualityCommentPct] = useState(30);
  const [profileVisits, setProfileVisits] = useState(
    published.reduce((s, i) => s + i.profileVisits, 0)
  );
  const [newFollows, setNewFollows] = useState(
    published.reduce((s, i) => s + i.newFollows, 0)
  );
  const [inboundLeads, setInboundLeads] = useState(
    published.reduce((s, i) => s + i.inboundLeads, 0)
  );
  const [ctaKeywordComments, setCtaKeywordComments] = useState(0);
  const [creatorHours, setCreatorHours] = useState(2.5);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const shareRate = totalReach > 0 ? (totalShares / totalReach) * 1000 : 0;
  const saveRate = totalReach > 0 ? (totalSaves / totalReach) * 1000 : 0;
  const followConv = profileVisits > 0 ? (newFollows / profileVisits) * 100 : 0;
  const minsPerContent =
    publishedCount > 0 ? (creatorHours * 60) / publishedCount : 0;

  const handleSubmitSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weekLabel.trim()) return;
    setSaving(true);
    try {
      await onSaveSnapshot({
        weekLabel,
        phase,
        startDate,
        endDate,
        publishedCount,
        totalViews,
        totalReach,
        avgNonFollowerPct,
        avgHoldRate3s,
        avgWatchPct,
        totalShares,
        totalSaves,
        qualityCommentPct,
        profileVisits,
        newFollows,
        inboundLeads,
        ctaKeywordComments,
        creatorHours,
        notes,
      });
      setWeekLabel(`Minggu ${snapshots.length + 2}`);
      setNotes('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="pb-6 border-b border-stone-200">
        <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">
          Analisis Konten Terpublikasi &amp; Scorecard Mingguan
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
          Analytics Lab &amp; Weekly Evaluation Scorecard
        </h1>
      </div>

      {/* Section A: Per-Content Performance */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900">
              1. Analisis Metrik Per Konten Terpublikasi
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Klik konten mana saja untuk memperbarui metrik 48 jam/7 hari atau meminta
              evaluasi AI Coach.
            </p>
          </div>
          <BarChart3 className="w-5 h-5 text-stone-400" aria-hidden="true" />
        </div>

        {published.length === 0 ? (
          <div className="p-8 bg-white border border-stone-200 text-center text-sm text-stone-600">
            Belum ada konten di tahap <strong>6. Tayang &amp; Analisis</strong>. Pindahkan
            konten yang sudah tayang di Kanban untuk melacak performanya di sini.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white border border-stone-200">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-[#F4F0E8] text-xs uppercase tracking-wider text-stone-600">
                  <th className="py-3 px-4 font-semibold">Konten &amp; Pilar</th>
                  <th className="py-3 px-3 font-semibold text-right">Views</th>
                  <th className="py-3 px-3 font-semibold text-right">Non-Foll</th>
                  <th className="py-3 px-3 font-semibold text-right">3s Hold</th>
                  <th className="py-3 px-3 font-semibold text-right">Share/1K</th>
                  <th className="py-3 px-3 font-semibold text-right">Save/1K</th>
                  <th className="py-3 px-3 font-semibold text-right">Foll Conv</th>
                  <th className="py-3 px-4 font-semibold">Vonis Sistem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {published.map((item) => {
                  const ev = evaluatePostPerformance(item);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => onOpenItem(item, 'metrics')}
                      className="hover:bg-stone-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900">{item.title}</div>
                        <div className="text-xs text-stone-500">
                          {PILLAR_META[item.pillar].shortLabel} · {item.targetAccount}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                        {item.views.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                        {item.nonFollowerPct}%
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                        {item.holdRate3s}%
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                        {ev.shareRate1k.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                        {ev.saveRate1k.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                        {ev.followConvPct.toFixed(1)}%
                      </td>
                      <td
                        className={`py-3.5 px-4 text-xs font-semibold ${
                          ev.tone === 'positive'
                            ? 'text-green-800'
                            : ev.tone === 'critical'
                              ? 'text-red-700'
                              : ev.tone === 'warning'
                                ? 'text-amber-700'
                                : 'text-stone-700'
                        }`}
                      >
                        {ev.statusLabel}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Section B: Weekly Evaluation Scorecard Calculator & Log */}
      <section className="space-y-6 pt-6 border-t border-stone-200">
        <div>
          <h2 className="font-serif text-xl font-semibold text-stone-900">
            2. Kalkulator &amp; Log Evaluasi Mingguan (20 Menit / Minggu)
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Catat rekap angka mingguan dari Instagram &amp; TikTok Insights untuk memantau
            tren lintas fase 90 hari.
          </p>
        </div>

        <form
          onSubmit={handleSubmitSnapshot}
          className="p-6 bg-white border border-stone-200 space-y-6"
        >
          {/* Live Computed Ratios Banner */}
          <div className="p-4 bg-[#F4F0E8] border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-stone-500 block mb-1">Share Rate / 1K Reach</span>
              <span
                className={`font-mono tabular-nums text-lg font-semibold ${
                  shareRate >= 10 ? 'text-green-800' : 'text-stone-900'
                }`}
              >
                {shareRate.toFixed(1)}{' '}
                <span className="text-[11px] font-normal text-stone-500">
                  (Target &gt;= 10)
                </span>
              </span>
            </div>
            <div>
              <span className="text-stone-500 block mb-1">Save Rate / 1K Reach</span>
              <span
                className={`font-mono tabular-nums text-lg font-semibold ${
                  saveRate >= 15 ? 'text-green-800' : 'text-stone-900'
                }`}
              >
                {saveRate.toFixed(1)}{' '}
                <span className="text-[11px] font-normal text-stone-500">
                  (Target &gt;= 15)
                </span>
              </span>
            </div>
            <div>
              <span className="text-stone-500 block mb-1">Profile-to-Follow %</span>
              <span
                className={`font-mono tabular-nums text-lg font-semibold ${
                  followConv >= 6 ? 'text-green-800' : 'text-stone-900'
                }`}
              >
                {followConv.toFixed(1)}%{' '}
                <span className="text-[11px] font-normal text-stone-500">
                  (Target &gt;= 6%)
                </span>
              </span>
            </div>
            <div>
              <span className="text-stone-500 block mb-1">Efisiensi Waktu Anda</span>
              <span
                className={`font-mono tabular-nums text-lg font-semibold ${
                  minsPerContent <= 45 ? 'text-green-800' : 'text-amber-700'
                }`}
              >
                {minsPerContent.toFixed(0)} mnt/konten{' '}
                <span className="text-[11px] font-normal text-stone-500">(&lt;= 45m)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Label Minggu
              </label>
              <input
                type="text"
                required
                value={weekLabel}
                onChange={(e) => setWeekLabel(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Fase Strategi
              </label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value as StrategyPhase)}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#1E3A8A]"
              >
                {Object.entries(PHASE_LABELS).map(([k, lbl]) => (
                  <option key={k} value={k}>
                    {lbl}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              ['Konten Tayang', publishedCount, setPublishedCount],
              ['Total Views', totalViews, setTotalViews],
              ['Total Reach', totalReach, setTotalReach],
              ['Non-Follower (%)', avgNonFollowerPct, setAvgNonFollowerPct],
              ['3s Hold Rate (%)', avgHoldRate3s, setAvgHoldRate3s],
              ['Avg Watch (%)', avgWatchPct, setAvgWatchPct],
              ['Total DM Shares', totalShares, setTotalShares],
              ['Total Saves', totalSaves, setTotalSaves],
              ['Komen Berkualitas (%)', qualityCommentPct, setQualityCommentPct],
              ['Profile Visits', profileVisits, setProfileVisits],
              ['New Follows', newFollows, setNewFollows],
              ['Inbound Leads', inboundLeads, setInboundLeads],
              ['Komen Kata Kunci CTA', ctaKeywordComments, setCtaKeywordComments],
              ['Jam Kerja Anda', creatorHours, setCreatorHours],
            ].map(([label, val, setter]) => (
              <div key={label as string}>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  {label as string}
                </label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={val as number}
                  onChange={(e) =>
                    (setter as (n: number) => void)(Number(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-sm font-mono tabular-nums focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Catatan Evaluasi &amp; Keputusan Minggu Depan
              </label>
              <input
                type="text"
                maxLength={1000}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Format bedah kemasan menang telak, jadikan serial Eps 02 hari Jumat."
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Log Scorecard'}</span>
            </button>
          </div>
        </form>

        {/* Saved Weekly Snapshots History */}
        {snapshots.length > 0 && (
          <div className="overflow-x-auto bg-white border border-stone-200">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-[#F4F0E8] text-xs uppercase tracking-wider text-stone-600">
                  <th className="py-3 px-4 font-semibold">Minggu &amp; Fase</th>
                  <th className="py-3 px-3 font-semibold text-right">Reach</th>
                  <th className="py-3 px-3 font-semibold text-right">3s Hold</th>
                  <th className="py-3 px-3 font-semibold text-right">Share/1K</th>
                  <th className="py-3 px-3 font-semibold text-right">Follow Conv</th>
                  <th className="py-3 px-3 font-semibold text-right">Leads</th>
                  <th className="py-3 px-4 font-semibold">Catatan Keputusan</th>
                  {canDeleteSnapshot && (
                    <th className="py-3 px-3 font-semibold text-right">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {snapshots.map((snap) => {
                  const sShare =
                    snap.totalReach > 0
                      ? (snap.totalShares / snap.totalReach) * 1000
                      : 0;
                  const sConv =
                    snap.profileVisits > 0
                      ? (snap.newFollows / snap.profileVisits) * 100
                      : 0;
                  return (
                    <tr key={snap.id} className="align-top">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">
                          {snap.weekLabel}
                        </div>
                        <div className="text-xs text-stone-500">
                          {snap.phase.toUpperCase()} · {snap.publishedCount} konten
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">
                        {snap.totalReach.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">
                        {snap.avgHoldRate3s}%
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">
                        {sShare.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">
                        {sConv.toFixed(1)}%
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-[#1E3A8A]">
                        {snap.inboundLeads}
                      </td>
                      <td className="py-3 px-4 text-xs text-stone-600 max-w-xs">
                        {snap.notes || '-'}
                      </td>
                      {canDeleteSnapshot && (
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => void onDeleteSnapshot(snap.id)}
                            aria-label={`Hapus ${snap.weekLabel}`}
                            className="p-1.5 text-stone-400 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
