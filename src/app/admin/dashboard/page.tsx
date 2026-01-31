import { 
  Users, 
  Building2, 
  GraduationCap, 
  BookOpen,
  MapPin,
  Phone,
  Calendar
} from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    { 
      title: "Total Siswa", 
      value: "150", 
      desc: "Seluruh siswa terdaftar",
      icon: Users,
      iconColor: "text-cyan-600"
    },
    { 
      title: "DUDI Partner", 
      value: "45", 
      desc: "Perusahaan mitra",
      icon: Building2,
      iconColor: "text-cyan-600"
    },
    { 
      title: "Siswa Magang", 
      value: "120", 
      desc: "Sedang aktif magang",
      icon: GraduationCap,
      iconColor: "text-cyan-600"
    },
    { 
      title: "Logbook Hari Ini", 
      value: "85", 
      desc: "Laporan masuk hari ini",
      icon: BookOpen,
      iconColor: "text-cyan-600"
    },
  ]

  const magangTerbaru = [
    {
      name: "Ahmad Rizki",
      company: "PT. Teknologi Nusantara",
      period: "15/1/2024 - 15/4/2024",
      status: "Aktif"
    },
    {
      name: "Siti Nurhaliza",
      company: "CV. Digital Kreativa",
      period: "20/1/2024 - 20/4/2024",
      status: "Aktif"
    }
  ]

  const dudiAktif = [
    {
      name: "PT. Teknologi Nusantara",
      address: "Jl. HR Muhammad No. 123, Surabaya",
      phone: "031-5551234",
      count: "8 siswa"
    },
    {
      name: "CV. Digital Kreativa",
      address: "Jl. Pemuda No. 45, Surabaya",
      phone: "031-5557890",
      count: "5 siswa"
    },
    {
      name: "PT. Inovasi Mandiri",
      address: "Jl. Diponegoro No. 78, Surabaya",
      phone: "031-5553456",
      count: "12 siswa"
    }
  ]
  const BookTerbaru = [
    {
      name: "Mempelajari sistem database dan melakukan backup data harian",
      company: "PT. Teknologi Nusantara",
      period: "15/1/2024 - 15/4/2024",
      status: "Disetujui"
    },
    {
      name: "Membuat design mockup untuk website perusahaan",
      company: "CV. Digital Kreativa",
      period: "20/1/2024 - 20/4/2024",
      status: "pending"
    },
    {
      name: "Mengikuti training keamanan sistem informasi",
      company: "CV. Digital Kreativa",
      period: "20/1/2024 - 20/4/2024",
      status: "Ditolak"
    },
  ]
  return (
    <div className="space-y-6">

      {/* TITLE */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Selamat datang di sistem pelaporan magang siswa SMK Negeri 1 Surabaya
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">
                    {item.title}
                  </p>
                  <p className="mt-2 text-4xl font-bold text-gray-900">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.desc}
                  </p>
                </div>
                <div className={`${item.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MAGANG TERBARU */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-cyan-600" />
              <h3 className="font-bold text-gray-800">
                Magang Terbaru
              </h3>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {magangTerbaru.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.company}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 text-gray-600" />
                      <p className="text-xs text-gray-500">{item.period}</p>
                    </div>
                  </div>
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700 font-medium">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* DUDI AKTIF */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-gray-800">
                DUDI Aktif
              </h3>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {dudiAktif.map((item, i) => (
              <div key={i} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-gray-800 text-sm">
                    {item.name}
                  </p>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                    {item.count}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                    <p className="text-xs text-gray-600">
                      {item.phone}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {/* MAGANG TERBARU */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-lime-600" />
              <h3 className="font-bold text-gray-800">
                Logbook Terbaru
              </h3>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {BookTerbaru.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-lime-500 to-lime-600">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 text-gray-600"/>
                      <p className="text-xs text-gray-500">{item.period}</p>
                    </div>
                    <p className="mt-1 text-sm italic text-orange-500">
                      Kendala: {item.company}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                    ${item.status === "Disetujui" && "bg-lime-100 text-lime-700"}
                    ${item.status === "pending" && "bg-yellow-100 text-yellow-700"}
                    ${item.status === "Ditolak" && "bg-pink-100 text-pink-700"}
                  `}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}