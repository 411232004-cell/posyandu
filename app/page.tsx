"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { LayoutShell } from "@/components/posyandu/layout-shell";
import { WargaDigitalCard } from "@/components/posyandu/warga-digital-card";
import {
  computeDashboardStats,
  listEvents,
  listParticipants,
  listVisits,
} from "@/lib/api";
import { usePosyanduStore } from "@/lib/store";
import { formatDateId } from "@/lib/clsx";
import { StatusPill } from "@/components/ui";
import { ageLabel } from "@/lib/zscore";

export default function HomePage() {
  const router = useRouter();
  const session = usePosyanduStore((s) => s.session);

  useEffect(() => {
    if (session === null && typeof window !== "undefined") {
      const t = setTimeout(() => {
        if (!usePosyanduStore.getState().session) router.push("/login");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [session, router]);

  const { data: participants = [] } = useQuery({
    queryKey: ["participants"],
    queryFn: listParticipants,
  });
  const { data: visits = [] } = useQuery({
    queryKey: ["visits"],
    queryFn: () => listVisits(),
  });
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: listEvents,
  });

  const stats = computeDashboardStats(visits, participants);
  const isWarga = session?.role === "warga";
  const myParticipant = participants.find((p) => p.wargaId === session?.uid);
  const nextEvent = events.find((e) => e.date >= new Date().toISOString().slice(0, 10));

  const statCards = [
    {
      label: "Kehadiran Bulan Ini (D/S)",
      value: `${stats.attendancePct}%`,
      delta: `${stats.dOverS.d}/${stats.dOverS.s} sasaran`,
      icon: Activity,
    },
    {
      label: "Prevalensi Stunting",
      value: `${stats.stuntingPct}%`,
      delta: `${stats.statusBreakdown.stunting + stats.statusBreakdown.at_risk} kasus`,
      icon: HeartPulse,
    },
    {
      label: "Layanan Diberikan",
      value: `${stats.immunizationDone}`,
      delta: "imunisasi & vit A",
      icon: ShieldCheck,
    },
    {
      label: "Kunjungan Bulan Ini",
      value: `${stats.visitsThisMonth}`,
      delta: nextEvent ? formatDateId(nextEvent.date) : "—",
      icon: CalendarDays,
    },
  ];

  return (
    <LayoutShell>
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel soft-shadow rounded-[32px] p-6 md:p-8"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
            <Stethoscope className="h-3.5 w-3.5" />
            Posyandu digital platform
          </div>

          <h1 className="max-w-xl text-4xl font-black tracking-tight text-rose-950 md:text-5xl">
            Sistem <span className="gradient-text">layanan kesehatan</span>{" "}
            untuk warga dan kader.
          </h1>

          <p className="mt-4 max-w-xl text-base text-rose-900/70 md:text-lg">
            Layanan pencatatan tumbuh kembang, pemeriksaan gizi, pengingat
            imunisasi, dan pemantauan kader berbasis PWA yang siap dipakai
            online maupun offline.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {isWarga ? (
              <Link
                href="/kartu"
                className="tactile-button rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 px-5 py-3 text-sm font-semibold text-white"
              >
                Lihat kartu digital saya
              </Link>
            ) : (
              <Link
                href="/kunjungan"
                className="tactile-button rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 px-5 py-3 text-sm font-semibold text-white"
              >
                Buat kunjungan baru
              </Link>
            )}
            <Link
              href={isWarga ? "/jadwal" : "/laporan"}
              className="rounded-2xl border border-rose-200 bg-white/60 px-5 py-3 text-sm font-semibold text-rose-900 shadow-sm backdrop-blur-md"
            >
              {isWarga ? "Jadwal posyandu" : "Lihat laporan bulan ini"}
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {statCards.map(({ label, value, delta, icon: Icon }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="glass-panel soft-shadow rounded-[28px] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
                  <Icon className="h-5 w-5" />
                </div>
                <StatusPill tone="emerald">{delta}</StatusPill>
              </div>
              <p className="mt-4 text-sm text-rose-900/70">{label}</p>
              <p className="mt-2 text-3xl font-black text-rose-950">{value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {isWarga && myParticipant ? (
        <section className="mb-8 grid gap-6 xl:grid-cols-2">
          <WargaDigitalCard participant={myParticipant} wargaName={session?.name} />
          <div className="glass-panel soft-shadow rounded-[32px] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
              Jadwal berikutnya
            </p>
            {nextEvent ? (
              <>
                <h3 className="mt-2 text-2xl font-black text-rose-950">
                  {nextEvent.title}
                </h3>
                <p className="mt-2 text-sm text-rose-900/70">
                  {formatDateId(nextEvent.date)} · {nextEvent.startTime}–
                  {nextEvent.endTime} · {nextEvent.location}
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm text-rose-900/70">
                Belum ada jadwal terdekat.
              </p>
            )}
            <div className="mt-6 rounded-[24px] border border-rose-100 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-950">
                {myParticipant.fullName} · {ageLabel(myParticipant.dob)}
              </p>
              <p className="mt-1 text-xs text-rose-900/60">
                Tunjukkan QR pada kartu digital kepada kader saat check-in di
                Meja 1.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="mb-8 rounded-[32px] border border-rose-100 bg-white/55 p-5 shadow-[0_20px_45px_rgba(244,63,94,0.08)] backdrop-blur-md md:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
                Workflow kader
              </p>
              <h2 className="mt-2 text-2xl font-black text-rose-950">
                5-Meja pelayanan terpandu
              </h2>
            </div>
            <Link
              href="/kunjungan"
              className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700"
            >
              Lanjutkan sesi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mb-6 max-w-2xl text-sm text-rose-900/70">
            Alur check-in QR → antropometri → evaluasi gizi otomatis → layanan →
            konseling & rujukan. Semua data tersimpan offline-first dan
            tersinkron ke Firestore.
          </p>
          <Link
            href="/kunjungan"
            className="tactile-button inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Mulai sesi pelayanan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}
    </LayoutShell>
  );
}
