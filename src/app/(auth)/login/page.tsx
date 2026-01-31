"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@/components/ui/icon"

export default function Page() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError("Email atau password salah")
      setLoading(false)
      return
    }

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single()

    if (!userData) {
      setError("Role user tidak ditemukan")
      setLoading(false)
      return
    }

    router.push(`/${userData.role}/dashboard`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_160%_160%_at_100%_100%,#93c5fd_-50%,#e8f0ff_30%,#ffffff_75%)]">

      <div className="w-full max-w-sm rounded-2xl bg-white shadow-[0_20px_20px_-10px_rgba(0,0,0,0.25)] px-7 py-8">

        {/* ICON */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-center text-2xl font-bold text-gray-800">
          Welcome Back
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Sign in to your account
        </p>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <div className="mt-6">
          <label className="text-xs font-bold text-gray-600">
            Email Address
          </label>
          <div className="relative mt-1">
            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="mt-4">
          <label className="text-xs font-bold text-gray-600">
            Password
          </label>
          <div className="relative mt-1">
            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>

      <p className="mt-6 text-center text-[14px] text-gray-400 leading-relaxed">
        By signing in, you agree to our{" "}
        <span className="text-blue-600 cursor-pointer">Terms of Service</span>{" "}
        and{" "}
        <span className="text-blue-600 cursor-pointer">
          Privacy<br />Policy
        </span>
      </p>
    </div>
  )
}