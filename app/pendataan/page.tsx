"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Activity,
  Baby,
  CalendarDays,
  HeartPulse,
  ShieldCheck,
  Syringe,
} from "lucide-react";
import { LayoutShell } from "@/components/posyandu/layout-shell";
import { Field, SectionHeading, StatusPill, TactileButton } from "@/components/ui";
import {
  initialPendataanRecords,
  pendataanSections,
  summarizePendataan,
  type PendataanStatus,
} from "@/lib/pendataan";

interface PendataanFormState {
  nama: string;
  detail: string;
  status: PendataanStatus;
  tanggal: string;
  catatan: string;
}

const statusTone: Record<
  PendataanStatus,
  "emerald" | "amber" | "rose" | "slate"
> = {
  aktif: "emerald",
  monitoring: "amber",
  beresiko: "rose",
  lengkap: "emerald",
  tertunda: "slate",
};

const defaultForm: PendataanFormState = {
  nama: "",
  detail: "",
  status: "aktif",
  tanggal: new Date().toISOString().slice(0, 10),
  catatan: "",
};

export default function PendataanPage() {
  const [records, setRecords] = useState(initialPendataanRecords);
  const [activeCategory, setActiveCategory] = useState(pendataanSections[0].id);
  const [form, setForm] = useState<PendataanFormState>(defaultForm);

  const summary = useMemo(() => summarizePendataan(records), [records]);
  const activeSection =
    pendataanSections.find((section) => section.id === activeCategory) ??
    pendataanSections[0];

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      status: activeSection.statusOptions[0],
    }));
  }, [activeCategory, activeSection.statusOptions]);

  const filteredRecords = records.filter((record) => record.category === activeCategory);

  const handleInputChange = (key: keyof PendataanFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === "status" ? (value as PendataanStatus) : value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.nama.trim()) return;

    const nextRecord = {
      id: `pend-${Date.now()}`,
      category: activeCategory,
      name: form.nama.trim(),
      detail: form.detail.trim() || "Pendataan baru",
      status: form.status,
      date: form.tanggal || new Date().toISOString().slice(0, 10),
      note: form.catatan.trim() || "Belum ada catatan tambahan.",
    };

    setRecords((prev) => [nextRecord, ...prev]);
    setForm({
      ...defaultForm,
      status: activeSection.statusOptions[0],
      tanggal: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <LayoutShell>
      <section className="mb-8 rounded-[32px] border border-rose-100 bg-white/55 p-5 shadow-[0_20px_45px_rgba(244,63,94,0.08)] backdrop-blur-md md:p-7">
        <SectionHeading
          eyebrow="Pendataan"
          title="Ibu hamil, KB, dan imunisasi"
        />

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-[24px] border border-rose-100 bg-rose-50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-rose-500">Total</p>
            <p className="mt-3 text-3xl font-black text-rose-950">{summary.total}</p>
            <p className="mt-1 text-xs text-rose-900/60">catatan aktif</p>
          </div>
          <div className="rounded-[24px] border border-rose-100 bg-white p-4">
            <div className="flex items-center gap-2 text-rose-600">
              <HeartPulse className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.18em]">Ibu Hamil</span>
            </div>
            <p className="mt-3 text-3xl font-black text-rose-950">{summary.byCategory['ibu-hamil']}</p>
          </div>
          <div className="rounded-[24px] border border-rose-100 bg-white p-4">
            <div className="flex items-center gap-2 text-rose-600">
              <Baby className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.18em]">KB</span>
            </div>
            <p className="mt-3 text-3xl font-black text-rose-950">{summary.byCategory.kb}</p>
          </div>
          <div className="rounded-[24px] border border-rose-100 bg-white p-4">
            <div className="flex items-center gap-2 text-rose-600">
              <Syringe className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.18em]">Imunisasi</span>
            </div>
            <p className="mt-3 text-3xl font-black text-rose-950">{summary.byCategory.imunisasi}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-rose-100 bg-white/60 p-5 shadow-[0_20px_45px_rgba(244,63,94,0.08)] backdrop-blur-md md:p-6">
          <div className="mb-5 flex flex-wrap gap-2">
            {pendataanSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveCategory(section.id)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  section.id === activeCategory
                    ? "bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 text-white shadow-sm"
                    : "border border-rose-200 bg-white text-rose-800",
                ].join(" ")}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="mb-5 rounded-[24px] bg-gradient-to-r from-rose-50 to-pink-50 p-4">
            <div className="flex items-center gap-2 text-rose-600">
              {activeCategory === "ibu-hamil" ? <HeartPulse className="h-4 w-4" /> : null}
              {activeCategory === "kb" ? <Activity className="h-4 w-4" /> : null}
              {activeCategory === "imunisasi" ? <ShieldCheck className="h-4 w-4" /> : null}
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                {activeSection.label}
              </span>
            </div>
            <p className="mt-2 text-sm text-rose-900/70">{activeSection.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <Field label="Nama warga" className="md:col-span-2">
              <input
                value={form.nama}
                onChange={(event) => handleInputChange("nama", event.target.value)}
                className="w-full border-none bg-transparent text-sm text-rose-950 outline-none placeholder:text-rose-400"
                placeholder="Masukkan nama lengkap"
              />
            </Field>

            <Field label="Detail / target">
              <input
                value={form.detail}
                onChange={(event) => handleInputChange("detail", event.target.value)}
                className="w-full border-none bg-transparent text-sm text-rose-950 outline-none placeholder:text-rose-400"
                placeholder="Contoh: G1P0, 26 minggu"
              />
            </Field>

            <Field label="Tanggal kunjungan">
              <input
                type="date"
                value={form.tanggal}
                onChange={(event) => handleInputChange("tanggal", event.target.value)}
                className="w-full border-none bg-transparent text-sm text-rose-950 outline-none"
              />
            </Field>

            <Field label="Status" className="md:col-span-2">
              <select
                value={form.status}
                onChange={(event) => handleInputChange("status", event.target.value)}
                className="w-full border-none bg-transparent text-sm text-rose-950 outline-none"
              >
                {activeSection.statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Catatan" className="md:col-span-2">
              <textarea
                value={form.catatan}
                onChange={(event) => handleInputChange("catatan", event.target.value)}
                rows={4}
                className="w-full resize-none border-none bg-transparent text-sm text-rose-950 outline-none placeholder:text-rose-400"
                placeholder="Tambahkan catatan layanan, tindak lanjut, dan edukasi yang diberikan..."
              />
            </Field>

            <div className="md:col-span-2 flex justify-end">
              <TactileButton type="submit">Simpan pendataan</TactileButton>
            </div>
          </form>
        </div>

        <div className="rounded-[32px] border border-rose-100 bg-white/60 p-5 shadow-[0_20px_45px_rgba(244,63,94,0.08)] backdrop-blur-md md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <SectionHeading eyebrow="Rekap" title={activeSection.label} />
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">
              <CalendarDays className="h-3.5 w-3.5" />
              {filteredRecords.length} data
            </span>
          </div>

          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="rounded-[24px] border border-rose-100 bg-rose-50/70 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-rose-950">{record.name}</p>
                    <p className="text-xs text-rose-900/60">{record.detail}</p>
                  </div>
                  <StatusPill tone={statusTone[record.status] ?? "slate"}>
                    {record.status}
                  </StatusPill>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-rose-900/60">
                  <span>{record.date}</span>
                  <span>{record.note}</span>
                </div>
              </div>
            ))}

            {filteredRecords.length === 0 && (
              <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-900/70">
                Belum ada data {activeSection.label.toLowerCase()} yang tercatat.
              </p>
            )}
          </div>
        </div>
      </section>
    </LayoutShell>
  );
}
