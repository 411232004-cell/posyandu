export type PendataanCategory = "ibu-hamil" | "kb" | "imunisasi";
export type PendataanStatus = "aktif" | "monitoring" | "beresiko" | "lengkap" | "tertunda";

export interface PendataanRecord {
  id: string;
  category: PendataanCategory;
  name: string;
  detail: string;
  status: PendataanStatus;
  date: string;
  note: string;
}

export interface PendataanSection {
  id: PendataanCategory;
  label: string;
  description: string;
  statusOptions: PendataanStatus[];
  fields: string[];
}

export const pendataanSections: PendataanSection[];
export const initialPendataanRecords: PendataanRecord[];

export function summarizePendataan(
  records?: PendataanRecord[],
): {
  total: number;
  activeTotal: number;
  byCategory: Record<PendataanCategory, number>;
  byStatus: Record<PendataanStatus, number>;
};
