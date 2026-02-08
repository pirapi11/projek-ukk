"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabase"; // sesuaikan path jika berbeda
import {
  Plus,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  X,
  Globe,
  MoreHorizontal,
} from "lucide-react";

// Tipe untuk data mentah dari Supabase (relasi berupa array)
type MagangRaw = {
  id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: "pending" | "aktif" | "selesai" | "ditolak";
  nilai_akhir?: number | null;
  siswa: Array<{ id: number; nama: string; nis: string; jurusan: string; kelas: string }> | null;
  guru: Array<{ id: number; nama: string; nip: string }> | null;
  dudi: Array<{ id: number; nama_perusahaan: string; alamat: string }> | null;
};

// Tipe yang digunakan di state (relasi sudah single object)
type Magang = {
  id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: "pending" | "aktif" | "selesai" | "ditolak";
  nilai_akhir?: number | null;
  siswa: { id: number; nama: string; nis: string; jurusan: string; kelas: string } | null;
  guru: { id: number; nama: string; nip: string } | null;
  dudi: { id: number; nama_perusahaan: string; alamat: string } | null;
};

type Siswa = { id: number; nama: string; nis: string; jurusan: string; kelas: string };
type Guru = { id: number; nama: string; nip: string };
type Dudi = { id: number; nama_perusahaan: string; alamat: string };

export default function MagangPage() {
  const [magangList, setMagangList] = useState<Magang[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchMagang();
  }, [searchTerm, statusFilter, page, limit]);

  async function fetchMagang() {
    setLoading(true);
    try {
        let query = supabase
        .from("magang")
        .select(
            `
            id,
            tanggal_mulai,
            tanggal_selesai,
            status,
            nilai_akhir,
            siswa:siswa_id (id, nama, nis, jurusan, kelas),
            guru:guru_id (id, nama, nip),
            dudi:dudi_id (id, nama_perusahaan, alamat)
        `,
            { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (searchTerm.trim()) {
        query = query.or(
          `siswa.nama.ilike.%${searchTerm}%,guru.nama.ilike.%${searchTerm}%,dudi.nama_perusahaan.ilike.%${searchTerm}%`
        );
      }

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

    console.log("Raw data dari Supabase:", data);

      // Transform relasi array → single object
      const transformed: Magang[] = (data || []).map((row: any) => ({
        id: row.id,
        tanggal_mulai: row.tanggal_mulai,
        tanggal_selesai: row.tanggal_selesai,
        status: row.status,
        nilai_akhir: row.nilai_akhir,
        siswa: row.siswa?.[0] ?? null,
        guru: row.guru?.[0] ?? null,
        dudi: row.dudi?.[0] ?? null,
        }));

        setMagangList(transformed);
        setTotalCount(count || 0);
    } catch (err) {
        console.error("Error fetch magang:", err);
    } finally {
        setLoading(false);
    }
    }

  const total = totalCount;
  const aktif = magangList.filter((m) => m.status === "aktif").length;
  const selesai = magangList.filter((m) => m.status === "selesai").length;
  const pending = magangList.filter((m) => m.status === "pending").length;

  async function handleDelete() {
    if (!selectedId) return;
    try {
      const { error } = await supabase.from("magang").delete().eq("id", selectedId);
      if (error) throw error;
      fetchMagang();
      setOpenDelete(false);
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">
        Manajemen Siswa Magang
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          ["Total Siswa", total, "Siswa magang terdaftar"],
          ["Aktif", aktif, "Sedang magang"],
          ["Selesai", selesai, "Magang selesai"],
          ["Pending", pending, "Menunggu penempatan"],
        ].map(([title, value, desc], idx) => (
          <div key={idx} className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center">
          <p className="font-semibold text-gray-800">Daftar Siswa Magang</p>
          <button
            onClick={() => setOpenTambah(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} /> Tambah
          </button>
        </div>

        <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cari siswa, guru, atau DUDI..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border rounded-lg px-3 py-2 text-sm min-w-[140px]"
              value={statusFilter || ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value || null)}
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="aktif">Aktif</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-sm whitespace-nowrap">
            <span>Tampilkan</span>
            <select
              className="border rounded-lg px-2 py-1 text-sm"
              value={limit}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setLimit(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>per halaman</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Memuat data...</div>
        ) : magangList.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Belum ada data magang</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1000px]">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Siswa</th>
                  <th className="px-6 py-4 text-left font-medium">Guru Pembimbing</th>
                  <th className="px-6 py-4 text-left font-medium">DUDI</th>
                  <th className="px-6 py-4 text-left font-medium">Periode</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-left font-medium">Nilai</th>
                  <th className="px-6 py-4 text-center font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {magangList.map((item) => {
                  const start = new Date(item.tanggal_mulai);
                  const end = new Date(item.tanggal_selesai);
                  const durasi =
                    !isNaN(start.getTime()) && !isNaN(end.getTime())
                      ? Math.ceil((end.getTime() - start.getTime()) / (86400000)) + " hari"
                      : "-";

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium">{item.siswa?.nama ?? "-"}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          NIS: {item.siswa?.nis ?? "-"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.siswa?.kelas ?? "-"} {item.siswa?.jurusan ?? ""}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{item.guru?.nama ?? "-"}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          NIP: {item.guru?.nip ?? "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <Globe size={16} className="text-gray-400 mt-1" />
                          <div>
                            <div className="font-medium">{item.dudi?.nama_perusahaan ?? "-"}</div>
                            <div className="text-xs text-gray-500">{item.dudi?.alamat ?? "-"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {item.tanggal_mulai
                            ? new Date(item.tanggal_mulai).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}{" "}
                          s.d{" "}
                          {item.tanggal_selesai
                            ? new Date(item.tanggal_selesai).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{durasi}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                            item.status === "aktif"
                              ? "bg-green-100 text-green-800"
                              : item.status === "selesai"
                              ? "bg-blue-100 text-blue-800"
                              : item.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.nilai_akhir != null ? (
                          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            {item.nilai_akhir}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedId(item.id);
                              setOpenEdit(true);
                            }}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedId(item.id);
                              setOpenDelete(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 border-t">
          <p>
            Menampilkan {(page - 1) * limit + 1} – {Math.min(page * limit, totalCount)} dari {totalCount} entri
          </p>

          <div className="flex items-center gap-1">
            <button
              className="p-2 border rounded disabled:opacity-50 hover:bg-gray-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: Math.ceil(totalCount / limit) }, (_, i) => i + 1)
              .slice(Math.max(0, page - 3), page + 2)
              .map((p) => (
                <button
                  key={p}
                  className={`px-3 py-1 rounded min-w-[32px] ${
                    p === page
                      ? "bg-blue-600 text-white font-medium"
                      : "border hover:bg-gray-50"
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}

            <button
              className="p-2 border rounded disabled:opacity-50 hover:bg-gray-50"
              disabled={page >= Math.ceil(totalCount / limit)}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tambah */}
      {openTambah && (
        <Modal title="Tambah Data Siswa Magang" onClose={() => setOpenTambah(false)}>
          <FormTambah
            onSuccess={() => {
              setOpenTambah(false);
              fetchMagang();
            }}
          />
        </Modal>
      )}

      {/* Modal Edit */}
      {openEdit && selectedId !== null && (
        <Modal title="Edit Data Siswa Magang" onClose={() => setOpenEdit(false)}>
          <FormEdit
            magangId={selectedId}
            onSuccess={() => {
              setOpenEdit(false);
              fetchMagang();
            }}
          />
        </Modal>
      )}

      {/* Konfirmasi Hapus */}
      {openDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus data magang ini? Aksi ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenDelete(false)}
                className="px-5 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
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

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">Masukkan informasi data magang siswa</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function FormTambah({ onSuccess }: { onSuccess: () => void }) {
  const [siswaId, setSiswaId] = useState("");
  const [guruId, setGuruId] = useState("");
  const [dudiId, setDudiId] = useState("");
  const [mulai, setMulai] = useState("");
  const [selesai, setSelesai] = useState("");
  const [status, setStatus] = useState<"pending" | "aktif" | "selesai">("pending");

  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [dudiList, setDudiList] = useState<Dudi[]>([]);

  useEffect(() => {
    async function fetchOptions() {
      const [s, g, d] = await Promise.all([
        supabase.from("siswa").select("id, nama, nis, jurusan, kelas"),
        supabase.from("guru").select("id, nama, nip"),
        supabase.from("dudi").select("id, nama_perusahaan, alamat"),
      ]);

      setSiswaList(s.data ?? []);
      setGuruList(g.data ?? []);
      setDudiList(d.data ?? []);
    }
    fetchOptions();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const { error } = await supabase.from("magang").insert({
        siswa_id: Number(siswaId),
        guru_id: Number(guruId),
        dudi_id: Number(dudiId),
        tanggal_mulai: mulai || null,
        tanggal_selesai: selesai || null,
        status,
      });

      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      console.error("Error menambah magang:", err);
      alert("Gagal menambah data: " + (err.message || "Terjadi kesalahan"));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section title="Siswa & Pembimbing">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Siswa *</label>
          <select
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={siswaId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSiswaId(e.target.value)}
            required
          >
            <option value="">Pilih Siswa</option>
            {siswaList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nama} — {s.nis}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guru Pembimbing *</label>
          <select
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={guruId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setGuruId(e.target.value)}
            required
          >
            <option value="">Pilih Guru</option>
            {guruList.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nama} — {g.nip}
              </option>
            ))}
          </select>
        </div>
      </Section>

      <Section title="Tempat Magang">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">DUDI *</label>
          <select
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dudiId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setDudiId(e.target.value)}
            required
          >
            <option value="">Pilih DUDI</option>
            {dudiList.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nama_perusahaan}
              </option>
            ))}
          </select>
        </div>
      </Section>

      <Section title="Periode & Status" grid>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={mulai}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMulai(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai *</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selesai}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSelesai(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setStatus(e.target.value as "pending" | "aktif" | "selesai")
            }
          >
            <option value="pending">Pending</option>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </Section>

      <Footer action="Simpan" type="submit" />
    </form>
  );
}

function FormEdit({ magangId, onSuccess }: { magangId: number; onSuccess: () => void }) {
  const [mulai, setMulai] = useState("");
  const [selesai, setSelesai] = useState("");
  const [status, setStatus] = useState<"pending" | "aktif" | "selesai">("pending");
  const [nilai, setNilai] = useState<number | "">("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("magang")
        .select("tanggal_mulai, tanggal_selesai, status, nilai_akhir")
        .eq("id", magangId)
        .single();

      if (error) {
        console.error("Error fetch data edit:", error);
      } else if (data) {
        setMulai(data.tanggal_mulai ?? "");
        setSelesai(data.tanggal_selesai ?? "");
        setStatus(data.status ?? "pending");
        setNilai(data.nilai_akhir ?? "");
      }
      setLoading(false);
    }
    fetchData();
  }, [magangId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const updates: Record<string, any> = {
        tanggal_mulai: mulai || null,
        tanggal_selesai: selesai || null,
        status,
      };

      if (status === "selesai" && nilai !== "") {
        updates.nilai_akhir = Number(nilai);
      }

      const { error } = await supabase.from("magang").update(updates).eq("id", magangId);

      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      console.error("Error update magang:", err);
      alert("Gagal mengupdate: " + (err.message || "Terjadi kesalahan"));
    }
  }

  if (loading) return <div className="py-8 text-center">Memuat data...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section title="Periode & Status" grid>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={mulai}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMulai(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai *</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selesai}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSelesai(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setStatus(e.target.value as "pending" | "aktif" | "selesai")
            }
          >
            <option value="pending">Pending</option>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </Section>

      <Section title="Penilaian">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Akhir</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={nilai}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNilai(e.target.value === "" ? "" : Number(e.target.value))
            }
            disabled={status !== "selesai"}
            placeholder="Hanya bisa diisi jika status selesai"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Nilai hanya dapat diisi setelah status magang menjadi "Selesai"
          </p>
        </div>
      </Section>

      <Footer action="Update" type="submit" />
    </form>
  );
}

function Section({
  title,
  children,
  grid = false,
}: {
  title: string;
  children: React.ReactNode;
  grid?: boolean;
}) {
  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-700 mb-3">{title}</h3>
      <div className={grid ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        {children}
      </div>
    </div>
  );
}

function Footer({ action, type = "button" }: { action: string; type?: "button" | "submit" }) {
  return (
    <div className="flex justify-end gap-3 pt-5 border-t mt-6">
      <button
        type="button"
        className="px-6 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
      >
        Batal
      </button>
      <button
        type={type}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
      >
        {action}
      </button>
    </div>
  );
}