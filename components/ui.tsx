import { clsxLite } from "@/lib/clsx";

export function GlassPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsxLite("glass-panel soft-shadow rounded-[32px]", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-black text-rose-950">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function TactileButton({
  children,
  className,
  type = "button",
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsxLite(
        "tactile-button inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-pink-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={clsxLite(
        "rounded-2xl border border-rose-100 bg-rose-50 p-3 text-sm font-medium text-rose-900",
        className,
      )}
    >
      <span className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-rose-500">
        {label}
      </span>
      {children}
    </label>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "emerald" | "amber" | "rose" | "slate";
  children: React.ReactNode;
}) {
  const tones = {
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
    slate: "bg-slate-100 text-slate-600",
  } as const;
  return (
    <span
      className={clsxLite(
        "rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
