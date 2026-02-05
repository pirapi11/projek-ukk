"use client"

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

export default function GuruDashboard() {
  /* ================= STATE ================= */
  const [stats, setStats] = useState<any[]>([])
  const [magangTerbaru, setMagangTerbaru] = useState<any[]>([])
  const [dudiAktif, setDudiAktif] = useState<any[]>([])
  const [logbookTerbaru, setLogbookTerbaru] = useState<any[]>([])

  /* ================= FETCH ================= */
  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    // ambil guru yang sedang login
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    /* ===== TOTAL SISWA BIMBINGAN ===== */
    const { count: totalSiswa } = await supabase
      .from("magang")
      .select("*", { count: "exact", head: true })
      .eq("guru_id", user.id)

    /* ===== SISWA MAGANG AKTIF ===== */
    const { count: siswaAktif } = await supabase
      .from("magang")
      .select("*", { count: "exact", head: true })
      .eq("guru_id", user.id)
      .eq("status", "berlangsung")

    /* ===== LOGBOOK HARI INI ===== */
    const today = new Date().toISOString().split("T")[0]
    const { count: logbookHariIni } = await supabase
      .from("logbook")
      .select("id", { count: "exact", head: true })
      .eq("tanggal", today)
      .eq("guru_id", user.id)

    setStats([
      {
        title: "Total Siswa Bimbingan",
        value: totalSiswa || 0,
        desc: "Siswa yang dibimbing",
        icon: Users,
      },
      {
        title: "Siswa Magang",
        value: siswaAktif || 0,
        desc: "Sedang magang",
        icon: GraduationCap,
      },
      {
        title: "Logbook Hari Ini",
        value: logbookHariIni || 0,
        desc: "Perlu direview",
        icon: BookOpen,
      },
    ])

    /* ===== MAGANG TERBARU ===== */
    const { data: magang } = await supabase
      .from("magang")
      .select(`
        id,
        status,
        tanggal_mulai,
        tanggal_selesai,
        users ( nama ),
        dudi ( nama )
      `)
      .eq("guru_id", user.id)
      .order("tanggal_mulai", { ascending: false })
      .limit(5)

    setMagangTerbaru(magang || [])

    /* ===== DUDI AKTIF ===== */
    const { data: dudi } = await supabase
      .from("dudi")
      .select(`
        nama,
        alamat,
        telepon,
        magang!inner ( id )
      `)
      .eq("magang.guru_id", user.id)
      .limit(5)

    setDudiAktif(dudi || [])

    /* ===== LOGBOOK TERBARU ===== */
    const { data: logbook } = await supabase
      .from("logbook")
      .select(`
        kegiatan,
        status,
        tanggal,
        magang (
          dudi ( nama )
        )
      `)
      .eq("guru_id", user.id)
      .order("tanggal", { ascending: false })
      .limit(5)

    setLogbookTerbaru(logbook || [])
  }

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Guru</h2>
        <p className="text-sm text-gray-600 mt-1">
          Monitoring siswa magang yang kamu bimbing
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="bg-white border rounded-lg p-5">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">{item.title}</p>
                  <p className="text-4xl font-bold mt-2">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <Icon className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          )
        })}
      </div>

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
      <div className="bg-white border rounded-lg">
        <div className="px-6 py-4 border-b font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-lime-600" />
          Logbook Terbaru
        </div>
        <div className="p-6 space-y-3">
          {logbookTerbaru.map((item, i) => (
            <div key={i} className="flex justify-between border p-4 rounded-lg">
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