import {
  Building2,
  User,
  MapPin,
  Phone,
  Calendar,
  Clock,
  CheckCircle
} from "lucide-react"

export default function MagangPage() {
  return (
    <div className="space-y-6">
      {/* HERO BANNER */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-8">
        <h1 className="text-2xl font-bold mb-2">Magang Siswa</h1>
        <p className="text-sm opacity-90">
          Cari tempat magang dan pantau status pendaftaran Anda
        </p>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-6 border-b border-gray-200">
        <button className="px-1 py-3 text-cyan-600 font-medium text-sm border-b-2 border-cyan-600 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Status Magang Saya
        </button>
        <button className="px-1 py-3 text-gray-500 font-medium text-sm hover:text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Cari Tempat Magang
        </button>
      </div>

      {/* STUDENT INFO CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Ahmad Rizki Ramadhan • 2021001
            </h2>
            <p className="text-sm text-gray-500 mt-1">XII • RPL</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-cyan-600">0/3</p>
            <p className="text-xs text-gray-500 mt-1">Pendaftaran Pending</p>
          </div>
        </div>
      </div>

      {/* DETAIL MAGANG AKTIF */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Detail Magang Aktif
          </h2>
          <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-medium">
            Berlangsung
          </span>
        </div>

        {/* DATA SISWA */}
        <div className="bg-white rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4 text-gray-500" />
            <h3 className="font-semibold text-sm">Data Siswa</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
              <p className="text-sm font-semibold text-gray-900">Ahmad Rizki Ramadhan</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">NIS</p>
              <p className="text-sm font-semibold text-gray-900">2021001</p>
            </div>
          </div>
        </div>

        {/* TEMPAT MAGANG */}
        <div className="bg-white rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Building2 className="w-4 h-4 text-cyan-500" />
            <h3 className="font-semibold text-sm">Tempat Magang</h3>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-2">
              PT. Teknologi Nusantara
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>Jl. HR Muhammad No. 123, Surabaya</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>031-5551234</span>
              </div>
            </div>
          </div>
        </div>

        {/* GURU PEMBIMBING */}
        <div className="bg-white rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4 text-green-500" />
            <h3 className="font-semibold text-sm">Guru Pembimbing</h3>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
              S
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Suryanto, S.Pd</h4>
              <p className="text-sm text-gray-600">NIP: 197501012000031001</p>
            </div>
          </div>
        </div>

        {/* PERIODE */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-green-600" />
              <p className="text-xs text-gray-500">Tanggal Mulai</p>
            </div>
            <p className="text-lg font-bold text-gray-900">7/1/2024</p>
          </div>
          <div className="bg-white rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-green-600" />
              <p className="text-xs text-gray-500">Tanggal Selesai</p>
            </div>
            <p className="text-lg font-bold text-gray-900">9/30/2024</p>
          </div>
        </div>
      </div>

      {/* RIWAYAT PENDAFTARAN */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Riwayat Pendaftaran</h2>
        <div className="text-center py-12 text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Belum ada riwayat pendaftaran</p>
        </div>
      </div>
    </div>
  )
}