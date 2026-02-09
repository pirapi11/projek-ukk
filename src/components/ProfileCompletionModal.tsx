'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AlertCircle } from 'lucide-react'

type Profile = {
  id: number
  nama: string | null
  nis: string | null
  kelas: string | null
  jurusan: string | null
  alamat: string | null
  telepon: string | null
}

export default function ProfileCompletionModal() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState({
    nis: '',
    kelas: '',
    jurusan: '',
    alamat: '',
    telepon: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('siswa')
        .select('id, nama, nis, kelas, jurusan, alamat, telepon')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setProfile(data)
        const isIncomplete =
          !data.nis?.trim() ||
          !data.kelas?.trim() ||
          !data.jurusan?.trim()

        setIsOpen(isIncomplete)
        
        if (!isIncomplete) {
          // sudah lengkap, simpan ke localStorage supaya tidak cek ulang
          localStorage.setItem('profile_completed', 'true')
        }
      }
    }

    // Cek hanya jika belum ditandai selesai
    if (!localStorage.getItem('profile_completed')) {
      checkProfile()
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!form.nis.trim() || !form.kelas.trim() || !form.jurusan.trim()) {
      setError('NIS, Kelas, dan Jurusan wajib diisi!')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase
        .from('siswa')
        .update({
          nis: form.nis.trim(),
          kelas: form.kelas.trim(),
          jurusan: form.jurusan.trim(),
          alamat: form.alamat.trim() || null,
          telepon: form.telepon.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile?.id)

      if (error) throw error

      localStorage.setItem('profile_completed', 'true')
      setIsOpen(false)
      window.location.reload() // refresh supaya dashboard tahu status baru
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !profile) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-cyan-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <AlertCircle size={28} />
            <h2 className="text-xl font-bold">Lengkapi Profil Siswa</h2>
          </div>
          <p className="mt-1 text-cyan-100">
            Selamat datang! Sebelum menggunakan sistem, lengkapi data berikut ya
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIS <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nis"
                value={form.nis}
                onChange={handleChange}
                required
                maxLength={50}
                className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Contoh: 1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kelas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="kelas"
                value={form.kelas}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Contoh: XII RPL 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jurusan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jurusan"
                value={form.jurusan}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Contoh: Rekayasa Perangkat Lunak"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telepon / WA
              </label>
              <input
                type="tel"
                name="telepon"
                value={form.telepon}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Alamat lengkap..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-medium ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-cyan-600 hover:bg-cyan-700'
            } transition-colors`}
          >
            {loading ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
          </button>
        </form>
      </div>
    </div>
  )
}