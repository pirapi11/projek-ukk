"use client"

import {
  Pencil,
  School,
  Eye,
  LayoutDashboard,
  FileText,
  Info,
} from "lucide-react"

export default function PengaturanSekolahPage() {
  return (
    <div className="space-y-6">
      {/* ================= TITLE ================= */}
      <h1 className="text-xl font-semibold">Pengaturan Sekolah</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ================= LEFT ================= */}
        <div className="xl:col-span-2 space-y-6">
          {/* -------- Informasi Sekolah -------- */}
          <div className="bg-white rounded-2xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-cyan-600" />
                <h2 className="font-semibold">Informasi Sekolah</h2>
              </div>

              <button className="flex items-center gap-2 text-sm bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg">
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            </div>

            <div className="space-y-4">
              {/* Logo */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Logo Sekolah
                </label>
                <div className="mt-2">
                  <LogoBox size="md" />
                </div>
              </div>

              <Input label="Nama Sekolah/Instansi" value="SMK Negeri 1 Surabaya" />
              <Textarea
                label="Alamat Lengkap"
                value="Jl. SMEA No.4, Sawahan, Kec. Sawahan, Kota Surabaya, Jawa Timur 60252"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input label="Telepon" value="031-5678910" />
                <Input label="Email" value="info@smkn1surabaya.sch.id" />
              </div>

              <Input label="Website" value="www.smkn1surabaya.sch.id" />
              <Input label="Kepala Sekolah" value="Drs. H. Sutrisno, M.Pd." />
              <Input label="NPSN (Nomor Pokok Sekolah Nasional)" value="20567890" />

              <p className="text-xs text-gray-400 pt-2">
                Terakhir diperbarui: 1 Januari 2024 pukul 07.00
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-6">
          {/* -------- Preview -------- */}
          <div className="bg-white rounded-2xl border p-6">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-5 h-5 text-cyan-600" />
              <h2 className="font-semibold">Preview Tampilan</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Pratinjau bagaimana informasi sekolah akan ditampilkan
            </p>

            {/* Dashboard Header */}
            <div className="border rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                <LayoutDashboard className="w-4 h-4 text-cyan-600" />
                Dashboard Header
              </div>

              <div className="flex items-center gap-3 bg-cyan-50 border border-cyan-100 rounded-lg p-3">
                <LogoBox size="sm" />
                <div>
                  <p className="font-semibold text-sm">
                    SMK Negeri 1 Surabaya
                  </p>
                  <p className="text-xs text-gray-500">
                    Sistem Informasi Magang
                  </p>
                </div>
              </div>
            </div>

            {/* Header Rapor */}
            <div className="border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                <FileText className="w-4 h-4 text-cyan-600" />
                Header Rapor/Sertifikat
              </div>

              <div className="text-center space-y-2 text-sm">
                <div className="flex justify-center">
                  <LogoBox size="sm" />
                </div>
                <p className="font-semibold">SMK Negeri 1 Surabaya</p>
                <p className="text-xs text-gray-500">
                  Jl. SMEA No.4, Sawahan, Kec. Sawahan, Kota Surabaya, Jawa Timur
                  60252
                </p>
                <p className="text-xs text-gray-500">
                  Telp: 031-5678910 | Email: info@smkn1surabaya.sch.id
                </p>
                <p className="font-semibold pt-2">SERTIFIKAT MAGANG</p>
              </div>
            </div>
          </div>

          {/* -------- Info -------- */}
          <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-4 text-sm space-y-2">
            <div className="flex items-center gap-2 font-medium text-cyan-700">
              <Info className="w-4 h-4" />
              Informasi Penggunaan:
            </div>
            <ul className="list-disc pl-5 text-cyan-700 space-y-1">
              <li>Dashboard: logo & nama sekolah tampil di header navigasi</li>
              <li>Rapor/Sertifikat: sebagai kop dokumen resmi</li>
              <li>Dokumen Cetak: footer/header laporan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= COMPONENTS ================= */

function LogoBox({ size }: { size: "sm" | "md" }) {
  const map = {
    sm: "w-10 h-10",
    md: "w-20 h-20",
  }

  return (
    <div
      className={`${map[size]} rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center`}
    >
      <School className="w-6 h-6 text-cyan-600" />
    </div>
  )
}

function Input({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        disabled
        value={value}
        className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
      />
    </div>
  )
}

function Textarea({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <textarea
        disabled
        value={value}
        rows={3}
        className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
      />
    </div>
  )
}