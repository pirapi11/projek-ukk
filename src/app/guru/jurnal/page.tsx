"use client";

import { useState, useEffect } from "react";
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
  Check,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase"; // sesuaikan path

type StatusType = "pending" | "disetujui" | "ditolak";

interface Jurnal {
  id: number;
  nama: string;
  tanggal: string;
  kegiatan: string;
  kendala: string | null;
  status: StatusType;
  catatan?: string | null;
  file?: string | null;
}

export default function Page() {
  const [journals, setJournals] = useState<Jurnal[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState<Jurnal | null>(null);
  const [catatanGuru, setCatatanGuru] = useState("");
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchJournals();
  }, []);

  async function fetchJournals() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("logbook")
        .select(`
          id,
          tanggal,
          kegiatan,
          kendala,
          file,
          status_verifikasi,
          catatan_guru,
          magang:magang_id (
            siswa:siswa_id (nama)
          )
        `)
        .order("tanggal", { ascending: false });

      if (error) throw error;

      const transformed = (data || []).map((item: any) => ({
        id: item.id,
        nama: item.magang?.siswa?.nama || "Siswa Tidak Diketahui",
        tanggal: new Date(item.tanggal).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        kegiatan: item.kegiatan || "",
        kendala: item.kendala || "",
        status: item.status_verifikasi as StatusType,
        catatan: item.catatan_guru || null,
        file: item.file || null,
      }));

      setJournals(transformed);
    } catch (err) {
      console.error("Error fetch jurnal guru:", err);
    } finally {
      setLoading(false);
    }
  }

  const openModal = (data: Jurnal) => {
    setSelected(data);
    setCatatanGuru(data.catatan || "");
    setOpenDetail(true);
  };

  const closeModal = () => {
    setOpenDetail(false);
    setSelected(null);
    setCatatanGuru("");
  };

  async function handleSetujui(id: number) {
    try {
      const { error } = await supabase
        .from("logbook")
        .update({
          status_verifikasi: "disetujui",
          catatan_guru: catatanGuru || null,
        })
        .eq("id", id);

      if (error) throw error;

      fetchJournals();
      if (openDetail) closeModal();
    } catch (err) {
      console.error("Gagal setujui:", err);
      alert("Gagal menyetujui jurnal");
    }
  }

  async function handleTolak(id: number) {
    try {
      const { error } = await supabase
        .from("logbook")
        .update({
          status_verifikasi: "ditolak",
          catatan_guru: catatanGuru || null,
        })
        .eq("id", id);

      if (error) throw error;

      fetchJournals();
      if (openDetail) closeModal();
    } catch (err) {
      console.error("Gagal tolak:", err);
      alert("Gagal menolak jurnal");
    }
  }

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setOpenDeleteConfirm(true);
  };

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("logbook").delete().eq("id", deleteId);
      if (error) throw error;
      fetchJournals();
      setOpenDeleteConfirm(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Gagal hapus:", err);
      alert("Gagal menghapus jurnal");
    }
  }

  const getStatusDisplay = (status: StatusType) => {
    if (status === "pending") return "Belum Diverifikasi";
    if (status === "disetujui") return "Disetujui";
    return "Ditolak";
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
        {loading ? (
          <div className="p-10 text-center text-gray-500">Memuat data jurnal...</div>
        ) : journals.length === 0 ? (
          <div className="p-10 text-center text-gray-500">Belum ada jurnal siswa</div>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3 text-left whitespace-nowrap">Siswa & Tanggal</th>
                <th className="px-5 py-3 text-left">Kegiatan & Kendala</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left whitespace-nowrap">Catatan Guru</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {journals.map((item) => (
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
                      <b>Kendala:</b> {item.kendala || "-"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs whitespace-nowrap
                      ${
                        item.status === "disetujui"
                          ? "bg-green-100 text-green-700"
                          : item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-pink-100 text-pink-700"
                      }`}
                    >
                      {getStatusDisplay(item.status)}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {item.catatan ?? "Belum ada catatan"}
                  </td>

                  {/* AKSI */}
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => openModal(item)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Lihat detail"
                      >
                        <Eye size={18} />
                      </button>

                      {item.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleSetujui(item.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Setujui jurnal"
                          >
                            <Check size={18} />
                          </button>

                          <button
                            onClick={() => confirmDelete(item.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Hapus jurnal"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* FOOTER */}
        <div className="p-5 flex justify-between text-sm text-gray-500">
          <p>Menampilkan 1 sampai {journals.length} dari {journals.length} entri</p>
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
                  <p className="text-xs text-gray-500">{selected.tanggal}</p>
                </div>
              </div>
              <button onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-5 space-y-6">
              {/* KENDALA */}
              <div>
                <p className="font-medium mb-2">Kendala yang Dihadapi</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                  {selected.kendala || "Tidak ada kendala"}
                </div>
              </div>

              {/* DOKUMENTASI */}
              {selected.file && (
                <div>
                  <p className="font-medium mb-2">Dokumentasi</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
                    <p className="text-sm">{selected.file}</p>
                    <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                      <Download size={16} /> Unduh
                    </button>
                  </div>
                </div>
              )}

              {/* CATATAN GURU */}
              <div>
                <div className="flex justify-between mb-2">
                  <p className="font-medium">Catatan Guru</p>
                </div>
                <textarea
                  value={catatanGuru}
                  onChange={(e) => setCatatanGuru(e.target.value)}
                  className="w-full border rounded-lg p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan catatan untuk siswa..."
                />
              </div>

              {/* ACTION BUTTONS - hanya muncul jika pending */}
              {selected.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleSetujui(selected.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    ✓ Setujui
                  </button>
                  <button
                    onClick={() => handleTolak(selected.id)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    ✕ Tolak
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI HAPUS ================= */}
      {openDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus jurnal ini? Aksi ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpenDeleteConfirm(false);
                  setDeleteId(null);
                }}
                className="px-5 py-2 border rounded-lg hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}