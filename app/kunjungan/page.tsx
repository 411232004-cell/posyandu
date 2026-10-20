"use client";

import { useQuery } from "@tanstack/react-query";
import { LayoutShell } from "@/components/posyandu/layout-shell";
import { FiveMejaStepper } from "@/components/posyandu/five-meja-stepper";
import { listParticipants, listVisits } from "@/lib/api";
import { SectionHeading, StatusPill } from "@/components/ui";
import { ageLabel, statusLabel } from "@/lib/zscore";
import { formatDateId } from "@/lib/clsx";
import type { ZScoreStatus } from "@/types/posyandu";

const tone: Record<ZScoreStatus, "emerald" | "amber" | "rose"> = {
  normal: "emerald",
  warning: "amber",
  at_risk: "amber",
  stunting: "rose",
};

export default function KunjunganPage() {
  const { data: visits = [] } = useQuery({
    queryKey: ["visits"],
    queryFn: () => listVisits(),
  });
  const { data: participants = [] } = useQuery({
    queryKey: ["participants"],
    queryFn: listParticipants,
  });

  const byId = new Map(participants.map((p) => [p.id, p]));
  const recent = [...visits].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <LayoutShell>
      <section className="mb-8 rounded-[32px] border border-rose-100 bg-white/55 p-5 shadow-[0_20px_45px_rgba(244,63,94,0.08)] backdrop-blur-md md:p-7">
        <SectionHeading
          eyebrow="Pelayanan"
          title="5-Meja — sesi kunjungan baru"
        />
        <FiveMejaStepper />
      </section>

      <section className="glass-panel soft-shadow rounded-[32px] p-5 md:p-6">
        <SectionHeading eyebrow="Riwayat" title="Kunjungan terakhir" />
        <div className="space-y-3">
          {recent.map((v) => {
            const p = byId.get(v.participantId);
            return (
              <div
                key={v.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-rose-100 bg-white/70 p-4"
              >
                <div className="min-w-[180px] flex-1">
                  <p className="font-bold text-rose-950">
                    {p?.fullName ?? v.participantId}
                  </p>
                  <p className="text-xs text-rose-900/60">
                    {formatDateId(v.date)} · {p ? ageLabel(p.dob) : ""}
                    {v.offlineQueued ? " · antrian offline" : ""}
                  </p>
                </div>
                <div className="text-sm font-semibold text-rose-900">
                  {v.weightKg ? `${v.weightKg} kg` : "—"} ·{" "}
                  {v.heightCm ? `${v.heightCm} cm` : "—"}
                </div>
                <StatusPill tone={tone[v.statusGizi]}>
                  {statusLabel(v.statusGizi)}
                </StatusPill>
                {v.referralIssued && (
                  <StatusPill tone="rose">Dirujuk</StatusPill>
                )}
              </div>
            );
          })}
          {recent.length === 0 && (
            <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-900/70">
              Belum ada kunjungan tercatat.
            </p>
          )}
        </div>
      </section>
    </LayoutShell>
  );
}
