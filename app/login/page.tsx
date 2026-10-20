"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HeartPulse, Loader2, Lock, Mail, Stethoscope } from "lucide-react";
import { demoLogin, isFirebaseConfigured, signInWithEmail } from "@/lib/api";
import { usePosyanduStore } from "@/lib/store";
import type { UserRole } from "@/types/posyandu";

const roles: { role: UserRole; label: string; desc: string }[] = [
  { role: "warga", label: "Warga", desc: "Kartu digital, KMS, jadwal" },
  { role: "kader", label: "Kader", desc: "Scan QR & 5-Meja" },
];

export default function LoginPage() {
  const router = useRouter();
  const setSession = usePosyanduStore((s) => s.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loginDemo = (role: UserRole) => {
    setSession(demoLogin(role));
    router.push("/");
  };

  const loginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      setSession(await signInWithEmail(email, password));
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel soft-shadow w-full max-w-md rounded-[32px] p-6 md:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 via-pink-400 to-pink-500 text-lg font-black text-white shadow-md">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-rose-500">
              Posyandu
            </p>
            <h1 className="font-black text-rose-900">Care Platform</h1>
          </div>
        </div>

        <h2 className="text-2xl font-black text-rose-950">Masuk ke akun</h2>
        <p className="mt-1 text-sm text-rose-900/70">
          {isFirebaseConfigured
            ? "Gunakan email & password Firebase Anda."
            : "Mode demo aktif — pilih peran untuk langsung masuk."}
        </p>

        {isFirebaseConfigured ? (
          <form onSubmit={loginEmail} className="mt-6 space-y-3">
            <label className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
              <Mail className="h-4 w-4 text-rose-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-transparent text-sm font-semibold text-rose-950 outline-none"
              />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
              <Lock className="h-4 w-4 text-rose-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent text-sm font-semibold text-rose-950 outline-none"
              />
            </label>
            {error && (
              <p className="rounded-2xl bg-rose-50 p-3 text-sm font-medium text-rose-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="tactile-button w-full rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "Masuk"
              )}
            </button>
          </form>
        ) : (
          <div className="mt-6 space-y-3">
            {roles.map(({ role, label, desc }) => (
              <button
                key={role}
                onClick={() => loginDemo(role)}
                className="flex w-full items-center gap-4 rounded-2xl border border-rose-100 bg-white/70 p-4 text-left transition hover:border-rose-300 hover:bg-rose-50"
              >
                <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-rose-950">{label}</p>
                  <p className="text-xs text-rose-900/60">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-[11px] text-rose-900/50">
          PWA siap offline · Data terenkripsi · Sinkron otomatis
        </p>
      </motion.div>
    </div>
  );
}
