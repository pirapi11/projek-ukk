"use client"

import React, { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Home, BookOpen, Briefcase, User, Building2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function SiswaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [openProfile, setOpenProfile] = useState(false)
  const [userName, setUserName] = useState("Loading...")
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from("users")
        .select("name, role")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Gagal ambil data user:", error)
        return
      }

      setUserName(data.name)
      setUserRole(data.role)
    }

    fetchUserProfile()
  }, [])

  const handleLogout = async () => {
      await supabase.auth.signOut()
      router.push("/login")
    }

  const menu = [
    {
      title: "Dashboard",
      desc: "Ringkasan aktivitas",
      icon: Home,
      path: "/siswa/dashboard",
    },
    {
      title: "Dudi",
      desc: "Dunia Usaha & Industri",
      icon: Building2,
      path: "/siswa/dudi",
    },
    {
      title: "Jurnal Harian",
      desc: "Catatan harian",
      icon: BookOpen,
      path: "/siswa/jurnal",
    },
    {
      title: "Magang",
      desc: "Data magang saya",
      icon: Briefcase,
      path: "/siswa/magang",
    },
  ]

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col flex-shrink-0">
        {/* logo */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <h1 className="font-bold text-gray-900">SIMMAS</h1>
              <p className="text-xs text-gray-500">Panel Siswa</p>
            </div>
          </div>
        </div>

        {/* menu aktif */}
        <nav className="flex-1 p-4 space-y-2">
          {menu.map((item, i) => {
            const Icon = item.icon
            const active = pathname === item.path

            return (
              <button
                key={i}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition
                  ${
                    active
                      ? "bg-cyan-500 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <div className="font-medium text-sm">{item.title}</div>
                  <div
                    className={`text-xs ${
                      active ? "opacity-90" : "text-gray-500"
                    }`}
                  >
                    {item.desc}
                  </div>
                </div>
              </button>
            )
          })}
        </nav>

        {/* profil seolah */}
        <div className="p-4 border-t text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            SMK Negeri 1 Surabaya
          </div>
          <p className="text-gray-400 mt-1">Sistem Pelaporan v1.0</p>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* header */}
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900">
              SMK Negeri 1 Surabaya
            </h2>
            <p className="text-sm text-gray-500">
              Sistem Manajemen Magang Siswa
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userRole}
                </p>
              </div>
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg">
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        {/* scrollable page */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
