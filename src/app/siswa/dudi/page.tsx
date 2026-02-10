"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import {
  User,
  MapPinIcon,
  Mail,
  BookOpen,
  MapPin,
  Phone,
  Calendar,
  Building2,
  Eye
} from "lucide-react"

type Dudi = {
  id: number
  nama_perusahaan: string
  alamat: string | null
  penanggung_jawab: string | null
  email: string | null
  telepon: string | null
  kuota: string | null
  status: string
  used?: number
}

type MagangSaya = {
  dudi_id: number
  status: string
}

export default function DudiPage() {
  const [dudiList, setDudiList] = useState<Dudi[]>([])
  const [magangSaya, setMagangSaya] = useState<MagangSaya[]>([])
  const [siswaId, setSiswaId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState(false)
  const [selectedDudi, setSelectedDudi] = useState<Dudi | null>(null)

  const maxPendaftaran = 3

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("Silakan login terlebih dahulu.")
        setLoading(false)
        return
      }

      const { data: siswaData, error: siswaErr } = await supabase
        .from("siswa")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (siswaErr || !siswaData) {
        setError("Profil siswa tidak ditemukan. Hubungi admin.")
        setLoading(false)
        return
      }

      setSiswaId(siswaData.id)
      fetchData(siswaData.id)
    }

    init()
  }, [])

  const fetchData = async (siswaId: number) => {
    setLoading(true)
    setError(null)

    try {
      const { data: dudiData, error: dudiErr } = await supabase
        .from("dudi")
        .select("id, nama_perusahaan, alamat, penanggung_jawab, kuota, status, telepon, email")
        .eq("status", "aktif")

      if (dudiErr) throw dudiErr

      const dudiWithUsed = await Promise.all(
        (dudiData || []).map(async (d: any) => {
          const { count } = await supabase
            .from("magang")
            .select("*", { count: "exact", head: true })
            .eq("dudi_id", d.id)
            .in("status", ["pending", "diterima"])

          return { ...d, used: count || 0 }
        })
      )

      setDudiList(dudiWithUsed)

      const { data: rawMagang } = await supabase
        .from("magang")
        .select("dudi_id, status")
        .eq("siswa_id", siswaId)

      // Paksa tipe supaya TypeScript tidak ragu lagi
      const magangData = (rawMagang || []) as unknown as MagangSaya[]
      setMagangSaya(magangData)
    } catch (err: any) {
      console.error(err)
      setError("Gagal memuat data. Coba lagi nanti.")
    } finally {
      setLoading(false)
    }
  }

  const sudahDaftarKe = (dudiId: number): boolean => {
    return magangSaya.some((m) => m.dudi_id === dudiId)
  }

  const jumlahMagangSaya = magangSaya.length

  const handleDaftar = async (dudi: Dudi) => {
    if (!siswaId) return alert("Profil siswa tidak ditemukan.")

    const kuotaNum = dudi.kuota ? parseInt(dudi.kuota, 10) : Infinity
    const tersisa = kuotaNum - (dudi.used || 0)

    if (tersisa <= 0) return alert("Kuota magang sudah penuh.")
    if (sudahDaftarKe(dudi.id)) return alert("Anda sudah mendaftar ke DU/DI ini.")
    if (jumlahMagangSaya >= maxPendaftaran) {
      return alert(`Maksimal ${maxPendaftaran} pendaftaran.`)
    }

    try {
      const { error } = await supabase.from("magang").insert({
        siswa_id: siswaId,
        dudi_id: dudi.id,
        status: "pending",
      })

      if (error) throw error

      setMagangSaya([...magangSaya, { dudi_id: dudi.id, status: "pending" }])
      setDudiList((prev) =>
        prev.map((item) =>
          item.id === dudi.id ? { ...item, used: (item.used || 0) + 1 } : item
        )
      )

      setToast(true)
      setTimeout(() => setToast(false), 4000)
    } catch (err: any) {
      alert("Gagal mendaftar: " + err.message)
    }
  }

  if (loading) return <div className="p-8 text-center">Memuat...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>

  return (
    <div className="space-y-6 p-4 md:p-6">
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] bg-lime-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in">
          <span className="text-sm font-medium">
            Pendaftaran berhasil dikirim! Menunggu verifikasi.
          </span>
          <button onClick={() => setToast(false)}>✕</button>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900">Cari Tempat Magang</h1>

      {dudiList.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Belum ada DUDI tersedia.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {dudiList.map((item) => {
            const kuotaNum = item.kuota ? parseInt(item.kuota, 10) : Infinity
            const tersisa = kuotaNum - (item.used || 0)

            const sudah = !!sudahDaftarKe(item.id) as boolean

            const disabled = tersisa <= 0 || sudah || jumlahMagangSaya >= maxPendaftaran

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border p-5 flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.nama_perusahaan}</h3>
                    {sudah && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">
                        Sudah Daftar
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{item.alamat || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>
                      <span className="font-medium text-gray-600">PIC:</span>{" "}
                      {item.penanggung_jawab || "-"}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Kuota Magang</span>
                    <span>{item.used || 0}/{item.kuota || "∞"}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500"
                      style={{
                        width: `${kuotaNum === Infinity ? 0 : ((item.used || 0) / kuotaNum) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {kuotaNum === Infinity ? "Tidak terbatas" : `${tersisa} slot tersisa`}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedDudi(item)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Detail</span>
                  </button>

                  {sudah ? (
                    <button
                      disabled
                      className="font-semibold px-4 py-2 rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed"
                    >
                      Sudah Mendaftar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDaftar(item)}
                      disabled={disabled}
                      className={`font-semibold px-4 py-2 rounded-xl ${
                        disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-cyan-500 text-white hover:bg-cyan-600"
                      }`}
                    >
                      Daftar
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedDudi && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold">{selectedDudi.nama_perusahaan}</h2>
              </div>
              {!!sudahDaftarKe(selectedDudi.id) && (
                <span className="px-2 py-1 font-semibold rounded-full bg-yellow-100 text-yellow-700">
                  Sudah Daftar
                </span>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-1">Informasi Kontak</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{selectedDudi.alamat || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{selectedDudi.penanggung_jawab || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{selectedDudi.email || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{selectedDudi.telepon || "-"}</span>
                </div>
              </div>
            </div>

            <div className="bg-cyan-100 rounded-xl p-4 text-sm">
              Kuota: {selectedDudi.used || 0}/{selectedDudi.kuota || "∞"}<br />
              Tersisa: {selectedDudi.kuota ? (parseInt(selectedDudi.kuota, 10) - (selectedDudi.used || 0)) : "Tidak terbatas"}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setSelectedDudi(null)} className="px-4 py-2 rounded-lg border">
                Tutup
              </button>

              {!sudahDaftarKe(selectedDudi.id) && (
                <button
                  onClick={() => {
                    handleDaftar(selectedDudi)
                    setSelectedDudi(null)
                  }}
                    disabled={
                      jumlahMagangSaya >= maxPendaftaran ||
                      (selectedDudi.kuota != null && selectedDudi.kuota.trim() !== '' 
                        ? (selectedDudi.used || 0) >= parseInt(selectedDudi.kuota, 10)
                        : false)
                    }
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-50"
                >
                  Daftar Magang
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}