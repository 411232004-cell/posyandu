"use client";

import { CalendarClock, HeartPulse, ShieldCheck, UserCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { ageLabel } from "@/lib/zscore";
import type { ParticipantRecord } from "@/types/posyandu";

const CACHE_KEY = "posyandu-warga-card";

export function WargaDigitalCard({
  participant,
  wargaName,
  scheduleLabel = "Setiap Jumat",
}: {
  participant: ParticipantRecord;
  wargaName?: string;
  scheduleLabel?: string;
}) {
  const qrPayload = `posyandu:${participant.nik}`;

  useEffect(() => {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ participant, wargaName, cachedAt: Date.now() }),
      );
    } catch {
      /* storage penuh / mode privat */
    }
  }, [participant, wargaName]);

  return (
    <div className="glass-panel soft-shadow rounded-[32px] p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
            Warga
          </p>
          <h3 className="mt-2 text-2xl font-black text-rose-950">
            Kartu identitas digital
          </h3>
        </div>
        <div className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
          Offline cache
        </div>
      </div>

      <div className="rounded-[30px] bg-gradient-to-br from-rose-500 via-pink-500 to-pink-600 p-[1px] shadow-[0_18px_35px_rgba(244,63,94,0.28)]">
        <div className="rounded-[29px] bg-[linear-gradient(135deg,rgba(255,255,255,0.28),rgba(255,255,255,0.1))] p-4 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white">
                <UserCircle2 className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-100">
                  {participant.participantType === "balita"
                    ? "Orang tua / Wali"
                    : "Peserta"}
                </p>
                <p className="mt-1 text-lg font-black text-white">
                  {participant.participantType === "balita"
                    ? wargaName ?? participant.parentName
                    : participant.fullName}
                </p>
              </div>
            </div>
            <div className="rounded-full bg-white/15 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-rose-50">
              Valid
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-white/10 p-3 text-white shadow-inner shadow-white/10">
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-rose-100">
                  NIK
                </p>
                <p className="mt-1 text-sm font-semibold">{participant.nik}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-rose-100">
                  No. KK
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {participant.familyId}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/20 pt-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-rose-100">
                  {participant.participantType === "balita"
                    ? "Balita"
                    : "Lansia"}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {participant.fullName} · {ageLabel(participant.dob)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/15 p-2 text-center">
                <ShieldCheck className="mx-auto h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-[22px] bg-white/90 p-3">
            <div className="flex items-center gap-2 text-rose-700">
              <CalendarClock className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                Jadwal posyandu
              </span>
            </div>
            <span className="text-xs font-bold text-rose-900">
              {scheduleLabel}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] bg-white/90 p-3">
            <div className="flex items-center gap-2 text-rose-700">
              <HeartPulse className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                QR digital
              </span>
            </div>
            <div className="rounded-xl bg-white p-2 shadow-sm">
              <QRCodeSVG
                value={qrPayload}
                size={52}
                bgColor="#ffffff"
                fgColor="#111827"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
