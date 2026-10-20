"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarRange, Clock, MapPin, Users } from "lucide-react";
import { LayoutShell } from "@/components/posyandu/layout-shell";
import { listEvents } from "@/lib/api";
import { formatDateId } from "@/lib/clsx";
import { SectionHeading, StatusPill } from "@/components/ui";

export default function JadwalPage() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: listEvents,
  });

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.date >= today);
  const past = events.filter((e) => e.date < today);

  return (
    <LayoutShell>
      <section className="glass-panel soft-shadow rounded-[32px] p-5 md:p-7">
        <SectionHeading eyebrow="Agenda" title="Jadwal kegiatan posyandu" />
        {isLoading && (
          <p className="text-sm text-rose-900/60">Memuat jadwal…</p>
        )}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {upcoming.map((e) => (
            <article
              key={e.id}
              className="rounded-[24px] border border-rose-100 bg-white/75 p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <StatusPill tone="emerald">Akan datang</StatusPill>
                <div className="flex gap-1">
                  {e.targetAudience.map((t) => (
                    <StatusPill key={t} tone={t === "balita" ? "rose" : "slate"}>
                      {t}
                    </StatusPill>
                  ))}
                </div>
              </div>
              <h3 className="text-lg font-black text-rose-950">{e.title}</h3>
              <div className="mt-3 space-y-1.5 text-sm text-rose-900/70">
                <p className="flex items-center gap-2">
                  <CalendarRange className="h-4 w-4 text-rose-500" />
                  {formatDateId(e.date)}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-rose-500" />
                  {e.startTime} – {e.endTime} WIB
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-rose-500" />
                  {e.location} · {e.venueAddress}
                </p>
                {e.description && (
                  <p className="flex items-start gap-2 pt-1 text-xs">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                    {e.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {past.length > 0 && (
          <>
            <h3 className="mb-3 mt-8 text-sm font-bold uppercase tracking-[0.2em] text-rose-500">
              Riwayat kegiatan
            </h3>
            <div className="space-y-2">
              {past.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-rose-950">{e.title}</span>
                  <span className="text-rose-900/60">{formatDateId(e.date)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </LayoutShell>
  );
}
