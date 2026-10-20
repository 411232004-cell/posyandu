import type {
  HasilKegiatanEntry,
  ParticipantRecord,
  PosyanduEvent,
  UserRecord,
  VisitRecord,
} from "@/types/posyandu";

const now = new Date().toISOString();

function monthsAgo(n: number, day = 10): string {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setDate(day);
  return d.toISOString().slice(0, 10);
}

export const demoUsers: UserRecord[] = [
  {
    id: "u-kader-1",
    name: "Nina Sari",
    email: "kader@posyandu.id",
    role: "kader",
    villageId: "desa-arumsari",
    createdAt: now,
    updatedAt: now,
    isActive: true,
  },
  {
    id: "u-warga-1",
    name: "Ratna Dewi",
    email: "warga@posyandu.id",
    role: "warga",
    villageId: "desa-arumsari",
    createdAt: now,
    updatedAt: now,
    isActive: true,
  },
];

export const demoParticipants: ParticipantRecord[] = [
  {
    id: "p-rania",
    wargaId: "u-warga-1",
    nik: "3201234509870002",
    parentName: "Ratna Dewi",
    fullName: "Rania Putri",
    dob: monthsAgo(14, 12),
    gender: "Perempuan",
    participantType: "balita",
    familyId: "3201010203040001",
    villageId: "desa-arumsari",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p-bima",
    wargaId: "u-warga-2",
    nik: "3201234509870003",
    parentName: "Sari Wulandari",
    fullName: "Bima Pratama",
    dob: monthsAgo(30, 5),
    gender: "Laki-laki",
    participantType: "balita",
    familyId: "3201010203040002",
    villageId: "desa-arumsari",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p-salsabila",
    wargaId: "u-warga-3",
    nik: "3201234509870004",
    parentName: "Dina Fitriani",
    fullName: "Salsabila Zahra",
    dob: monthsAgo(22, 20),
    gender: "Perempuan",
    participantType: "balita",
    familyId: "3201010203040003",
    villageId: "desa-arumsari",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p-harto",
    wargaId: "u-warga-4",
    nik: "3201234509870005",
    parentName: "Harto Wijaya",
    fullName: "Harto Wijaya",
    dob: monthsAgo(800, 3),
    gender: "Laki-laki",
    participantType: "lansia",
    familyId: "3201010203040004",
    villageId: "desa-arumsari",
    createdAt: now,
    updatedAt: now,
  },
];

function visit(
  id: string,
  participantId: string,
  wargaId: string,
  monthsBack: number,
  weightKg: number,
  heightCm: number,
  extras: Partial<VisitRecord> = {},
): VisitRecord {
  const date = monthsAgo(monthsBack);
  return {
    id,
    participantId,
    wargaId,
    kaderId: "u-kader-1",
    date,
    monthKey: date.slice(0, 7),
    weightKg,
    heightCm,
    headCircumferenceCm: extras.headCircumferenceCm,
    upperArmCircumferenceCm: extras.upperArmCircumferenceCm ?? 13.5,
    zScore: extras.zScore,
    statusGizi: extras.statusGizi ?? "normal",
    immunizations: extras.immunizations ?? [],
    vitaminA: extras.vitaminA ?? false,
    deworming: extras.deworming ?? false,
    pmtGiven: extras.pmtGiven ?? false,
    counselingNotes: extras.counselingNotes,
    referralIssued: extras.referralIssued ?? false,
    referralTarget: extras.referralTarget,
    syncedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

export const demoVisits: VisitRecord[] = [
  visit("v-rania-5", "p-rania", "u-warga-1", 5, 8.4, 73.5, {
    immunizations: ["Campak/MR"],
    vitaminA: true,
    zScore: -0.8,
  }),
  visit("v-rania-4", "p-rania", "u-warga-1", 4, 8.7, 74.2, { zScore: -0.7 }),
  visit("v-rania-3", "p-rania", "u-warga-1", 3, 9.0, 74.9, {
    immunizations: ["DPT-HB-Hib 3"],
    zScore: -0.6,
  }),
  visit("v-rania-2", "p-rania", "u-warga-1", 2, 9.2, 75.8, { zScore: -0.55 }),
  visit("v-rania-1", "p-rania", "u-warga-1", 1, 9.4, 76.4, {
    vitaminA: true,
    pmtGiven: true,
    zScore: -0.5,
  }),
  visit("v-bima-5", "p-bima", "u-warga-2", 5, 12.4, 87.0, { zScore: -0.4 }),
  visit("v-bima-4", "p-bima", "u-warga-2", 4, 12.5, 87.6, { zScore: -0.45 }),
  visit("v-bima-3", "p-bima", "u-warga-2", 3, 12.4, 88.1, {
    zScore: -0.7,
    statusGizi: "warning",
    counselingNotes: "BB stagnan, edukasi MP-ASI padat gizi.",
  }),
  visit("v-bima-2", "p-bima", "u-warga-2", 2, 12.3, 88.5, {
    zScore: -0.85,
    statusGizi: "warning",
    counselingNotes: "BB turun 2 bulan berturut (2T). Rujuk ke unit kesehatan terkait.",
    referralIssued: true,
    referralTarget: "Unit Kesehatan Terkait",
  }),
  visit("v-bima-1", "p-bima", "u-warga-2", 1, 12.35, 88.9, {
    zScore: -0.8,
    statusGizi: "warning",
    vitaminA: true,
  }),
  visit("v-salsa-3", "p-salsabila", "u-warga-3", 3, 9.8, 80.2, {
    zScore: -2.4,
    statusGizi: "at_risk",
    pmtGiven: true,
  }),
  visit("v-salsa-2", "p-salsabila", "u-warga-3", 2, 9.9, 80.8, {
    zScore: -2.35,
    statusGizi: "at_risk",
    pmtGiven: true,
    counselingNotes: "PMT pemulihan dilanjutkan.",
  }),
  visit("v-salsa-1", "p-salsabila", "u-warga-3", 1, 10.1, 81.3, {
    zScore: -2.2,
    statusGizi: "at_risk",
    immunizations: ["PCV 2"],
  }),
  visit("v-harto-1", "p-harto", "u-warga-4", 1, 58.2, 162, {
    counselingNotes: "Tekanan darah 130/85, kontrol rutin.",
  }),
];

export const demoHasilKegiatan: HasilKegiatanEntry[] = [
  {
    id: "hk-1",
    category: "kesehatan-ibu-anak",
    key: "jml_bumil",
    label: "Jml Bumil",
    value: 18,
    monthKey: new Date().toISOString().slice(0, 7),
    submittedBy: "Nina Sari",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "hk-2",
    category: "kesehatan-ibu-anak",
    key: "jml_bumil_kunjungan",
    label: "Jml Bumil yang datang / kunjungan",
    value: 14,
    monthKey: new Date().toISOString().slice(0, 7),
    submittedBy: "Nina Sari",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "hk-3",
    category: "gizi",
    key: "balita_ditimbang",
    label: "Jml Balita Ditimbang",
    value: 52,
    monthKey: new Date().toISOString().slice(0, 7),
    submittedBy: "Nina Sari",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "hk-4",
    category: "gizi",
    key: "balita_naik_bb",
    label: "Jml Balita Naik Berat Badan",
    value: 34,
    monthKey: new Date().toISOString().slice(0, 7),
    submittedBy: "Nina Sari",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "hk-5",
    category: "pencegahan-diare",
    key: "balita_diduga_diare",
    label: "Jumlah Balita diduga Diare",
    value: 4,
    monthKey: new Date().toISOString().slice(0, 7),
    submittedBy: "Nina Sari",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "hk-6",
    category: "kb",
    key: "pus_binaan",
    label: "Jumlah PUS Binaan",
    value: 90,
    monthKey: new Date().toISOString().slice(0, 7),
    submittedBy: "Nina Sari",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "hk-7",
    category: "imunisasi",
    key: "hb0_24jam",
    label: "0-24 jam HBO",
    value: 18,
    monthKey: new Date().toISOString().slice(0, 7),
    submittedBy: "Nina Sari",
    createdAt: now,
    updatedAt: now,
  },
];

export const demoEvents: PosyanduEvent[] = [
  {
    id: "ev-1",
    title: "Penimbangan & Imunisasi Rutin",
    date: nextWeekday(5),
    startTime: "08.00",
    endTime: "11.00",
    location: "Posyandu Melati, RW 04",
    organizerId: "u-kader-1",
    venueAddress: "Balai RW 04, Dusun Arum Sari",
    targetAudience: ["balita"],
    description: "Penimbangan BB/TB, pengukuran LILA & LK, imunisasi dasar.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ev-2",
    title: "Pemberian Vitamin A & Obat Cacing",
    date: nextWeekday(5, 2),
    startTime: "08.30",
    endTime: "10.30",
    location: "Posyandu Melati, RW 04",
    organizerId: "u-kader-1",
    venueAddress: "Balai RW 04, Dusun Arum Sari",
    targetAudience: ["balita"],
    description: "Vitamin A kapsul biru/merah + albendazole untuk balita.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ev-3",
    title: "Kelas Ibu & Lansia",
    date: nextWeekday(3, 3),
    startTime: "09.00",
    endTime: "11.00",
    location: "Aula Posyandu",
    organizerId: "u-admin-1",
    venueAddress: "Pustu Arum Sari",
    targetAudience: ["lansia", "balita"],
    description: "Edukasi gizi lansia, cek tensi, dan konseling MP-ASI.",
    createdAt: now,
    updatedAt: now,
  },
];

function nextWeekday(day: number, weeksAhead = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + weeksAhead * 7);
  const diff = (day - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}
