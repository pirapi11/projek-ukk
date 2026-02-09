"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { createPortal } from "react-dom"
import {
  Plus,
  Pencil,
  Trash2,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react"

type Role = "admin" | "guru" | "siswa"

interface UserType {
  id: string
  name: string | null
  email: string
  role: Role
  email_verified?: "Verified" | "Unverified"
  created_at?: string
}

export default function PenggunaPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState<UserType | null>(null)
  const [openDelete, setOpenDelete] = useState<UserType | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    setErrorMsg("")
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role, email_verified, created_at")
        .order("created_at", { ascending: false })

      if (error) throw error

      setUsers(data || [])
    } catch (err: any) {
      console.error("Fetch users error:", err)
      setErrorMsg("Gagal memuat data pengguna")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
        <button
          onClick={() => setOpenAdd(true)}
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Tambah User
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errorMsg}
        </div>
      )}

      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Belum ada pengguna</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-6 py-3">Pengguna</th>
                <th className="text-left px-6 py-3">Email & Verifikasi</th>
                <th className="text-left px-6 py-3">Role</th>
                <th className="text-left px-6 py-3">Terdaftar</th>
                <th className="text-center px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{u.name || "Tidak ada nama"}</div>
                    <div className="text-xs text-gray-500">ID: {u.id.slice(0, 8)}...</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {u.email}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.email_verified === "Verified" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.email_verified === "Verified" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {u.email_verified || "Unverified"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-medium">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID") : "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setOpenEdit(u)}
                      className="p-2 hover:bg-cyan-50 rounded-lg mr-1"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4 text-cyan-600" />
                    </button>
                    <button
                      onClick={() => setOpenDelete(u)}
                      className="p-2 hover:bg-red-50 rounded-lg"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL TAMBAH */}
      {openAdd &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tambah User Baru</h2>
                <p className="text-sm text-gray-500 mt-1">Lengkapi semua informasi yang diperlukan</p>
              </div>
              <FormTambahUser onSuccess={() => { fetchUsers(); setOpenAdd(false) }} onCancel={() => setOpenAdd(false)} />
            </div>
          </div>,
          document.body
        )}

      {/* MODAL EDIT */}
      {openEdit &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
                <p className="text-sm text-gray-500 mt-1">Perbarui informasi user</p>
              </div>
              <FormEditUser user={openEdit} onSuccess={() => { fetchUsers(); setOpenEdit(null) }} onCancel={() => setOpenEdit(null)} />
            </div>
          </div>,
          document.body
        )}

      {/* MODAL HAPUS */}
      {openDelete &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Konfirmasi Hapus</h2>
              <p className="text-gray-600">
                Hapus user <strong>{openDelete.name || openDelete.email}</strong>? Tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setOpenDelete(null)} className="flex-1 py-3 border rounded-xl hover:bg-gray-50">
                  Batal
                </button>
                <button
                  onClick={async () => {
                    const { error } = await supabase.from("users").delete().eq("id", openDelete.id)
                    if (error) alert("Gagal hapus: " + error.message)
                    else { fetchUsers(); setOpenDelete(null) }
                  }}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

/* FORM TAMBAH */
function FormTambahUser({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"guru" | "siswa">("siswa")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || password.length < 6 || password !== confirmPassword) {
      setError("Isi semua field benar. Password min 6 char & sama.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("Gagal buat akun")

      onSuccess()  // trigger sudah handle insert ke public.users
    } catch (err: any) {
      console.error("Error tambah user:", err)
      setError(err.message || "Gagal tambah user. Cek email sudah terdaftar atau role valid.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Nama Lengkap *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Masukkan nama lengkap" className="w-full border rounded-xl px-4 py-2.5" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Email *</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@email.com" className="w-full border rounded-xl px-4 py-2.5" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Role *</label>
        <select value={role} onChange={e => setRole(e.target.value as "guru" | "siswa")} className="w-full border rounded-xl px-4 py-2.5">
          <option value="guru">Guru</option>
          <option value="siswa">Siswa</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Password *</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 karakter" className="w-full border rounded-xl px-4 py-2.5" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Konfirmasi Password *</label>
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Ulangi password" className="w-full border rounded-xl px-4 py-2.5" />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3 pt-4">
        <button onClick={onCancel} className="flex-1 py-3 border rounded-xl hover:bg-gray-50">Batal</button>
        <button onClick={handleSubmit} disabled={loading} className={`flex-1 py-3 rounded-xl text-white ${loading ? "bg-gray-400" : "bg-cyan-600 hover:bg-cyan-700"}`}>
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  )
}

/* FORM EDIT */
function FormEditUser({ user, onSuccess, onCancel }: { user: UserType; onSuccess: () => void; onCancel: () => void }) {
  const [name, setName] = useState(user.name || "")
  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState<Role>(user.role)
  const [verification, setVerification] = useState<"Verified" | "Unverified">(user.email_verified || "Unverified")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      setError("Nama dan email wajib")
      return
    }

    setLoading(true)
    setError("")

    try {
      const { error } = await supabase
        .from("users")
        .update({
          name,
          email,
          role,
          email_verified: verification,
        })
        .eq("id", user.id)

      if (error) throw error
      onSuccess()
    } catch (err: any) {
      setError(err.message || "Gagal update")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Nama Lengkap *</label>
        <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-xl px-4 py-2.5" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Email *</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-xl px-4 py-2.5" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Role *</label>
        <select value={role} onChange={e => setRole(e.target.value as Role)} className="w-full border rounded-xl px-4 py-2.5">
          <option value="admin">Admin</option>
          <option value="guru">Guru</option>
          <option value="siswa">Siswa</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Email Verification *</label>
        <select
          value={verification}
          onChange={e => setVerification(e.target.value as "Verified" | "Unverified")}
          className="w-full border rounded-xl px-4 py-2.5 bg-white"
        >
          <option value="Unverified">Unverified</option>
          <option value="Verified">Verified</option>
        </select>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
        Catatan: Password diubah via reset password terpisah.
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3 pt-4">
        <button onClick={onCancel} className="flex-1 py-3 border rounded-xl hover:bg-gray-50">Batal</button>
        <button onClick={handleSubmit} disabled={loading} className={`flex-1 py-3 rounded-xl text-white ${loading ? "bg-gray-400" : "bg-cyan-600 hover:bg-cyan-700"}`}>
          {loading ? "Memperbarui..." : "Update"}
        </button>
      </div>
    </div>
  )
}