export function clsxLite(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDateId(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function monthKeyOf(date = new Date()): string {
  return date.toISOString().slice(0, 7);
}
