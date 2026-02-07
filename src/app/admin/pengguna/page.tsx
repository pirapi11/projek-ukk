"use client"

import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react"

type Role = "Admin" | "Guru" | "Siswa"

type User = {
  id: number
  name: string
  email: string
  role: Role
  verified: boolean
  date: string
}

export default function PenggunaPage() {
  const [users, setUsers] = useState<User[]>(dummyUsers)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState<User | null>(null)
  const [openDelete, setOpenDelete] = useState<User | null>(null)

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Manajemen User
        </h1>
        <button
          onClick={() => setOpenAdd(true)}
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 text-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah User
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">
                Email & Verifikasi
              </th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Terdaftar</th>
              <th className="text-center px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr
                key={u.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {u.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    ID: {u.id}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {u.email}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs
                    ${
                      u.verified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.verified ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {u.verified ? "Verified" : "Unverified"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs">
                    {u.role}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {u.date}
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setOpenEdit(u)}
                      className="p-2 hover:bg-gray-200 rounded-lg"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setOpenDelete(u)}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL TAMBAH USER ================= */}
      {openAdd && (
        <Modal onClose={() => setOpenAdd(false)}>
            <h3 className="text-lg font-semibold">
            Tambah User Baru
            </h3>
            <p className="text-sm text-gray-500 mb-4">
            Lengkapi semua informasi yang diperlukan
            </p>

            <FormTambahUser onCancel={() => setOpenAdd(false)} />
        </Modal>
        )}

      {/* ================= MODAL EDIT USER ================= */}
      {openEdit && (
        <Modal onClose={() => setOpenEdit(null)}>
            <h3 className="text-lg font-semibold">Edit User</h3>
            <p className="text-sm text-gray-500 mb-4">
            Perbarui informasi user
            </p>

            <FormEditUser
            user={openEdit}
            onCancel={() => setOpenEdit(null)}
            />
        </Modal>
        )}
    
      {/* ================= MODAL HAPUS ================= */}
      {openDelete && (
        <Modal onClose={() => setOpenDelete(null)}>
          <h3 className="text-lg font-semibold mb-2">
            Konfirmasi Hapus
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Apakah Anda yakin ingin menghapus data user ini?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setOpenDelete(null)}
              className="px-4 py-2 rounded-lg border"
            >
              Batal
            </button>
            <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
              Ya, Hapus
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ================= MODAL WRAPPER ================= */
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
        {children}
      </div>
    </div>
  )
}

/* ================= FORM TAMBAH ================= */
function FormTambahUser({
  onCancel,
}: {
  onCancel: () => void
}) {
  return (
    <div className="space-y-3">
      <Input label="Nama Lengkap" placeholder="Masukkan nama lengkap" />
      <Input label="Email" placeholder="user@email.com" />
      <Select label="Role" />
      <Input label="Password" placeholder="Minimal 6 karakter" />
      <Input label="Konfirmasi Password" placeholder="Ulangi password" />
      <Select label="Email Verification" />

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border rounded-lg py-2 hover:bg-gray-100"
        >
          Batal
        </button>
        <button
          type="button"
          className="flex-1 bg-cyan-500 text-white rounded-lg py-2 hover:bg-cyan-600"
        >
          Simpan
        </button>
      </div>
    </div>
  )
}

/* ================= FORM EDIT ================= */
function FormEditUser({
  user,
  onCancel,
}: {
  user: User
  onCancel: () => void
}) {
  return (
    <div className="space-y-3">
      <Input label="Nama Lengkap" defaultValue={user.name} />
      <Input label="Email" defaultValue={user.email} />
      <Select label="Role" defaultValue={user.role} />

      <div className="text-xs bg-blue-50 text-blue-600 p-3 rounded-lg">
        Catatan: Untuk mengubah password, silakan gunakan fitur
        reset password yang terpisah.
      </div>

      <Select
        label="Email Verification"
        defaultValue={user.verified ? "Verified" : "Unverified"}
      />

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="border px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          Batal
        </button>
        <button
          type="button"
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  )
}

/* ================= COMPONENT KECIL ================= */
function Input({
  label,
  ...props
}: any) {
  return (
    <div>
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        {...props}
        className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
      />
    </div>
  )
}

function Select({
  label,
  defaultValue,
}: {
  label: string
  defaultValue?: string
}) {
  return (
    <div>
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        defaultValue={defaultValue}
        className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
      >
        <option>Admin</option>
        <option>Guru</option>
        <option>Siswa</option>
        <option>Verified</option>
        <option>Unverified</option>
      </select>
    </div>
  )
}

/* ================= DUMMY DATA ================= */
const dummyUsers: User[] = [
  {
    id: 1,
    name: "Admin Sistem",
    email: "admin@gmail.com",
    role: "Admin",
    verified: true,
    date: "1 Jan 2024",
  },
  {
    id: 2,
    name: "Pak Suryanto",
    email: "suryanto@teacher.com",
    role: "Guru",
    verified: true,
    date: "2 Jan 2024",
  },
  {
    id: 3,
    name: "Bu Kartika",
    email: "kartika@teacher.com",
    role: "Guru",
    verified: true,
    date: "3 Jan 2024",
  },
  {
    id: 4,
    name: "Ahmad Rizki",
    email: "ahmad@email.com",
    role: "Siswa",
    verified: true,
    date: "4 Jan 2024",
  },
]
