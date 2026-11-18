import { useState } from 'react';
import { CheckCircle2, Plus, Repeat } from 'lucide-react';
import type { ContentItem, PortfolioAsset } from '../types/creator';

interface ShowcaseVaultViewProps {
  assets: PortfolioAsset[];
  onRecycleAsset: (
    asset: PortfolioAsset,
    seed: Omit<ContentItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  onAddAsset: (
    asset: Omit<PortfolioAsset, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
}

export function ShowcaseVaultView({
  assets,
  onRecycleAsset,
  onAddAsset,
}: ShowcaseVaultViewProps) {
  const [title, setTitle] = useState('');
  const [sourceAccount, setSourceAccount] = useState<'@obeephotography' | '@obeecreatives'>(
    '@obeephotography'
  );
  const [category, setCategory] = useState('');
  const [craftAngle, setCraftAngle] = useState('');
  const [adding, setAdding] = useState(false);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    try {
      await onAddAsset({
        title,
        sourceAccount,
        category: category || 'Commercial Project',
        imagePath: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_13.14.22_f91d7ff9.jpeg',
        craftAngle:
          craftAngle ||
          'Bedah pencahayaan, art direction, dan nilai jual komersial di balik karya ini.',
        recycledToReels: false,
        linkedContentId: '',
      });
      setTitle('');
      setCategory('');
      setCraftAngle('');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-stone-200">
        <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">
          Daur Ulang Portofolio Tanpa Syuting Produk Ulang
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
          Showcase Vault (@obeephotography &amp; @obeecreatives)
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-3xl">
          Ubah foto katalog statis menjadi Reels Collab bedah teknik di{' '}
          <strong>@lalumahendra × @obeephotography</strong>. Satu klik di bawah otomatis
          membuat draf skrip Pilar 3 (Applied Technical Craft) dan menandai karya sudah
          didaur ulang.
        </p>
      </div>

      {/* Add Portfolio Work Form */}
      <form
        onSubmit={handleCreateAsset}
        className="p-4 sm:p-5 bg-[#F4F0E8]/70 border border-stone-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.5fr_auto] gap-3 items-end"
      >
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            Nama Karya / Klien
          </label>
          <input
            type="text"
            required
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Misal: Foto Kopi Kemasan Tin"
            className="w-full px-3 py-2 bg-white border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-[#1E3A8A]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            Akun Sumber
          </label>
          <select
            value={sourceAccount}
            onChange={(e) =>
              setSourceAccount(
                e.target.value as '@obeephotography' | '@obeecreatives'
              )
            }
            className="w-full px-3 py-2 bg-white border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-[#1E3A8A]"
          >
            <option value="@obeephotography">@obeephotography</option>
            <option value="@obeecreatives">@obeecreatives</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            Kategori
          </label>
          <input
            type="text"
            maxLength={60}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="F&B / Skincare / Tech"
            className="w-full px-3 py-2 bg-white border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-[#1E3A8A]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            Angle Craft untuk Bedah Reels
          </label>
          <input
            type="text"
            maxLength={500}
            value={craftAngle}
            onChange={(e) => setCraftAngle(e.target.value)}
            placeholder="Trik cahaya, refleksi, atau alasan komposisi"
            className="w-full px-3 py-2 bg-white border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-[#1E3A8A]"
          />
        </div>
        <button
          type="submit"
          disabled={adding || !title.trim()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 cursor-pointer whitespace-nowrap min-h-[44px] sm:min-h-[38px] md:col-span-2 lg:col-span-1"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Simpan Karya</span>
        </button>
      </form>

      {/* Portfolio Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="p-5 bg-white border border-stone-200 flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-2">
                <span>
                  {asset.sourceAccount} · {asset.category}
                </span>
                {asset.recycledToReels ? (
                  <span className="inline-flex items-center gap-1 text-green-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Sudah Jadi Reels</span>
                  </span>
                ) : (
                  <span className="text-[#1E3A8A] font-medium">Siap Daur Ulang</span>
                )}
              </div>

              <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
                {asset.title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">{asset.craftAngle}</p>
            </div>

            <button
              type="button"
              onClick={() =>
                void onRecycleAsset(asset, {
                  title: `Bedah Karya ${asset.title} (${asset.sourceAccount})`,
                  pillar: 'pilar-3',
                  targetAccount:
                    asset.sourceAccount === '@obeephotography'
                      ? 'Collab @lalumahendra x @obeephotography'
                      : 'Collab @lalumahendra x @obeecreatives',
                  format: 'Collab Reels',
                  stage: 'script',
                  researchSource: `Daur ulang showcase ${asset.sourceAccount} — ${asset.title}`,
                  audienceTier: 'lapis-1',
                  viralTrigger: 'Saves',
                  researchInsight: asset.craftAngle,
                  hook3s: `Di balik foto ${asset.title} ini—kenapa 1 keputusan cahaya & komposisi ini bikin produk lokal terasa berkelas komersial.`,
                  body30s: `Tampilkan hasil foto final ${asset.title} pada 2 detik pertama. Jelaskan problem material (${asset.category}) dan teknik eksekusi studio: ${asset.craftAngle}`,
                  cta15s: `Simpan referensi teknis ini untuk proyekmu berikutnya, dan lihat portofolio lengkapnya di ${asset.sourceAccount}.`,
                  carouselOutline: `Slide 1: Final Shot ${asset.title} | Slide 2: Tantangan Material | Slide 3: Setup Cahaya Studio | Slide 4: Hasil Detail & CTA`,
                  seoCaption: `Bedah proses di balik layar ${asset.title}. Klien membayar kejelasan visual dan nilai produk yang terbangun dari eksekusi tepat.`,
                  hashtags: '#fotoproduk #obeephotography #obeecreatives #creativecraft #lalumahendra',
                  driveAssetUrl: '',
                  scheduledDate: '',
                  publishedUrl: '',
                  igPublishStatus: 'manual',
                  tiktokPublishStatus: 'manual',
                  sourcePortfolioRef: asset.title,
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
                })
              }
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] transition-colors cursor-pointer"
            >
              <Repeat className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {asset.recycledToReels
                  ? 'Buat Angle Reels Baru'
                  : 'Jadikan Reels Bedah Karya'}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
