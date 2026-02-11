"use client"

import DudiStatusChart from "@/components/DudiStatusChart"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react"

export default function AdminDashboard() {
  /* ================= STATE ================= */
  const [stats, setStats] = useState([
    { title: "Total Siswa", value: 0, desc: "Seluruh siswa terdaftar", icon: Users },
    { title: "DUDI Partner", value: 0, desc: "Perusahaan mitra", icon: Building2 },
    { title: "Siswa Magang", value: 0, desc: "Sedang aktif magang", icon: GraduationCap },
    { title: "Logbook Hari Ini", value: 0, desc: "Laporan masuk hari ini", icon: BookOpen },
  ])

  const [magangTerbaru, setMagangTerbaru] = useState<any[]>([])
  const [dudiAktif, setDudiAktif] = useState<any[]>([])
  const [logbookTerbaru, setLogbookTerbaru] = useState<any[]>([])

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchDashboard()
  }, [])

  async function fetchDashboard() {
    /* ==== STATS ==== */
    const [{ count: siswa }, { count: dudi }, { count: magang }] =
      await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "siswa"),
        supabase.from("dudi").select("*", { count: "exact", head: true }).eq("status", "aktif"),
        supabase.from("magang").select("*", { count: "exact", head: true }).eq("status", "berlangsung"),
      ])

    const today = new Date().toISOString().split("T")[0]
    const { count: logbook } = await supabase
      .from("logbook")
      .select("*", { count: "exact", head: true })
      .eq("tanggal", today)

    setStats([
      { title: "Total Siswa", value: siswa || 0, desc: "Seluruh siswa terdaftar", icon: Users },
      { title: "DUDI Partner", value: dudi || 0, desc: "Perusahaan mitra", icon: Building2 },
      { title: "Siswa Magang", value: magang || 0, desc: "Sedang aktif magang", icon: GraduationCap },
      { title: "Logbook Hari Ini", value: logbook || 0, desc: "Laporan masuk hari ini", icon: BookOpen },
    ])

    /* ==== MAGANG TERBARU ==== */
    const { data: magangData } = await supabase
      .from("magang")
      .select(`
        id,
        status,
        tanggal_mulai,
        tanggal_selesai,
        users ( nama ),
        dudi ( nama )
      `)
      .order("tanggal_mulai", { ascending: false })
      .limit(5)

    setMagangTerbaru(magangData || [])

    /* ==== DUDI AKTIF ==== */
    const { data: dudiData } = await supabase
      .from("dudi")
      .select("nama, alamat, telepon")
      .eq("status", "aktif")
      .limit(5)

    setDudiAktif(dudiData || [])

    /* ==== LOGBOOK TERBARU ==== */
    const { data: logbookData } = await supabase
      .from("logbook")
      .select(`
        kegiatan,
        status,
        tanggal,
        magang (
          dudi ( nama )
        )
      `)
      .order("tanggal", { ascending: false })
      .limit(5)

    setLogbookTerbaru(logbookData || [])
  }

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-600 mt-1">
          Selamat datang di sistem pelaporan magang
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="bg-white rounded-lg border p-5">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">{item.title}</p>
                  <p className="mt-2 text-4xl font-bold">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <Icon className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          )
        })}
      </div>

      <DudiStatusChart />

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MAGANG TERBARU */}
        <div className="lg:col-span-2 bg-white rounded-lg border">
          <div className="px-6 py-4 border-b">
            <h3 className="font-bold flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-600" />
              Magang Terbaru
            </h3>
          </div>

          <div className="p-6 space-y-3">
            {magangTerbaru.map((item, i) => (
              <div key={i} className="flex justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{item.users?.nama}</p>
                  <p className="text-sm text-gray-600">{item.dudi?.nama}</p>
                  <p className="text-xs text-gray-500">
                    {item.tanggal_mulai} - {item.tanggal_selesai}
                  </p>
                </div>
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* DUDI AKTIF */}
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b">
            <h3 className="font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-600" />
              DUDI Aktif
            </h3>
          </div>

          <div className="p-6 space-y-4">
            {dudiAktif.map((item, i) => (
              <div key={i} className="border-b pb-3">
                <p className="font-semibold text-sm">{item.nama}</p>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <MapPin className="w-3 h-3 mt-0.5" />
                  {item.alamat}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="w-3 h-3" />
                  {item.telepon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOGBOOK TERBARU */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-lime-600" />
            Logbook Terbaru
          </h3>
        </div>

        <div className="p-6 space-y-3">
          {logbookTerbaru.map((item, i) => (
            <div key={i} className="flex justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">{item.kegiatan}</p>
                <p className="text-xs text-gray-500">
                  {item.tanggal} • {item.magang?.dudi?.nama}
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}