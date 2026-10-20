import Link from "next/link";
import { CloudOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel soft-shadow max-w-md rounded-[32px] p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <CloudOff className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-black text-rose-950">Anda sedang offline</h1>
        <p className="mt-2 text-sm text-rose-900/70">
          Halaman ini belum tersimpan di cache. Data yang sudah diinput tetap
          aman di antrian lokal dan akan tersinkron saat koneksi kembali.
        </p>
        <Link
          href="/"
          className="tactile-button mt-6 inline-block rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 px-5 py-3 text-sm font-semibold text-white"
        >
          Kembali ke dashboard
        </Link>
      </div>
    </div>
  );
}
