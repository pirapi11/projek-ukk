"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  FileText,
} from "lucide-react";

type StatusType = "Belum Diverifikasi" | "Disetujui" | "Ditolak";

interface Jurnal {
  id: number;
  nama: string;
  tanggal: string;
  kegiatan: string;
  kendala: string;
  status: StatusType;
  catatan?: string;
}

const DATA: Jurnal[] = [
  {
    id: 1,
    nama: "Ahmad Rizki",
    tanggal: "2 Mar 2024",
    kegiatan:
      "Belajar backend Laravel untuk membangun REST API sistem kasir",
    kendala:
      "Error saat menjalankan migration database dan kesulitan memahami relationship antar tabel",
    status: "Belum Diverifikasi",
  },
  {
    id: 2,
    nama: "Budi Santoso",
    tanggal: "1 Mar 2024",
    kegiatan:
      "Membuat desain UI aplikasi kasir menggunakan Figma",
    kendala: "Menentukan skema warna",
    status: "Disetujui",
    catatan: "Bagus, lanjutkan dengan implementasi",
  },
  {
    id: 3,
    nama: "Siti Nurhaliza",
    tanggal: "28 Feb 2024",
    kegiatan: "Setup server Ubuntu",
    kendala: "Belum familiar permission Linux",
    status: "Ditolak",
    catatan: "Perlu deskripsi kegiatan lebih detail",
  },
];

const statusStyle = {
  "Belum Diverifikasi": "bg-yellow-100 text-yellow-700",
  Disetujui: "bg-green-100 text-green-700",
  Ditolak: "bg-pink-100 text-pink-700",
};

export default function Page() {
  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState<Jurnal | null>(null);

  const openModal = (data: Jurnal) => {
    setSelected(data);
    setOpenDetail(true);
  };

  return (
    <div className="p-6">
      {/* TITLE */}
      <div className="mb-6">
        <h1 className="text-xl font-bold">
          Jurnal Harian Magang
        </h1>
        <p className="text-sm text-gray-500">
          Catatan kegiatan harian siswa magang
        </p>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-xl border">
        <div className="p-5 border-b font-semibold">
          Daftar Logbook Siswa
        </div>

        {/* FILTER */}
        <div className="p-5 flex justify-between">
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                className="pl-9 pr-3 py-2 border rounded-lg text-sm w-[280px]"
                placeholder="Cari siswa, kegiatan, atau kendala..."
              />
            </div>
            <button className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm">
              <Filter size={16} /> Tampilkan Filter <ChevronDown size={14} />
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Tampilkan: <b>10</b> per halaman
          </p>
        </div>

        {/* TABLE */}
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-5 py-3 text-left">Siswa & Tanggal</th>
              <th className="px-5 py-3 text-left">Kegiatan & Kendala</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Catatan Guru</th>
              <th className="px-5 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {DATA.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <p className="font-medium">{item.nama}</p>
                  <p className="text-xs text-gray-500">{item.tanggal}</p>
                </td>

                <td className="px-5 py-4">
                  <p>
                    <b>Kegiatan:</b> {item.kegiatan}
                  </p>
                  <p className="text-gray-500 mt-1">
                    <b>Kendala:</b> {item.kendala}
                  </p>
                </td>

                <td className="px-15 py-10">
                  <span
                    className={`px-5 py-1 rounded-full text-xs ${statusStyle[item.status]}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-gray-500">
                  {item.catatan ?? "Belum ada catatan"}
                </td>

                {/* ✅ AKSI: HANYA ICON MATA */}
                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => openModal(item)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FOOTER */}
        <div className="p-5 flex justify-between text-sm text-gray-500">
          <p>Menampilkan 1 sampai 5 dari 5 entri</p>
          <div className="flex gap-2">
            <button className="p-2 border rounded-lg">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">
              1
            </button>
            <button className="p-2 border rounded-lg">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= DETAIL MODAL ================= */}
        {openDetail && selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="bg-white w-[760px] rounded-xl max-h-[90vh] overflow-y-auto">
            
            {/* HEADER */}
            <div className="p-5 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                <FileText size={18} />
                <div>
                    <p className="font-semibold">Detail Jurnal Harian</p>
                    <p className="text-xs text-gray-500">
                    {selected.tanggal}
                    </p>
                </div>
                </div>
                <button onClick={() => setOpenDetail(false)}>
                <X size={18} />
                </button>
            </div>

            {/* BODY */}
            <div className="p-5 space-y-6">
                
                {/* KENDALA */}
                <div>
                <p className="font-medium mb-2">Kendala yang Dihadapi</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                    {selected.kendala}
                </div>
                </div>

                {/* DOKUMENTASI */}
                <div>
                <p className="font-medium mb-2">Dokumentasi</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
                    <p className="text-sm">documento2.pdf</p>
                    <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                    <Download size={16} /> Unduh
                    </button>
                </div>
                </div>

                {/* CATATAN GURU */}
                <div>
                <div className="flex justify-between mb-2">
                    <p className="font-medium">Catatan Guru</p>
                    <button className="text-blue-600 text-sm">
                    Edit
                    </button>
                </div>
                <div className="border rounded-lg p-4 text-sm text-gray-500">
                    {selected.catatan ?? "Belum ada catatan dari guru"}
                </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 pt-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 text-sm">
                    ✓ Setujui
                </button>
                  <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 text-sm">
                    ✕ Tolak
                </button>
                </div>
            </div>
            </div>
        </div>
        )}
    </div>
  );
}