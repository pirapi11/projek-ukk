"use client";

type Props = {
  data: {
    status: string;
  }[];
};

export default function MagangStats({ data }: Props) {
  const total = data.length;
  const pending = data.filter((d) => d.status === "pending").length;
  const berlangsung = data.filter((d) => d.status === "berlangsung").length;
  const selesai = data.filter((d) => d.status === "selesai").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div className="rounded-xl border bg-white p-6">
        <p className="text-sm text-gray-500">Total Siswa</p>
        <p className="text-2xl font-semibold">{total}</p>
        <p className="text-xs text-gray-400">
          Siswa magang terdaftar
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <p className="text-sm text-gray-500">Berlangsung</p>
        <p className="text-2xl font-semibold">{berlangsung}</p>
        <p className="text-xs text-gray-400">
          Sedang magang
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <p className="text-sm text-gray-500">Selesai</p>
        <p className="text-2xl font-semibold">{selesai}</p>
        <p className="text-xs text-gray-400">
          Magang selesai
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <p className="text-sm text-gray-500">Pending</p>
        <p className="text-2xl font-semibold">{pending}</p>
        <p className="text-xs text-gray-400">
          Menunggu penempatan
        </p>
      </div>
    </div>
  );
}