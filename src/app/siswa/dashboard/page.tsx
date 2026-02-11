'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  User,
  School,
  BookOpen,
  MapPin,
  Phone,
  AlertCircle,
  X,
  CheckCircle,
  Calendar
} from 'lucide-react';

export default function SiswaDashboardPage() {
  const [siswa, setSiswa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nis: '',
    kelas: '',
    jurusan: '',
    alamat: '',
    telepon: '',
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSiswa() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Belum login');

        const { data, error } = await supabase
          .from('siswa')
          .select('id, nama, nis, kelas, jurusan, alamat, telepon')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Data siswa tidak ditemukan');

        setSiswa(data);

        // Cek apakah data profil masih kosong (baru ditambahkan admin)
        if (
          !data.nis ||
          !data.kelas ||
          !data.jurusan ||
          !data.alamat ||
          !data.telepon
        ) {
          setShowModal(true);
        }
      } catch (err: any) {
        console.error('Error fetch siswa:', err);
        setErrorMsg(err.message || 'Gagal memuat data siswa');
      } finally {
        setLoading(false);
      }
    }

    fetchSiswa();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validasi sederhana
    if (!formData.nis || !formData.kelas || !formData.jurusan) {
      setErrorMsg('NIS, Kelas, dan Jurusan wajib diisi');
      return;
    }

    try {
      const { error } = await supabase
        .from('siswa')
        .update({
          nis: formData.nis.trim(),
          kelas: formData.kelas.trim(),
          jurusan: formData.jurusan.trim(),
          alamat: formData.alamat.trim() || null,
          telepon: formData.telepon.trim() || null,
        })
        .eq('id', siswa.id);

      if (error) throw error;

      // Update state lokal
      setSiswa((prev: any) => ({
        ...prev,
        nis: formData.nis,
        kelas: formData.kelas,
        jurusan: formData.jurusan,
        alamat: formData.alamat,
        telepon: formData.telepon,
      }));

      setSuccessMsg('Profil berhasil diperbarui!');
      setShowModal(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Selamat Datang */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Selamat datang, {siswa?.nama || 'Siswa'}
        </h1>
        <p className="text-gray-600 mt-2">
          Pantau aktivitas magang dan jurnal harian Anda di sini
        </p>
      </div>

      {/* Ringkasan cepat / card dashboard
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Jurnal Harian</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status Magang</p>
              <p className="text-2xl font-bold text-gray-900">
                {siswa?.nis ? 'Aktif' : 'Belum Terdaftar'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Periode Magang</p>
              <p className="text-lg font-medium text-gray-900">Belum tersedia</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Modal Profil Siswa Baru */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">
                Lengkapi Profil Siswa Anda
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-cyan-800">
                    Selamat datang! Sebelum melanjutkan, lengkapi data profil Anda terlebih dahulu.
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    NIS *
                  </label>
                  <input
                    type="text"
                    name="nis"
                    value={formData.nis}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Kelas *
                  </label>
                  <input
                    type="text"
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    placeholder="Contoh: XII RPL 1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Jurusan *
                  </label>
                  <input
                    type="text"
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    placeholder="Contoh: Rekayasa Perangkat Lunak"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Alamat
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm resize-none"
                    placeholder="Alamat lengkap Anda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    placeholder="Contoh: 08123456789"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Simpan Profil
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Konten dashboard lainnya bisa ditambahkan di sini nanti */}
    </div>
  );
}