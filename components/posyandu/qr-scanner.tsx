"use client";

import { Camera, CameraOff, ScanLine, Search } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

const SCANNER_ID = "posyandu-scanner";

export function QRScanner({
  onScan,
}: {
  onScan?: (decoded: string) => void;
}) {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualNik, setManualNik] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const handleDecoded = (decodedText: string) => {
    setScanResult(decodedText);
    onScan?.(decodedText);
  };

  const start = async () => {
    if (typeof window === "undefined" || scannerRef.current) return;
    setError(null);
    const scanner = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = scanner;
    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        handleDecoded,
        () => undefined,
      );
      setRunning(true);
    } catch {
      scannerRef.current = null;
      setError("Kamera tidak tersedia. Izinkan akses atau gunakan input NIK.");
    }
  };

  const stop = async () => {
    if (!scannerRef.current) return;
    try {
      await scannerRef.current.stop();
    } catch {
      /* already stopped */
    }
    scannerRef.current.clear();
    scannerRef.current = null;
    setRunning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => undefined)
          .finally(() => {
            scannerRef.current = null;
          });
      }
    };
  }, []);

  const submitManual = () => {
    const nik = manualNik.trim();
    if (nik) handleDecoded(nik.startsWith("posyandu:") ? nik : `posyandu:${nik}`);
  };

  return (
    <div className="glass-panel soft-shadow rounded-[32px] p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
            Meja 1
          </p>
          <h3 className="mt-2 text-2xl font-black text-rose-950">
            Scanner QR Kader
          </h3>
        </div>
        <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
          <ScanLine className="h-5 w-5" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-pink-50 p-2">
        <div
          id={SCANNER_ID}
          className="min-h-[260px] w-full overflow-hidden rounded-[24px] bg-slate-950/95"
        />
        {running && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-40 w-40 -translate-y-1/2 rounded-[28px] border-2 border-rose-300/80" />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white/70 p-3 text-sm shadow-sm">
        <button
          onClick={running ? stop : start}
          className="flex items-center gap-2 font-medium text-rose-700"
        >
          {running ? (
            <>
              <CameraOff className="h-4 w-4" /> Hentikan kamera
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" /> Mulai scan
            </>
          )}
        </button>
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
          Offline-ready
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={manualNik}
          onChange={(e) => setManualNik(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitManual()}
          placeholder="Atau ketik NIK manual..."
          inputMode="numeric"
          className="w-full rounded-2xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-950 outline-none placeholder:font-normal placeholder:text-rose-300"
        />
        <button
          onClick={submitManual}
          className="rounded-2xl bg-rose-500 px-4 text-white shadow-button active:translate-y-0.5"
          aria-label="Cari NIK"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-xs font-medium text-amber-700">
          {error}
        </p>
      )}

      {scanResult && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
          <p className="font-bold uppercase tracking-[0.12em] text-rose-500">
            Hasil scan
          </p>
          <p className="mt-2 break-all font-medium">{scanResult}</p>
        </div>
      )}
    </div>
  );
}
