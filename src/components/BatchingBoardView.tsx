import { Calendar, ExternalLink, Plus } from 'lucide-react';
import { WEEKLY_SCHEDULE } from '../data/reportData';
import {
  PILLAR_META,
  STAGE_META,
  type ContentItem,
  type ContentStage,
} from '../types/creator';

interface BatchingBoardViewProps {
  items: ContentItem[];
  onOpenItem: (item: ContentItem, tab?: 'research' | 'script' | 'metrics') => void;
  onChangeStage: (itemId: string, nextStage: ContentStage) => Promise<void>;
  onCreateNew: () => void;
}

export function BatchingBoardView({
  items,
  onOpenItem,
  onChangeStage,
  onCreateNew,
}: BatchingBoardViewProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">
            Sistem Batching 2,5 Jam / Minggu · 1-to-Many
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
            Papan Produksi &amp; Antrean Publikasi
          </h1>
        </div>
        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Tambah Konten Baru</span>
        </button>
      </div>

      {/* Creator 6-Stage Kanban */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 min-w-[980px] items-start">
          {STAGE_META.map((stage) => {
            const columnItems = items.filter((i) => i.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="bg-[#F4F0E8]/60 border border-stone-200 p-3 flex flex-col gap-3 min-h-[360px]"
              >
                <div className="pb-2.5 border-b border-stone-200">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                      {stage.label}
                    </h2>
                    <span className="font-mono tabular-nums text-xs font-semibold text-[#1E3A8A]">
                      {columnItems.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">{stage.description}</p>
                </div>

                {columnItems.length === 0 ? (
                  <p className="text-xs text-stone-400 italic py-6 text-center">
                    Belum ada kartu
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {columnItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-stone-200 p-3 space-y-2.5"
                      >
                        <div className="text-[11px] text-stone-500 flex items-center justify-between gap-1">
                          <span className="truncate">
                            {PILLAR_META[item.pillar].shortLabel} · {item.format}
                          </span>
                          {item.scheduledDate && (
                            <span className="font-mono tabular-nums text-[#1E3A8A] shrink-0">
                              {item.scheduledDate}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            onOpenItem(
                              item,
                              item.stage === 'published' ? 'metrics' : 'script'
                            )
                          }
                          className="text-left w-full text-xs font-semibold text-stone-900 hover:text-[#1E3A8A] leading-snug cursor-pointer"
                        >
                          {item.title}
                        </button>

                        <p className="text-[11px] text-stone-500 truncate">
                          {item.targetAccount}
                        </p>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                          <select
                            aria-label={`Ubah tahap ${item.title}`}
                            value={item.stage}
                            onChange={(e) =>
                              void onChangeStage(item.id, e.target.value as ContentStage)
                            }
                            className="w-full text-[11px] px-2 py-1 bg-[#FBF9F5] border border-stone-200 text-stone-700 focus:outline-none focus:border-[#1E3A8A] cursor-pointer"
                          >
                            {STAGE_META.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>

                          {item.driveAssetUrl && (
                            <a
                              href={item.driveAssetUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Buka Aset Drive"
                              className="p-1 text-stone-500 hover:text-[#1E3A8A] shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly 3-Account Rhythm Reference */}
      <div className="p-6 bg-white border border-stone-200">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[#1E3A8A]" aria-hidden="true" />
          <h2 className="font-serif text-lg font-semibold text-stone-900">
            Ritme Jadwal Mingguan Sinergi 3 Akun
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-[#F4F0E8] text-stone-700 text-xs uppercase tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Hari</th>
                <th className="py-2.5 px-3 font-semibold">Akun &amp; Collab</th>
                <th className="py-2.5 px-3 font-semibold">Format &amp; Pilar</th>
                <th className="py-2.5 px-3 font-semibold">Tujuan Algoritmik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {WEEKLY_SCHEDULE.map((row) => (
                <tr key={row.day} className="align-top">
                  <td className="py-3 px-3 font-semibold text-stone-900 whitespace-nowrap">
                    {row.day}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-[#1E3A8A] whitespace-nowrap">
                    {row.account}
                  </td>
                  <td className="py-3 px-3 text-stone-800">
                    <span className="font-medium">{row.format}</span> —{' '}
                    <span className="text-stone-500">{row.pillar}</span>
                  </td>
                  <td className="py-3 px-3 text-stone-600">{row.goal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
