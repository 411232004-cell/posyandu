"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Activity, FileSpreadsheet, HeartPulse, ShieldCheck, Syringe } from "lucide-react";
import { LayoutShell } from "@/components/posyandu/layout-shell";
import { Field, SectionHeading } from "@/components/ui";
import {
  hasilKegiatanSections,
  initialHasilKegiatan,
  summarizeHasilKegiatan,
} from "@/lib/hasil-kegiatan";
import { listHasilKegiatan, saveHasilKegiatan } from "@/lib/api";
import { usePosyanduStore } from "@/lib/store";
import type {
  HasilKegiatanCategory,
  HasilKegiatanEntry,
} from "@/types/posyandu";

const categoryIcons: Record<HasilKegiatanCategory, typeof HeartPulse> = {
  'kesehatan-ibu-anak': HeartPulse,
  gizi: Activity,
  'pencegahan-diare': Activity,
  kb: ShieldCheck,
  imunisasi: Syringe,
};

const roleLabel: Record<string, string> = {
  kader: "Kader",
};

export default function HasilKegiatanPage() {
  const router = useRouter();
  const session = usePosyanduStore((state) => state.session);
  const [entries, setEntries] = useState<HasilKegiatanEntry[]>(initialHasilKegiatan);
  const [selectedCategory, setSelectedCategory] = useState<HasilKegiatanCategory>(
    'kesehatan-ibu-anak',
  );
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const allowed = new Set(["kader"]);
    if (!allowed.has(session.role)) {
      router.push("/");
      return;
    }

    const monthKey = new Date().toISOString().slice(0, 7);
    listHasilKegiatan(monthKey)
      .then((records) => {
        if (records.length > 0) setEntries(records);
      })
      .catch(() => setEntries(initialHasilKegiatan));
  }, [router, session]);

  const summary = useMemo(() => summarizeHasilKegiatan(entries), [entries]);
  const selectedSection =
    hasilKegiatanSections.find((section) => section.id === selectedCategory) ??
    hasilKegiatanSections[0];

  const visibleEntries = entries.filter((entry) => entry.category === selectedCategory);

  const updateValue = (id: string, value: string) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id
          ? { ...entry, value: Number(value || 0) }
          : entry,
      ),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;

    setIsSaving(true);
    try {
      const nextEntries = entries.map((entry) => ({
        ...entry,
        submittedBy: session.name,
        monthKey: entry.monthKey || new Date().toISOString().slice(0, 7),
      }));

      await saveHasilKegiatan(nextEntries, session.name, session.role);
      setSavedAt(
        new Date().toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const count = summary.byCategory[selectedCategory];

  if (!session) return null;

  return (
    <LayoutShell>
      <section className="mb-8 rounded-[32px] border border-rose-100 bg-white/55 p-5 shadow-[0_20px_45px_rgba(244,63,94,0.08)] backdrop-blur-md md:p-7">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Laporan teknis lapangan"
            title="Hasil kegiatan posyandu"
          />
          <div className="rounded-full bg-rose-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-700">
            {roleLabel[session.role] ?? "Akses terautentikasi"}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {hasilKegiatanSections.map((section) => {
            const Icon = categoryIcons[section.id];
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setSelectedCategory(section.id)}
                className={[
                  "rounded-[24px] border p-4 text-left transition",
                  section.id === selectedCategory
                    ? "border-rose-300 bg-gradient-to-br from-rose-50 to-pink-50 shadow-sm"
                    : "border-rose-100 bg-white/70",
                ].join(" ")}
              >
                <div className="mb-3 inline-flex rounded-2xl bg-rose-100 p-2 text-rose-600">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-500">
                  {section.label}
                </p>
                <p className="mt-2 text-2xl font-black text-rose-950">{summary.byCategory[section.id]}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[32px] border border-rose-100 bg-white/60 p-5 shadow-[0_20px_45px_rgba(244,63,94,0.08)] backdrop-blur-md md:p-6"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
                Form laporan
              </p>
              <h2 className="mt-2 text-2xl font-black text-rose-950">
                {selectedSection.label}
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Terintegrasi
            </div>
          </div>

          <p className="mb-5 text-sm text-rose-900/70">{selectedSection.description}</p>

          <div className="grid gap-4 md:grid-cols-2">
            {visibleEntries.map((entry) => (
              <Field key={entry.id} label={entry.label}>
                <input
                  type="number"
                  min={0}
                  value={entry.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    updateValue(entry.id, event.target.value)
                  }
                  className="w-full border-none bg-transparent text-sm font-semibold text-rose-950 outline-none"
                />
              </Field>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-rose-900/70">
              {savedAt ? `Tersimpan: ${savedAt}` : "Belum ada penyimpanan terbaru."}
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="tactile-button rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Menyimpan..." : "Simpan laporan"}
            </button>
          </div>
        </form>

        <aside className="rounded-[32px] border border-rose-100 bg-white/60 p-5 shadow-[0_20px_45px_rgba(244,63,94,0.08)] backdrop-blur-md md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
                Ringkasan
              </p>
              <h3 className="mt-2 text-2xl font-black text-rose-950">
                {selectedSection.label}
              </h3>
            </div>
            <div className="rounded-full bg-rose-100 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-700">
              {count} item
            </div>
          </div>

          <div className="space-y-3">
            {visibleEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-rose-50/80 p-3"
              >
                <span className="text-sm text-rose-900/70">{entry.label}</span>
                <span className="text-lg font-black text-rose-950">{entry.value}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </LayoutShell>
  );
}
