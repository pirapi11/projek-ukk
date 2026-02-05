import {
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Filter,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle
} from "lucide-react"

export default function JurnalHarianPage() {
  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Jurnal Harian Magang</h1>
        <button className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-sm transition-colors flex items-center gap-2">
          + Tambah Jurnal
        </button>
      </div>

      {/* ALERT - JANGAN LUPA */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
        <FileText className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-orange-900 mb-1">
            Jangan Lupa Jurnal Hari Ini!
          </h3>
          <p className="text-sm text-orange-700">
            Anda belum membuat jurnal untuk hari ini. Dokumentasikan kegiatan magang Anda sekarang.
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors">
          Buat Sekarang
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Jurnal", value: 2, icon: BookOpen, desc: "Jurnal yang telah dibuat" },
          { title: "Disetujui", value: 1, icon: CheckCircle, desc: "Jurnal disetujui guru" },
          { title: "Menunggu", value: 1, icon: Clock, desc: "Belum diverifikasi" },
          { title: "Ditolak", value: 0, icon: XCircle, desc: "Perlu diperbaiki" },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">{item.title}</p>
                <Icon className="w-5 h-5 text-cyan-500" />
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {item.value}
              </p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          )
        })}
      </div>

      {/* RIWAYAT JURNAL */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-500" />
            Riwayat Jurnal
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* SEARCH & FILTER */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Cari kegiatan atau kendala..."
                className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>
            <button className="px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Tampilkan Filter
            </button>
          </div>

          {/* PAGINATION INFO */}
          <div className="flex items-center justify-end gap-3 text-sm text-gray-600">
            <span>Tampilkan:</span>
            <select className="px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>per halaman</span>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Tanggal
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Kegiatan & Kendala
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Feedback Guru
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* ROW 1 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900 font-medium">Sel, 16 Jul</p>
                    <p className="text-xs text-gray-500">2024</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900 font-medium mb-1">Kegiatan:</p>
                    <p className="text-sm text-gray-600">
                      Belajar backend Laravel untuk...
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                      Menunggu Verifikasi
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-xs text-gray-400">Belum ada feedback</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* ROW 2 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900 font-medium">Sen, 15</p>
                    <p className="text-xs text-gray-500">Jul 2024</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900 font-medium mb-1">Kegiatan:</p>
                    <p className="text-sm text-gray-600">
                      Membuat desain UI aplikasi kasir...
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      Disetujui
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-700 font-medium">Catatan Guru:</p>
                        <p className="text-xs text-gray-600">Bagus, lanjutkan...</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-600">
              Menampilkan 1 sampai 2 dari 2 entri
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <ChevronsLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-sm font-medium">
                1
              </button>
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <ChevronsRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}