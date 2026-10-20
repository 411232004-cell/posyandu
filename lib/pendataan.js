export const pendataanSections = [
  {
    id: 'ibu-hamil',
    label: 'Ibu Hamil',
    description: 'Pemantauan kehamilan, ANC, dan deteksi risiko selama masa kehamilan.',
    statusOptions: ['aktif', 'monitoring', 'beresiko'],
    fields: ['nama', 'detail', 'status', 'tanggal', 'catatan'],
  },
  {
    id: 'kb',
    label: 'KB',
    description: 'Pendataan peserta KB aktif, kontrasepsi, dan pemantauan repetisi.',
    statusOptions: ['aktif', 'monitoring', 'tertunda'],
    fields: ['nama', 'detail', 'status', 'tanggal', 'catatan'],
  },
  {
    id: 'imunisasi',
    label: 'Imunisasi',
    description: 'Jadwal vaksin, cakupan, dan status penyelesaian imunisasi.',
    statusOptions: ['lengkap', 'monitoring', 'tertunda'],
    fields: ['nama', 'detail', 'status', 'tanggal', 'catatan'],
  },
];

export const initialPendataanRecords = [
  {
    id: 'pdh-ih-01',
    category: 'ibu-hamil',
    name: 'Sri Wulandari',
    detail: 'G1P0, usia kehamilan 26 minggu',
    status: 'aktif',
    date: '2026-10-03',
    note: 'Konseling nutrisi dan pemeriksaan HB rutin.',
  },
  {
    id: 'pdh-kb-01',
    category: 'kb',
    name: 'Dewi Lestari',
    detail: 'Pil kombinasi, kunjungan 3 bulan',
    status: 'monitoring',
    date: '2026-10-02',
    note: 'Minta evaluasi efek samping pada bulan depan.',
  },
  {
    id: 'pdh-im-01',
    category: 'imunisasi',
    name: 'Naila Rahma',
    detail: 'Vaksin MR tahap lanjutan',
    status: 'lengkap',
    date: '2026-10-01',
    note: 'Imunisasi sesuai jadwal, tidak ada keluhan.',
  },
  {
    id: 'pdh-ih-02',
    category: 'ibu-hamil',
    name: 'Maya Rahayu',
    detail: 'G2P1, usia kehamilan 18 minggu',
    status: 'monitoring',
    date: '2026-09-29',
    note: 'Perlu pemantauan tekanan darah dan asupan zat besi.',
  },
  {
    id: 'pdh-kb-02',
    category: 'kb',
    name: 'Lina Suhartini',
    detail: 'Suntik 3 bulan',
    status: 'aktif',
    date: '2026-09-28',
    note: 'Kembali untuk jadwal suntik berikutnya dalam 3 bulan.',
  },
  {
    id: 'pdh-im-02',
    category: 'imunisasi',
    name: 'Arman Putra',
    detail: 'Imunisasi campak, perlu follow-up',
    status: 'tertunda',
    date: '2026-09-27',
    note: 'Warga belum hadir saat jadwal sebelumnya.',
  },
];

export function summarizePendataan(records = []) {
  const byCategory = { 'ibu-hamil': 0, kb: 0, imunisasi: 0 };
  const byStatus = { aktif: 0, monitoring: 0, beresiko: 0, lengkap: 0, tertunda: 0 };

  for (const record of records) {
    if (!record || !record.category) continue;

    if (byCategory[record.category] !== undefined) {
      byCategory[record.category] += 1;
    }

    if (record.status && byStatus[record.status] !== undefined) {
      byStatus[record.status] += 1;
    }
  }

  return {
    total: records.length,
    activeTotal: byStatus.aktif + byStatus.monitoring + byStatus.lengkap,
    byCategory,
    byStatus,
  };
}
