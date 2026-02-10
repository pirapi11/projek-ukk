"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { createPortal } from "react-dom"
import {
  Building2,
  CheckCircle2,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  Search,
  Users,
} from "lucide-react"

/* ================= TYPES ================= */

type DudiStatus = "aktif" | "nonaktif" | "pending"

interface Dudi {
  id: number
  nama_perusahaan: string
  alamat: string
  telepon: string
  email: string
  penanggung_jawab: string
  status: DudiStatus
  magang: { count: number }[]
  kuota: string | null
}

type DudiForm = {
  nama_perusahaan: string
  alamat: string
  telepon: string
  email: string
  penanggung_jawab: string
  status: DudiStatus
  kuota: string | null
}

/* ================= MAIN COMPONENT ================= */

export default function DudiAdminPage() {
  const [data, setData] = useState<Dudi[]>([])
  const [form, setForm] = useState<DudiForm>({
    nama_perusahaan: "",
    alamat: "",
    telepon: "",
    email: "",
    penanggung_jawab: "",
    status: "aktif",
    kuota: null,
  })

  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 5

  useEffect(() => {
    fetchDudi()
  }, [])

  async function fetchDudi() {
    setLoading(true)
    const { data: dudiData, error } = await supabase
      .from("dudi")
      .select(`
        id,
        nama_perusahaan,
        alamat,
        telepon,
        email,
        penanggung_jawab,
        status,
        kuota,
        magang:magang!magang_dudi_id_fkey (count)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching DUDI:", error)
    } else {
      setData(dudiData || [])
    }
    setLoading(false)
  }

  const isFormComplete =
    [form.nama_perusahaan, form.alamat, form.telepon, form.email, form.penanggung_jawab].every(
      (str) => str.trim() !== ""
    ) && !!form.status

  async function handleSave() {
    if (!isFormComplete) return

    setLoading(true)

    try {
      const payload = {
        nama_perusahaan: form.nama_perusahaan,
        alamat: form.alamat,
        telepon: form.telepon,
        email: form.email,
        penanggung_jawab: form.penanggung_jawab,
        status: form.status,
        kuota: form.kuota,
      }

      if (isEdit && editId) {
        const { error } = await supabase.from("dudi").update(payload).eq("id", editId)
        if (error) throw error
      } else {
        const { error } = await supabase.from("dudi").insert(payload)
        if (error) throw error
      }

      await fetchDudi()
      closeModal()
    } catch (err: any) {
      console.error("Error saving DUDI:", err)
      alert("Gagal menyimpan: " + (err?.message || "Periksa koneksi atau data duplikat"))
    } finally {
      setLoading(false)
    }
  }

  function openAddModal() {
    setForm({
      nama_perusahaan: "",
      alamat: "",
      telepon: "",
      email: "",
      penanggung_jawab: "",
      status: "aktif",
      kuota: null,
    })
    setIsEdit(false)
    setEditId(null)
    setOpen(true)
  }

  function openEditModal(dudi: Dudi) {
    setForm({
      nama_perusahaan: dudi.nama_perusahaan,
      alamat: dudi.alamat,
      telepon: dudi.telepon,
      email: dudi.email,
      penanggung_jawab: dudi.penanggung_jawab,
      status: dudi.status,
      kuota: dudi.kuota,
    })
    setIsEdit(true)
    setEditId(dudi.id)
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
    setIsEdit(false)
    setEditId(null)
  }

  async function confirmDelete() {
    if (!deleteId) return
    setLoading(true)

    const { error } = await supabase.from("dudi").delete().eq("id", deleteId)

    if (error) {
      console.error("Error deleting DUDI:", error)
      alert("Gagal menghapus: " + (error.message || "Mungkin ada data terkait"))
    } else {
      await fetchDudi()
    }

    setShowDeleteConfirm(false)
    setDeleteId(null)
    setLoading(false)
  }

  const filtered = data.filter(
    (d) =>
      d.nama_perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.alamat.toLowerCase().includes(search.toLowerCase()) ||
      d.penanggung_jawab.toLowerCase().includes(search.toLowerCase())
  )

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  const totalMagang = data.reduce((sum, d) => sum + (d.magang?.[0]?.count ?? 0), 0)
  const totalTidakAktif = data.filter((d) => d.status !== "aktif").length

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Manajemen DUDI</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total DUDI" value={data.length} icon={<Building2 className="w-5 h-5 text-cyan-600" />} />
        <StatCard title="DUDI Aktif" value={data.filter((d) => d.status === "aktif").length} icon={<CheckCircle2 className="w-5 h-5 text-green-600" />} />
        <StatCard title="DUDI Tidak Aktif" value={totalTidakAktif} icon={<XCircle className="w-5 h-5 text-red-500" />} />
        <StatCard title="Siswa Magang" value={totalMagang} icon={<Users className="w-5 h-5 text-cyan-600" />} />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row justify-between gap-4 border-b">
          <h2 className="font-semibold text-lg">Daftar DUDI</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari perusahaan, alamat, penanggung jawab..."
                className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full sm:w-64"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              <Plus className="w-4 h-4" />
              Tambah DUDI
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Perusahaan</th>
                <th className="px-6 py-3 text-left font-medium">Kontak</th>
                <th className="px-6 py-3 text-left font-medium">Penanggung Jawab</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-center font-medium">Siswa Magang</th>
                <th className="px-6 py-3 text-center font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginated.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <div className="font-medium">{d.nama_perusahaan}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{d.alamat}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div>{d.email}</div>
                    <div className="mt-0.5">{d.telepon}</div>
                  </td>
                  <td className="px-6 py-4">{d.penanggung_jawab}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium
                        ${d.status === "aktif" ? "bg-green-100 text-green-700" : ""}
                        ${d.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
                        ${d.status === "nonaktif" ? "bg-red-100 text-red-700" : ""}
                      `}
                    >
                      {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium">
                    {d.magang?.[0]?.count ?? 0}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => openEditModal(d)}
                      className="p-2 hover:bg-cyan-50 rounded-lg mr-1"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4 text-cyan-600" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(d.id)
                        setShowDeleteConfirm(true)
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Tidak ada data DUDI
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 border-t">
          <div>
            Menampilkan {(page - 1) * perPage + 1} – {Math.min(page * perPage, filtered.length)} dari {filtered.length} entri
          </div>
          <div className="flex gap-2 mt-3 sm:mt-0">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              «
            </button>
            <span className="px-4 py-1 bg-cyan-600 text-white rounded">{page}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || totalPages === 0}
              className="px-3 py-1 border rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              »
            </button>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT */}
      {open &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isEdit ? "Edit DUDI" : "Tambah DUDI Baru"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Lengkapi semua informasi yang diperlukan
                </p>
              </div>

              <div className="space-y-5">
                {(["nama_perusahaan", "alamat", "telepon", "email", "penanggung_jawab", "kuota"] as const).map(
                  (field) => (
                    <div key={field} className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {field.replace(/_/g, " ")} {field !== "kuota" && <span className="text-red-500">*</span>}
                      </label>

                      {field === "alamat" ? (
                        <textarea
                          placeholder="Masukkan alamat lengkap"
                          className="w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[80px]"
                          value={form[field] ?? ""}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              [field]: e.target.value, // wajib → selalu string
                            }))
                          }
                        />
                      ) : (
                        <input
                          type={field === "email" ? "email" : "text"}
                          placeholder={
                            field === "telepon"
                              ? "Contoh: 021-12345678"
                              : field === "email"
                              ? "Contoh: info@perusahaan.com"
                              : field === "kuota"
                              ? "Kuota siswa magang (misal: 10)"
                              : "Masukkan " + field.replace(/_/g, " ")
                          }
                          className="w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          value={form[field] ?? ""}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              [field]:
                                field === "kuota"
                                  ? e.target.value || null // opsional → boleh null
                                  : e.target.value,        // wajib → string
                            }))
                          }
                        />
                      )}
                    </div>
                  )
                )}

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full rounded-xl border px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as DudiStatus,
                      }))
                    }
                  >
                    <option value="aktif">Aktif</option>
                    <option value="pending">Pending</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isFormComplete || loading}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium text-white transition ${
                    isFormComplete && !loading ? "bg-cyan-600 hover:bg-cyan-700" : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL HAPUS */}
      {showDeleteConfirm &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Konfirmasi Hapus</h2>
              <p className="text-gray-600">
                Apakah Anda yakin ingin menghapus data DUDI ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium text-white transition ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {loading ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border p-5 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>
    </div>
  )
}