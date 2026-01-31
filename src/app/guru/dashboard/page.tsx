import { Users, GraduationCap, BookOpen } from "lucide-react"

export default function GuruDashboardPage() {
  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Dashboard Guru
        </h2>
        <p className="text-gray-500 mt-1">
          Pantau dan kelola siswa bimbingan Anda
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium text-gray-600">Total Siswa</p>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">4</p>
          <p className="text-sm text-gray-400">Seluruh siswa terdaftar</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium text-gray-600">Siswa Magang</p>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">2</p>
          <p className="text-sm text-gray-400">Sedang aktif magang</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium text-gray-600">Logbook Hari Ini</p>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">0</p>
          <p className="text-sm text-gray-400">Laporan masuk hari ini</p>
        </div>
      </div>

      {/* MAGANG TERBARU */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="w-5 h-5 text-cyan-500" />
          <h3 className="font-bold text-gray-900 text-lg">Magang Terbaru</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-white text-xl">
                🎓
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Ahmad Rizki Ramadhan
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  PT. Teknologi Nusantara
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  📅 1/7/2024 - 30/9/2024
                </p>
              </div>
            </div>

            <span className="text-xs px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
              Aktif
            </span>
          </div>

          <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-white text-xl">
                🎓
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Siti Nurhaliza
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  CV. Digital Kreativa
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  📅 1/7/2024 - 30/9/2024
                </p>
              </div>
            </div>

            <span className="text-xs px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
              Aktif
            </span>
          </div>

          <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-white text-xl">
                🎓
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Dewi Lestari
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  PT. Media Interaktif
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  📅 15/6/2024 - 15/9/2024
                </p>
              </div>
            </div>

            <span className="text-xs px-4 py-2 rounded-full bg-gray-100 text-gray-600 font-semibold">
              Selesai
            </span>
          </div>
        </div>
      </div>

      {/* LOGBOOK TERBARU */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-cyan-500" />
          <h3 className="font-bold text-gray-900 text-lg">Logbook Terbaru</h3>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Belum ada logbook hari ini</p>
        </div>
      </div>
    </div>
  )
}