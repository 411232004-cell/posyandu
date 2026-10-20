"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Loader2,
  Pill,
  QrCode,
  Stethoscope,
  UserSearch,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  findParticipantByNik,
  listVisits,
  recordVisit,
} from "@/lib/api";
import {
  ageLabel,
  ageInMonths,
  classifyZ,
  detectTwoT,
  statusLabel,
  weightForAgeZ,
} from "@/lib/zscore";
import { usePosyanduStore } from "@/lib/store";
import { monthKeyOf } from "@/lib/clsx";
import { Field, StatusPill } from "@/components/ui";
import { QRScanner } from "@/components/posyandu/qr-scanner";
import type {
  ParticipantRecord,
  ReferralLetter,
  VisitInput,
  ZScoreStatus,
} from "@/types/posyandu";

const steps = [
  { label: "Meja 1", title: "Kehadiran & scan QR", subtitle: "Verifikasi identitas warga" },
  { label: "Meja 2", title: "Antropometri", subtitle: "BB, TB, LK, LILA" },
  { label: "Meja 3", title: "Evaluasi gizi", subtitle: "Z-score & deteksi 2T" },
  { label: "Meja 4", title: "Layanan", subtitle: "Imunisasi, Vit A, PMT, cacing" },
  { label: "Meja 5", title: "Konseling & rujukan", subtitle: "Catatan & surat referral" },
];

const IMMUNIZATION_OPTIONS = [
  "HB-0",
  "BCG",
  "Polio 1",
  "Polio 2",
  "Polio 3",
  "DPT-HB-Hib 1",
  "DPT-HB-Hib 2",
  "DPT-HB-Hib 3",
  "PCV 1",
  "PCV 2",
  "Campak/MR",
];

const statusTone: Record<ZScoreStatus, "emerald" | "amber" | "rose"> = {
  normal: "emerald",
  warning: "amber",
  at_risk: "amber",
  stunting: "rose",
};

export function FiveMejaStepper() {
  const queryClient = useQueryClient();
  const session = usePosyanduStore((s) => s.session);
  const isOnline = usePosyanduStore((s) => s.isOnline);

  const [currentStep, setCurrentStep] = useState(0);
  const [nikInput, setNikInput] = useState("");
  const [participant, setParticipant] = useState<ParticipantRecord | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [form, setForm] = useState({
    weight: "",
    height: "",
    headCircumference: "",
    lila: "",
    immunizations: [] as string[],
    vitaminA: false,
    deworming: false,
    pmtGiven: false,
    notes: "",
    referral: false,
    referralTarget: "Unit Kesehatan Terkait",
  });
  const [saved, setSaved] = useState(false);
  const [referral, setReferral] = useState<ReferralLetter | null>(null);

  const { data: history = [] } = useQuery({
    queryKey: ["visits", participant?.id],
    queryFn: () => listVisits(participant!.id),
    enabled: Boolean(participant),
  });

  const saveMutation = useMutation({
    mutationFn: recordVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setSaved(true);
    },
  });

  const zScore = useMemo(() => {
    if (!participant || participant.participantType !== "balita" || !form.weight)
      return undefined;
    const age = ageInMonths(participant.dob);
    return weightForAgeZ(participant.gender, age, Number(form.weight));
  }, [participant, form.weight]);

  const status = classifyZ(zScore);
  const twoT = useMemo(
    () => (participant ? detectTwoT(history) : false),
    [participant, history],
  );

  const lookup = async (raw: string) => {
    const nik = raw.replace(/^posyandu:/, "").trim();
    if (!nik) return;
    setNikInput(nik);
    setLookupError(null);
    const found = await findParticipantByNik(nik);
    if (found) {
      setParticipant(found);
    } else {
      setParticipant(null);
      setLookupError(`NIK ${nik} tidak ditemukan di register posyandu.`);
    }
  };

  const toggleImmunization = (name: string) =>
    setForm((f) => ({
      ...f,
      immunizations: f.immunizations.includes(name)
        ? f.immunizations.filter((i) => i !== name)
        : [...f.immunizations, name],
    }));

  const finish = () => {
    if (!participant) return;
    const payload: VisitInput = {
      participantId: participant.id,
      wargaId: participant.wargaId,
      kaderId: session?.uid ?? "kader-demo",
      date: new Date().toISOString().slice(0, 10),
      monthKey: monthKeyOf(),
      weightKg: form.weight ? Number(form.weight) : undefined,
      heightCm: form.height ? Number(form.height) : undefined,
      headCircumferenceCm: form.headCircumference
        ? Number(form.headCircumference)
        : undefined,
      upperArmCircumferenceCm: form.lila ? Number(form.lila) : undefined,
      zScore,
      statusGizi: status,
      immunizations: form.immunizations,
      vitaminA: form.vitaminA,
      deworming: form.deworming,
      pmtGiven: form.pmtGiven,
      counselingNotes: form.notes || undefined,
      referralIssued: form.referral,
      referralTarget: form.referral ? form.referralTarget : undefined,
    };
    if (form.referral) {
      setReferral({
        participantName: participant.fullName,
        nik: participant.nik,
        ageLabel: ageLabel(participant.dob),
        reason: form.notes || statusLabel(status),
        target: form.referralTarget,
        issuedAt: new Date().toISOString(),
        kaderName: session?.name ?? "Kader",
      });
    }
    saveMutation.mutate(payload);
  };

  const reset = () => {
    setCurrentStep(0);
    setParticipant(null);
    setNikInput("");
    setLookupError(null);
    setSaved(false);
    setReferral(null);
    setForm({
      weight: "",
      height: "",
      headCircumference: "",
      lila: "",
      immunizations: [],
      vitaminA: false,
      deworming: false,
      pmtGiven: false,
      notes: "",
      referral: false,
      referralTarget: "Unit Kesehatan Terkait",
    });
  };

  const canProceed =
    currentStep === 0 ? Boolean(participant) : currentStep === 1 ? Boolean(form.weight) : true;
  const step = steps[currentStep];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((item, index) => {
          const active = index === currentStep;
          const isPassed = index < currentStep || saved;
          return (
            <div
              key={item.label}
              className={`rounded-[22px] border p-3 transition ${
                active
                  ? "border-rose-300 bg-rose-50"
                  : isPassed
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-rose-100 bg-white/60"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">
                  {item.label}
                </span>
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    active
                      ? "bg-rose-500 text-white"
                      : isPassed
                        ? "bg-emerald-500 text-white"
                        : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </span>
              </div>
              <p className="text-sm font-bold text-rose-950">{item.title}</p>
              <p className="mt-1 text-xs text-rose-900/70">{item.subtitle}</p>
            </div>
          );
        })}
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-[28px] border border-rose-100 bg-white/70 p-5"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
              Sesi aktif
            </p>
            <h4 className="mt-2 text-2xl font-black text-rose-950">
              {step.title}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            {twoT && currentStep >= 1 && (
              <StatusPill tone="rose">2T — BB turun 2 bulan</StatusPill>
            )}
            {participant && (
              <StatusPill tone={statusTone[participant ? status : "normal"]}>
                {participant.fullName} · {ageLabel(participant.dob)}
              </StatusPill>
            )}
            {!isOnline && <StatusPill tone="slate">Mode offline</StatusPill>}
          </div>
        </div>

        {currentStep === 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            <QRScanner onScan={lookup} />
            <div className="space-y-4">
              <Field label="Cari manual via NIK">
                <div className="flex gap-2">
                  <input
                    value={nikInput}
                    onChange={(e) => setNikInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && lookup(nikInput)}
                    placeholder="3201xxxxxxxxxxxx"
                    inputMode="numeric"
                    className="w-full bg-transparent text-base font-semibold text-rose-950 outline-none"
                  />
                  <button
                    onClick={() => lookup(nikInput)}
                    className="rounded-xl bg-rose-500 px-3 text-white"
                    aria-label="Cari"
                  >
                    <UserSearch className="h-4 w-4" />
                  </button>
                </div>
              </Field>
              {lookupError && (
                <p className="rounded-2xl bg-amber-50 p-3 text-sm font-medium text-amber-700">
                  {lookupError}
                </p>
              )}
              {participant && (
                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">
                      Warga terverifikasi
                    </span>
                  </div>
                  <p className="mt-2 text-xl font-black text-rose-950">
                    {participant.fullName}
                  </p>
                  <p className="mt-1 text-sm text-rose-900/70">
                    NIK {participant.nik} · {participant.participantType} ·{" "}
                    {ageLabel(participant.dob)} · Ortu: {participant.parentName}
                  </p>
                  <p className="mt-1 text-xs text-rose-900/60">
                    Riwayat kunjungan tercatat: {history.length} kali
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ["weight", "Berat badan (kg)", "cth. 9.4"],
                ["height", "Tinggi badan (cm)", "cth. 76.4"],
                ["headCircumference", "Lingkar kepala (cm)", "cth. 45"],
                ["lila", "LILA (cm)", "cth. 13.5"],
              ] as const
            ).map(([key, label, placeholder]) => (
              <Field key={key} label={label}>
                <input
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  placeholder={placeholder}
                  inputMode="decimal"
                  className="w-full bg-transparent text-base font-semibold text-rose-950 outline-none"
                />
              </Field>
            ))}
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div
              className={`rounded-[24px] p-4 ${
                status === "normal"
                  ? "bg-gradient-to-br from-emerald-50 via-white to-rose-50"
                  : status === "warning" || status === "at_risk"
                    ? "bg-gradient-to-br from-amber-50 via-white to-rose-50"
                    : "bg-gradient-to-br from-rose-100 via-white to-rose-50"
              }`}
            >
              <div className="mb-3 flex items-center gap-2 text-emerald-700">
                <Stethoscope className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Status gizi (BB/U)
                </span>
              </div>
              <p className="text-3xl font-black text-rose-950">
                {statusLabel(status)}
              </p>
              <p className="mt-2 text-sm text-rose-900/70">
                Z-score: {zScore !== undefined ? zScore : "—"} · Umur{" "}
                {participant ? ageInMonths(participant.dob) : "—"} bulan · BB{" "}
                {form.weight || "—"} kg
              </p>
              <div className="mt-3">
                <StatusPill tone={statusTone[status]}>
                  {statusLabel(status)}
                </StatusPill>
              </div>
            </div>
            <div className="rounded-[24px] border border-rose-100 bg-rose-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-rose-700">
                <ClipboardList className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Analisis tren
                </span>
              </div>
              {twoT ? (
                <p className="flex items-start gap-2 text-sm font-semibold text-rose-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  Berat badan tidak naik dua bulan berturut-turut (2T). Wajib
                  rujukan ke unit kesehatan terkait.
                </p>
              ) : (
                <p className="text-sm text-rose-900/80">
                  Tidak ada tren penurunan dua bulan berturut. Pertahankan
                  pemantauan bulanan dan lengkapi layanan di Meja 4.
                </p>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Imunisasi yang diberikan" className="lg:col-span-2">
              <div className="flex flex-wrap gap-2">
                {IMMUNIZATION_OPTIONS.map((name) => {
                  const on = form.immunizations.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleImmunization(name)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                        on
                          ? "bg-rose-500 text-white"
                          : "bg-white text-rose-700 ring-1 ring-rose-200"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </Field>
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3">
              <div className="mb-2 flex items-center gap-2 text-rose-700">
                <Pill className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                  Layanan tambahan
                </span>
              </div>
              <div className="space-y-2 text-sm font-medium text-rose-900/80">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.vitaminA}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, vitaminA: e.target.checked }))
                    }
                  />
                  Vitamin A
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.deworming}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, deworming: e.target.checked }))
                    }
                  />
                  Obat cacing
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.pmtGiven}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, pmtGiven: e.target.checked }))
                    }
                  />
                  PMT dibagikan
                </label>
              </div>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3">
              <div className="mb-2 flex items-center gap-2 text-rose-700">
                <QrCode className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                  Ringkasan
                </span>
              </div>
              <p className="text-sm text-rose-900/80">
                {form.immunizations.length} imunisasi
                {form.vitaminA ? ", Vit A" : ""}
                {form.deworming ? ", obat cacing" : ""}
                {form.pmtGiven ? ", PMT" : ""}
                {!form.immunizations.length &&
                  !form.vitaminA &&
                  !form.deworming &&
                  !form.pmtGiven &&
                  "Belum ada layanan dipilih"}
              </p>
            </div>
          </div>
        )}

        {currentStep === 4 && !saved && (
          <div className="space-y-4">
            <Field label="Catatan konseling">
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Edukasi yang diberikan, keluhan orang tua, tindak lanjut..."
                className="min-h-[110px] w-full resize-none bg-transparent text-base font-semibold text-rose-950 outline-none"
              />
            </Field>
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-rose-900">
                <input
                  type="checkbox"
                  checked={form.referral}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, referral: e.target.checked }))
                  }
                />
                Buat surat rujukan otomatis
              </label>
              {form.referral && (
                <input
                  value={form.referralTarget}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, referralTarget: e.target.value }))
                  }
                  placeholder="Tujuan rujukan"
                  className="mt-3 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-950 outline-none"
                />
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && saved && (
          <div className="space-y-4">
            <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
              <p className="mt-3 text-xl font-black text-rose-950">
                Kunjungan tersimpan
              </p>
              <p className="mt-1 text-sm text-rose-900/70">
                {saveMutation.data?.offlineQueued
                  ? "Disimpan di antrian offline — akan tersinkron otomatis saat online."
                  : "Data sudah tersinkron ke Firestore."}
              </p>
            </div>
            {referral && (
              <div className="rounded-[24px] border border-rose-200 bg-white p-5">
                <div className="mb-3 flex items-center gap-2 text-rose-700">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    Surat rujukan
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-rose-950">
                  Kepada Yth. {referral.target}, mohon pemeriksaan lanjutan
                  untuk <b>{referral.participantName}</b> (NIK {referral.nik},{" "}
                  {referral.ageLabel}) dengan alasan: {referral.reason}.
                  Diterbitkan oleh {referral.kaderName} pada{" "}
                  {new Date(referral.issuedAt).toLocaleDateString("id-ID")}.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            disabled={currentStep === 0 || saved}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white/80 px-4 py-3 text-sm font-semibold text-rose-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </button>

          {saved ? (
            <button
              onClick={reset}
              className="tactile-button inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 px-5 py-3 text-sm font-semibold text-white"
            >
              Kunjungan baru
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : currentStep === steps.length - 1 ? (
            <button
              onClick={finish}
              disabled={saveMutation.isPending}
              className="tactile-button inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saveMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Simpan & selesai
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep((p) => Math.min(steps.length - 1, p + 1))}
              disabled={!canProceed}
              className="tactile-button inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Lanjutkan
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
