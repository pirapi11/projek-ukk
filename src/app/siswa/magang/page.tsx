'use client';

import { useMagangSiswa } from '@/lib/queries'; // sesuaikan path kalau beda
import { User, Building2, MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function MagangPage() {
  const { magang, loading: magangLoading, error: magangError } = useMagangSiswa();

  if (magangLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Memuat data magang...</p>
        </div>
      </div>
    );
  }

  if (magangError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700">{magangError}</p>
        </div>
      </div>
    );
  }

  // Belum punya magang
  if (!magang) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Status Magang Saya</h1>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Belum Ada Data Magang</h2>
          <p className="text-gray-600 mb-6">
            Anda belum terdaftar magang. Silakan lakukan pendaftaran di menu DUDI.
          </p>
          <Link
            href="/siswa/dudi" // sesuaikan path ke halaman DUDI/pendaftaran
            className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
          >
            Daftar Tempat Magang
          </Link>
        </div>
      </div>
    );
  }

  // Tampilan persis seperti screenshot
  return (
    <div className="p-6 space-y-8">
      {/* Judul utama */}
      <h1 className="text-2xl font-bold text-gray-900">Status Magang Saya</h1>

      {/* Card Data Magang */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header card */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-3">
          <User className="w-5 h-5 text-cyan-600" />
          <h2 className="text-lg font-semibold text-gray-900">Data Magang</h2>
        </div>

        {/* Isi card - dua kolom label-value */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Kolom kiri */}
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">Nama Siswa</p>
                <p className="text-base font-medium text-gray-900">{magang.siswa?.nama || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">NIS</p>
                <p className="text-base font-medium text-gray-900">{magang.siswa?.nis || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kelas</p>
                <p className="text-base font-medium text-gray-900">{magang.siswa?.kelas || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jurusan</p>
                <p className="text-base font-medium text-gray-900">{magang.siswa?.jurusan || '-'}</p>
              </div>
            </div>

            {/* Kolom kanan */}
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">Nama Perusahaan</p>
                <p className="text-base font-medium text-gray-900">
                  {magang.dudi?.nama_perusahaan || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Alamat Perusahaan</p>
                <p className="text-base font-medium text-gray-900">{magang.dudi?.alamat || '-'}</p>
              </div>

              {/* Periode */}
              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-1">Periode Magang</p>
                <p className="text-base font-medium text-gray-900">
                  {magang.tanggal_mulai
                    ? new Date(magang.tanggal_mulai).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}{' '}
                  s.d.{' '}
                  {magang.tanggal_selesai
                    ? new Date(magang.tanggal_selesai).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Aktif
                </span>
              </div>

              {/* Nilai Akhir */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Nilai Akhir</p>
                <p className="text-lg font-bold text-cyan-600">
                  {magang.nilai_akhir ?? '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}