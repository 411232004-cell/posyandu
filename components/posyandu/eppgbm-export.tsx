"use client";

import { FileSpreadsheet, Loader2 } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { ageInMonths, statusLabel } from "@/lib/zscore";
import type { ParticipantRecord, VisitRecord } from "@/types/posyandu";

export function EppgbmExport({
  visits,
  participants,
}: {
  visits: VisitRecord[];
  participants: ParticipantRecord[];
}) {
  const [busy, setBusy] = useState(false);

  const exportXlsx = () => {
    setBusy(true);
    try {
      const byId = new Map(participants.map((p) => [p.id, p]));
      const rows = [...visits]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((v, i) => {
          const p = byId.get(v.participantId);
          return {
            No: i + 1,
            "Nama Anak/Peserta": p?.fullName ?? v.participantId,
            NIK: p?.nik ?? "-",
            "Tgl Lahir": p?.dob ?? "-",
            "Umur (bln)": p ? ageInMonths(p.dob, new Date(v.date)) : "-",
            "Jenis Kelamin": p?.gender ?? "-",
            "Nama Ortu": p?.parentName ?? "-",
            "Tgl Kunjungan": v.date,
            "BB (kg)": v.weightKg ?? "",
            "TB (cm)": v.heightCm ?? "",
            "LK (cm)": v.headCircumferenceCm ?? "",
            "LILA (cm)": v.upperArmCircumferenceCm ?? "",
            "Z-Score": v.zScore ?? "",
            "Status Gizi": statusLabel(v.statusGizi),
            Imunisasi: v.immunizations.join(", ") || "-",
            "Vit A": v.vitaminA ? "Ya" : "Tidak",
            "Obat Cacing": v.deworming ? "Ya" : "Tidak",
            PMT: v.pmtGiven ? "Ya" : "Tidak",
            Rujukan: v.referralIssued ? v.referralTarget ?? "Ya" : "-",
            Catatan: v.counselingNotes ?? "",
          };
        });

      const ws = XLSX.utils.json_to_sheet(rows);
      ws["!cols"] = Object.keys(rows[0] ?? { No: 0 }).map((key) => ({
        wch: Math.max(
          key.length + 2,
          ...rows.map((r) => String(r[key as keyof typeof r]).length + 2),
        ),
      }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "e-PPGBM");
      const month = new Date().toISOString().slice(0, 7);
      XLSX.writeFile(wb, `eppgbm-posyandu-${month}.xlsx`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={exportXlsx}
      disabled={busy || visits.length === 0}
      className="tactile-button inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileSpreadsheet className="h-4 w-4" />
      )}
      Export e-PPGBM (.xlsx)
    </button>
  );
}
