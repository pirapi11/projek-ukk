"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
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
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h3 className="font-semibold">Tambah DUDI</h3>

            {[
              ["Nama Perusahaan", "nama_perusahaan"],
              ["Alamat", "alamat"],
              ["Telepon", "telepon"],
              ["Email", "email"],
              ["Penanggung Jawab", "penanggung_jawab"],
            ].map(([label, key]) => (
              <input
                key={key}
                placeholder={label}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={(form as any)[key]}
                onChange={e =>
                  setForm(p => ({ ...p, [key]: e.target.value }))
                }
              />
            ))}

            <select
              value={form.status}
              onChange={e =>
                setForm(p => ({
                  ...p,
                  status: e.target.value as DudiStatus,
                }))
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 border rounded-lg py-2 text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-cyan-500 text-white rounded-lg py-2 text-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
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