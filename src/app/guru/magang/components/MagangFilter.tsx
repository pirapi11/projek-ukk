"use client";

type Props = {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export default function MagangFilter({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border-b">
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Cari nama / instansi..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-64 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring"
      />

      {/* STATUS FILTER */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full sm:w-48 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring"
      >
        <option value="">Semua Status</option>
        <option value="pending">Pending</option>
        <option value="diterima">Diterima</option>
        <option value="berlangsung">Berlangsung</option>
        <option value="selesai">Selesai</option>
        <option value="ditolak">Ditolak</option>
        <option value="dibatalkan">Dibatalkan</option>
      </select>
    </div>
  );
}
