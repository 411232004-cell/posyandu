"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarRange,
  ClipboardCheck,
  ClipboardList,
  CloudOff,
  FileBarChart2,
  FileSpreadsheet,
  IdCard,
  LayoutGrid,
  LogOut,
  RefreshCw,
  UserCircle2,
} from "lucide-react";
import { usePosyanduStore } from "@/lib/store";
import { clsxLite } from "@/lib/clsx";
import type { UserRole } from "@/types/posyandu";

const navByRole: Record<
  string,
  { label: string; href: string; icon: typeof LayoutGrid }[]
> = {
  warga: [
    { label: "Dashboard", href: "/", icon: LayoutGrid },
    { label: "Kartu Digital", href: "/kartu", icon: IdCard },
    { label: "Jadwal", href: "/jadwal", icon: CalendarRange },
  ],
  kader: [
    { label: "Dashboard", href: "/", icon: LayoutGrid },
    { label: "Kunjungan", href: "/kunjungan", icon: ClipboardCheck },
    { label: "Pendataan", href: "/pendataan", icon: ClipboardList },
    { label: "Hasil Kegiatan", href: "/hasil-kegiatan", icon: FileSpreadsheet },
    { label: "Jadwal", href: "/jadwal", icon: CalendarRange },
    { label: "Laporan", href: "/laporan", icon: FileBarChart2 },
  ],
};

const roleLabel: Record<UserRole, string> = {
  warga: "Warga",
  kader: "Kader",
};

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = usePosyanduStore((s) => s.session);
  const isOnline = usePosyanduStore((s) => s.isOnline);
  const pendingCount = usePosyanduStore((s) => s.pendingQueue.length);
  const setSession = usePosyanduStore((s) => s.setSession);

  const role = session?.role ?? "kader";
  const navItems = navByRole[role] ?? navByRole.kader;

  const logout = () => {
    setSession(null);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-transparent px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="glass-panel soft-shadow mb-8 rounded-[28px] border border-white/50 px-4 py-4 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 via-pink-400 to-pink-500 text-lg font-black text-white shadow-md">
                P
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-rose-500">
                  Posyandu
                </p>
                <h2 className="font-black text-rose-900">Care Platform</h2>
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-2 rounded-full bg-white/60 p-1.5">
              {navItems.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsxLite(
                      "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm"
                        : "text-rose-900/80 hover:bg-rose-50",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 self-end lg:self-auto">
              {isOnline ? (
                pendingCount > 0 ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Sync {pendingCount}
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                    Online
                  </span>
                )
              ) : (
                <span className="flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                  <CloudOff className="h-3.5 w-3.5" />
                  Offline{pendingCount > 0 ? ` (${pendingCount})` : ""}
                </span>
              )}
              <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-rose-700 shadow-sm">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-2.5 py-2 shadow-sm">
                <UserCircle2 className="h-9 w-9 text-rose-700" />
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
                    {roleLabel[role]}
                  </p>
                  <p className="text-sm font-semibold text-rose-950">
                    {session?.name ?? "Tamu"}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="rounded-2xl border border-rose-200 bg-white/70 px-3 py-2 text-sm font-semibold text-rose-800"
                aria-label="Keluar"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
