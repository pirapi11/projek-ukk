"use client"

import { useState } from "react"

export default function DudiPage() {

  const [dudiList, setDudiList] = useState(data)
  const [toast, setToast] = useState(false)
  const [selectedDudi, setSelectedDudi] = useState<any>(null)

  const handleDaftar = (index: number) => {
    const updated = [...dudiList]

    updated[index] = {
      ...updated[index],
      registered: true,
      status: "Menunggu",
      used: updated[index].used + 1,
    }

    setDudiList(updated)
    setToast(true)

    setTimeout(() => {
      setToast(false)
    }, 4000)
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="
          fixed top-6 right-6 z-[9999]
          bg-lime-500 text-white
          px-5 py-3 rounded-xl shadow-lg
          flex items-center gap-3
          animate-slide-in
        ">
          <span className="text-sm font-medium">
            Pendaftaran magang berhasil dikirim! Menunggu verifikasi dari perusahaan.
          </span>
          <button onClick={() => setToast(false)}>✕</button>
        </div>
      )}
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Cari Tempat Magang
        </h1>
      </div>

      {/* FILTER */}
      <div className="bg-white rounded-xl border p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari perusahaan, bidang"
            className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Tampilkan:</span>
          <select className="border rounded-lg px-2 py-1 focus:outline-none">
            <option>6</option>
            <option>9</option>
            <option>12</option>
          </select>
          <span>per halaman</span>
        </div>
      </div>

      {/* CARD LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dudiList.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border p-5 flex flex-col justify-between"
          >
            {/* HEADER */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white font-semibold">
                D
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {item.name}
                </h3>
                <p className="text-sm text-cyan-600">
                  {item.field}
                </p>

                {item.status && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">
                    {item.status}
                  </span>
                )}
              </div>
            </div>

            {/* INFO */}
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <p>📍 {item.address}</p>
              <p>👤 PIC: {item.pic}</p>
            </div>

            {/* QUOTA */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Kuota Magang</span>
                <span>
                  {item.used}/{item.total}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500"
                  style={{
                    width: `${(item.used / item.total) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {item.total - item.used} slot tersisa
              </p>
            </div>

            {/* DESC */}
            <p className="mt-4 text-sm text-gray-500 line-clamp-3">
              {item.desc}
            </p>

            {/* ACTION */}
            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={() => setSelectedDudi(item)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Detail
              </button>

              {item.registered ? (
                <button
                  disabled
                  className="text-sm px-4 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
                >
                  Sudah Mendaftar
                </button>
              ) : (
                <button
                  onClick={() => handleDaftar(i)}
                  className="text-sm px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600"
                >
                  Daftar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
        {selectedDudi && (
          <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">
            <div className="bg-white w-full max-w-xl rounded-2xl p-6 space-y-6">

              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold">{selectedDudi.name}</h2>
                  <p className="text-sm text-cyan-600">{selectedDudi.field}</p>
                </div>

                {selectedDudi.registered && (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    Menunggu Verifikasi
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-1">Tentang Perusahaan</h3>
                <p className="text-sm text-gray-500">{selectedDudi.desc}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-2">Informasi Kontak</h3>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>📍 {selectedDudi.address}</div>
                  <div>👤 {selectedDudi.pic}</div>
                </div>
              </div>

              <div className="bg-cyan-50 rounded-xl p-4 text-sm">
                <div className="flex justify-between">
                  <span>Kuota Magang</span>
                  <span>{selectedDudi.used}/{selectedDudi.total}</span>
                </div>
                <div className="mt-1">
                  Slot Tersisa: {selectedDudi.total - selectedDudi.used}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setSelectedDudi(null)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Tutup
                </button>

                {!selectedDudi.registered ? (
                  <button
                    onClick={() => {
                      handleDaftar(dudiList.indexOf(selectedDudi))
                      setSelectedDudi(null)
                    }}
                    className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600"
                  >
                    Daftar Magang
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-500"
                  >
                    Sudah Mendaftar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

/* ================== DUMMY DATA ================== */

const data = [
  {
    name: "PT Kreatif Teknologi",
    field: "Teknologi Informasi",
    status: "Menunggu",
    address: "Jl. Merdeka No. 123, Jakarta",
    pic: "Andi Wijaya",
    used: 8,
    total: 12,
    desc:
      "Perusahaan teknologi yang bergerak dalam pengembangan aplikasi web dan mobile.",
    registered: true,
  },
  {
    name: "CV Digital Solusi",
    field: "Digital Marketing",
    address: "Jl. Sudirman No. 45, Surabaya",
    pic: "Sari Dewi",
    used: 5,
    total: 8,
    desc:
      "Konsultan digital marketing yang membantu UMKM berkembang di era digital.",
    registered: false,
  },
  {
    name: "PT Inovasi Mandiri",
    field: "Software Development",
    address: "Jl. Diponegoro No. 78, Surabaya",
    pic: "Budi Santoso",
    used: 12,
    total: 15,
    desc:
      "Software house yang mengembangkan sistem informasi untuk berbagai industri.",
    registered: false,
  },
  {
    name: "PT Teknologi Maju",
    field: "Hardware & Networking",
    address: "Jl. HR Rasuna Said No. 12, Jakarta",
    pic: "Lisa Permata",
    used: 6,
    total: 10,
    desc:
      "Spesialis instalasi dan maintenance jaringan komputer skala besar.",
    registered: false,
  },
  {
    name: "CV Solusi Digital Prima",
    field: "E-commerce",
    address: "Jl. Gatot Subroto No. 88, Bandung",
    pic: "Rahmat Hidayat",
    used: 9,
    total: 12,
    desc:
      "Platform e-commerce lokal yang melayani berbagai produk UMKM.",
    registered: false,
  },
  {
    name: "PT Inovasi Global",
    field: "Konsultan IT",
    address: "Jl. Pemuda No. 156, Semarang",
    pic: "Maya Sari",
    used: 15,
    total: 20,
    desc:
      "Konsultan IT yang memberikan solusi teknologi untuk perusahaan.",
    registered: false,
  },
]