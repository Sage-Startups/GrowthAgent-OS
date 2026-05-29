import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "GBP") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string) {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) return formatDate(date);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function getScoreBandColor(band: string | null | undefined) {
  switch (band) {
    case "HOT": return "text-red-400 bg-red-400/10 border-red-400/20";
    case "WARM": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    case "COLD": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    case "BAD_FIT": return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  }
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    NEW: "text-blue-400 bg-blue-400/10",
    RESEARCHING: "text-violet-400 bg-violet-400/10",
    QUALIFIED: "text-emerald-400 bg-emerald-400/10",
    HOT: "text-red-400 bg-red-400/10",
    WARM: "text-orange-400 bg-orange-400/10",
    COLD: "text-blue-400 bg-blue-400/10",
    BAD_FIT: "text-slate-400 bg-slate-400/10",
    REPLIED: "text-teal-400 bg-teal-400/10",
    FOLLOW_UP_DUE: "text-yellow-400 bg-yellow-400/10",
    CALL_BOOKED: "text-indigo-400 bg-indigo-400/10",
    PROPOSAL_SENT: "text-purple-400 bg-purple-400/10",
    WON: "text-green-400 bg-green-400/10",
    LOST: "text-red-400 bg-red-400/10",
    PENDING: "text-yellow-400 bg-yellow-400/10",
    APPROVED: "text-green-400 bg-green-400/10",
    REJECTED: "text-red-400 bg-red-400/10",
  };
  return colors[status] || "text-slate-400 bg-slate-400/10";
}
