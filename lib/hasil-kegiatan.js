export const hasilKegiatanSections = [
  {
    id: 'kesehatan-ibu-anak',
    label: 'Kesehatan Ibu & Anak',
    description: 'Pemantauan kesehatan ibu hamil, balita, dan layanan dasar kesehatan di posyandu.',
  },
  {
    id: 'gizi',
    label: 'Gizi',
    description: 'Laporan penimbangan, kenaikan berat badan, dan status gizi balita.',
  },
  {
    id: 'pencegahan-diare',
    label: 'Pencegahan Diare',
    description: 'Monitoring balita yang diduga diare dan pemberian oralit.',
  },
  {
    id: 'kb',
    label: 'KB',
    description: 'Pendataan peserta KB dan jenis layanan kontrasepsi yang diterima.',
  },
  {
    id: 'imunisasi',
    label: 'Imunisasi',
    description: 'Cakupan imunisasi dasar dan lanjutan sesuai jadwal balita.',
  },
];

export const metricCatalog = {
  jml_bumil: {
    category: 'kesehatan-ibu-anak',
    label: 'Jml Bumil',
    shortLabel: 'Bumil',
    defaultValue: 18,
  },
  jml_bumil_kunjungan: {
    category: 'kesehatan-ibu-anak',
    label: 'Jml Bumil yang datang / kunjungan',
    shortLabel: 'Bumil hadir',
    defaultValue: 14,
  },
  jml_bumil_vit_a: {
    category: 'kesehatan-ibu-anak',
    label: 'Pemberian Vitamin A bagi Bumil',
    shortLabel: 'Vit A Bumil',
    defaultValue: 9,
  },
  jml_balita_1_5: {
    category: 'kesehatan-ibu-anak',
    label: 'Jml Balita 1-5 tahun',
    shortLabel: 'Balita 1-5 th',
    defaultValue: 65,
  },
  balita_ditimbang: {
    category: 'gizi',
    label: 'Jml Balita Ditimbang',
    shortLabel: 'Ditimbang',
    defaultValue: 52,
  },
  balita_naik_bb: {
    category: 'gizi',
    label: 'Jml Balita Naik Berat Badan',
    shortLabel: 'Naik BB',
    defaultValue: 34,
  },
  balita_tidak_naik_bb: {
    category: 'gizi',
    label: 'Jml Balita Tidak Naik Berat Badan',
    shortLabel: 'Tidak naik BB',
    defaultValue: 11,
  },
  balita_hadir_pertama: {
    category: 'gizi',
    label: 'Jml Balita yang Pertama Kali Hadir di Timbang',
    shortLabel: 'Pertama kali hadir',
    defaultValue: 7,
  },
  balita_baru_tidak_lalu: {
    category: 'gizi',
    label: 'Jml Balita Ditimbang Bulan Ini, tetapi tidak ditimbang bulan lalu',
    shortLabel: 'Baru hadir',
    defaultValue: 6,
  },
  balita_bawah_garis_merah: {
    category: 'gizi',
    label: 'Jml Balita Berat Badannya di bawah Garis Merah (BGM)',
    shortLabel: 'BGM',
    defaultValue: 5,
  },
  balita_diduga_diare: {
    category: 'pencegahan-diare',
    label: 'Jumlah Balita diduga Diare',
    shortLabel: 'Diduga diare',
    defaultValue: 4,
  },
  balita_oralit: {
    category: 'pencegahan-diare',
    label: 'Jumlah Balita diberi Oralit',
    shortLabel: 'Oralit',
    defaultValue: 4,
  },
  pus_binaan: {
    category: 'kb',
    label: 'Jumlah PUS Binaan',
    shortLabel: 'PUS',
    defaultValue: 90,
  },
  peserta_kb_binaan: {
    category: 'kb',
    label: 'Jumlah Peserta KB Binaan',
    shortLabel: 'Peserta KB',
    defaultValue: 62,
  },
  peserta_kb_dilayani: {
    category: 'kb',
    label: 'Jumlah Peserta KB yang dilayani',
    shortLabel: 'Dibimbing',
    defaultValue: 41,
  },
  iud: {
    category: 'kb',
    label: 'IUD',
    shortLabel: 'IUD',
    defaultValue: 8,
  },
  implant: {
    category: 'kb',
    label: 'Implant',
    shortLabel: 'Implant',
    defaultValue: 12,
  },
  suntik: {
    category: 'kb',
    label: 'Suntik',
    shortLabel: 'Suntik',
    defaultValue: 16,
  },
  pil: {
    category: 'kb',
    label: 'Pil',
    shortLabel: 'Pil',
    defaultValue: 9,
  },
  kondom: {
    category: 'kb',
    label: 'Kondom',
    shortLabel: 'Kondom',
    defaultValue: 3,
  },
  hb0_24jam: {
    category: 'imunisasi',
    label: '0-24 jam HBO',
    shortLabel: 'HBO 0-24 jam',
    defaultValue: 18,
  },
  bulan_1_bcg_polio_1: {
    category: 'imunisasi',
    label: '1 bulan BCG + Polio 1',
    shortLabel: 'BCG + Polio 1',
    defaultValue: 15,
  },
  bulan_2_dpt_hib_1_pcv1_polio2_rotavirus1: {
    category: 'imunisasi',
    label: '2 bulan DPT-Hib 1 + PCV1 + Polio 2 + Rotavirus 1',
    shortLabel: 'DPT-Hib 1',
    defaultValue: 12,
  },
  bulan_3_dpt_hib_2_pcv2_polio3_rotavirus2: {
    category: 'imunisasi',
    label: '3 bulan DPT-Hib 2 + PCV2 + Polio 3 + Rotavirus 2',
    shortLabel: 'DPT-Hib 2',
    defaultValue: 11,
  },
  bulan_4_dpt_hb_hib_3_ipv1_polio4_rotavirus3: {
    category: 'imunisasi',
    label: '4 bulan DPT-HB-Hib 3 + IPV1 + Polio 4 + Rotavirus 3',
    shortLabel: 'DPT-HB-Hib 3',
    defaultValue: 13,
  },
  bulan_9_mr_ipv2: {
    category: 'imunisasi',
    label: '9 bulan MR + IPV2',
    shortLabel: 'MR + IPV2',
    defaultValue: 20,
  },
  bulan_12_pcv3: {
    category: 'imunisasi',
    label: '12 bulan PCV3',
    shortLabel: 'PCV3',
    defaultValue: 17,
  },
  bulan_18_dpt_hb_hib_a_mr2_booster: {
    category: 'imunisasi',
    label: '18 bulan DPT-HB-Hib A + MR2 (booster)',
    shortLabel: 'Booster',
    defaultValue: 16,
  },
};

const currentMonthKey = new Date().toISOString().slice(0, 7);

export const initialHasilKegiatan = Object.entries(metricCatalog).map(
  ([key, metric]) => ({
    id: `${metric.category}-${key}`,
    category: metric.category,
    key,
    label: metric.label,
    value: metric.defaultValue,
    monthKey: currentMonthKey,
    submittedBy: "",
  }),
);

export function summarizeHasilKegiatan(entries = []) {
  const byCategory = {
    'kesehatan-ibu-anak': 0,
    gizi: 0,
    'pencegahan-diare': 0,
    kb: 0,
    imunisasi: 0,
  };

  const byKey = {};

  for (const item of entries) {
    if (!item || !item.category) continue;
    if (Object.prototype.hasOwnProperty.call(byCategory, item.category)) {
      byCategory[item.category] += 1;
    }
    if (item.key) {
      byKey[item.key] = Number(item.value ?? 0);
    }
  }

  return {
    total: entries.length,
    byCategory,
    byKey,
  };
}
