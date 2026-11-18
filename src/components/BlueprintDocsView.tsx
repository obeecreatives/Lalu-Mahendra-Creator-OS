import { useState } from 'react';
import { Check, Download, Printer } from 'lucide-react';
import {
  ALGORITHM_SIGNALS,
  AUDIENCE_TIERS,
  CONTENT_PILLARS,
  OBEEPHOTOGRAPHY_AUDIT,
  REPORT_META,
  ROADMAP_PHASES,
  SCORECARD_PHASE_1,
  SCORECARD_PHASE_2,
  SCORECARD_PHASE_3,
  STRENGTH_GAP_MATRIX,
  TECHNICAL_REFRAME_ROWS,
  TRIPLE_ACCOUNT_ARCHITECTURE,
  VERIFIED_PROFILE_FACTS,
} from '../data/reportData';
import { generateReportPdf } from '../utils/generateReportPdf';

export function BlueprintDocsView() {
  const [downloadDone, setDownloadDone] = useState(false);

  const handleDownloadPdf = () => {
    generateReportPdf();
    setDownloadDone(true);
    window.setTimeout(() => setDownloadDone(false), 3000);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">
            Master Reference · {REPORT_META.date}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
            Dokumen Riset &amp; Blueprint Strategi
          </h1>
        </div>
        <div className="no-print flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 hover:bg-stone-50 cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Cetak A4</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] cursor-pointer whitespace-nowrap"
          >
            {downloadDone ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>PDF Terunduh</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Download PDF (.pdf)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audit Ringkas & Ekosistem 3 Akun */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-stone-900">
          1. Rekam Jejak, Matriks Kekuatan &amp; Ekosistem 3 Akun
        </h2>
        <div className="bg-white border border-stone-200 divide-y divide-stone-200">
          {VERIFIED_PROFILE_FACTS.map((f) => (
            <div key={f.label} className="p-4 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2">
              <div className="font-semibold text-sm text-stone-900">{f.label}</div>
              <div className="text-sm text-stone-700 leading-relaxed">{f.detail}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRIPLE_ACCOUNT_ARCHITECTURE.map((acc) => (
            <div key={acc.account} className="p-5 bg-white border border-stone-200">
              <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">
                {acc.role}
              </p>
              <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
                {acc.account}
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">{acc.focus}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto bg-white border border-stone-200">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-[#F4F0E8] text-xs uppercase tracking-wider text-stone-600">
                <th className="py-3 px-4 font-semibold w-1/2">Unfair Advantage</th>
                <th className="py-3 px-4 font-semibold w-1/2">Celah Pertumbuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {STRENGTH_GAP_MATRIX.map((r, i) => (
                <tr key={i} className="align-top">
                  <td className="py-3 px-4 text-stone-800">{r.strength}</td>
                  <td className="py-3 px-4 text-stone-600">{r.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Audit @obeephotography */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-stone-900">
          2. Audit @obeephotography &amp; Standar Bio Baru
        </h2>
        <div className="p-5 bg-white border border-stone-200 space-y-4">
          <p className="text-xs uppercase tracking-wider text-stone-500">
            {OBEEPHOTOGRAPHY_AUDIT.snapshotStats}
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-stone-700">
            {OBEEPHOTOGRAPHY_AUDIT.integrationSteps.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ol>
          <div className="font-mono text-xs bg-[#F4F0E8] p-4 border border-stone-200 text-stone-800 space-y-1">
            {OBEEPHOTOGRAPHY_AUDIT.upgradedBio.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Algoritma, Reframe & Pilar */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-stone-900">
          3. Sinyal Algoritma, Reframe Teknis &amp; Pilar 60-30-10
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALGORITHM_SIGNALS.map((sig) => (
            <div key={sig.signal} className="p-4 bg-white border border-stone-200">
              <p className="text-xs uppercase tracking-wider text-[#1E3A8A] font-semibold">
                {sig.weight}
              </p>
              <h3 className="font-semibold text-sm text-stone-900 mt-1 mb-1.5">
                {sig.signal}
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">{sig.insight}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto bg-white border border-stone-200">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-[#F4F0E8] text-xs uppercase tracking-wider text-stone-600">
                <th className="py-3 px-4 font-semibold">Topik Operator</th>
                <th className="py-3 px-4 font-semibold">Angle Creative Director</th>
                <th className="py-3 px-4 font-semibold">Dampak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {TECHNICAL_REFRAME_ROWS.map((r) => (
                <tr key={r.oldTopic} className="align-top">
                  <td className="py-3 px-4 text-stone-500 line-through">{r.oldTopic}</td>
                  <td className="py-3 px-4 font-medium text-stone-900">{r.newAngle}</td>
                  <td className="py-3 px-4 text-stone-700">{r.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONTENT_PILLARS.map((p) => (
            <div key={p.id} className="p-4 bg-white border border-stone-200">
              <div className="flex justify-between text-xs text-stone-500 mb-1">
                <span>{p.role}</span>
                <span className="font-mono font-semibold text-[#1E3A8A]">{p.share}</span>
              </div>
              <h3 className="font-semibold text-sm text-stone-900 mb-1">{p.name}</h3>
              <p className="text-xs text-stone-700 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-stone-200 divide-y divide-stone-200">
          {AUDIENCE_TIERS.map((t) => (
            <div key={t.tier} className="p-4 text-sm">
              <span className="font-semibold text-stone-900">{t.tier}:</span>{' '}
              <span className="text-stone-700">
                {t.profile} — {t.need}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Peta Jalan & Patokan Scorecard */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-stone-900">
          4. Peta Jalan 90 Hari &amp; Benchmark Scorecard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROADMAP_PHASES.map((rp) => (
            <div key={rp.phase} className="p-5 bg-white border border-stone-200">
              <p className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-wider mb-1">
                {rp.phase}
              </p>
              <h3 className="font-serif text-base font-semibold text-stone-900 mb-2">
                {rp.title}
              </h3>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-stone-700">
                {rp.actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ['Benchmark Fase 1', SCORECARD_PHASE_1],
            ['Benchmark Fase 2', SCORECARD_PHASE_2],
            ['Benchmark Fase 3', SCORECARD_PHASE_3],
          ].map(([title, rows]) => (
            <div key={title as string} className="p-4 bg-white border border-stone-200">
              <h3 className="font-semibold text-sm text-stone-900 mb-2">
                {title as string}
              </h3>
              <ul className="space-y-2 text-xs">
                {(rows as typeof SCORECARD_PHASE_1).map((r) => (
                  <li key={r.metric} className="flex justify-between gap-2 border-b border-stone-100 pb-1.5">
                    <span className="text-stone-700">{r.metric}</span>
                    <span className="font-mono tabular-nums font-semibold text-[#1E3A8A] shrink-0">
                      {r.target}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
