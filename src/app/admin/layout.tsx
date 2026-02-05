"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  User,
  Building2, 
  Briefcase, 
  UserCog, 
  Activity, 
  Settings,
  Bell
} from "lucide-react"

export default function AdminLayout({
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

  const menu = [
    { 
      name: "Dashboard", 
      path: "/admin/dashboard",
      subtitle: "Ringkasan sistem",
      icon: LayoutDashboard
    },
    { 
      name: "DUDI", 
      path: "/admin/dudi",
      subtitle: "Manajemen DUDI",
      icon: Building2
    },
    { 
      name: "Pengguna", 
      path: "#",
      subtitle: "Manajemen user",
      icon: UserCog
    },
    { 
      name: "Pengaturan", 
      path: "#",
      subtitle: "Konfigurasi sistem",
      icon: Settings
    },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="h-screen w-screen bg-gray-50 overflow-hidden">

      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-50">
        {/* SIDEBAR HEADER - SIMMAS BRANDING */}
        <div className="h-16 bg-[#ffffff] flex items-center gap-3 px-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-black">
              SIMMAS
            </h1>
            <p className="text-xs text-gray-400">
              Panel Admin
            </p>
          </div>
        </div>
        <div className="p-4 space-y-1">
          {menu.map(item => {
            const active = pathname === item.path
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => item.path !== "#" && router.push(item.path)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition flex items-center gap-3
                  ${active
                    ? "bg-gradient-to-br from-cyan-500 to-cyan-600"
                    : "text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-500"}`} />
                <div className="flex-1">
                  <div className={`font-medium ${active ? "text-white" : "text-gray-800"}`}>
                    {item.name}
                  </div>
                  <div className={`text-xs ${active ? "text-cyan-50" : "text-gray-500"}`}>
                    {item.subtitle}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-800">
                SMK Negeri 1 Surabaya
              </div>
              <div className="text-xs text-gray-500">
                Sistem Pelaporan v1.0
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* HEADER - Starts from right of sidebar */}
      <header className="fixed top-0 left-64 right-0 h-16 bg-[#ffffff] z-40 flex items-center justify-between px-6">
        <div className="flex-1 text-left">
          <h2 className="text-base font-semibold text-black">
            SMK Negeri 1 Surabaya
          </h2>
          <p className="text-xs text-gray-400">
            Sistem Manajemen Magang Siswa
          </p>
        </div>

        {/* PROFILE & NOTIFICATION */}
        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell className="w-4 h-5 text-gray-600" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-3 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>

              <div className="text-left leading-tight">
                <p className="text-sm font-semibold text-gray-800">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userRole}
                </p>
              </div>
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENT (SCROLL AREA) */}
      <main className="ml-64 pt-16 h-screen overflow-y-auto bg-gray-50">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}