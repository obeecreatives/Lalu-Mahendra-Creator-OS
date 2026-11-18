import type { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { OperationType, db, handleFirestoreError } from '../firebase';
import { BLUEPRINT_BATCH_10, type ContentItemSeed } from '../data/blueprintBatch10';
import {
  clampNum,
  clampStr,
  type ContentItem,
  type PortfolioAsset,
  type StrategyPhase,
  type UserProfile,
  type WeeklySnapshot,
  type Workspace,
  type WorkspaceMember,
  type WorkspaceRole,
} from '../types/creator';

const BASE_BLUEPRINT_ITEMS: ContentItemSeed[] = [
  {
    title: 'Bedah 3 Kesalahan Fatal Kemasan UMKM Sebelum Masuk Ritel',
    pillar: 'pilar-1',
    targetAccount: 'Collab @lalumahendra x @obeecreatives',
    format: 'Collab Reels',
    stage: 'batching',
    researchSource: 'Pendampingan Rebranding UMKM & KTH (MJC Bakorwil III)',
    audienceTier: 'lapis-2',
    viralTrigger: 'DM Shares',
    researchInsight:
      'Banyak produk lokal punya rasa bagus, tetapi gagal bersaing di rak toko karena hierarki informasi, ukuran brand, dan material cetak tidak dipikirkan dari sisi pembeli.',
    hook3s:
      'Produk seenak ini gagal tembus ritel modern cuma gara-gara 3 kesalahan di kemasannya. Ini cara kami rombak total di studio.',
    body30s:
      '1) Nama produk terlalu kecil dibanding ornamen. 2) Tidak ada pembeda varian yang jelas dari jarak 1,5 meter. 3) Warna cetak turun karena tidak disiapkan profil warna print-ready. Lihat perbandingannya sebelum dan sesudah layout dirapikan.',
    cta15s:
      'Kalau kamu punya produk UMKM yang mau dibedah kemasannya di episode berikutnya, tulis nama produknya di komentar.',
    carouselOutline:
      'Slide 1: Foto Before vs After kemasan | Slide 2: Kesalahan Hierarki Visual | Slide 3: Kesalahan Profil Warna Cetak | Slide 4: Checklist Kemasan Siap Ritel | Slide 5: CTA Konsultasi @obeecreatives',
    seoCaption:
      'Desain kemasan bukan soal ramai warna, tapi seberapa cepat pembeli mengerti nilai produkmu dalam 3 detik di rak toko. Simpan checklist ini sebelum naik cetak.',
    hashtags: '#desainkemasan #rebrandingumkm #obeecreatives #brandingproduk #strategibrand',
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
    creatorMinutes: 35,
  },
  {
    title: 'Foto Katalog Sepatu Kelas Iklan Pakai Kertas Sobek Rp15rb',
    pillar: 'pilar-3',
    targetAccount: 'Collab @lalumahendra x @obeephotography',
    format: 'Collab Reels',
    stage: 'script',
    researchSource: 'Daur Ulang Showcase @obeephotography — Sepatu BR',
    audienceTier: 'lapis-1',
    viralTrigger: 'Saves',
    researchInsight:
      'Audiens kreator dan UMKM sering mengira visual komersial mahal butuh CGI atau studio raksasa, padahal art direction dan kontrol arah cahaya jauh lebih menentukan.',
    hook3s:
      'Cara bikin foto katalog sepatu terlihat seperti kampanye iklan mahal cuma pakai properti kertas sobek Rp15 ribuan—bukan CGI.',
    body30s:
      'Tampilkan foto final Sepatu BR dari @obeephotography di 2 detik awal. Tarik ke belakang: tunjukkan 2 layer kertas warna kontras (hijau sage & kuning) yang disobek manual untuk menciptakan depth, lalu 1 key light bersudut 45 derajat untuk mempertegas tekstur sol.',
    cta15s:
      'Simpan referensi set ini buat sesi foto berikutnya, atau cek hasil lengkapnya di @obeephotography.',
    carouselOutline:
      'Slide 1: Hasil Foto Final Sepatu BR | Slide 2: BTS Susunan Kertas Sobek | Slide 3: Posisi Lampu & Diffuser | Slide 4: Hasil Crop Detail | Slide 5: CTA Booking Foto @obeephotography',
    seoCaption:
      'Art direction mengalahkan mahalnya properti. Begini cara tim kami membangun depth pada foto produk sepatu dengan budget kertas warna.',
    hashtags: '#fotoproduk #obeephotography #artdirection #studiophotography #tipsfotoproduk',
    driveAssetUrl: '',
    scheduledDate: '',
    publishedUrl: '',
    igPublishStatus: 'manual',
    tiktokPublishStatus: 'manual',
    sourcePortfolioRef: 'Sepatu BR (Paper-Craft Tear)',
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
  },
  {
    title: 'Berhenti Jual "Desain Bagus": Apa yang Sebenarnya Dibeli Klien?',
    pillar: 'pilar-2',
    targetAccount: '@lalumahendra',
    format: 'Reels',
    stage: 'research',
    researchSource: 'Evaluasi Brief Klien Agensi & Mentoring Talenta MJC',
    audienceTier: 'lapis-3',
    viralTrigger: 'Discussion',
    researchInsight:
      'Desainer dan videografer muda sering gagal menjual jasa di harga layak karena hanya mempresentasikan estetika, bukan solusi bisnis klien.',
    hook3s:
      'Berhenti menjual "desain bagus". Klien sebenarnya tidak peduli dengan estetika kamu jika 1 hal ini tidak terjawab.',
    body30s:
      'Selama mendampingi puluhan brand di @obeecreatives dan talenta di MJC, masalah terbesar bukan skill software, tapi ketidakmampuan menerjemahkan tujuan jualan klien menjadi keputusan visual. Klien besar membayar kejelasan positioning dan pengurangan risiko.',
    cta15s:
      'Setuju atau punya pengalaman lain saat pitching klien? Tulis pandangan kamu di komentar.',
    carouselOutline:
      'Slide 1: Mitos Desain Bagus | Slide 2: Apa yang Dilihat Klien B2B | Slide 3: 3 Pertanyaan Brief Bisnis | Slide 4: Cara Presentasi Nilai | Slide 5: Ringkasan',
    seoCaption:
      'Perbedaan karya Rp100 ribu dan proyek agensi puluhan juta ada pada riset masalah sebelum menyentuh software.',
    hashtags: '#industrikreatif #agensikreatif #creativebusiness #brandingindonesia #lalumahendra',
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
    creatorMinutes: 25,
  },
  {
    title: 'Trik Rim Light Produk Hitam di Background Gelap (DS-70 Monitor)',
    pillar: 'pilar-3',
    targetAccount: 'Collab @lalumahendra x @obeephotography',
    format: 'Collab Reels',
    stage: 'research',
    researchSource: 'Daur Ulang Showcase @obeephotography — DS-70 Studio Monitor',
    audienceTier: 'lapis-1',
    viralTrigger: 'Saves',
    researchInsight:
      'Kesalahan klasik memotret produk hitam adalah siluet tenggelam ke background gelap sehingga produk terlihat murah dan kehilangan bentuk.',
    hook3s:
      'Kenapa memotret produk serba hitam di background gelap sering gagal total—dan trik rim light yang kami pakai di studio.',
    body30s:
      'Tunjukkan foto headphone DS-70 Studio Monitor. Jelaskan penempatan dua strip light dari belakang samping (45 derajat belakang) untuk menggambar garis tepi kulit dan logam, ditambah radial spot lembut tepat di belakang subjek untuk menciptakan separasi dimensi.',
    cta15s:
      'Kirim video ini ke teman videografer/fotografer kamu yang masih sering bingung motret produk gelap.',
    carouselOutline:
      'Slide 1: Final Shot DS-70 | Slide 2: Diagram Rim Light 2 Sisi | Slide 3: Radial Background Separation | Slide 4: Detail Tekstur Kulit',
    seoCaption:
      'Kunci foto dark moody bukan mematikan lampu, tapi mengarahkan cahaya tepi tepat di kontur material produk.',
    hashtags: '#lightingproduk #fotokatalog #obeephotography #studioindonesia #creativecraft',
    driveAssetUrl: '',
    scheduledDate: '',
    publishedUrl: '',
    igPublishStatus: 'manual',
    tiktokPublishStatus: 'manual',
    sourcePortfolioRef: 'DS-70 Studio Monitor',
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
  },
  {
    title: 'Koreksi Langsung Presentasi Karya Anak Kreatif di Ruang Mentoring',
    pillar: 'pilar-4',
    targetAccount: '@lalumahendra',
    format: 'Reels',
    stage: 'research',
    researchSource: 'Sesi Mentoring Kelas / Workshop Kewirausahaan Kampus & MJC',
    audienceTier: 'lapis-3',
    viralTrigger: 'Watch Time',
    researchInsight:
      'Rekaman otentik saat membimbing langsung di ruangan membangun bukti sosial tak terbantahkan bagi penyelenggara acara dan calon klien.',
    hook3s:
      'Momen saat saya harus menghentikan presentasi karya talenta kreatif di kelas—karena kesalahan ini yang sering bikin klien kabur.',
    body30s:
      'Cuplikan mic-up saat memberi umpan balik: jangan buka presentasi dengan "ini warna favorit saya", buka dengan masalah audiens yang diselesaikan oleh visual tersebut.',
    cta15s:
      'Bagian mana dari presentasi karya yang paling sering bikin kamu gugup di depan klien? Tulis di bawah.',
    carouselOutline: '',
    seoCaption:
      'Skill teknis membawa kamu ke meja kerja; kemampuan mempresentasikan alasan strategis di balik karya yang membuat klien menandatangani kontrak.',
    hashtags: '#mentoringkreatif #millenialjobcenter #publicspeakingkreatif #lalumahendra #edukasikreatif',
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
    creatorMinutes: 20,
  },
];

const INITIAL_BLUEPRINT_ITEMS: ContentItemSeed[] = [
  ...BASE_BLUEPRINT_ITEMS,
  ...BLUEPRINT_BATCH_10,
];

const INITIAL_PORTFOLIO_ASSETS: Array<
  Omit<PortfolioAsset, 'id' | 'ownerId' | 'sharedEmails' | 'lastEditedBy' | 'createdAt' | 'updatedAt'>
> = [
  {
    title: 'Sepatu BR (Paper-Craft Tear)',
    sourceAccount: '@obeephotography',
    category: 'Fashion & Footwear',
    imagePath: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_13.14.22_f91d7ff9.jpeg',
    craftAngle: 'Art direction budget kertas sobek Rp15rb untuk membangun depth komersial tanpa CGI.',
    recycledToReels: false,
    linkedContentId: '',
  },
  {
    title: 'DS-70 Studio Monitor',
    sourceAccount: '@obeephotography',
    category: 'Audio & Tech',
    imagePath: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_13.14.22_f91d7ff9.jpeg',
    craftAngle: 'Teknik rim light + radial spotlight untuk memisahkan produk hitam di background gelap.',
    recycledToReels: false,
    linkedContentId: '',
  },
  {
    title: 'Pansela & DRW Skincare',
    sourceAccount: '@obeephotography',
    category: 'Beauty & Skincare',
    imagePath: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_13.14.22_f91d7ff9.jpeg',
    craftAngle: 'Kontrol refleksi botol plastik/kaca agar label merek terbaca 100% tanpa hotspot cahaya.',
    recycledToReels: false,
    linkedContentId: '',
  },
  {
    title: 'POCO Yellow Color-Block',
    sourceAccount: '@obeephotography',
    category: 'Gadget & Commercial',
    imagePath: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_13.14.22_f91d7ff9.jpeg',
    craftAngle: 'Strategi color-blocking monokrom kuning untuk menangkap scroll di feed marketplace.',
    recycledToReels: false,
    linkedContentId: '',
  },
  {
    title: 'Ardent Watch Rose Gold',
    sourceAccount: '@obeephotography',
    category: 'Luxury Accessories',
    imagePath: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_13.14.22_f91d7ff9.jpeg',
    craftAngle: 'Pelajaran safe-zone crop grid 3:4 & kontrol specular highlight pada logam rose gold.',
    recycledToReels: false,
    linkedContentId: '',
  },
  {
    title: 'Garvinoes Wooden Watch',
    sourceAccount: '@obeephotography',
    category: 'Craft & Local Brand',
    imagePath: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_13.14.22_f91d7ff9.jpeg',
    craftAngle: 'Warm tone lighting untuk menonjolkan serat kayu alami & kemasan bambu brand lokal.',
    recycledToReels: false,
    linkedContentId: '',
  },
];

export function normalizeEmailList(emails: string[] | undefined): string[] {
  if (!Array.isArray(emails)) return [];
  const cleaned = emails
    .map((e) => clampStr(e, 120).toLowerCase())
    .filter((e) => e.includes('@') && e.length >= 3);
  return Array.from(new Set(cleaned)).slice(0, 5);
}

export function normalizeActorLabel(user: User): string {
  return clampStr(user.displayName || user.email || 'Creator', 120);
}

function sanitizeContentPayload(
  workspaceOwnerId: string,
  sharedEmails: string[],
  lastEditedBy: string,
  input: Omit<ContentItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
) {
  return {
    ownerId: workspaceOwnerId,
    sharedEmails: normalizeEmailList(sharedEmails),
    lastEditedBy: clampStr(lastEditedBy, 120),
    title: clampStr(input.title, 160) || 'Konten Tanpa Judul',
    pillar: input.pillar,
    targetAccount: input.targetAccount,
    format: input.format,
    stage: input.stage,
    researchSource: clampStr(input.researchSource, 240),
    audienceTier: input.audienceTier,
    viralTrigger: input.viralTrigger,
    researchInsight: clampStr(input.researchInsight, 1000),
    hook3s: clampStr(input.hook3s, 400),
    body30s: clampStr(input.body30s, 3000),
    cta15s: clampStr(input.cta15s, 600),
    carouselOutline: clampStr(input.carouselOutline, 2500),
    seoCaption: clampStr(input.seoCaption, 2200),
    hashtags: clampStr(input.hashtags, 200),
    driveAssetUrl: clampStr(input.driveAssetUrl, 500),
    scheduledDate: clampStr(input.scheduledDate, 30),
    publishedUrl: clampStr(input.publishedUrl, 500),
    igPublishStatus: input.igPublishStatus,
    tiktokPublishStatus: input.tiktokPublishStatus,
    sourcePortfolioRef: clampStr(input.sourcePortfolioRef, 120),
    views: clampNum(input.views),
    reach: clampNum(input.reach),
    nonFollowerPct: clampNum(input.nonFollowerPct, 0, 100),
    holdRate3s: clampNum(input.holdRate3s, 0, 100),
    avgWatchPct: clampNum(input.avgWatchPct, 0, 200),
    shares: clampNum(input.shares),
    saves: clampNum(input.saves),
    comments: clampNum(input.comments),
    profileVisits: clampNum(input.profileVisits),
    newFollows: clampNum(input.newFollows),
    inboundLeads: clampNum(input.inboundLeads),
    creatorMinutes: clampNum(input.creatorMinutes),
  };
}

async function backfillOwnerSharedFields(
  uid: string,
  sharedEmails: string[],
  actorLabel: string
) {
  const collections = ['contentItems', 'weeklySnapshots', 'portfolioAssets'] as const;
  for (const colName of collections) {
    const snap = await getDocs(query(collection(db, colName), where('ownerId', '==', uid)));
    const docsToFix = snap.docs.filter((d) => !Array.isArray(d.data().sharedEmails));
    if (docsToFix.length === 0) continue;

    for (let i = 0; i < docsToFix.length; i += 400) {
      const batch = writeBatch(db);
      docsToFix.slice(i, i + 400).forEach((d) => {
        batch.update(d.ref, {
          sharedEmails,
          lastEditedBy: clampStr(d.data().lastEditedBy || actorLabel, 120),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
    }
  }
}

export async function findAssignedWorkspacesForAssistant(
  email: string | null | undefined
): Promise<Workspace[]> {
  const emailLower = clampStr(email || '', 120).toLowerCase();
  if (!emailLower) return [];
  const path = 'workspaces';
  try {
    const q = query(
      collection(db, path),
      where('assistantEmails', 'array-contains', emailLower)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Workspace, 'id'>),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function ensureOwnWorkspaceAndProfile(
  user: User,
  shouldSeedStarterData: boolean
): Promise<{ profile: UserProfile; workspace: Workspace }> {
  const userPath = `users/${user.uid}`;
  const wsPath = `workspaces/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);
  const wsRef = doc(db, 'workspaces', user.uid);
  const actorLabel = normalizeActorLabel(user);
  const emailLower = clampStr(user.email || '', 120).toLowerCase() || `${user.uid}@creator.local`;

  try {
    const [userSnap, wsSnap] = await Promise.all([getDoc(userRef), getDoc(wsRef)]);

    let profile: UserProfile;
    let workspace: Workspace;

    if (!userSnap.exists()) {
      const batch = writeBatch(db);
      const profilePayload: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
        ownerId: user.uid,
        displayName: clampStr(user.displayName || 'Lalu Mahendra', 100),
        activePhase: 'phase-1',
        seededDefaultData: shouldSeedStarterData,
      };
      batch.set(userRef, {
        ...profilePayload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (!wsSnap.exists()) {
        const wsPayload: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'> = {
          ownerId: user.uid,
          ownerEmail: emailLower,
          ownerName: clampStr(user.displayName || 'Lalu Mahendra', 100),
          activePhase: 'phase-1',
          assistantEmails: [],
        };
        batch.set(wsRef, {
          ...wsPayload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        workspace = { id: user.uid, ...wsPayload };
      } else {
        workspace = { id: wsSnap.id, ...(wsSnap.data() as Omit<Workspace, 'id'>) };
      }

      if (shouldSeedStarterData) {
        INITIAL_BLUEPRINT_ITEMS.forEach((item) => {
          const newRef = doc(collection(db, 'contentItems'));
          batch.set(newRef, {
            ...sanitizeContentPayload(user.uid, [], actorLabel, item),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });

        INITIAL_PORTFOLIO_ASSETS.forEach((asset) => {
          const newRef = doc(collection(db, 'portfolioAssets'));
          batch.set(newRef, {
            ownerId: user.uid,
            sharedEmails: [],
            lastEditedBy: actorLabel,
            title: clampStr(asset.title, 120),
            sourceAccount: asset.sourceAccount,
            category: clampStr(asset.category, 60),
            imagePath: clampStr(asset.imagePath, 300),
            craftAngle: clampStr(asset.craftAngle, 500),
            recycledToReels: asset.recycledToReels,
            linkedContentId: clampStr(asset.linkedContentId, 128),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });
      }

      await batch.commit();
      profile = profilePayload;
      return { profile, workspace };
    }

    profile = userSnap.data() as UserProfile;

    if (!wsSnap.exists()) {
      const wsPayload: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'> = {
        ownerId: user.uid,
        ownerEmail: emailLower,
        ownerName: clampStr(profile.displayName || user.displayName || 'Lalu Mahendra', 100),
        activePhase: profile.activePhase || 'phase-1',
        assistantEmails: [],
      };
      await setDoc(wsRef, {
        ...wsPayload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      workspace = { id: user.uid, ...wsPayload };
    } else {
      workspace = { id: wsSnap.id, ...(wsSnap.data() as Omit<Workspace, 'id'>) };
    }

    if (shouldSeedStarterData && !profile.seededDefaultData) {
      const batch = writeBatch(db);
      INITIAL_BLUEPRINT_ITEMS.forEach((item) => {
        const newRef = doc(collection(db, 'contentItems'));
        batch.set(newRef, {
          ...sanitizeContentPayload(user.uid, workspace.assistantEmails, actorLabel, item),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      INITIAL_PORTFOLIO_ASSETS.forEach((asset) => {
        const newRef = doc(collection(db, 'portfolioAssets'));
        batch.set(newRef, {
          ownerId: user.uid,
          sharedEmails: normalizeEmailList(workspace.assistantEmails),
          lastEditedBy: actorLabel,
          title: clampStr(asset.title, 120),
          sourceAccount: asset.sourceAccount,
          category: clampStr(asset.category, 60),
          imagePath: clampStr(asset.imagePath, 300),
          craftAngle: clampStr(asset.craftAngle, 500),
          recycledToReels: asset.recycledToReels,
          linkedContentId: clampStr(asset.linkedContentId, 128),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      batch.update(userRef, {
        seededDefaultData: true,
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
      profile = { ...profile, seededDefaultData: true };
    }

    // Backfill legacy owner docs with sharedEmails if created prior to RBAC update
    await backfillOwnerSharedFields(user.uid, workspace.assistantEmails || [], actorLabel);

    return { profile, workspace };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${userPath} | ${wsPath}`);
  }
}

export async function updateUserActivePhase(uid: string, activePhase: StrategyPhase) {
  const path = `users/${uid}`;
  try {
    const batch = writeBatch(db);
    batch.update(doc(db, 'users', uid), {
      activePhase,
      updatedAt: serverTimestamp(),
    });
    batch.update(doc(db, 'workspaces', uid), {
      activePhase,
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeWorkspace(
  workspaceId: string,
  onData: (ws: Workspace | null) => void
): Unsubscribe {
  const path = `workspaces/${workspaceId}`;
  return onSnapshot(
    doc(db, 'workspaces', workspaceId),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      onData({ id: snap.id, ...(snap.data() as Omit<Workspace, 'id'>) });
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeWorkspaceMembers(
  workspaceId: string,
  onData: (members: WorkspaceMember[]) => void
): Unsubscribe {
  const path = `workspaces/${workspaceId}/members`;
  const q = query(collection(db, path), where('ownerId', '==', workspaceId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: WorkspaceMember[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<WorkspaceMember, 'id'>),
      }));
      list.sort((a, b) => a.email.localeCompare(b.email));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

async function syncSharedEmailsAcrossCollections(
  ownerUid: string,
  nextAssistantEmails: string[],
  actorLabel: string
) {
  const normalized = normalizeEmailList(nextAssistantEmails);
  const collections = ['contentItems', 'weeklySnapshots', 'portfolioAssets'] as const;

  for (const colName of collections) {
    const snap = await getDocs(query(collection(db, colName), where('ownerId', '==', ownerUid)));
    if (snap.empty) continue;
    for (let i = 0; i < snap.docs.length; i += 400) {
      const batch = writeBatch(db);
      snap.docs.slice(i, i + 400).forEach((d) => {
        batch.update(d.ref, {
          sharedEmails: normalized,
          lastEditedBy: clampStr(actorLabel, 120),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
    }
  }
}

export async function inviteAssistantToWorkspace(
  ownerUser: User,
  currentAssistantEmails: string[],
  rawEmail: string,
  displayName: string
): Promise<string[]> {
  const emailLower = clampStr(rawEmail, 120).toLowerCase();
  if (!emailLower || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
    throw new Error('Masukkan alamat email Google yang valid (contoh: asisten@gmail.com).');
  }
  if (emailLower === (ownerUser.email || '').toLowerCase()) {
    throw new Error('Email tersebut adalah akun Owner Anda sendiri.');
  }
  const existingNormalized = normalizeEmailList(currentAssistantEmails);
  if (existingNormalized.includes(emailLower)) {
    throw new Error('Email asisten tersebut sudah terdaftar di workspace ini.');
  }
  if (existingNormalized.length >= 5) {
    throw new Error('Batas maksimal adalah 5 asisten aktif per workspace.');
  }

  const nextEmails = [...existingNormalized, emailLower];
  const memberId = `asst_${emailLower.replace(/[^a-z0-9]/g, '_').slice(0, 90)}`;
  const path = `workspaces/${ownerUser.uid}/members/${memberId}`;
  const actorLabel = normalizeActorLabel(ownerUser);

  try {
    const batch = writeBatch(db);
    batch.set(doc(db, 'workspaces', ownerUser.uid, 'members', memberId), {
      workspaceId: ownerUser.uid,
      ownerId: ownerUser.uid,
      email: emailLower,
      displayName: clampStr(displayName || emailLower.split('@')[0], 100),
      role: 'assistant',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    batch.update(doc(db, 'workspaces', ownerUser.uid), {
      assistantEmails: nextEmails,
      updatedAt: serverTimestamp(),
    });
    await batch.commit();

    await syncSharedEmailsAcrossCollections(ownerUser.uid, nextEmails, actorLabel);
    return nextEmails;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeAssistantFromWorkspace(
  ownerUser: User,
  currentAssistantEmails: string[],
  memberId: string,
  emailToRemove: string
): Promise<string[]> {
  const emailLower = clampStr(emailToRemove, 120).toLowerCase();
  const nextEmails = normalizeEmailList(currentAssistantEmails).filter((e) => e !== emailLower);
  const path = `workspaces/${ownerUser.uid}/members/${memberId}`;
  const actorLabel = normalizeActorLabel(ownerUser);

  try {
    const batch = writeBatch(db);
    batch.delete(doc(db, 'workspaces', ownerUser.uid, 'members', memberId));
    batch.update(doc(db, 'workspaces', ownerUser.uid), {
      assistantEmails: nextEmails,
      updatedAt: serverTimestamp(),
    });
    await batch.commit();

    await syncSharedEmailsAcrossCollections(ownerUser.uid, nextEmails, actorLabel);
    return nextEmails;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeContentItems(
  workspaceOwnerId: string,
  role: WorkspaceRole,
  currentUserEmail: string,
  onData: (items: ContentItem[]) => void
): Unsubscribe {
  const path = 'contentItems';
  const emailLower = clampStr(currentUserEmail, 120).toLowerCase();
  const q =
    role === 'owner'
      ? query(collection(db, path), where('ownerId', '==', workspaceOwnerId))
      : query(collection(db, path), where('sharedEmails', 'array-contains', emailLower));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: ContentItem[] = snapshot.docs
        .map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ContentItem, 'id'>),
        }))
        .filter((item) => item.ownerId === workspaceOwnerId);
      list.sort((a, b) => {
        const tA = a.updatedAt?.toMillis?.() ?? 0;
        const tB = b.updatedAt?.toMillis?.() ?? 0;
        return tB - tA;
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeWeeklySnapshots(
  workspaceOwnerId: string,
  role: WorkspaceRole,
  currentUserEmail: string,
  onData: (snapshots: WeeklySnapshot[]) => void
): Unsubscribe {
  const path = 'weeklySnapshots';
  const emailLower = clampStr(currentUserEmail, 120).toLowerCase();
  const q =
    role === 'owner'
      ? query(collection(db, path), where('ownerId', '==', workspaceOwnerId))
      : query(collection(db, path), where('sharedEmails', 'array-contains', emailLower));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: WeeklySnapshot[] = snapshot.docs
        .map((d) => ({
          id: d.id,
          ...(d.data() as Omit<WeeklySnapshot, 'id'>),
        }))
        .filter((item) => item.ownerId === workspaceOwnerId);
      list.sort((a, b) => {
        const tA = a.createdAt?.toMillis?.() ?? 0;
        const tB = b.createdAt?.toMillis?.() ?? 0;
        return tB - tA;
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribePortfolioAssets(
  workspaceOwnerId: string,
  role: WorkspaceRole,
  currentUserEmail: string,
  onData: (assets: PortfolioAsset[]) => void
): Unsubscribe {
  const path = 'portfolioAssets';
  const emailLower = clampStr(currentUserEmail, 120).toLowerCase();
  const q =
    role === 'owner'
      ? query(collection(db, path), where('ownerId', '==', workspaceOwnerId))
      : query(collection(db, path), where('sharedEmails', 'array-contains', emailLower));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: PortfolioAsset[] = snapshot.docs
        .map((d) => ({
          id: d.id,
          ...(d.data() as Omit<PortfolioAsset, 'id'>),
        }))
        .filter((item) => item.ownerId === workspaceOwnerId);
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function createContentItem(
  workspaceOwnerId: string,
  sharedEmails: string[],
  actorLabel: string,
  input: Omit<ContentItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const path = 'contentItems';
  try {
    const ref = doc(collection(db, path));
    await setDoc(ref, {
      ...sanitizeContentPayload(workspaceOwnerId, sharedEmails, actorLabel, input),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

function normalizeTitleKey(title: string): string {
  return clampStr(title, 160).toLowerCase().replace(/\s+/g, ' ');
}

export function getMissingBlueprintBatch10(existingItems: ContentItem[]): ContentItemSeed[] {
  const existingTitles = new Set(existingItems.map((it) => normalizeTitleKey(it.title)));
  return BLUEPRINT_BATCH_10.filter((seed) => !existingTitles.has(normalizeTitleKey(seed.title)));
}

export async function importBlueprintBatch10(
  workspaceOwnerId: string,
  sharedEmails: string[],
  actorLabel: string,
  existingItems: ContentItem[]
): Promise<number> {
  const missing = getMissingBlueprintBatch10(existingItems);
  if (missing.length === 0) return 0;

  const path = 'contentItems';
  try {
    for (let i = 0; i < missing.length; i += 400) {
      const batch = writeBatch(db);
      missing.slice(i, i + 400).forEach((seed) => {
        const newRef = doc(collection(db, path));
        batch.set(newRef, {
          ...sanitizeContentPayload(workspaceOwnerId, sharedEmails, actorLabel, seed),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
    }
    return missing.length;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateContentItem(
  workspaceOwnerId: string,
  sharedEmails: string[],
  actorLabel: string,
  isOwner: boolean,
  itemId: string,
  input: Omit<ContentItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const path = `contentItems/${itemId}`;
  try {
    const payload = sanitizeContentPayload(workspaceOwnerId, sharedEmails, actorLabel, input);
    if (!isOwner) {
      const { sharedEmails: _omitShared, ownerId: _omitOwner, ...assistantFields } = payload;
      await updateDoc(doc(db, 'contentItems', itemId), {
        ...assistantFields,
        updatedAt: serverTimestamp(),
      });
      return;
    }

    await updateDoc(doc(db, 'contentItems', itemId), {
      ...payload,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateContentStage(
  itemId: string,
  stage: ContentItem['stage'],
  actorLabel: string
): Promise<void> {
  const path = `contentItems/${itemId}`;
  try {
    await updateDoc(doc(db, 'contentItems', itemId), {
      stage,
      lastEditedBy: clampStr(actorLabel, 120),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteContentItem(itemId: string): Promise<void> {
  const path = `contentItems/${itemId}`;
  try {
    await deleteDoc(doc(db, 'contentItems', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function createWeeklySnapshot(
  workspaceOwnerId: string,
  sharedEmails: string[],
  actorLabel: string,
  input: Omit<WeeklySnapshot, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const path = 'weeklySnapshots';
  try {
    const ref = doc(collection(db, path));
    await setDoc(ref, {
      ownerId: workspaceOwnerId,
      sharedEmails: normalizeEmailList(sharedEmails),
      lastEditedBy: clampStr(actorLabel, 120),
      weekLabel: clampStr(input.weekLabel, 60) || 'Minggu Baru',
      phase: input.phase,
      startDate: clampStr(input.startDate, 20),
      endDate: clampStr(input.endDate, 20),
      publishedCount: clampNum(input.publishedCount),
      totalViews: clampNum(input.totalViews),
      totalReach: clampNum(input.totalReach),
      avgNonFollowerPct: clampNum(input.avgNonFollowerPct, 0, 100),
      avgHoldRate3s: clampNum(input.avgHoldRate3s, 0, 100),
      avgWatchPct: clampNum(input.avgWatchPct, 0, 200),
      totalShares: clampNum(input.totalShares),
      totalSaves: clampNum(input.totalSaves),
      qualityCommentPct: clampNum(input.qualityCommentPct, 0, 100),
      profileVisits: clampNum(input.profileVisits),
      newFollows: clampNum(input.newFollows),
      inboundLeads: clampNum(input.inboundLeads),
      ctaKeywordComments: clampNum(input.ctaKeywordComments),
      creatorHours: clampNum(input.creatorHours),
      notes: clampStr(input.notes, 1000),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteWeeklySnapshot(snapshotId: string): Promise<void> {
  const path = `weeklySnapshots/${snapshotId}`;
  try {
    await deleteDoc(doc(db, 'weeklySnapshots', snapshotId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function createPortfolioAsset(
  workspaceOwnerId: string,
  sharedEmails: string[],
  actorLabel: string,
  input: Omit<PortfolioAsset, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const path = 'portfolioAssets';
  try {
    const ref = doc(collection(db, path));
    await setDoc(ref, {
      ownerId: workspaceOwnerId,
      sharedEmails: normalizeEmailList(sharedEmails),
      lastEditedBy: clampStr(actorLabel, 120),
      title: clampStr(input.title, 120) || 'Karya Baru',
      sourceAccount: input.sourceAccount,
      category: clampStr(input.category, 60),
      imagePath: clampStr(input.imagePath, 300),
      craftAngle: clampStr(input.craftAngle, 500),
      recycledToReels: input.recycledToReels,
      linkedContentId: clampStr(input.linkedContentId, 128),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function markPortfolioAssetRecycled(
  assetId: string,
  linkedContentId: string,
  actorLabel: string
): Promise<void> {
  const path = `portfolioAssets/${assetId}`;
  try {
    await updateDoc(doc(db, 'portfolioAssets', assetId), {
      recycledToReels: true,
      linkedContentId: clampStr(linkedContentId, 128),
      lastEditedBy: clampStr(actorLabel, 120),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
