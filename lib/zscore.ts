import type { Gender, GrowthPoint, VisitRecord, ZScoreStatus } from "@/types/posyandu";

const ANCHOR_AGES = [
  0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60,
];

const WFA_MEDIAN: Record<Gender, number[]> = {
  "Laki-laki": [
    3.3, 6.0, 7.9, 8.9, 9.6, 10.3, 10.9, 11.5, 12.2, 12.7, 13.3, 13.7, 14.3,
    14.8, 15.3, 15.8, 16.3, 16.8, 17.3, 17.8, 18.3,
  ],
  Perempuan: [
    3.2, 5.8, 7.3, 8.2, 8.9, 9.6, 10.2, 10.9, 11.5, 12.1, 12.7, 13.3, 13.9,
    14.4, 15.0, 15.5, 16.1, 16.6, 17.2, 17.7, 18.2,
  ],
};

const HFA_MEDIAN: Record<Gender, number[]> = {
  "Laki-laki": [
    49.9, 61.4, 67.6, 72.0, 75.7, 79.1, 82.3, 85.1, 87.1, 89.0, 90.7, 92.4,
    94.2, 96.1, 98.0, 99.9, 101.9, 103.8, 105.7, 107.5, 109.4,
  ],
  Perempuan: [
    49.1, 59.8, 65.7, 70.1, 74.0, 77.5, 80.7, 83.6, 86.4, 88.3, 90.1, 91.9,
    93.6, 95.4, 97.1, 99.0, 100.9, 102.7, 104.5, 106.2, 107.9,
  ],
};

const WFA_CV = 0.13;
const HFA_CV = 0.037;

function lerp(x: number, x0: number, x1: number, y0: number, y1: number) {
  return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
}

function interpolate(table: number[], ageMonths: number): number {
  const clamped = Math.max(0, Math.min(60, ageMonths));
  for (let i = 0; i < ANCHOR_AGES.length - 1; i += 1) {
    const a = ANCHOR_AGES[i];
    const b = ANCHOR_AGES[i + 1];
    if (clamped >= a && clamped <= b) {
      return lerp(clamped, a, b, table[i], table[i + 1]);
    }
  }
  return table[table.length - 1];
}

export function ageInMonths(dob: string, at: Date = new Date()): number {
  const birth = new Date(dob);
  const months =
    (at.getFullYear() - birth.getFullYear()) * 12 +
    (at.getMonth() - birth.getMonth());
  const dayAdj = at.getDate() < birth.getDate() ? 1 : 0;
  return Math.max(0, months - dayAdj);
}

export function ageLabel(dob: string, at: Date = new Date()): string {
  const months = ageInMonths(dob, at);
  if (months < 24) return `${months} bulan`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest === 0 ? `${years} tahun` : `${years} th ${rest} bln`;
}

export function weightForAgeMedian(gender: Gender, ageMonths: number): number {
  return interpolate(WFA_MEDIAN[gender], ageMonths);
}

export function heightForAgeMedian(gender: Gender, ageMonths: number): number {
  return interpolate(HFA_MEDIAN[gender], ageMonths);
}

export function weightForAgeZ(
  gender: Gender,
  ageMonths: number,
  weightKg: number,
): number {
  const median = weightForAgeMedian(gender, ageMonths);
  const sd = median * WFA_CV;
  return Number(((weightKg - median) / sd).toFixed(2));
}

export function heightForAgeZ(
  gender: Gender,
  ageMonths: number,
  heightCm: number,
): number {
  const median = heightForAgeMedian(gender, ageMonths);
  const sd = median * HFA_CV;
  return Number(((heightCm - median) / sd).toFixed(2));
}

export function classifyZ(zScore: number | undefined): ZScoreStatus {
  if (zScore === undefined || Number.isNaN(zScore)) return "warning";
  if (zScore < -3) return "stunting";
  if (zScore < -2) return "at_risk";
  if (zScore > 3) return "warning";
  return "normal";
}

export function detectTwoT(visits: VisitRecord[]): boolean {
  const sorted = [...visits]
    .filter((v) => typeof v.weightKg === "number")
    .sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length < 2) return false;
  const last = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];
  const prevMonth = prev.date.slice(0, 7);
  const lastMonth = last.date.slice(0, 7);
  if (prevMonth === lastMonth) return false;
  return (last.weightKg ?? 0) <= (prev.weightKg ?? 0);
}

export interface BandPoint {
  age: number;
  sd3neg: number;
  sd2neg: number;
  median: number;
  sd2pos: number;
  sd3pos: number;
}

export function weightBands(gender: Gender): BandPoint[] {
  return ANCHOR_AGES.map((age) => {
    const m = WFA_MEDIAN[gender][ANCHOR_AGES.indexOf(age)];
    const sd = m * WFA_CV;
    return {
      age,
      sd3neg: Number((m - 3 * sd).toFixed(2)),
      sd2neg: Number((m - 2 * sd).toFixed(2)),
      median: Number(m.toFixed(2)),
      sd2pos: Number((m + 2 * sd).toFixed(2)),
      sd3pos: Number((m + 3 * sd).toFixed(2)),
    };
  });
}

export function statusLabel(status: ZScoreStatus): string {
  switch (status) {
    case "normal":
      return "Gizi Normal";
    case "warning":
      return "Perlu Pemantauan";
    case "at_risk":
      return "Risiko (Gizi Kurang)";
    case "stunting":
      return "Stunting / Gizi Buruk";
  }
}

export function growthPoints(visits: VisitRecord[], dob: string): GrowthPoint[] {
  return [...visits]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((v) => ({
      ageMonths: ageInMonths(dob, new Date(v.date)),
      weightKg: v.weightKg,
      heightCm: v.heightCm,
      date: v.date,
    }));
}
