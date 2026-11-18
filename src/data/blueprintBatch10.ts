import type { ContentItem } from '../types/creator';

export type ContentItemSeed = Omit<
  ContentItem,
  'id' | 'ownerId' | 'sharedEmails' | 'lastEditedBy' | 'createdAt' | 'updatedAt'
>;

export const BLUEPRINT_BATCH_10: ContentItemSeed[] = [
  // =========================================================================
  // PILAR 3 · APPLIED TECHNICAL CRAFT (30% -> 3 IDE · TEMA LENSA KAMERA)
  // =========================================================================
  {
    title: '1 Produk, 5 Lensa Berbeda (16mm–135mm): Mana yang Bikin Produk Terlihat Mewah?',
    pillar: 'pilar-3',
    targetAccount: 'Collab @lalumahendra x @obeephotography',
    format: 'Collab Reels',
    stage: 'batching',
    researchSource:
      'Riset Topik Lensa Komersial: Focal Length Distortion Test pada Foto & Video Produk',
    audienceTier: 'lapis-1',
    viralTrigger: 'Saves',
    researchInsight:
      'Topik perbandingan focal length pada objek yang sama dengan ukuran framing identik konsisten mencetak Watch Time & Saves tertinggi karena perbedaan proporsi visual langsung terlihat mata awam dalam 2 detik pertama—dan langsung menjelaskan mengapa foto produk UMKM dengan kamera wide HP terlihat kurang premium dibanding hasil studio.',
    hook3s:
      'Satu botol skincare yang sama, satu lampu yang sama—tapi kenapa di lensa 16mm terlihat seperti produk murah, sedangkan di 85mm langsung berkelas iklan?',
    body30s:
      '[0–3 dtk] Split-screen cepat botol serum difoto pakai 16mm vs 85mm di ukuran frame yang sama.\n[3–12 dtk] Uji berurutan 16mm → 35mm → 50mm → 85mm → 135mm (posisi kamera mundur menjaga ukuran produk tetap sama di frame).\n[12–24 dtk] Jelaskan dampaknya: di 16mm–24mm (termasuk kamera utama HP), perspektif melebarkan bagian yang dekat kamera sehingga bentuk kemasan menggembung dan latar belakang melebar berantakan. Masuk ke 85mm–135mm, garis vertikal botol tegak lurus, proporsi tegas, dan background terkompresi rapi.\n[24–30 dtk] Pengecualian Creative Director: gunakan 24mm–35mm HANYA saat ingin efek dinamis/energi olahraga, dan 85mm+ untuk produk kecantikan, jam tangan, serta luxury.',
    cta15s:
      'Simpan video referensi focal length ini sebelum sesi foto produk berikutnya—kirim ke tim studio atau rekan fotografermu biar tidak salah pilih lensa.',
    carouselOutline:
      'Slide 1: Split-Screen 16mm vs 85mm (Produk Sama, Persepsi Beda) | Slide 2: Tabel Perbandingan 16mm, 35mm, 50mm, 85mm, 135mm | Slide 3: Kapan Pakai Wide vs Telephoto di Iklan | Slide 4: Contoh Komposisi Studio @obeephotography | Slide 5: CTA Booking & Konsultasi Katalog',
    seoCaption:
      'Bukan cuma soal pencahayaan—pemilihan focal length lensa kamera langsung mengubah persepsi harga sebuah produk di mata pembeli. Cek perbandingan 16mm hingga 135mm pada satu set studio @obeephotography ini dan simpan sebagai panduan produksi.',
    hashtags: '#lensakamera #fotoproduk #obeephotography #tipsfotografi #creativecraft',
    driveAssetUrl: '',
    scheduledDate: '',
    publishedUrl: '',
    igPublishStatus: 'manual',
    tiktokPublishStatus: 'manual',
    sourcePortfolioRef: 'Pansela & DRW Skincare',
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
    title: 'Kesalahan Fatal Pakai f/1.4 Saat Foto Produk: Uji Ketajaman f/1.4 vs f/8–f/11',
    pillar: 'pilar-3',
    targetAccount: 'Collab @lalumahendra x @obeephotography',
    format: 'Collab Reels',
    stage: 'batching',
    researchSource:
      'Riset Teknis Lensa Komersial: Mitos Bokeh f/1.2–f/1.4 vs Commercial Sharpness f/8–f/11',
    audienceTier: 'lapis-1',
    viralTrigger: 'Saves',
    researchInsight:
      'Fotografer pemula sering terobsesi memakai bukaan f/1.4 karena merasa "makin blur makin mahal". Di industri komersial & e-commerce, kesalahan ini justru membuat tepi label merek dan detail material jam/kemasan keluar dari bidang fokus, sehingga revisi klien menumpuk.',
    hook3s:
      'Berhenti memotret produk klien di bukaan f/1.4! Inilah alasan fotografer komersial justru sering mengunci lensa di f/8 sampai f/11.',
    body30s:
      '[0–3 dtk] Zoom-in 200% ke jam tangan/kemasan yang difoto di f/1.4—huruf belakang logo terlihat kabur.\n[3–14 dtk] Tunjukkan perbandingan side-by-side: frame kiri f/1.4 (bokeh halus tapi bagian belakang produk dan ujung merek hilang fokus), frame kanan f/8–f/11 (seluruh kontur logam, tekstur kemasan, dan huruf kecil tajam dari depan ke belakang).\n[14–24 dtk] Jelaskan prinsip studio: klien membayar agar produknya terbaca 100%, bukan untuk memamerkan lensa mahalmu. Jika tetap ingin background lembut dan terpisah, jangan mengorbankan ketajaman produk—jauhkan saja objek dari backdrop 1–2 meter.\n[24–30 dtk] Tunjukkan hasil akhir setup f/8 di @obeephotography.',
    cta15s:
      'Kirim video ini ke temanmu yang masih hobi motret katalog produk pakai bukaan paling mentok—tulis di komentar lensa andalanmu buat foto komersial.',
    carouselOutline:
      'Slide 1: Zoom 200% f/1.4 vs f/8 pada Label Produk | Slide 2: Kenapa Depth-of-Field Tipis Merusak Katalog | Slide 3: Cara Bikin Background Blur Tanpa Mengorbankan Ketajaman Produk | Slide 4: Checklist Setting Studio @obeephotography | Slide 5: CTA Kolaborasi Foto Produk',
    seoCaption:
      'Mitos terbesar saat membeli lensa prime mahal: semuanya harus difoto di f/1.4. Pada foto produk komersial, ketajaman menyeluruh di f/8–f/11 justru yang menyelamatkan keterbacaan merek dan detail material.',
    hashtags: '#tipsfotoproduk #aperturelensa #obeephotography #kamerafotografi #studiokomersial',
    driveAssetUrl: '',
    scheduledDate: '',
    publishedUrl: '',
    igPublishStatus: 'manual',
    tiktokPublishStatus: 'manual',
    sourcePortfolioRef: 'Ardent Watch Rose Gold',
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
    title: 'Bukan Salah Lensa Murah: Rahasia Efek Kompresi Latar Cukup dari Jarak Kamera & 24mm vs 85mm',
    pillar: 'pilar-3',
    targetAccount: 'Collab @lalumahendra x @obeephotography',
    format: 'Collab Reels',
    stage: 'script',
    researchSource:
      'Riset Optika & Sinematografi Lensa: Mitos Lens Compression vs Fisika Jarak Kamera',
    audienceTier: 'lapis-1',
    viralTrigger: 'DM Shares',
    researchInsight:
      'Topik "Lens Compression Myth vs Distance" adalah salah satu materi fotografi/videografi dengan tingkat share & perdebatan tertinggi karena mematahkan anggapan umum bahwa kompresi latar belakang berasal dari kaca lensa, bukan dari posisi berdiri fotografer.',
    hook3s:
      'Rahasia visual "cinematic compression" yang sering dikira cuma bisa pakai lensa puluhan juta—padahal kuncinya ada di jarak berdirimu.',
    body30s:
      '[0–3 dtk] Perlihatkan efek "dolly zoom" cepat di meja studio: produk diam, tapi background tiba-tiba membesar mendekati kamera.\n[3–15 dtk] Demo 2 langkah nyata: (1) Foto dari jarak 50 cm dengan 24mm → crop ke ukuran frame tengah. (2) Mundur 2 meter, pakai 85mm. Jelaskan fisika sederhananya: kompresi perspektif terjadi karena jarak kamera ke subjek jauh lebih besar dibanding rasio jarak ke latar.\n[15–25 dtk] Aplikasi nyata di proyek iklan Obee: pakai 24mm + gerak maju cepat (crash push) untuk iklan F&B/otomotif yang butuh energi intens, lalu mundur dengan 85mm–105mm ketika ruangan studio sempit terlihat berantakan agar backdrop tampak penuh dan bersih.',
    cta15s:
      'Simpan dan coba trik mundur 2 langkah ini di sesi syuting besok, bahkan jika kamu baru punya lensa kit atau zoom standar.',
    carouselOutline:
      'Slide 1: Mitos Lens Compression | Slide 2: Perbandingan 24mm Crop vs 85mm Jarak Jauh | Slide 3: Trik Menutupi Studio Sempit dengan Focal Length Panjang | Slide 4: Kapan Memakai 24mm Crash Push di Video Iklan | Slide 5: Ringkasan & CTA',
    seoCaption:
      'Mengerti cara kerja jarak kamera dan focal length lensa jauh lebih berharga daripada sekadar menabung beli lensa baru. Begini tim kami memanfaatkan fisika optik 24mm vs 85mm di set iklan dan katalog.',
    hashtags: '#sinematografi #lensakamera #videografiproduk #obeephotography #lalumahendra',
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

  // =========================================================================
  // PILAR 1 · BEDAH KASUS & TRANSFORMASI NYATA (~25% -> 3 IDE)
  // =========================================================================
  {
    title: 'Produk Lokal Kualitas Ekspor, Tapi Kemasan Terbaca Rp10 Ribuan — 3 Perombakan Studio',
    pillar: 'pilar-1',
    targetAccount: 'Collab @lalumahendra x @obeecreatives',
    format: 'Collab Reels',
    stage: 'batching',
    researchSource:
      'Studi Kasus Rebranding UMKM & Kelompok Tani Hutan (MJC Bakorwil III)',
    audienceTier: 'lapis-2',
    viralTrigger: 'DM Shares',
    researchInsight:
      'Pemilik UMKM sering bingung mengapa produk yang sudah enak atau berkualitas tidak dilirik distributor/ritel. Bedah kasus visual sebelum-sesudah secara jujur langsung memicu pemilik usaha mengirim video ke tim atau partner bisnisnya.',
    hook3s:
      'Banyak produk lokal sebenarnya sudah layak ekspor, tapi tetap mentok di harga Rp10 ribuan cuma karena 3 sinyal murahan di kemasannya.',
    body30s:
      '[0–4 dtk] Pegang kemasan awal penuh teks kecil & warna tabrakan, lalu transisi cepat ke versi mockup/cetak baru yang bersih.\n[4–18 dtk] Bedah 3 perombakan kami: (1) Pangkas 60% teks depan menjadi 1 klaim nilai utama agar terbaca dalam 2 detik dari jarak 1,5 meter. (2) Ganti kombinasi font dekoratif dengan pasangan serif-sans berkarakter. (3) Pilih finishing matte/spot UV & warna khas yang membedakan varian rasa.\n[18–26 dtk] Tunjukkan efek langsung ke positioning harga jual.',
    cta15s:
      'Tulis nama usaha atau jenis produkmu di kolom komentar kalau mau kami pilih jadi studi kasus bedah kemasan di episode berikutnya.',
    carouselOutline:
      'Slide 1: Before–After Kemasan UMKM | Slide 2: Kesalahan Padat Informasi di Muka Kemasan | Slide 3: Solusi Hierarki 3 Detik Rak Toko | Slide 4: Pemilihan Finishing Cetak Hemat tapi Premium | Slide 5: CTA Konsultasi @obeecreatives',
    seoCaption:
      'Pembeli tidak mencicipi produkmu di rak toko—mereka membeli persepsi nilainya dalam 3 detik pertama dari kemasan. Ini 3 perbaikan yang rutin kami lakukan saat mendampingi rebranding UMKM bersama @obeecreatives.',
    hashtags: '#rebrandingumkm #desainkemasan #obeecreatives #umkmnaikkelas #strategibrand',
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
    title: 'Audit Website & Company Profile B2B: 3 Elemen Penentu Klien Bertahan di 5 Detik Pertama',
    pillar: 'pilar-1',
    targetAccount: '@lalumahendra',
    format: 'Reels',
    stage: 'script',
    researchSource:
      'Audit Website & Company Profile Calon Klien B2B Obee Creatives (obeecreatives.com)',
    audienceTier: 'lapis-3',
    viralTrigger: 'DM Shares',
    researchInsight:
      'Pemilik bisnis B2B mengira website/company profile cukup berisi "Selamat Datang di Perusahaan Kami". Rekaman layar bedah hero section secara langsung membuka kesadaran pengambil keputusan tanpa terdengar menggurui.',
    hook3s:
      'Calon klien korporat menutup website bisnis Anda dalam 5 detik pertama kalau 3 elemen ini tidak langsung terlihat sebelum mereka scroll.',
    body30s:
      '[0–3 dtk] Screen-record kursor mengarah ke tombol close tab pada contoh halaman depan website yang lambat & generik.\n[3–18 dtk] Tunjukkan audit 3 elemen wajib "Above the Fold": (1) Headline spesifik "Untuk Siapa & Hasil Apa", bukan jargon klise. (2) Bukti visual proyek nyata atau logo klien tepercaya tepat di bawah headline. (3) Satu tombol aksi yang jelas (Konsultasi / Unduh Katalog), bukan 5 tombol berjejer.\n[18–27 dtk] Bandingkan dengan struktur rapi company profile & web yang siap konversi.',
    cta15s:
      'Bagikan video ini ke tim marketing atau pemilik usaha yang websitenya masih jarang menghasilkan pesan masuk.',
    carouselOutline:
      'Slide 1: Kenapa Website B2B Sepi Prospek | Slide 2: Checklist 5 Detik Layar Pertama | Slide 3: Contoh Headline Lemah vs Tajam | Slide 4: Penempatan Bukti Sosial | Slide 5: CTA Audit Web @obeecreatives',
    seoCaption:
      'Website dan company profile bukan pajangan brosur digital—keduanya adalah sales representative 24 jam bagi perusahaan Anda. Pastikan 3 elemen ini muncul jelas di 5 detik pertama pengunjung mendarat.',
    hashtags: '#companyprofile #websitebisnis #brandingb2b #obeecreatives #lalumahendra',
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
    title: 'Transformasi Foto Skincare: Dari Cahaya Jendela Berpantulan ke Visual Studio Anti-Glare',
    pillar: 'pilar-1',
    targetAccount: 'Collab @lalumahendra x @obeephotography',
    format: 'Collab Reels',
    stage: 'batching',
    researchSource:
      'Daur Ulang Portofolio @obeephotography — Pansela & DRW Skincare',
    audienceTier: 'lapis-2',
    viralTrigger: 'Watch Time',
    researchInsight:
      'Brand beauty dan skincare lokal sangat sensitif terhadap kebersihan label dan kesan higienis. Memperlihatkan proses mengubah foto produk berpantulan jendela menjadi katalog bersih ala @obeephotography memicu pemilik brand beauty langsung melihat nilai investasi studio.',
    hook3s:
      'Kesalahan paling sering foto produk skincare pakai HP: botolnya silau, mereknya hilang kena pantulan lampu. Ini cara kami bersihkan di studio.',
    body30s:
      '[0–3 dtk] Tampilkan foto botol skincare berpantulan putih keras di atas meja kerja.\n[3–16 dtk] Pindah ke set studio @obeephotography: letakkan diffuser scrim besar di samping untuk menciptakan gradasi cahaya lembut memanjang di silinder botol, serta flag hitam di sisi berlawanan untuk mengunci kontras tepi botol agar label merek terbaca 100% tajam.\n[16–26 dtk] Transisi cepat ke hasil akhir katalog Pansela/DRW Skincare di grid marketplace dan iklan Meta Ads.',
    cta15s:
      'Kalau brand skincare atau F&B kamu lagi siapin peluncuran produk baru, cek portofolio lengkap di @obeephotography atau kirim DM sekarang.',
    carouselOutline:
      'Slide 1: Foto Mentah Berpantulan vs Final Shot Pansela/DRW | Slide 2: Posisi Scrim Diffuser & Black Flag | Slide 3: Crop Detail Ketajaman Label | Slide 4: Dampak ke CTR Iklan Beauty | Slide 5: CTA Studio @obeephotography',
    seoCaption:
      'Pada produk kecantikan dan skincare, pantulan cahaya yang tidak terkontrol langsung menurunkan tingkat kepercayaan pembeli. Begini standar studio @obeephotography menjaga setiap huruf di kemasan tetap bersih dan tajam.',
    hashtags: '#fotoskincare #fotokatalog #obeephotography #brandskincare #productphotography',
    driveAssetUrl: '',
    scheduledDate: '',
    publishedUrl: '',
    igPublishStatus: 'manual',
    tiktokPublishStatus: 'manual',
    sourcePortfolioRef: 'Pansela & DRW Skincare',
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

  // =========================================================================
  // PILAR 2 · REALITAS AGENSI & OPINI KONTRARIAN (20% -> 2 IDE)
  // =========================================================================
  {
    title: 'Kenapa Klien Berani Bayar Agensi Rp25 Juta untuk Desain "Simpel", Bukan Rp250 Ribu Penuh Efek?',
    pillar: 'pilar-2',
    targetAccount: '@lalumahendra',
    format: 'Carousel',
    stage: 'script',
    researchSource:
      'Pertanyaan Berulang Talenta MJC & Negosiasi Harga Klien di Obee Creatives',
    audienceTier: 'lapis-2',
    viralTrigger: 'Discussion',
    researchInsight:
      'Topik struktur harga jasa kreatif selalu memicu diskusi aktif antara desainer muda dan pemilik bisnis, sekaligus menyaring calon klien yang mencari partner strategis dibanding sekadar tukang edit murah.',
    hook3s:
      'Klien besar sering lebih rela membayar Rp25 juta untuk desain yang terlihat "simpel", daripada Rp250 ribu yang penuh efek warna-warni. Kenapa?',
    body30s:
      'Slide & narasi utama membedah 4 lapisan yang sebenarnya dibayar klien: (1) Riset kompetitor dan positioning sebelum sketsa pertama dibuat. (2) Kesederhanaan yang lahir dari penyaringan puluhan opsi—bukan kemalasan. (3) Sistem aplikasi menyeluruh (kemasan cetak, feed, website, guideline tim) agar merek konsisten bertahun-tahun. (4) Jaminan akuntabilitas dan kepastian jadwal eksekusi agensi.',
    cta15s:
      'Menurut kamu, tantangan terbesar saat menjelaskan harga jasa ke klien ada di mana? Tulis pengalamanmu di komentar.',
    carouselOutline:
      'Slide 1: Cover Kontras Harga Rp250rb vs Rp25jt | Slide 2: Ilusi "Desain Simpel = Cepat Bikin" | Slide 3: Lapisan Riset & Strategi Sebelum Eksekusi | Slide 4: Sistem Konsistensi Lintas Media (Kemasan, Foto, Web) | Slide 5: Biaya Revisi & Risiko Bisnis | Slide 6: Cara Menaikkan Nilai Tawarmu | Slide 7: CTA Diskusi & Follow @lalumahendra',
    seoCaption:
      'Menghilangkan elemen yang tidak perlu jauh lebih sulit daripada menumpuk efek. Klien korporat membayar kejelasan pesan, konsistensi lintas media, dan ketenangan pikiran selama proyek berjalan.',
    hashtags: '#hargajasadesain #agensikreatif #brandingindonesia #obeecreatives #lalumahendra',
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
  },
  {
    title: 'Jago Editing & Color Grading Belum Cukup: 3 Alasan Talenta Kreatif Gagal di Proyek Klien Nyata',
    pillar: 'pilar-2',
    targetAccount: '@lalumahendra',
    format: 'Reels',
    stage: 'research',
    researchSource:
      'Observasi Rekrutmen & Mentoring Talenta Muda di MJC Bakorwil III & Obee Creatives',
    audienceTier: 'lapis-1',
    viralTrigger: 'Discussion',
    researchInsight:
      'Menegaskan posisi ganda Anda sebagai Mentor MJC sekaligus Founder Agensi. Banyak anak muda mengira portofolio "cinematic" sudah menjamin lolos kerja agensi, padahal dunia klien menuntut disiplin komunikasi brief dan tujuan jualan.',
    hook3s:
      'Banyak anak kreatif jago kamera, editing, dan color grading, tapi tetap tersingkir di proyek klien nyata. Bukan skill software-nya yang kurang, tapi 3 hal ini.',
    body30s:
      '[0–3 dtk] Tatap lensa langsung di meja studio dengan B-roll proses review proyek tim.\n[3–20 dtk] Ungkap 3 jurang di dunia kerja agensi: (1) Mengejar gaya pribadi yang sedang tren tapi tidak menjawab target pembeli produk klien. (2) Tidak terbiasa membaca dan mengunci brief sebelum eksekusi sehingga revisi membengkak. (3) Lambat berkomunikasi saat ada kendala produksi di lapangan.\n[20–28 dtk] Pesan penutup: teknik membuatmu dilirik, kepekaan bisnis dan komunikasi yang membuatmu dibayar mahal dan dipertahankan.',
    cta15s:
      'Dari 3 hal tadi, mana yang paling sering kamu temui di tim kreatif? Share ke rekan kerjamu dan tulis pendapatmu di bawah.',
    carouselOutline:
      'Slide 1: Jebakan Portofolio Keren tapi Sepi Proyek | Slide 2: Masalah #1 Ego Estetika vs Tujuan Klien | Slide 3: Masalah #2 Malas Membaca Brief | Slide 4: Masalah #3 Komunikasi Krisis & Deadline | Slide 5: Standar Talenta Siap Industri',
    seoCaption:
      'Selama mendampingi talenta kreatif di Millenial Job Center dan membangun tim di @obeecreatives, pola kegagalan di awal karier hampir selalu sama. Latih 3 hal ini agar kemampuan tekniismu dihargai tinggi oleh industri.',
    hashtags: '#karierkreatif #millenialjobcenter #manajemenkreatif #industrikreatif #lalumahendra',
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

  // =========================================================================
  // PILAR 4 · LIVE MENTORING & STUDIO COLLAB (~25% -> 2 IDE)
  // =========================================================================
  {
    title: 'Momen Mic-Up Kelas MJC: Cara Mengubah Pitching Karya "Ini Keren" Jadi "Ini Solusi Bisnis"',
    pillar: 'pilar-4',
    targetAccount: '@lalumahendra',
    format: 'Reels',
    stage: 'research',
    researchSource:
      'Rekaman Langsung Sesi Coaching Workshop / Kelas MJC Bakorwil III Malang',
    audienceTier: 'lapis-3',
    viralTrigger: 'Watch Time',
    researchInsight:
      'Video dokumentasi otentik menggunakan clip-on mic di tengah ruang kelas/mentoring menjadi bukti sosial terkuat bagi panitia seminar kampus, instansi Kemenkop UKM, dan pengambil keputusan korporat.',
    hook3s:
      'Kalimat yang langsung saya coret saat peserta mentoring latihan pitching karya di depan calon klien—dan cara membaliknya dalam 10 detik.',
    body30s:
      '[0–4 dtk] Cuplikan suasana kelas nyata dengan mic-up audio jernih saat peserta mempresentasikan desain/konten.\n[4–18 dtk] Momen koreksi langsung: "Jangan mulai presentasi dengan menjelaskan warna biru favoritmu. Mulai dengan menyebut masalah toko/klien yang diselesaikan oleh layout ini."\n[18–27 dtk] Perlihatkan peserta mengulang kalimat pembukanya dengan struktur problem → visual solution, disambut anggukan audiens ruangan.',
    cta15s:
      'Mau latihan pitching karyamu bareng di sesi berikutnya? Simpan template pembuka presentasi ini dan follow untuk jadwal kelas terbuka.',
    carouselOutline: '',
    seoCaption:
      'Kemampuan menjelaskan alasan strategis di balik setiap keputusan visual adalah pembeda utama kreator pemula dan mitra kreatif tepercaya. Cuplikan langsung dari sesi mentoring di lapangan.',
    hashtags: '#livementoring #pitchingklien #workshopkreatif #millenialjobcenter #lalumahendra',
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
  {
    title: 'Di Balik Layar 14 Hari Proyek Rebranding @obeecreatives: Sinkronisasi Foto, Kemasan & Web',
    pillar: 'pilar-4',
    targetAccount: 'Collab @lalumahendra x @obeecreatives',
    format: 'Collab Reels',
    stage: 'script',
    researchSource:
      'Dokumentasi Alur Kerja Lintas Divisi Studio Obee Creatives Group (Malang & Batu)',
    audienceTier: 'lapis-3',
    viralTrigger: 'Watch Time',
    researchInsight:
      'Menunjukkan keunikan ekosistem terintegrasi Obee Creatives (foto, desain kemasan, video, dan website berada di satu atap) secara visual lewat montase cepat—langsung mengonversi prospek B2B dan UMKM serius yang lelah mengoordinasikan banyak vendor terpisah.',
    hook3s:
      'Ini alasan kenapa proyek branding sering pecah kalau vendor foto, desainer kemasan, dan tim websitenya jalan sendiri-sendiri—dan cara tim kami menyatukannya.',
    body30s:
      '[0–3 dtk] Montase cepat 3 layar kerja di studio Obee Creatives: moodboard warna, meja set foto, dan preview website.\n[3–18 dtk] Tunjukkan alur 1 pintu dalam 14 hari: Hari 1–3 kunci positioning & sistem warna brand → Hari 4–7 produksi foto produk di @obeephotography menyesuaikan ruang teks kemasan & hero banner web → Hari 8–14 finalisasi file siap cetak + peluncuran website.\n[18–28 dtk] Hasil akhir seragam saat produk difoto, dipajang di rak, dan tampil di halaman web.',
    cta15s:
      'Lagi merapikan identitas brand biar foto, kemasan, dan websitenya nyambung satu pintu? Cek portofolio layanan terpadu di @obeecreatives.',
    carouselOutline:
      'Slide 1: Masalah Brand Pecah Akibat Beda Vendor | Slide 2: Alur Terpadu 14 Hari Obee Creatives | Slide 3: Sinergi Brief Kemasan & Art Direction Foto | Slide 4: Integrasi Aset Studio ke Website | Slide 5: CTA Konsultasi @obeecreatives',
    seoCaption:
      'Ketika tim strategi brand, desain kemasan, fotografi produk, dan pengembang web bekerja dari satu brief yang sama, hasilnya terasa jauh lebih kohesif. Intip alur kerja terpadu di studio @obeecreatives Group.',
    hashtags: '#obeecreatives #studioindonesia #rebranding #agencylife #lalumahendra',
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
  },
];
