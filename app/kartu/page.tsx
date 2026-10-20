"use client";

import { useQuery } from "@tanstack/react-query";
import { BellRing, ShieldCheck, Syringe } from "lucide-react";
import { LayoutShell } from "@/components/posyandu/layout-shell";
import { WargaDigitalCard } from "@/components/posyandu/warga-digital-card";
import { GrowthChart } from "@/components/posyandu/growth-chart";
import { SectionHeading, StatusPill } from "@/components/ui";
import { listEvents, listParticipants, listVisits } from "@/lib/api";
import { usePosyanduStore } from "@/lib/store";
import { formatDateId } from "@/lib/clsx";
import { statusLabel } from "@/lib/zscore";

export default function KartuPage() {
  const session = usePosyanduStore((s) => s.session);
  const { data: participants = [] } = useQuery({
    queryKey: ["participants"],
    queryFn: listParticipants,
  });
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: listEvents,
  });

  const participant =
    participants.find((p) => p.wargaId === session?.uid) ?? participants[0];

  const { data: visits = [] } = useQuery({
    queryKey: ["visits", participant?.id],
    queryFn: () => listVisits(participant!.id),
    enabled: Boolean(participant),
  });

  if (!participant) {
    return (
      <LayoutShell>
        <p className="glass-panel soft-shadow rounded-[32px] p-6 text-sm text-rose-900/70">
          Data peserta tidak ditemukan.
        </p>
      </LayoutShell>
    );
  }

  const lastVisit = [...visits].sort((a, b) => b.date.localeCompare(a.date))[0];
  const nextEvent = events.find(
    (e) => e.date >= new Date().toISOString().slice(0, 10),
  );
  const reminders = [
    {
      icon: Syringe,
      title: "Imunisasi berikutnya",
      detail: nextEvent
        ? `${nextEvent.title} · ${formatDateId(nextEvent.date)}`
        : "Menunggu jadwal",
    },
    {
      icon: BellRing,
      title: "Vitamin A",
      detail: lastVisit?.vitaminA
        ? "Sudah diberikan bulan ini"
        : "Jadwalkan pada kunjungan berikutnya",
    },
    {
      icon: ShieldCheck,
      title: "Status gizi terakhir",
      detail: lastVisit ? statusLabel(lastVisit.statusGizi) : "Belum ada data",
    },
  ];

  return (
    <LayoutShell>
      <section className="mb-8 grid gap-6 xl:grid-cols-2">
        <WargaDigitalCard participant={participant} wargaName={session?.name} />

        <div className="glass-panel soft-shadow rounded-[32px] p-5 md:p-6">
          <SectionHeading
            eyebrow="Pengingat"
            title="Imunisasi & layanan"
          />
          <div className="space-y-3">
            {reminders.map(({ icon: Icon, title, detail }) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-white/70 p-4"
              >
                <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-rose-950">{title}</p>
                  <p className="text-xs text-rose-900/60">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel soft-shadow rounded-[32px] p-5 md:p-6">
        <SectionHeading
          eyebrow="KMS Digital"
          title={`Kurva berat badan — ${participant.fullName}`}
          action={
            lastVisit && (
              <StatusPill
                tone={
                  lastVisit.statusGizi === "normal"
                    ? "emerald"
                    : lastVisit.statusGizi === "stunting"
                      ? "rose"
                      : "amber"
                }
              >
                {statusLabel(lastVisit.statusGizi)}
              </StatusPill>
            )
          }
        />
        <GrowthChart participant={participant} visits={visits} />
      </section>
    </LayoutShell>
  );
}
