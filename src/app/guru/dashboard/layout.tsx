import React from "react"
import { LayoutDashboard, GraduationCap, FileCheck, BookOpen, User } from "lucide-react"

export default function GuruDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white flex-shrink-0 shadow-sm">
        <div className="h-full flex flex-col">
          {/* LOGO */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">SIMMAS</p>
                <p className="text-xs text-gray-500">Panel Guru</p>
              </div>
            </div>
          </div>

          {/* MENU */}
          <nav className="px-4 space-y-1 text-sm flex-1">
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-white font-medium shadow-md">
              <LayoutDashboard className="w-5 h-5" />
              <div>
                <p className="font-semibold">Dashboard</p>
                <p className="text-xs text-cyan-50 font-normal">Ringkasan aktivitas</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl text-gray-600 hover:bg-gray-50 cursor-pointer">
              <GraduationCap className="w-5 h-5" />
              <div>
                <p className="font-medium">Magang</p>
                <p className="text-xs text-gray-400">Kelola magang siswa</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl text-gray-600 hover:bg-gray-50 cursor-pointer">
              <FileCheck className="w-5 h-5" />
              <div>
                <p className="font-medium">Approval Jurnal</p>
                <p className="text-xs text-gray-400">Review jurnal harian</p>
              </div>
            </div>
          </nav>

          {/* FOOTER SIDEBAR */}
          <div className="p-4">
            <div className="rounded-2xl bg-gray-50 p-4 text-xs flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
              <div className="text-gray-600">
                <p className="font-semibold text-gray-800 mb-0.5">
                  SMK Negeri 1 Surabaya
                </p>
                <p>Sistem Pelaporan v1.0</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-20 bg-white px-8 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              SMK Negeri 1 Surabaya
            </h1>
            <p className="text-sm text-gray-500">
              Sistem Manajemen Magang Siswa
            </p>
          </div>

          <button className="flex items-center gap-3 hover:bg-gray-50 px-4 py-2 rounded-xl transition-colors">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-left leading-tight">
              <p className="text-sm font-semibold text-gray-900">
                Suryanto, S.Pd
              </p>
              <p className="text-xs text-gray-500">Guru</p>
            </div>
          </button>
        </header>

        {/* SCROLL AREA */}
        <main className="flex-1 overflow-y-auto px-8 py-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}