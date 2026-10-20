export type UserRole = "warga" | "kader";
export type ParticipantType = "balita" | "lansia";
export type Gender = "Laki-laki" | "Perempuan";
export type ZScoreStatus = "normal" | "warning" | "stunting" | "at_risk";
export type HasilKegiatanCategory =
  | "kesehatan-ibu-anak"
  | "gizi"
  | "pencegahan-diare"
  | "kb"
  | "imunisasi";

export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface UserRecord {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  villageId?: string;
  createdAt: FirestoreTimestamp | string;
  updatedAt: FirestoreTimestamp | string;
  isActive: boolean;
}

export interface ParticipantRecord {
  id: string;
  wargaId: string;
  nik: string;
  parentName: string;
  fullName: string;
  dob: string;
  gender: Gender;
  participantType: ParticipantType;
  familyId: string;
  villageId: string;
  createdAt: FirestoreTimestamp | string;
  updatedAt: FirestoreTimestamp | string;
}

export interface VisitRecord {
  id: string;
  participantId: string;
  wargaId: string;
  kaderId: string;
  date: string;
  monthKey: string;
  weightKg?: number;
  heightCm?: number;
  headCircumferenceCm?: number;
  upperArmCircumferenceCm?: number;
  zScore?: number;
  statusGizi: ZScoreStatus;
  immunizations: string[];
  vitaminA: boolean;
  deworming: boolean;
  pmtGiven: boolean;
  counselingNotes?: string;
  referralIssued: boolean;
  referralTarget?: string;
  offlineQueued?: boolean;
  syncedAt?: FirestoreTimestamp | string;
  createdAt: FirestoreTimestamp | string;
  updatedAt: FirestoreTimestamp | string;
}

export interface PosyanduEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  organizerId: string;
  venueAddress: string;
  targetAudience: ParticipantType[];
  description?: string;
  createdAt: FirestoreTimestamp | string;
  updatedAt: FirestoreTimestamp | string;
}

export interface HasilKegiatanEntry {
  id: string;
  category: HasilKegiatanCategory;
  key: string;
  label: string;
  value: number;
  monthKey: string;
  submittedBy?: string;
  createdAt?: FirestoreTimestamp | string;
  updatedAt?: FirestoreTimestamp | string;
}

export interface HasilKegiatanReport {
  id: string;
  monthKey: string;
  submittedBy: string;
  role: UserRole;
  entries: HasilKegiatanEntry[];
  createdAt: FirestoreTimestamp | string;
  updatedAt: FirestoreTimestamp | string;
}

export interface PosyanduSchema {
  users: Record<string, UserRecord>;
  participants: Record<string, ParticipantRecord>;
  visits: Record<string, VisitRecord>;
  posyandu_events: Record<string, PosyanduEvent>;
  hasil_kegiatan: Record<string, HasilKegiatanReport>;
}

export const firestoreCollections = {
  users: "users",
  participants: "participants",
  visits: "visits",
  posyanduEvents: "posyandu_events",
  hasilKegiatan: "hasil_kegiatan",
} as const;

export type VisitInput = Omit<
  VisitRecord,
  "id" | "createdAt" | "updatedAt" | "syncedAt" | "zScore" | "statusGizi"
> & {
  zScore?: number;
  statusGizi: ZScoreStatus;
};

export interface SessionUser {
  uid: string;
  name: string;
  role: UserRole;
  email?: string;
  villageId?: string;
  wargaId?: string;
}

export interface PendingVisit extends VisitInput {
  queueId: string;
  queuedAt: string;
}

export interface ReferralLetter {
  participantName: string;
  nik: string;
  ageLabel: string;
  reason: string;
  target: string;
  issuedAt: string;
  kaderName: string;
}

export interface GrowthPoint {
  ageMonths: number;
  weightKg?: number;
  heightCm?: number;
  date: string;
}

export interface DashboardStats {
  attendancePct: number;
  stuntingPct: number;
  immunizationDone: number;
  visitsThisMonth: number;
  dOverS: { d: number; s: number };
  statusBreakdown: Record<ZScoreStatus, number>;
}
