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
  AlertCircle
} from "lucide-react"

export default function GuruDashboard() {
  /* ================= STATE ================= */
  const [stats, setStats] = useState<any[]>([])
  const [magangTerbaru, setMagangTerbaru] = useState<any[]>([])
  const [dudiAktif, setDudiAktif] = useState<any[]>([])
  const [logbookTerbaru, setLogbookTerbaru] = useState<any[]>([])
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [guruId, setGuruId] = useState<number | null>(null)

  const [form, setForm] = useState({
    nip: "",
    alamat: "",
    telepon: "",
  })

  const [loadingSave, setLoadingSave] = useState(false)

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

    const { data: guru } = await supabase
      .from("guru")
      .select("id, nip, alamat, telepon")
      .eq("user_id", user.id)
      .single()

    if (guru) {
      setGuruId(guru.id)

      // kalau data belum lengkap → tampilkan modal
      if (!guru.nip || !guru.alamat || !guru.telepon) {
        setShowProfileModal(true)
      }
    }

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

  async function handleSaveProfile() {
    if (!guruId) return

    setLoadingSave(true)

    const { error } = await supabase
      .from("guru")
      .update({
        nip: form.nip,
        alamat: form.alamat,
        telepon: form.telepon,
        updated_at: new Date(),
      })
      .eq("id", guruId)

    setLoadingSave(false)

    if (!error) {
      setShowProfileModal(false)
    } else {
      alert("Gagal menyimpan data")
    }
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
      {showProfileModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
      
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-6 py-4 z-10">
        <h3 className="text-xl font-bold text-gray-900">
          Lengkapi Profil Guru Anda
        </h3>
      </div>

      <div className="p-6 space-y-6">

        {/* Info */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-cyan-600 mt-0.5" />
            <p className="text-sm text-cyan-800">
              Sebelum melanjutkan, silakan lengkapi data profil guru Anda terlebih dahulu.
            </p>
          </div>
        </div>

        {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveProfile()
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    NIP *
                  </label>
                  <input
                    type="text"
                    value={form.nip}
                    onChange={(e) =>
                      setForm({ ...form, nip: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                              focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Alamat *
                  </label>
                  <textarea
                    rows={2}
                    value={form.alamat}
                    onChange={(e) =>
                      setForm({ ...form, alamat: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                              focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    value={form.telepon}
                    onChange={(e) =>
                      setForm({ ...form, telepon: e.target.value })
                    }
                    required
                    placeholder="Contoh: 08123456789"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                              focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loadingSave}
                    className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700
                              text-white rounded-xl font-medium transition-colors
                              disabled:opacity-50"
                  >
                    {loadingSave ? "Menyimpan..." : "Simpan Profil"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}