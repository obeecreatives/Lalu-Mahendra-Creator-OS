import { useState } from 'react';
import { Check, Copy, ShieldCheck, Trash2, UserPlus, Users } from 'lucide-react';
import type { Workspace, WorkspaceMember, WorkspaceRole } from '../types/creator';

interface TeamAccessViewProps {
  activeWorkspace: Workspace | null;
  userRole: WorkspaceRole;
  members: WorkspaceMember[];
  currentUserEmail: string;
  onInviteAssistant: (email: string, displayName: string) => Promise<void>;
  onRemoveAssistant: (memberId: string, email: string) => Promise<void>;
}

export function TeamAccessView({
  activeWorkspace,
  userRole,
  members,
  currentUserEmail,
  onInviteAssistant,
  onRemoveAssistant,
}: TeamAccessViewProps) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedGuide, setCopiedGuide] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      await onInviteAssistant(email, displayName);
      setSuccessMsg(
        `Akses asisten untuk ${email.trim().toLowerCase()} aktif. Asisten dapat langsung masuk menggunakan akun Google tersebut.`
      );
      setEmail('');
      setDisplayName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambahkan asisten.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyOnboarding = () => {
    const appUrl = window.location.origin;
    const text = `Halo, kamu sudah ditambahkan sebagai Asisten Konten di Lalu Mahendra Creator OS.\n\n1. Buka: ${appUrl}\n2. Klik "Masuk dengan Akun Google" menggunakan email Google yang sudah didaftarkan.\n3. Workspace Lalu Mahendra akan langsung terbuka dengan akses operasional (input riset, skrip, link aset Google Drive, jadwal tayang, dan metrik 48 jam/7 hari).`;
    void navigator.clipboard.writeText(text);
    setCopiedGuide(true);
    window.setTimeout(() => setCopiedGuide(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">
            Delegasi Terkontrol · Tanpa Modul Agensi Klien
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
            Akses Asisten &amp; Hak Kelola Workspace
          </h1>
          <p className="text-sm text-stone-600 mt-2 max-w-3xl">
            Asisten wajib login memakai <strong>akun Google miliknya sendiri</strong>. Tidak
            perlu berbagi kredensial Gmail pribadi Anda, dan akses dapat dicabut kapan saja
            dengan satu klik.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyOnboarding}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 hover:bg-stone-50 cursor-pointer whitespace-nowrap shrink-0"
        >
          {copiedGuide ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-700" aria-hidden="true" />
              <span>Panduan Login Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Salin Panduan Masuk Asisten</span>
            </>
          )}
        </button>
      </div>

      {/* Active Session Role Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-stone-200">
          <p className="text-[11px] uppercase tracking-wider text-stone-500 mb-1">
            Pemilik Workspace (Owner)
          </p>
          <p className="font-serif text-lg font-semibold text-stone-900">
            {activeWorkspace?.ownerName || 'Lalu Mahendra'}
          </p>
          <p className="text-xs text-stone-500 mt-0.5 truncate">
            {activeWorkspace?.ownerEmail || currentUserEmail}
          </p>
        </div>

        <div className="p-5 bg-white border border-stone-200">
          <p className="text-[11px] uppercase tracking-wider text-stone-500 mb-1">
            Peran Sesi Anda
          </p>
          <p className="font-serif text-lg font-semibold text-[#1E3A8A]">
            {userRole === 'owner' ? 'Owner (Kontrol Penuh)' : 'Assistant (Operasional)'}
          </p>
          <p className="text-xs text-stone-500 mt-0.5 truncate">{currentUserEmail}</p>
        </div>

        <div className="p-5 bg-white border border-stone-200">
          <p className="text-[11px] uppercase tracking-wider text-stone-500 mb-1">
            Kuota Asisten Aktif (Spark Plan)
          </p>
          <p className="font-mono tabular-nums text-2xl font-semibold text-stone-900">
            {activeWorkspace?.assistantEmails?.length ?? 0}{' '}
            <span className="text-sm font-normal text-stone-500">/ 5 akun</span>
          </p>
          <p className="text-xs text-stone-500 mt-0.5">
            Sinkronisasi real-time via Firestore
          </p>
        </div>
      </div>

      {userRole === 'owner' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8">
          {/* Invite Assistant Form & Roster */}
          <div className="space-y-6">
            <form
              onSubmit={handleInvite}
              className="p-6 bg-white border border-stone-200 space-y-4"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <UserPlus className="w-4 h-4 text-[#1E3A8A]" aria-hidden="true" />
                <h2 className="font-serif text-lg font-semibold text-stone-900">
                  Undang Asisten via Email Google
                </h2>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-green-50 border border-green-200 text-xs text-green-900">
                  {successMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Email Akun Google Asisten *
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={120}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="asisten.konten@gmail.com"
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-stone-300 text-sm focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nama / Label Peran
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Misal: Raka · Editor Reels"
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-stone-300 text-sm focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <p className="text-xs text-stone-500">
                  Asisten harus memakai email Gmail / Google Workspace yang terverifikasi.
                </p>
                <button
                  type="submit"
                  disabled={submitting || !email.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{submitting ? 'Memproses...' : 'Berikan Akses'}</span>
                </button>
              </div>
            </form>

            {/* Active Assistants List */}
            <div className="bg-white border border-stone-200">
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-stone-600" aria-hidden="true" />
                  <h2 className="font-serif text-lg font-semibold text-stone-900">
                    Daftar Asisten Terotorisasi
                  </h2>
                </div>
                <span className="text-xs font-mono text-stone-500">
                  {members.length} aktif
                </span>
              </div>

              {members.length === 0 ? (
                <div className="p-6 text-sm text-stone-500">
                  Belum ada asisten yang ditambahkan. Saat ini hanya akun Anda yang memiliki
                  akses baca dan tulis ke workspace ini.
                </div>
              ) : (
                <ul className="divide-y divide-stone-200">
                  {members.map((m) => (
                    <li
                      key={m.id}
                      className="px-6 py-4 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-900 truncate">
                          {m.displayName}
                        </p>
                        <p className="text-xs text-stone-500 truncate">{m.email}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] font-medium text-[#1E3A8A] border border-[#1E3A8A]/25 bg-[#F4F0E8] px-2.5 py-1">
                          Assistant
                        </span>
                        <button
                          type="button"
                          onClick={() => void onRemoveAssistant(m.id, m.email)}
                          title="Cabut akses asisten"
                          aria-label={`Cabut akses ${m.email}`}
                          className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* RBAC Matrix Explanation */}
          <div className="p-6 bg-[#F4F0E8]/60 border border-stone-200 space-y-5 h-fit">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-200">
              <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" aria-hidden="true" />
              <h2 className="font-serif text-lg font-semibold text-stone-900">
                Batas Hak Akses (Dikunci di Firestore Rules)
              </h2>
            </div>

            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div>
                <p className="font-semibold text-stone-900 mb-1">
                  Yang Boleh Dilakukan Asisten:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Melihat seluruh konten, riset, skrip 3-30-15, dan katalog showcase.</li>
                  <li>
                    Menambahkan draf riset, mengisi link aset <strong>Google Drive</strong>,
                    dan menggeser tahap di Kanban (<em>Editing → Siap Posting → Tayang</em>).
                  </li>
                  <li>
                    Menginput angka metrik IG/TikTok Insights (48 jam &amp; 7 hari) serta
                    log <em>Weekly Scorecard</em>.
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-stone-200">
                <p className="font-semibold text-red-900 mb-1">
                  Yang Diblokir untuk Asisten:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-stone-700">
                  <li>
                    <strong>Tidak bisa menghapus</strong> konten, snapshot mingguan, maupun
                    aset portofolio.
                  </li>
                  <li>
                    <strong>Tidak bisa mengubah</strong> fase strategi 90 hari utama.
                  </li>
                  <li>
                    <strong>Tidak bisa menambah atau menghapus</strong> anggota tim lain.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white border border-stone-200 space-y-3">
          <h2 className="font-serif text-lg font-semibold text-stone-900">
            Anda Sedang Masuk dalam Mode Asisten
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Anda memiliki akses operasional ke seluruh papan riset, skrip 3-30-15, papan
            batching, dan input metrik pasca-tayang milik{' '}
            <strong>{activeWorkspace?.ownerName || 'Lalu Mahendra'}</strong>. Penghapusan
            dokumen permanen, perubahan fase 90 hari, dan manajemen anggota tim hanya
            tersedia untuk Owner.
          </p>
        </div>
      )}
    </div>
  );
}
