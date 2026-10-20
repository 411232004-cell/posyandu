"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Baby,
  ClipboardCheck,
  HeartPulse,
  PieChart,
  ShieldCheck,
  Syringe,
} from "lucide-react";
import { LayoutShell } from "@/components/posyandu/layout-shell";
import { EppgbmExport } from "@/components/posyandu/eppgbm-export";
import { SectionHeading, StatusPill } from "@/components/ui";
import {
  computeDashboardStats,
  listParticipants,
  listVisits,
} from "@/lib/api";
import { statusLabel } from "@/lib/zscore";
import type { ZScoreStatus } from "@/types/posyandu";

const tone: Record<ZScoreStatus, "emerald" | "amber" | "rose"> = {
  normal: "emerald",
  warning: "amber",
  at_risk: "amber",
  stunting: "rose",
};

export default function LaporanPage() {
  const { data: participants = [] } = useQuery({
    queryKey: ["participants"],
    queryFn: listParticipants,
  });
  const { data: visits = [] } = useQuery({
    queryKey: ["visits"],
    queryFn: () => listVisits(),
  });

  const stats = computeDashboardStats(visits, participants);
  const monthLabel = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  const breakdown: { status: ZScoreStatus; count: number }[] = [
    { status: "normal", count: stats.statusBreakdown.normal },
    { status: "warning", count: stats.statusBreakdown.warning },
    { status: "at_risk", count: stats.statusBreakdown.at_risk },
    { status: "stunting", count: stats.statusBreakdown.stunting },
  ];
  const max = Math.max(1, ...breakdown.map((b) => b.count));

  return (
    <LayoutShell>
      <section className="glass-panel soft-shadow mb-8 rounded-[32px] p-5 md:p-7">
        <SectionHeading
          eyebrow="Pelaporan"
          title={`Rekap ${monthLabel} — format e-PPGBM`}
          action={<EppgbmExport visits={visits} participants={participants} />}
        />
        <p className="mb-6 max-w-2xl text-sm text-rose-900/70">
          Ekspor kolom sesuai format e-PPGBM Kemenkes (BB, TB, LK, LILA,
          imunisasi, Vit A, PMT) untuk pelaporan bulanan posyandu.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Cakupan D/S",
              value: `${stats.dOverS.d}/${stats.dOverS.s}`,
              sub: `${stats.attendancePct}% sasaran hadir`,
              icon: ClipboardCheck,
            },
            {
              label: "Prevalensi stunting",
              value: `${stats.stuntingPct}%`,
              sub: "at_risk + stunting bulan ini",
              icon: HeartPulse,
            },
            {
              label: "Layanan diberikan",
              value: `${stats.immunizationDone}`,
              sub: "imunisasi & vitamin A",
              icon: Syringe,
            },
            {
              label: "Total kunjungan",
              value: `${stats.visitsThisMonth}`,
              sub: "bulan berjalan",
              icon: Baby,
            },
          ].map(({ label, value, sub, icon: Icon }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[24px] border border-rose-100 bg-white/70 p-4"
            >
              <div className="rounded-2xl bg-rose-100 p-3 text-rose-600 w-fit">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-3xl font-black text-rose-950">{value}</p>
              <p className="text-sm font-semibold text-rose-900">{label}</p>
              <p className="text-xs text-rose-900/60">{sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="glass-panel soft-shadow rounded-[32px] p-5 md:p-7">
        <SectionHeading
          eyebrow="Analitik"
          title="Distribusi status gizi bulan ini"
        />
        <div className="space-y-3">
          {breakdown.map(({ status, count }) => (
            <div key={status} className="flex items-center gap-3">
              <div className="w-40 shrink-0">
                <StatusPill tone={tone[status]}>{statusLabel(status)}</StatusPill>
              </div>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-rose-100">
                <div
                  className={`h-full rounded-full ${
                    status === "normal"
                      ? "bg-emerald-400"
                      : status === "stunting"
                        ? "bg-rose-500"
                        : "bg-amber-400"
                  }`}
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right text-sm font-black text-rose-950">
                {count}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2 rounded-2xl bg-rose-50 p-4 text-sm text-rose-900/70">
          <PieChart className="h-4 w-4 text-rose-500" />
          Indikator mengikuti metrik portal Posyandu Kemendagri: D/S (sasaran
          datang), prevalensi gizi, dan cakupan layanan.
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
        </div>
      </section>
    </LayoutShell>
  );
}
