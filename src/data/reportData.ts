export interface MatrixRow {
  strength: string;
  gap: string;
}

export interface ReframeRow {
  oldTopic: string;
  newAngle: string;
  impact: string;
}

export interface IdeaItem {
  id: string;
  pillarId: 'pilar-1' | 'pilar-2' | 'pilar-3' | 'pilar-4';
  pillarName: string;
  format: string;
  hook: string;
  visualDirection: string;
  trigger: string;
}

export interface ScheduleRow {
  day: string;
  account: string;
  format: string;
  pillar: string;
  goal: string;
}

export interface ScorecardRow {
  metric: string;
  formula: string;
  target: string;
  trigger: string;
}

export const REPORT_META = {
  title: 'Laporan Riset Profil, Riset Konten & Blueprint Pertumbuhan Organik',
  subtitle:
    'Strategi Otoritas Kredibel, Eskalasi Views Organik, dan Sinergi 3 Akun untuk Ekosistem Lalu Mahendra, Obee Creatives & Obee Photography',
  subject: 'Lalu Mahendra Ali Akbar (@lalumahendra)',
  agency: 'Obee Creatives Group (@obeecreatives · @obeephotography · www.obeecreatives.com)',
  baseLocation: 'Malang Raya & Batu, Jawa Timur (Skalabilitas Nasional)',
  date: 'November 2026 (Edisi Revisi Ekosistem 3 Akun)',
  cycle: '90 Hari · 3 Fase Eksekusi & Evaluasi Mingguan',
};

export const VERIFIED_PROFILE_FACTS = [
  {
    label: 'Praktisi & Founder Agensi',
    detail:
      'Pendiri Obee Creatives Group (Malang & Batu), agensi layanan kreatif terpadu yang mencakup desain grafis & kemasan siap cetak (print-ready packaging), fotografi dan videografi produk, company profile, manajemen konten, strategi branding, hingga pengembangan website.',
  },
  {
    label: 'Showcase Spesialis (@obeephotography)',
    detail:
      'Mengelola akun showcase fotografi produk komersial (@obeephotography, 76 postingan, 1.545 pengikut) yang menampilkan eksekusi studio lintas industri: jam tangan (Ardent Watch, Garvinoes), elektronik (POCO, DS-70 Studio Monitor), skincare (DRW, Pansela), hingga fashion & lifestyle.',
  },
  {
    label: 'Pengajar & Mentor Ekosistem',
    detail:
      'Aktif sebagai Mentor di Millenial Job Center (MJC) / EJSC di bawah Bakorwil III Malang (Pemprov Jawa Timur), serta narasumber pelatihan kewirausahaan dan konten kreatif bersama Kemenkop UKM (termasuk program Entrepreneur Hub di kampus seperti ITSK RS dr. Soepraoen).',
  },
  {
    label: 'Rekam Jejak Pendampingan & Multi-Craft',
    detail:
      'Terlibat langsung membina UMKM dan Kelompok Tani Hutan (KTH) dalam rebranding serta pengemasan komersial, melatih manajemen tim kreatif, sekaligus memiliki kepekaan teknis audio/musik digital yang memperkuat kualitas sound design konten video.',
  },
];

export const STRENGTH_GAP_MATRIX: MatrixRow[] = [
  {
    strength:
      'Real-World Proof & Portfolio Studio: Mendampingi UMKM/MJC secara langsung serta memiliki 76+ karya foto komersial nyata di @obeephotography.',
    gap: 'Jebakan Konten Operator & Katalog Pasif: Tips teknis level pemula atau unggahan foto tunggal tanpa Reels membuat jangkauan organik tertahan.',
  },
  {
    strength:
      'Dapur Produksi Hidup: Memiliki tim lintas disiplin di Obee Creatives (foto, video, desain, web) sebagai sumber studi kasus tak terbatas.',
    gap: 'Fragmentasi 3 Akun: Jika @lalumahendra, @obeecreatives, dan @obeephotography berjalan terpisah tanpa jembatan Collab, energi produksi terpecah.',
  },
  {
    strength:
      'DNA Pengajar: Terbiasa memetakan materi kompleks (manajemen tim, brief, branding) menjadi kerangka kerja yang mudah dipahami.',
    gap: 'Bingkai Lokal vs. Nasional: Isu UMKM dan kreatif lokal perlu dibingkai ke masalah bisnis universal agar algoritma mendorong jangkauan nasional.',
  },
];

export const TRIPLE_ACCOUNT_ARCHITECTURE = [
  {
    account: '@lalumahendra',
    role: 'Personal Brand · Mesin Trafik & Otoritas (Top-of-Funnel)',
    focus:
      'Wajah utama, opini tajam industri kreatif, bedah kasus kemasan/brand, dokumentasi live mentoring di kelas/MJC, dan teknik foto/video level Creative Director.',
    conversionRole:
      'Menarik non-follower secara masif dan mengalirkan trafik menuju kedua akun bisnis melalui tag & Instagram Collab.',
  },
  {
    account: '@obeecreatives',
    role: 'Agency Showcase · Konversi B2B Terpadu (Middle/Bottom-of-Funnel)',
    focus:
      'Portofolio kampanye lengkap (branding, packaging, company profile, web, video komersial), BTS tim studio, dan transformasi klien B2B/UMKM.',
    conversionRole:
      'Mengonversi kepercayaan dari akun personal menjadi proyek agensi terintegrasi.',
  },
  {
    account: '@obeephotography',
    role: 'Galeri Spesialis · Etalase Foto Produk Komersial (Proof & Niche Showcase)',
    focus:
      'Etalase khusus fotografi produk & iklan (Carousel 4-slide: hasil foto + BTS lampu + detail tekstur + brief solusi) tanpa harus memproduksi konten terpisah dari nol.',
    conversionRole:
      'Menjadi bukti spesialisasi visual ketika calon klien atau audiens ingin melihat kualitas foto studio Anda secara terfokus.',
  },
];

export const OBEEPHOTOGRAPHY_AUDIT = {
  snapshotStats: '76 Postingan · 1.545 Pengikut · 440 Mengikuti · Basis Jl. Batok 8, Kota Batu',
  strengths: [
    {
      title: 'Penguasaan Pencahayaan pada Material Sulit',
      detail:
        'Grid portofolio menunjukkan kendali specular highlight yang bersih pada kaca dan logam jam tangan (Ardent Watch, jam skeleton hitam-perak, frame POCO), kontrol refleksi botol skincare agar label terbaca tajam (Pansela, DRW Skincare, Night Cream), hingga detail tekstur kulit/busa headphone (DS-70 Studio Monitor) dan kayu (Garvinoes).',
    },
    {
      title: 'Variasi Art Direction Lintas Industri',
      detail:
        'Terbukti mampu mengeksekusi beragam gaya visual: creative paper-craft (sepatu BR dengan sobekan kertas hijau-kuning), bold color-blocking (POCO kuning monokrom), dark moody luxury, clean pastel beauty, hingga editorial lifestyle.',
    },
    {
      title: 'Korelasi Kuat dengan Multi-Disiplin Audio/Visual',
      detail:
        'Proyek produk audio seperti DS-70 Studio Monitor memperkuat narasi keunikan Anda yang memadukan estetika visual dengan kepekaan dunia audio.',
    },
  ],
  gaps: [
    {
      title: '0 Tab Reels & Dominasi Foto Tunggal Pasif',
      detail:
        'Seluruh 76 postingan bertumpu pada foto statis tanpa tab Reels aktif. Di algoritma modern, foto tunggal memiliki jangkauan non-follower paling rendah sehingga akun berhenti sebagai brosur pasif.',
    },
    {
      title: 'Cropping Grid 3:4 & Teks Kredit Mikro di Dalam Gambar',
      detail:
        'Pada materi Ardent Watch, teks desain di sisi kiri terpotong oleh rasio crop grid Instagram terbaru. Selain itu, teks kredit kecil di bagian bawah foto mengurangi kesan bersih komersial; kredit lebih elegan dipindah ke caption, tag kolaborator, atau slide penutup Carousel.',
    },
    {
      title: 'Bio Bersifat Deskriptif & Highlight Minim Bukti Proses',
      detail:
        'Bio saat ini baru menjelaskan "apa akun ini" (Photo Catalogue || Advertising), belum menembak nilai jual bisnis untuk klien. Highlight baru mencakup Products, F & B, dan studioac..., belum memuat Before-After serta panduan konsultasi/order.',
    },
  ],
  integrationSteps: [
    'Daur ulang 6–8 foto terbaik dari grid @obeephotography (sepatu BR, DS-70, POCO, Pansela/DRW) menjadi Reels bedah teknik & komersial di @lalumahendra tanpa syuting produk ulang.',
    'Hentikan unggah foto tunggal di @obeephotography; ubah menjadi Carousel 4 Slide (Slide 1: Hasil Jadi dengan safe-zone 4:5 bersih, Slide 2: BTS posisi lampu di studio, Slide 3: Zoom detail tekstur/label, Slide 4: Brief & CTA).',
    'Aktifkan tab Reels @obeephotography secara otomatis melalui fitur Instagram Collab setiap hari Rabu saat @lalumahendra mengunggah bedah teknik fotografi produk.',
    'Tambahkan 3 Pinned Posts di @obeephotography: (1) Reels Collab BTS foto terbaik, (2) Carousel Before-After foto HP vs hasil studio, (3) Kompilasi karya lintas industri.',
  ],
  upgradedBio: [
    'Commercial Product Photography · Jawa Timur & Nasional',
    'Bikin Produk Lokal Tampil Berkelas Ritel & Siap Iklan',
    'Part of @obeecreatives · Shot by @lalumahendra',
    'Jl. Batok 8, Kota Batu · Konsultasi Katalog: obeecreatives.com/',
  ],
};

export const ALGORITHM_SIGNALS = [
  {
    signal: '01. Watch Time, Completion Rate & Loop',
    weight: 'Bobot Tertinggi',
    insight:
      'Total waktu tonton dan persentase penonton yang menyelesaikan video hingga frame akhir menjadi penentu utama rekomendasi Reels dan TikTok. Video 20–45 detik yang padat atau berstruktur loop (akhir menyambung mulus ke awal) memicu pemutaran ulang otomatis.',
  },
  {
    signal: '02. Sends Per Reach (DM Shares)',
    weight: 'Pendorong Non-Follower #1',
    insight:
      'Pengiriman konten melalui DM ke rekan kerja, pemilik bisnis, atau grup tim adalah sinyal intensi tertinggi. Konten edukasi dan opini harus dirancang agar penonton merasa perlu membagikannya sebagai referensi atau bahan diskusi.',
  },
  {
    signal: '03. Early Skip Rate (1–3 Detik Pertama)',
    weight: 'Rem Distribusi',
    insight:
      'Platform membaca seberapa cepat pengguna menggulir melewati 3 detik pembuka. Pembukaan lambat seperti sapaan basa-basi langsung menghentikan distribusi ke audiens baru.',
  },
  {
    signal: '04. Interest Graph, Kata Kunci & Orisinalitas',
    weight: 'Kategorisasi Niche',
    insight:
      'Instagram membatasi efektivitas tagar berlebihan (maksimal 5 tagar niche sudah optimal) dan memprioritaskan kata kunci pada teks layar, transkrip suara, serta caption. Video dengan watermark aplikasi lain ditekan jangkauannya.',
  },
];

export const TECHNICAL_REFRAME_ROWS: ReframeRow[] = [
  {
    oldTopic: '3 Tips Lighting Foto Produk',
    newAngle:
      'Kenapa produk bagus ini terlihat "murahan" di foto—dan bagaimana menggeser 1 sumber cahaya bikin nilainya terasa naik 3x lipat.',
    impact: 'Mengubah topik operator menjadi wawasan psikologi nilai jual bagi UMKM & brand owner.',
  },
  {
    oldTopic: 'Cara Pakai Gimbal Biar Halus',
    newAngle:
      'Kapan tim kami sengaja MELARANG videografer pakai gimbal saat syuting iklan—karena gerakan kamera menentukan emosi pembeli.',
    impact: 'Memposisikan Anda sebagai Creative Director yang mengerti dampak komersial, bukan sekadar operator alat.',
  },
  {
    oldTopic: 'Gear Wajib untuk Foto Produk',
    newAngle:
      'Breakdown setup 1 lampu Rp500rb yang kami pakai di proyek klien @obeephotography: karena klien membayar hasil visualnya, bukan mahalnya gear-mu.',
    impact: 'Relatable untuk kreator muda sekaligus mengarahkan trafik portofolio ke akun fotografi Anda.',
  },
  {
    oldTopic: 'Tutorial Color Grading Cinematic',
    newAngle:
      'Kesalahan fatal pemilihan tone warna iklan yang bikin audiens langsung skip dalam 2 detik pertama.',
    impact: 'Mengaitkan teknik warna dengan metrik performa marketing dan retensi audiens.',
  },
];

export const AUDIENCE_TIERS = [
  {
    tier: 'Lapis 1 · Volume Views & Komunitas',
    profile: 'Kreator muda, fotografer, videografer, desainer grafis, dan mahasiswa industri kreatif.',
    need: 'Standar kerja profesional agensi, panduan portofolio, dan teknik terapan yang relevan dengan kebutuhan klien nyata.',
  },
  {
    tier: 'Lapis 2 · Mesin Share & Prospek Agensi',
    profile: 'Pemilik UMKM naik kelas, pelaku F&B/skincare/fashion lokal, dan pengelola usaha daerah.',
    need: 'Solusi konkret mengapa produk mereka kalah menarik di pasar dan bagaimana visual, foto katalog, kemasan, serta web mempercepat penjualan.',
  },
  {
    tier: 'Lapis 3 · Otoritas Tinggi & Monetisasi Premium',
    profile: 'Penyelenggara seminar (kampus/instansi/EO), brand manager, dan pengambil keputusan korporat.',
    need: 'Keyakinan bahwa Anda adalah praktisi berpengalaman sekaligus komunikator yang layak diundang sebagai narasumber atau mitra strategis.',
  },
];

export const CONTENT_PILLARS = [
  {
    id: 'pilar-1',
    name: 'Pilar 1 · Bedah Kasus & Transformasi Nyata',
    share: '25%',
    role: 'Mesin Views & Shares',
    description:
      'Membedah kemasan produk UMKM, identitas brand, foto katalog, atau website yang lemah secara komersial, lalu memperlihatkan proses perbaikannya secara visual (Before–After).',
  },
  {
    id: 'pilar-2',
    name: 'Pilar 2 · Realitas Agensi & Opini Kontrarian',
    share: '20%',
    role: 'Mesin Komentar & Otoritas Bisnis',
    description:
      'Sudut pandang jujur seorang Founder & Mentor mengenai mitos industri kreatif: manajemen klien, struktur harga jasa, mentalitas talenta kreatif, dan peran strategi di atas estetika.',
  },
  {
    id: 'pilar-3',
    name: 'Pilar 3 · Applied Technical Craft (Elevated)',
    share: '30%',
    role: 'Mesin Saves & Bukti Keahlian (@obeephotography)',
    description:
      'Pembahasan teknik fotografi, videografi, lighting, dan sound design yang 100% terikat pada dampak komersial dan proyek nyata—banyak memanfaatkan aset showcase @obeephotography.',
  },
  {
    id: 'pilar-4',
    name: 'Pilar 4 · Live Mentoring, Studio & Collab Showcase',
    share: '25%',
    role: 'Social Proof (15%) & Konversi Collab (10%)',
    description:
      'Rekaman otentik saat Anda mengajar di kelas/MJC/workshop, mengarahkan tim di studio Obee Creatives, serta unggahan kolaborasi hasil akhir proyek dengan @obeecreatives.',
  },
];

export const IDEA_BANK: IdeaItem[] = [
  {
    id: '1-1',
    pillarId: 'pilar-1',
    pillarName: 'Bedah Kasus & Transformasi',
    format: 'Reels 35–45 dtk + Carousel',
    hook: 'Produk seenak ini gagal tembus ritel modern cuma gara-gara 3 kesalahan di kemasannya. Ini cara kami rombak di studio.',
    visualDirection: 'Pegang kemasan awal di 3 detik pertama, tunjukkan titik mati hierarki teks, lalu transisi cepat ke mockup/hasil cetak baru.',
    trigger: 'Before–After Dopamine & Relevansi Jutaan UMKM',
  },
  {
    id: '1-2',
    pillarId: 'pilar-1',
    pillarName: 'Bedah Kasus & Transformasi',
    format: 'Reels Screen-Record 40 dtk',
    hook: 'Kenapa calon klien besar ragu bayar mahal kalau company profile dan website bisnis Anda masih tampil seperti ini.',
    visualDirection: 'Rekam layar audit visual website/PDF profil, tandai bagian yang membingungkan pembeli, lalu bandingkan dengan struktur baru.',
    trigger: 'Pain Point Pemilik Usaha & Solusi Web/Compro',
  },
  {
    id: '1-3',
    pillarId: 'pilar-1',
    pillarName: 'Bedah Kasus & Transformasi',
    format: 'Reels Collab 30 dtk (@obeephotography)',
    hook: 'Dari foto modal HP di meja makan menjadi visual katalog siap iklan—tanpa mengganti produknya sama sekali.',
    visualDirection: 'Split-screen foto mentah vs proses set studio Obee Photography vs hasil akhir di feed e-commerce.',
    trigger: 'Bukti Langsung Dampak Jasa Fotografi Komersial',
  },
  {
    id: '2-1',
    pillarId: 'pilar-2',
    pillarName: 'Realitas Agensi & Opini',
    format: 'Talking Head + B-Roll Studio',
    hook: 'Berhenti menjual "desain bagus". Klien sebenarnya tidak peduli dengan estetika kamu jika 1 hal ini tidak terjawab.',
    visualDirection: 'Tatap lensa langsung dengan framing medium-close, diselingi B-roll rapat brief bersama tim atau klien.',
    trigger: 'Mematahkan Mitos Umum & Memicu Diskusi Komentar',
  },
  {
    id: '2-2',
    pillarId: 'pilar-2',
    pillarName: 'Realitas Agensi & Opini',
    format: 'Reels 40 dtk',
    hook: 'Kenapa banyak anak kreatif jago teknis kamera dan desain, tapi tetap gagal bertahan saat masuk ke tim agensi.',
    visualDirection: 'Buka dengan suasana ruang kerja kreatif, bahas 3 jurang antara skill teknis vs komunikasi brief & deadline.',
    trigger: 'Otoritas Pengajar MJC & Relatable bagi Pekerja Kreatif',
  },
  {
    id: '2-3',
    pillarId: 'pilar-2',
    pillarName: 'Realitas Agensi & Opini',
    format: 'Carousel 7 Slide / Reels',
    hook: 'Logo Rp100 ribu vs Rp30 juta: apa sebenarnya yang dibeli klien besar saat menyewa agensi kreatif?',
    visualDirection: 'Breakdown lapisan nilai: riset pasar, sistem identitas, panduan aplikasi kemasan, hingga konsistensi jangka panjang.',
    trigger: 'Edukasi Harga Jasa & Penyaring Klien Berkualitas',
  },
  {
    id: '3-1',
    pillarId: 'pilar-3',
    pillarName: 'Applied Technical Craft',
    format: 'Reels Collab (@obeephotography)',
    hook: 'Cara bikin foto katalog sepatu terlihat seperti kampanye iklan mahal cuma pakai properti kertas sobek Rp15 ribuan—bukan CGI.',
    visualDirection: 'Tampilkan hasil foto sepatu BR dari @obeephotography di 2 detik awal, lalu bedah susunan layer kertas dan arah cahaya studio.',
    trigger: 'Menghidupkan Portofolio Lama Jadi Konten Viral & Saves Tinggi',
  },
  {
    id: '3-2',
    pillarId: 'pilar-3',
    pillarName: 'Applied Technical Craft',
    format: 'Reels Collab (@obeephotography)',
    hook: 'Kenapa memotret produk serba hitam di background gelap sering berakhir gagal—dan trik rim light yang kami pakai di studio.',
    visualDirection: 'Gunakan hasil foto DS-70 Studio Monitor & jam tangan hitam dari @obeephotography untuk membedah pemisahan siluet dengan cahaya tepi.',
    trigger: 'Otoritas Teknis Fotografi Produk + Referensi Audio/Studio',
  },
  {
    id: '3-3',
    pillarId: 'pilar-3',
    pillarName: 'Applied Technical Craft',
    format: 'Reels Breakdown Skincare',
    hook: 'Kesalahan fatal foto produk skincare yang bikin mereknya hilang kena pantulan lampu—ini cara kami mengontrol refleksi botol.',
    visualDirection: 'Tampilkan foto Pansela/DRW Skincare dari @obeephotography, jelaskan sudut diffuser agar label produk tajam dan bersih.',
    trigger: 'Menarik Klien Industri Skincare/Beauty & Saves Tinggi',
  },
  {
    id: '3-4',
    pillarId: 'pilar-3',
    pillarName: 'Applied Technical Craft',
    format: 'Reels Demonstrasi 30 dtk',
    hook: 'Kapan tim kami sengaja MELARANG videografer pakai gimbal saat syuting komersial—karena gerakan kamera menentukan emosi pembeli.',
    visualDirection: 'Bandingkan footage gimbal yang terlalu steril vs handheld terukur untuk adegan produk yang butuh urgensi dan keintiman.',
    trigger: 'Otoritas Director + Mengubah Cara Pandang Teknis',
  },
  {
    id: '3-5',
    pillarId: 'pilar-3',
    pillarName: 'Applied Technical Craft',
    format: 'Reels Studio Setup 35 dtk',
    hook: 'Setup 1 lampu Rp500rb yang kami pakai di proyek klien: karena klien membayar hasil visualnya, bukan mahalnya gear-mu.',
    visualDirection: 'Tunjukkan hasil foto final di detik 0–2, baru tarik kamera ke belakang memperlihatkan posisi 1 lampu + diffuser sederhana.',
    trigger: 'Saves Tinggi & Kredibilitas Teknis Tanpa Pamer Gear',
  },
  {
    id: '3-6',
    pillarId: 'pilar-3',
    pillarName: 'Applied Technical Craft',
    format: 'Reels Audio-Visual Breakdown',
    hook: '50% rasa "mahal" dari video iklan komersial bukan berasal dari kameranya, tapi dari 3 layer sound design ini.',
    visualDirection: 'Putar video iklan tanpa audio (terasa hambar) di 3 detik pertama, lalu nyalakan layer ambience, foley, dan transisi satu per satu.',
    trigger: 'Memanfaatkan Keunggulan Unik Audio/Musik Anda',
  },
  {
    id: '4-1',
    pillarId: 'pilar-4',
    pillarName: 'Live Mentoring & Studio',
    format: 'Mic-Up Documentary 45 dtk',
    hook: 'Momen saat saya harus mengoreksi konsep presentasi karya anak kreatif di ruang mentoring—karena alasan ini sering bikin klien kabur.',
    visualDirection: 'Pasang clip-on mic saat mengajar di kelas/MJC/workshop, tampilkan interaksi tanya-jawab otentik dengan subtitle rapi.',
    trigger: 'Social Proof Tak Terbantahkan sebagai Pengajar',
  },
  {
    id: '4-2',
    pillarId: 'pilar-4',
    pillarName: 'Live Mentoring & Studio',
    format: 'Reels BTS 35 dtk',
    hook: '3 pertanyaan wajib di SOP agensi kami sebelum menyentuh software desain—ini yang memangkas revisi klien hingga 70%.',
    visualDirection: 'Rekam momen diskusi pra-produksi di Obee Creatives, tampilkan poin checklist brief di layar.',
    trigger: 'High-Save Operational Playbook untuk Agensi & Freelancer',
  },
  {
    id: '4-3',
    pillarId: 'pilar-4',
    pillarName: 'Live Mentoring & Studio',
    format: 'Reels Collab (@obeecreatives)',
    hook: 'Di balik layar proyek rebranding [Nama Brand]: bagaimana tim foto, kemasan, dan web kami menyatukan identitas dalam 14 hari.',
    visualDirection: 'Montase cepat dari sketsa, cetak proof kemasan, sesi foto, hingga tampilan live website.',
    trigger: 'Konversi Langsung ke Profil & Layanan Obee Creatives',
  },
];

export const WEEKLY_SCHEDULE: ScheduleRow[] = [
  {
    day: 'Senin',
    account: '@lalumahendra',
    format: 'Reels (Pilar 2 · Opini & Realitas)',
    pillar: 'Realitas Agensi & Opini Kontrarian',
    goal: 'Memancing diskusi awal pekan, comment velocity & DM shares.',
  },
  {
    day: 'Selasa',
    account: '@obeecreatives & @obeephotography',
    format: 'Carousel 4 Slide (Hasil + BTS + Detail + CTA)',
    pillar: 'Agency & Photography Deliverables',
    goal: 'Menunjukkan standar eksekusi profesional tanpa upload foto tunggal pasif.',
  },
  {
    day: 'Rabu',
    account: '@lalumahendra × @obeephotography',
    format: 'Reels Collab (Pilar 3 · Bedah Karya Foto)',
    pillar: 'Applied Technical Craft (Daur Ulang Showcase)',
    goal: 'Menghidupkan tab Reels @obeephotography & mengejar rasio Saves tinggi.',
  },
  {
    day: 'Kamis',
    account: '@lalumahendra',
    format: 'Carousel Mendalam (6–8 Slide)',
    pillar: 'Framework Pengajar & Sistem Kreatif',
    goal: 'Menarik trafik Explore & membangun posisi edukator.',
  },
  {
    day: 'Jumat',
    account: '@lalumahendra × @obeecreatives',
    format: 'Reels Collab (Pilar 1 · Transformasi)',
    pillar: 'Bedah Kasus & Transformasi Nyata',
    goal: 'Puncak viralitas (Before–After) & mengalirkan trafik ke akun agensi.',
  },
  {
    day: 'Sabtu / Minggu',
    account: '@lalumahendra',
    format: 'Reels Dokumenter (Pilar 4 · Mentoring)',
    pillar: 'Live Mentoring & Ruang Studio',
    goal: 'Membangun social proof otentik dan kedekatan komunitas.',
  },
  {
    day: 'Harian',
    account: '@lalumahendra (Stories)',
    format: '3–5 Frame Raw BTS / Tips Cepat 15 dtk',
    pillar: 'Keseharian Praktisi & Pengajar',
    goal: 'Menyalurkan tips teknis spontan tanpa menurunkan posisi Feed.',
  },
];

export const BATCHING_STEPS = [
  {
    step: '01. Tangkap Bahan Pasif + Aset Lama (Harian · 5 Menit)',
    detail:
      'Catat 1 pertanyaan nyata dari klien UMKM/mahasiswa setiap hari, dan pilih 1 karya dari 76 foto di @obeephotography untuk dijadikan bahan bedah Reels minggu berjalan.',
  },
  {
    step: '02. Sesi Batching Mingguan (1x/Minggu · 2,5 Jam)',
    detail:
      'Rekam 3–4 video talking head atau bedah layar/foto dalam satu blok waktu dengan setup kamera dan lampu studio yang sudah siap pakai.',
  },
  {
    step: '03. Ekspansi 1-to-Many (1 Ide = 3–4 Aset Lintas Akun)',
    detail:
      '1 topik riset terbaik menjadi Reels utama (@lalumahendra), didistribusikan via Collab ke @obeephotography atau @obeecreatives, lalu intisarinya diolah menjadi Carousel dan Threads.',
  },
  {
    step: '04. Delegasi Eksekusi ke Tim Obee Creatives',
    detail:
      'Keterlibatan pribadi Anda cukup pada Hook, Isi Materi, dan Rekam Mentah (<= 30–45 menit/konten). Pemotongan jeda, B-roll proyek, teks layar, dan audio dikerjakan tim.',
  },
];

export const ROADMAP_PHASES = [
  {
    phase: 'Fase 1 · Minggu 1–4',
    title: 'Kalibrasi Sinyal, Pembenahan 3 Profil & Uji Format (The Signal Phase)',
    actions: [
      'Perbarui Bio @lalumahendra (Creative Director, Founder @obeecreatives & Educator) serta Bio @obeephotography (berorientasi solusi komersial brand lokal).',
      'Sematkan 3 Pinned Posts terbaik di @lalumahendra dan @obeephotography, serta hentikan teks kredit mikro di dalam foto baru (pindah ke caption/slide penutup).',
      'Unggah ritme dasar 3 Reels + 1 Carousel per minggu—termasuk mendaur ulang 4 karya terbaik @obeephotography menjadi Reels Collab.',
    ],
  },
  {
    phase: 'Fase 2 · Minggu 5–8',
    title: 'Serialisasi Konten & Eskalasi Viralitas (The Momentum Phase)',
    actions: [
      'Ubah format pemenang Fase 1 menjadi Serial Bernomor (misal: "Bedah Kemasan Lokal Eps. 01–04" atau "Bedah Foto Studio Eps. 01–04").',
      'Tingkatkan frekuensi menjadi 4 Reels/minggu dan gunakan fitur Reply Comment with Reels untuk komentar kritis dari audiens.',
      'Aktifkan Collab Post terstruktur: Rabu (@lalumahendra x @obeephotography) dan Jumat (@lalumahendra x @obeecreatives).',
    ],
  },
  {
    phase: 'Fase 3 · Minggu 9–12+',
    title: 'Konsolidasi Otoritas & Flywheel Konversi (The Authority Flywheel)',
    actions: [
      'Siapkan Lead Magnet bernilai tinggi (Checklist Kemasan Siap Ritel, Panduan Persiapan Foto Produk UMKM, atau Template Creative Brief Agensi) via kata kunci komentar.',
      'Arahkan prospek berkualitas ke kanal konsultasi jasa Obee Creatives / Obee Photography, undangan narasumber, atau program mentoring terstruktur.',
      'Standarkan template editing internal agar keterlibatan waktu pribadi Anda tetap di bawah 3 jam per minggu.',
    ],
  },
];

export const SCORECARD_PHASE_1: ScorecardRow[] = [
  {
    metric: '3-Second Retention / Hold Rate',
    formula: '% penonton yang tidak skip di 3 detik awal',
    target: '>= 65%',
    trigger:
      'Jika < 55%: Materi tidak bermasalah, tetapi Hook pembuka terlalu lambat. Ganti kalimat awal dengan hasil visual terbaik (seperti foto final studio) atau konflik langsung.',
  },
  {
    metric: 'Average Watch Time vs. Durasi',
    formula: 'Rata-rata durasi tonton / panjang video',
    target: '>= 75% (video 20–45 dtk)',
    trigger:
      'Jika < 50%: Ritme tengah terlalu datar. Pangkas jeda napas dan tambahkan pergantian B-roll/foto BTS setiap 3–4 detik.',
  },
  {
    metric: 'Non-Follower Reach Ratio',
    formula: '% jangkauan akun bukan pengikut',
    target: '>= 50%',
    trigger:
      'Jika < 30%: Topik terlalu internal atau sempit. Perluas pembingkaian masalah agar relevan untuk audiens kreatif & bisnis nasional.',
  },
];

export const SCORECARD_PHASE_2: ScorecardRow[] = [
  {
    metric: 'Sends Per Reach (DM Share Rate)',
    formula: '(Total Shares / Total Reach) x 1.000',
    target: '>= 10 – 15 / 1K reach',
    trigger:
      'Sinyal utama potensi viral. Jika rendah pada pilar opini/bedah kasus, artinya argumen masih terlalu aman dan perlu sudut pandang lebih tajam.',
  },
  {
    metric: 'Save Rate',
    formula: '(Total Saves / Total Reach) x 1.000',
    target: '>= 15 – 25 / 1K reach',
    trigger:
      'Tolok ukur nilai referensi pada pilar Applied Craft & Carousel @obeephotography. Jika rendah, tambahkan rangkuman langkah atau diagram pencahayaan di layar.',
  },
  {
    metric: 'Profile-to-Follow Conversion',
    formula: '(New Follows / Profile Visits) x 100%',
    target: '>= 6% – 10%',
    trigger:
      'Jika orang mampir ke profil tetapi tidak mem-follow (< 4%): Perbaiki kejelasan janji nilai di Bio dan 3 Pinned Posts pada masing-masing akun.',
  },
  {
    metric: 'Comment Quality Ratio',
    formula: '% komentar berisi diskusi/tanya (bukan emoji)',
    target: '>= 30% komentar',
    trigger:
      'Pilih komentar paling kritis atau paling sering muncul untuk dijadikan episode lanjutan menggunakan fitur Reply with Reels.',
  },
];

export const SCORECARD_PHASE_3: ScorecardRow[] = [
  {
    metric: 'Inbound Business & Speaking Leads',
    formula: 'Jumlah DM/WA masuk menanyakan jasa @obeecreatives, @obeephotography, atau narasumber',
    target: 'Naik min. +20% / bulan',
    trigger:
      'Lacak konten sumber leads (apakah dari bedah kemasan, bedah foto produk, atau mentoring). Gandakan porsi produksi pilar penyumbang leads tertinggi.',
  },
  {
    metric: 'Lead Magnet / CTA Conversion',
    formula: '(Komentar kata kunci / Total Views video CTA) x 100%',
    target: '>= 2% – 3%',
    trigger:
      'Jika di bawah target, pastikan aset gratis yang ditawarkan benar-benar menyelesaikan masalah paling mendesak pada video tersebut.',
  },
  {
    metric: 'Creator Time Efficiency',
    formula: 'Total jam kerja pribadi Anda / jumlah konten tayang',
    target: '<= 30 – 45 mnt / konten',
    trigger:
      'Jika > 1 jam per konten: Sistem delegasi ke tim masih tersendat. Kunci preset editing dan SOP serah-terima file mentah.',
  },
];
