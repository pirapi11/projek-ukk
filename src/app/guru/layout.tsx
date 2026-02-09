"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { 
  LayoutDashboard, 
  GraduationCap, 
  Building2, 
  BookOpen,
  Bell,
  User,
  LogOut
} from "lucide-react"

// Komponen ProfileDropdown sama persis seperti di atas (copy paste ke sini atau buat file terpisah)
function ProfileDropdown({
  userName,
  userRole,
  onLogout
}: {
  userName: string
  userRole: string
  onLogout: () => void
}) {
  const [openDropdown, setOpenDropdown] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleLogoutClick = () => {
    setOpenDropdown(false)
    setShowConfirm(true)
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="flex items-center gap-3 focus:outline-none hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>

          <div className="text-left leading-tight hidden md:block">
            <p className="text-sm font-semibold text-gray-800">{userName}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </button>

        {openDropdown && (
          <div 
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden"
            onClick={() => setOpenDropdown(false)}
          >
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="font-medium text-gray-900">{userName}</p>
              <p className="text-sm text-gray-500 capitalize">{userRole}</p>
            </div>

            <button
              onClick={handleLogoutClick}
              className="
                w-full flex items-center gap-3 px-4 py-3 text-left text-sm 
                text-red-600 hover:bg-red-600 hover:text-white 
                transition-colors duration-200
              ">
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <LogOut className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Konfirmasi Keluar
                </h3>
                <p className="text-gray-600">
                  Apakah Anda yakin ingin keluar dari sistem?<br />
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={onLogout}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [userName, setUserName] = useState("Loading...")
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
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

      setUserName(data.name || "Guru")
      setUserRole(data.role || "guru")
    }

    fetchUserProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const menu = [
    { name: "Dashboard", path: "/guru/dashboard", subtitle: "Ringkasan sistem", icon: LayoutDashboard },
    { name: "DUDI", path: "/guru/dudi", subtitle: "Manajemen DUDI", icon: Building2 },
    { name: "Magang", path: "/guru/magang", subtitle: "Manajemen magang", icon: GraduationCap },
    { name: "Jurnal Harian", path: "/guru/jurnal", subtitle: "Catatan jurnal", icon: BookOpen },
  ]

  return (
    <div className="h-screen w-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-40">
        <div className="h-16 bg-white flex items-center gap-3 px-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-black">SIMMAS</h1>
            <p className="text-xs text-gray-400">Panel Guru</p>
          </div>
        </div>
        <div className="p-4 space-y-1">
          {menu.map(item => {
            const active = pathname === item.path
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition flex items-center gap-3
                  ${active ? "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-500"}`} />
                <div className="flex-1">
                  <div className={`font-medium ${active ? "text-white" : "text-gray-800"}`}>{item.name}</div>
                  <div className={`text-xs ${active ? "text-cyan-100" : "text-gray-500"}`}>{item.subtitle}</div>
                </div>
              </button>
            )
          })}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-800">SMK Negeri 1 Surabaya</div>
              <div className="text-xs text-gray-500">Sistem Pelaporan v1.0</div>
            </div>
          </div>
        </div>
      </aside>

      {/* HEADER */}
      <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-6">
        <div className="flex-1">
          <h2 className="text-base font-semibold text-gray-900">SMK Negeri 1 Surabaya</h2>
          <p className="text-xs text-gray-500">Sistem Manajemen Magang Siswa</p>
        </div>

        <div className="flex items-center gap-5">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>

          <ProfileDropdown 
            userName={userName}
            userRole={userRole}
            onLogout={handleLogout}
          />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="ml-64 pt-16 h-screen overflow-y-auto bg-gray-50">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}