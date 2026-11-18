import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  ALGORITHM_SIGNALS,
  AUDIENCE_TIERS,
  BATCHING_STEPS,
  CONTENT_PILLARS,
  IDEA_BANK,
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
  WEEKLY_SCHEDULE,
} from '../data/reportData';

// Normalize non-WinAnsi characters so built-in PDF Helvetica renders cleanly without garbled glyphs
function pdfText(input: string): string {
  return input
    .replace(/×/g, 'x')
    .replace(/→/g, '->')
    .replace(/≥/g, '>=')
    .replace(/≤/g, '<=')
    .replace(/÷/g, '/')
    .replace(/—/g, '--')
    .replace(/–/g, '-')
    .replace(/·/g, '|')
    .replace(/“|”/g, '"')
    .replace(/‘|’/g, "'");
}

export function generateReportPdf(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 16;
  const contentWidth = pageWidth - marginX * 2;
  let y = 20;

  const colors = {
    ink: [28, 25, 23] as [number, number, number],
    muted: [87, 83, 78] as [number, number, number],
    lapis: [30, 58, 138] as [number, number, number],
    border: [214, 211, 209] as [number, number, number],
    surface: [247, 244, 238] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
  };

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageHeight - 20) {
      doc.addPage();
      y = 22;
    }
  };

  const addSectionHeader = (kicker: string, title: string) => {
    ensureSpace(22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...colors.lapis);
    doc.text(pdfText(kicker.toUpperCase()), marginX, y);
    y += 5;

    doc.setFont('times', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(...colors.ink);
    const wrappedTitle = doc.splitTextToSize(pdfText(title), contentWidth);
    doc.text(wrappedTitle, marginX, y);
    y += wrappedTitle.length * 6 + 1;

    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.3);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 6;
  };

  const addSubHeading = (text: string) => {
    ensureSpace(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...colors.ink);
    const lines = doc.splitTextToSize(pdfText(text), contentWidth);
    doc.text(lines, marginX, y);
    y += lines.length * 5 + 2;
  };

  const addParagraph = (text: string, fontSize = 9.5) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(...colors.ink);
    const lines = doc.splitTextToSize(pdfText(text), contentWidth);
    ensureSpace(lines.length * 4.5 + 3);
    doc.text(lines, marginX, y);
    y += lines.length * 4.4 + 3;
  };

  const addBulletItem = (lead: string, body: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    const leadLines = doc.splitTextToSize(pdfText(`- ${lead}`), contentWidth);
    doc.setFont('helvetica', 'normal');
    const bodyLines = doc.splitTextToSize(pdfText(body), contentWidth - 4);
    ensureSpace((leadLines.length + bodyLines.length) * 4.5 + 3);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.ink);
    doc.text(leadLines, marginX, y);
    y += leadLines.length * 4.4;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.muted);
    doc.text(bodyLines, marginX + 4, y);
    y += bodyLines.length * 4.3 + 2.5;
  };

  // --- COVER / DOCUMENT HEADER ---
  doc.setFillColor(...colors.surface);
  doc.rect(marginX, 16, contentWidth, 58, 'F');
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.4);
  doc.rect(marginX, 16, contentWidth, 58, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.lapis);
  doc.text('DOKUMEN STRATEGIS  |  RISET PROFIL, AUDIT KARYA & BLUEPRINT 3 AKUN', marginX + 6, 24);

  doc.setFont('times', 'bold');
  doc.setFontSize(17.5);
  doc.setTextColor(...colors.ink);
  const coverTitleLines = doc.splitTextToSize(pdfText(REPORT_META.title), contentWidth - 12);
  doc.text(coverTitleLines, marginX + 6, 33);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.muted);
  const coverSubLines = doc.splitTextToSize(pdfText(REPORT_META.subtitle), contentWidth - 12);
  doc.text(coverSubLines, marginX + 6, 48);

  y = 80;

  // Document Metadata Table
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 },
      textColor: colors.ink,
      lineColor: colors.border,
      lineWidth: { bottom: 0.2 },
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 42, textColor: colors.muted },
      1: { cellWidth: contentWidth - 42 },
    },
    body: [
      ['Subjek Personal', pdfText(REPORT_META.subject)],
      ['Ekosistem Bisnis', pdfText(REPORT_META.agency)],
      ['Basis & Skalabilitas', pdfText(REPORT_META.baseLocation)],
      ['Periode Siklus', pdfText(REPORT_META.cycle)],
      ['Tanggal Penyusunan', pdfText(REPORT_META.date)],
    ],
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // --- BAGIAN I ---
  addSectionHeader('Bagian I', 'Laporan Riset & Audit Profil Ekosistem');
  addParagraph(
    'Anda berada pada posisi Practitioner-Educator-Founder: memadukan eksekusi studio nyata di Obee Creatives Group dan showcase fotografi komersial di @obeephotography, kredibilitas pengajar/mentor ekosistem Jawa Timur (MJC Bakorwil III & Kemenkop UKM), serta kepekaan produksi audiovisual. Strategi Anda tidak boleh turun ke level kreator tutorial dasar yang jenuh, melainkan mengawinkan bukti karya nyata dan pemikiran Creative Director.'
  );

  addSubHeading('1.1. Rekam Jejak Terverifikasi');
  VERIFIED_PROFILE_FACTS.forEach((item) => {
    addBulletItem(item.label, item.detail);
  });

  addSubHeading('1.2. Matriks Kekuatan Unik (Unfair Advantage) vs. Celah Pertumbuhan (Gap)');
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [['Kekuatan Unik (Unfair Advantage)', 'Celah & Risiko yang Harus Ditutup (Gap)']],
    body: STRENGTH_GAP_MATRIX.map((r) => [pdfText(r.strength), pdfText(r.gap)]),
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 3,
      textColor: colors.ink,
      lineColor: colors.border,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: colors.lapis,
      textColor: colors.white,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: colors.surface,
    },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  addSubHeading('1.3. Arsitektur Sinergi 3 Akun (Founder-Led Ecosystem)');
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [['Akun', 'Peran Strategis', 'Fokus Konten', 'Peran Konversi']],
    body: TRIPLE_ACCOUNT_ARCHITECTURE.map((d) => [
      pdfText(d.account),
      pdfText(d.role),
      pdfText(d.focus),
      pdfText(d.conversionRole),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 8.1,
      cellPadding: 2.6,
      textColor: colors.ink,
      lineColor: colors.border,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: colors.ink,
      textColor: colors.white,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 30 },
      1: { cellWidth: 36 },
    },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  addSubHeading(`1.4. Audit Visual & Strategis @obeephotography (${OBEEPHOTOGRAPHY_AUDIT.snapshotStats})`);
  addParagraph(
    'Berdasarkan tinjauan langsung terhadap tampilan profil dan 12 karya showcase terakhir di @obeephotography (Ardent Watch, Garvinoes, DS-70 Studio Monitor, POCO, DRW Skincare, Pansela, sepatu BR, serta potret lifestyle), kualitas craft fotografi Anda sudah berada pada level komersial siap jual. Celahnya terletak pada kemasan distribusi media sosial:'
  );
  OBEEPHOTOGRAPHY_AUDIT.strengths.forEach((s) => {
    addBulletItem(`[Kekuatan Craft] ${s.title}`, s.detail);
  });
  OBEEPHOTOGRAPHY_AUDIT.gaps.forEach((g) => {
    addBulletItem(`[Celah Strategis] ${g.title}`, g.detail);
  });

  addSubHeading('1.5. Rencana Integrasi @obeephotography & Rekomendasi Bio');
  OBEEPHOTOGRAPHY_AUDIT.integrationSteps.forEach((step, idx) => {
    addBulletItem(`Langkah Integrasi 0${idx + 1}`, step);
  });
  addParagraph(
    `Rekomendasi Bio @obeephotography: ${OBEEPHOTOGRAPHY_AUDIT.upgradedBio.join(' | ')}`,
    8.8
  );
  y += 2;

  // --- BAGIAN II ---
  addSectionHeader('Bagian II', 'Laporan Riset Konten & Mekanika Algoritma');

  addSubHeading('2.1. Sinyal Algoritma Penentu Viralitas Organik');
  ALGORITHM_SIGNALS.forEach((sig) => {
    addBulletItem(`${sig.signal} (${sig.weight})`, sig.insight);
  });

  addSubHeading('2.2. Resolusi Konten Teknis: Operator vs. Creative Director');
  addParagraph(
    'Konten teknis fotografi dan videografi tidak dihilangkan (porsi ideal 30% atau sekitar 1 dari 3-4 konten inti per minggu), karena berfungsi sebagai Proof of Craft sekaligus mesin penggerak aset @obeephotography. Namun, sudut pandangnya wajib dinaikkan dari sekadar operator alat menjadi pengambil keputusan komersial:'
  );
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [['Topik Teknis Lama (Operator)', 'Transformasi Angle Baru (Creative Director)', 'Dampak Otoritas']],
    body: TECHNICAL_REFRAME_ROWS.map((r) => [
      pdfText(r.oldTopic),
      pdfText(r.newAngle),
      pdfText(r.impact),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 8.2,
      cellPadding: 2.8,
      textColor: colors.ink,
      lineColor: colors.border,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: colors.lapis,
      textColor: colors.white,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: colors.surface,
    },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  addSubHeading('2.3. Pemetaan 3 Segmen Audiens yang Dilayani');
  AUDIENCE_TIERS.forEach((t) => {
    addBulletItem(t.tier, `Profil: ${t.profile} Kebutuhan: ${t.need}`);
  });
  y += 2;

  // --- BAGIAN III ---
  addSectionHeader('Bagian III', 'Blueprint Strategi Konten (The 60-30-10 Engine)');

  addSubHeading('3.1. Komposisi 4 Pilar Konten & Porsi Ideal');
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [['Pilar Konten', 'Porsi', 'Peran Algoritmik', 'Fokus Eksekusi']],
    body: CONTENT_PILLARS.map((p) => [
      pdfText(p.name),
      pdfText(p.share),
      pdfText(p.role),
      pdfText(p.description),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 8.2,
      cellPadding: 2.8,
      textColor: colors.ink,
      lineColor: colors.border,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: colors.ink,
      textColor: colors.white,
      fontStyle: 'bold',
    },
    columnStyles: {
      1: { fontStyle: 'bold', halign: 'center', cellWidth: 16 },
    },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  addSubHeading('3.2. 15 Bank Ide & Hook Siap Produksi (Termasuk Bedah Karya @obeephotography)');
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [['Pilar & Format', 'Hook 3 Detik Pertama', 'Arahan Visual & Pemicu']],
    body: IDEA_BANK.map((item) => [
      pdfText(`${item.pillarName}\n[${item.format}]`),
      pdfText(`"${item.hook}"`),
      pdfText(`${item.visualDirection} (Pemicu: ${item.trigger})`),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 7.9,
      cellPadding: 2.5,
      textColor: colors.ink,
      lineColor: colors.border,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: colors.lapis,
      textColor: colors.white,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: colors.surface,
    },
    columnStyles: {
      0: { cellWidth: 38, fontStyle: 'bold' },
      1: { cellWidth: 66 },
    },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  addSubHeading('3.3. Sistem Produksi Efisien (1-to-Many Batching Workflow)');
  BATCHING_STEPS.forEach((b) => {
    addBulletItem(b.step, b.detail);
  });

  addSubHeading('3.4. Jadwal Operasional Mingguan (Sinergi 3 Akun)');
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [['Hari', 'Akun', 'Format & Pilar', 'Tujuan Algoritmik']],
    body: WEEKLY_SCHEDULE.map((s) => [
      pdfText(s.day),
      pdfText(s.account),
      pdfText(`${s.format} -- ${s.pillar}`),
      pdfText(s.goal),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 8.1,
      cellPadding: 2.6,
      textColor: colors.ink,
      lineColor: colors.border,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: colors.ink,
      textColor: colors.white,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 24 },
      1: { cellWidth: 42 },
    },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  addSubHeading('3.5. Peta Jalan Eksekusi 90 Hari (3 Fase Bertahap)');
  ROADMAP_PHASES.forEach((rp) => {
    addBulletItem(`${rp.phase}: ${rp.title}`, rp.actions.join(' | '));
  });
  y += 2;

  // --- BAGIAN IV ---
  addSectionHeader('Bagian IV', 'Weekly Evaluation Scorecard (Metrik per Fase)');
  addParagraph(
    'Lakukan audit rutin setiap Minggu malam atau Senin pagi (durasi 20 menit) berbasis data analitik nyata. Hindari mengevaluasi performa hanya dari jumlah Likes; gunakan tabel target dan aturan keputusan korektif berikut:'
  );

  const renderScorecardTable = (title: string, rows: typeof SCORECARD_PHASE_1) => {
    addSubHeading(title);
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [['Metrik Evaluasi', 'Rumus / Cara Baca', 'Target Sehat', 'Aturan Keputusan (Decision Trigger)']],
      body: rows.map((r) => [
        pdfText(r.metric),
        pdfText(r.formula),
        pdfText(r.target),
        pdfText(r.trigger),
      ]),
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 2.6,
        textColor: colors.ink,
        lineColor: colors.border,
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: colors.lapis,
        textColor: colors.white,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: colors.surface,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 34 },
        2: { fontStyle: 'bold', cellWidth: 26 },
      },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 7;
  };

  renderScorecardTable('4.1. Scorecard Fase 1 (Minggu 1-4): Daya Pikat & Kesehatan Retensi', SCORECARD_PHASE_1);
  renderScorecardTable('4.2. Scorecard Fase 2 (Minggu 5-8): Daya Viral & Tarikan Otoritas', SCORECARD_PHASE_2);
  renderScorecardTable('4.3. Scorecard Fase 3 (Minggu 9-12+): Dampak Bisnis & Efisiensi Sistem', SCORECARD_PHASE_3);

  // Add running headers & page numbers across all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    if (i > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...colors.muted);
      doc.text(
        'LAPORAN RISET & BLUEPRINT  |  @LALUMAHENDRA x @OBEECREATIVES x @OBEEPHOTOGRAPHY',
        marginX,
        11
      );
      doc.setDrawColor(...colors.border);
      doc.setLineWidth(0.2);
      doc.line(marginX, 13, pageWidth - marginX, 13);
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      pageWidth - marginX,
      pageHeight - 10,
      { align: 'right' }
    );
    doc.text(
      'Disusun khusus untuk Lalu Mahendra, Obee Creatives & Obee Photography',
      marginX,
      pageHeight - 10
    );
  }

  doc.save('Laporan_Riset_Blueprint_Lalu_Mahendra_Obee_Creatives.pdf');
}
