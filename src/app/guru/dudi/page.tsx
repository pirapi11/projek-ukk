"use client"

import { useEffect, useState } from "react"
import { Building2, CheckCircle2, XCircle, Users } from "lucide-react"
import { supabase } from "@/lib/supabase"

/*tipe*/

type DudiStatus = "aktif" | "nonaktif" | "pending"

type Dudi = {
  id: number
  nama_perusahaan: string
  alamat: string
  telepon: string
  email: string
  penanggung_jawab: string
  status: DudiStatus
  students?: number
}

/*halaman*/

export default function DudiGuruPage() {
  const [data, setData] = useState<Dudi[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDudi = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("dudi")
      .select(`
        id,
        nama_perusahaan,
        alamat,
        telepon,
        email,
        penanggung_jawab,
        status
      `)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setData(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchDudi()
  }, [])

  /*hitung dudi sesuai status*/

  const totalDudi = data.length
  const aktif = data.filter(d => d.status === "aktif").length
  const nonaktif = data.filter(d => d.status === "nonaktif").length

  /*render halaman*/

  return (
    <div className="space-y-6">

      {/*judul*/}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Data DUDI</h1>
        <p className="text-sm text-gray-500">
          Daftar Dunia Usaha & Dunia Industri
        </p>
      </div>

      {/*3 card*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total DUDI"
          value={totalDudi}
          desc="Perusahaan mitra"
          icon={<Building2 className="w-5 h-5 text-cyan-600" />}
        />
        <StatCard
          title="DUDI Aktif"
          value={aktif}
          desc="Status aktif"
          icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
        />
        <StatCard
          title="DUDI Nonaktif"
          value={nonaktif}
          desc="Status nonaktif"
          icon={<XCircle className="w-5 h-5 text-red-500" />}
        />
      </div>

      {/*tabel dudi*/}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4">
          <h2 className="font-semibold">Daftar DUDI</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Perusahaan</th>
                <th className="px-4 py-3 text-left">Kontak</th>
                <th className="px-4 py-3 text-left">Penanggung Jawab</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center">
                    Belum ada data DUDI
                  </td>
                </tr>
              ) : (
                data.map(d => (
                  <tr key={d.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{d.nama_perusahaan}</div>
                      <div className="text-xs text-gray-500">
                        {d.alamat}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div>{d.email}</div>
                      <div>{d.telepon}</div>
                    </td>
                    <td className="px-4 py-3">{d.penanggung_jawab}</td>
                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          d.status === "aktif"
                            ? "bg-green-100 text-green-700"
                            : d.status === "nonaktif"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/*komponen card*/

function StatCard({ title, value, desc, icon }: any) {
  return (
    <div className="bg-white rounded-xl border p-4 flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
        {icon}
      </div>
    </div>
  )
}