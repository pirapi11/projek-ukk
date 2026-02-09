"use client";

import { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase";

type StatusType = "Belum Diverifikasi" | "Disetujui" | "Ditolak";

interface Jurnal {
  id: number;
  nama: string;
  tanggal: string;
  kegiatan: string;
  kendala: string;
  status: StatusType;
  catatan?: string;
  file_path?: string;
}

const statusStyle = {
  "Belum Diverifikasi": "bg-yellow-100 text-yellow-700",
  Disetujui: "bg-green-100 text-green-700",
  Ditolak: "bg-pink-100 text-pink-700",
};

export default function Page() {
  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState<Jurnal | null>(null);

  const [data, setData] = useState<Jurnal[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusType | "">("");

  const [editing, setEditing] = useState(false);
  const [catatan, setCatatan] = useState("");

  /* ================= FETCH DATA ================= */
  const fetchJurnal = async () => {
    let query = supabase
      .from("logbook")
      .select(`
        id,
        tanggal,
        kegiatan,
        kendala,
        status,
        catatan_guru,
        file_path,
        siswa:siswa_id (nama)
      `)
      .order("tanggal", { ascending: false });

    if (search) {
      query = query.or(
        `kegiatan.ilike.%${search}%,kendala.ilike.%${search}%,siswa.nama.ilike.%${search}%`
      );
    }

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setData(
        data.map((d: any) => ({
          id: d.id,
          nama: d.siswa?.nama,
          tanggal: d.tanggal,
          kegiatan: d.kegiatan,
          kendala: d.kendala,
          status: d.status,
          catatan: d.catatan_guru,
          file_path: d.file_path,
        }))
      );
    }
  };

  useEffect(() => {
    fetchJurnal();
  }, [search, statusFilter]);

  /* ================= MODAL ================= */
  const openModal = (data: Jurnal) => {
    setSelected(data);
    setCatatan(data.catatan ?? "");
    setEditing(false);
    setOpenDetail(true);
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (status: StatusType) => {
    if (!selected) return;

    await supabase
      .from("logbook")
      .update({ status })
      .eq("id", selected.id);

    fetchJurnal();
    setOpenDetail(false);
  };

  /* ================= CATATAN ================= */
  const saveCatatan = async () => {
    if (!selected) return;

    await supabase
      .from("logbook")
      .update({ catatan_guru: catatan })
      .eq("id", selected.id);

    fetchJurnal();
    setEditing(false);
  };

  /* ================= DOWNLOAD ================= */
  const downloadFile = async () => {
    if (!selected?.file_path) return;

    const { data } = await supabase
      .storage
      .from("jurnal")
      .download(selected.file_path);

    if (data) {
      const url = URL.createObjectURL(data);
      window.open(url);
    }
  };

  return (
    <div className="p-6">
      {/* TITLE */}
      <div className="mb-6">
        <h1 className="text-xl font-bold">Jurnal Harian Magang</h1>
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
                onChange={(e) => setSearch(e.target.value)}
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
          <tbody className="divide-y">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <p className="font-medium">{item.nama}</p>
                  <p className="text-xs text-gray-500">{item.tanggal}</p>
                </td>

                <td className="px-5 py-4">
                  <p><b>Kegiatan:</b> {item.kegiatan}</p>
                  <p className="text-gray-500 mt-1">
                    <b>Kendala:</b> {item.kendala}
                  </p>
                </td>

                <td className="px-15 py-10">
                  <span className={`px-5 py-1 rounded-full text-xs ${statusStyle[item.status]}`}>
                    {item.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-gray-500">
                  {item.catatan ?? "Belum ada catatan"}
                </td>

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
      </div>

      {/* ================= DETAIL MODAL ================= */}
      {openDetail && selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white w-[760px] rounded-xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText size={18} />
                <div>
                  <p className="font-semibold">Detail Jurnal Harian</p>
                  <p className="text-xs text-gray-500">{selected.tanggal}</p>
                </div>
              </div>
              <button onClick={() => setOpenDetail(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <p className="font-medium mb-2">Kendala yang Dihadapi</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                  {selected.kendala}
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Dokumentasi</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
                  <p className="text-sm">File Jurnal</p>
                  <button
                    onClick={downloadFile}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    <Download size={16} /> Unduh
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <p className="font-medium">Catatan Guru</p>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                </div>

                {editing ? (
                  <>
                    <textarea
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      className="w-full border rounded-lg p-2 text-sm"
                    />
                    <button
                      onClick={saveCatatan}
                      className="mt-2 text-sm text-blue-600"
                    >
                      Simpan
                    </button>
                  </>
                ) : (
                  <div className="border rounded-lg p-4 text-sm text-gray-500">
                    {selected.catatan ?? "Belum ada catatan dari guru"}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => updateStatus("Disetujui")}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm"
                >
                  ✓ Setujui
                </button>
                <button
                  onClick={() => updateStatus("Ditolak")}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg text-sm"
                >
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