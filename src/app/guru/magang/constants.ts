import { StatusMagang } from "./types";

export const statusClass: Record<StatusMagang, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  diterima: "bg-green-100 text-green-800",
  berlangsung: "bg-blue-100 text-blue-800",
  selesai: "bg-blue-100 text-blue-800",
  ditolak: "bg-red-100 text-red-800",
  dibatalkan: "bg-red-100 text-red-800",
};

export const statusLabel: Record<StatusMagang, string> = {
  pending: "Pending",
  diterima: "Diterima",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
  ditolak: "Ditolak",
  dibatalkan: "Dibatalkan",
};