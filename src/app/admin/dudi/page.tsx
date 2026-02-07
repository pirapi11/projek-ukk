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
} from "lucide-react"

/* ================= TYPES (SESUAI DB) ================= */

type DudiStatus = "aktif" | "nonaktif" | "pending"

type Dudi = {
  id: number
  nama_perusahaan: string
  alamat: string
  telepon: string
  email: string
  penanggung_jawab: string
  status: DudiStatus
}

type DudiForm = Omit<Dudi, "id">

/* ================= PAGE ================= */

export default function DudiAdminPage() {
  const [data, setData] = useState<Dudi[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<DudiForm>({
    nama_perusahaan: "",
    alamat: "",
    telepon: "",
    email: "",
    penanggung_jawab: "",
    status: "pending",
  })

  /* ================= FETCH DATA ================= */

  const fetchDudi = async () => {
    const { data } = await supabase
      .from("dudi")
      .select(`
        id,
        nama_perusahaan,
        alamat,
        telepon,
        email,
        penanggung_jawab,
        status,
        users (
          id,
          email
        )
      `)
      .order("created_at", { ascending: false })

    setData(data ?? [])
  }

  useEffect(() => {
    fetchDudi()
  }, [])

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (
      !form.nama_perusahaan ||
      !form.alamat ||
      !form.telepon ||
      !form.email ||
      !form.penanggung_jawab
    ) {
      alert("Semua field wajib diisi")
      return
    }

    setLoading(true)

    /* =============================
      1. BUAT USER DUDI
    ============================== */

    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        email: form.email,
        role: "dudi",
      })
      .select()
      .single()

    if (userError) {
      setLoading(false)
      alert("Gagal membuat akun DUDI")
      return
    }

    /* =============================
      2. SIMPAN DATA DUDI
    ============================== */

    const { error: dudiError } = await supabase.from("dudi").insert({
      user_id: user.id,
      nama_perusahaan: form.nama_perusahaan,
      alamat: form.alamat,
      telepon: form.telepon,
      email: form.email,
      penanggung_jawab: form.penanggung_jawab,
      status: "pending",
    })

    setLoading(false)

    if (dudiError) {
      alert("Gagal menyimpan data DUDI")
      return
  }

  /* =============================
     3. REFRESH DATA + RESET
  ============================== */

  setOpen(false)
  fetchDudi()

  setForm({
    nama_perusahaan: "",
    alamat: "",
    telepon: "",
    email: "",
    penanggung_jawab: "",
    status: "pending",
  })
}

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Manajemen DUDI</h1>
        <p className="text-sm text-gray-500">
          Data Dunia Usaha dan Dunia Industri
        </p>
      </div>

      {/* STAT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total DUDI"
          value={data.length}
          icon={<Building2 className="w-5 h-5 text-cyan-600" />}
        />
        <StatCard
          title="Aktif"
          value={data.filter(d => d.status === "aktif").length}
          icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
        />
        <StatCard
          title="Nonaktif"
          value={data.filter(d => d.status === "nonaktif").length}
          icon={<XCircle className="w-5 h-5 text-red-500" />}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 flex justify-between">
          <h2 className="font-semibold">Daftar DUDI</h2>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah DUDI
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Perusahaan</th>
              <th className="px-4 py-3 text-left">Kontak</th>
              <th className="px-4 py-3 text-left">Penanggung Jawab</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map(d => (
              <tr key={d.id}>
                <td className="px-4 py-3">
                  <div className="font-medium">{d.nama_perusahaan}</div>
                  <div className="text-xs text-gray-500">{d.alamat}</div>
                </td>
                <td className="px-4 py-3 text-xs">
                  <div>{d.email}</div>
                  <div>{d.telepon}</div>
                </td>
                <td className="px-4 py-3">{d.penanggung_jawab}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs
                    ${d.status === "aktif" && "bg-green-100 text-green-700"}
                    ${d.status === "nonaktif" && "bg-red-100 text-red-600"}
                    ${d.status === "pending" && "bg-yellow-100 text-yellow-700"}
                  `}>
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Pencil className="w-4 h-4 text-cyan-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-6">

              {/* HEADER */}
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Tambah DUDI Baru
                </h2>
                <p className="text-sm text-gray-500">
                  Lengkapi semua informasi yang diperlukan
                </p>
              </div>

              {/* FORM */}
              <div className="space-y-4 text-sm">

                {/* Nama Perusahaan */}
                <div className="space-y-1">
                  <label className="font-medium text-gray-700">
                    Nama Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Masukkan nama perusahaan"
                    className="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={form.nama_perusahaan}
                    onChange={e =>
                      setForm(p => ({ ...p, nama_perusahaan: e.target.value }))
                    }
                  />
                </div>

                {/* Alamat */}
                <div className="space-y-1">
                  <label className="font-medium text-gray-700">
                    Alamat <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Masukkan alamat lengkap"
                    className="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={form.alamat}
                    onChange={e =>
                      setForm(p => ({ ...p, alamat: e.target.value }))
                    }
                  />
                </div>

                {/* Telepon */}
                <div className="space-y-1">
                  <label className="font-medium text-gray-700">
                    Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Contoh: 021-12345678"
                    className="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={form.telepon}
                    onChange={e =>
                      setForm(p => ({ ...p, telepon: e.target.value }))
                    }
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Contoh: info@perusahaan.com"
                    className="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={form.email}
                    onChange={e =>
                      setForm(p => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>

                {/* Penanggung Jawab */}
                <div className="space-y-1">
                  <label className="font-medium text-gray-700">
                    Penanggung Jawab <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Nama penanggung jawab"
                    className="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={form.penanggung_jawab}
                    onChange={e =>
                      setForm(p => ({ ...p, penanggung_jawab: e.target.value }))
                    }
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full rounded-xl border px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={form.status}
                    onChange={e =>
                      setForm(p => ({
                        ...p,
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

              {/* ACTION */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="
                    flex-1 rounded-xl py-2 font-medium
                    border border-gray-300 text-gray-300
                    transition-all duration-200
                    hover:bg-red-500 hover:text-white hover:shadow-md
                    active:scale-95
                  ">
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="
                    flex-1 rounded-xl py-2 font-medium text-white
                    bg-gray-300
                    transition-all duration-200
                    hover:bg-cyan-600 hover:shadow-md
                    disabled:hover:bg-gray-300
                    disabled:cursor-not-allowed
                  ">
                  Simpan
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

/* ================= COMPONENT ================= */

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white rounded-xl border p-4 flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
        {icon}
      </div>
    </div>
  )
}