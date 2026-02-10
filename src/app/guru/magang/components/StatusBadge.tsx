"use client";

type Status =
  | "pending"
  | "diterima"
  | "ditolak"
  | "berlangsung"
  | "selesai"
  | "dibatalkan";

const statusClass: Record<Status, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  diterima: "bg-green-100 text-green-800",
  berlangsung: "bg-blue-100 text-blue-800",
  selesai: "bg-blue-100 text-blue-800",
  ditolak: "bg-red-100 text-red-800",
  dibatalkan: "bg-red-100 text-red-800",
};

const statusLabel: Record<Status, string> = {
  pending: "Pending",
  diterima: "Diterima",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
  ditolak: "Ditolak",
  dibatalkan: "Dibatalkan",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
        statusClass[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {statusLabel[status] || "-"}
    </span>
  );
}