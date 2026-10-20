export type HasilKegiatanCategory =
  | 'kesehatan-ibu-anak'
  | 'gizi'
  | 'pencegahan-diare'
  | 'kb'
  | 'imunisasi';

export type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export interface HasilKegiatanEntry {
  id: string;
  category: HasilKegiatanCategory;
  key: string;
  label: string;
  value: number;
  monthKey: string;
  submittedBy?: string;
  createdAt?: string | FirestoreTimestamp;
  updatedAt?: string | FirestoreTimestamp;
}

export interface HasilKegiatanSection {
  id: HasilKegiatanCategory;
  label: string;
  description: string;
}

export const hasilKegiatanSections: HasilKegiatanSection[];
export const initialHasilKegiatan: HasilKegiatanEntry[];

export function summarizeHasilKegiatan(
  entries?: HasilKegiatanEntry[],
): {
  total: number;
  byCategory: Record<HasilKegiatanCategory, number>;
  byKey: Record<string, number>;
};
