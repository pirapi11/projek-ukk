'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Filter,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  X,
  Calendar,
  Upload,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useMagangSiswa } from '@/lib/queries'; // sesuaikan path jika berbeda

type VerifikasiStatus = 'pending' | 'disetujui' | 'ditolak';

interface Logbook {
  id: number;
  tanggal: string;
  kegiatan: string;
  kendala?: string | null;
  file?: string | null;
  status_verifikasi: VerifikasiStatus;
  catatan_guru?: string | null;
  catatan_dudi?: string | null;
  created_at: string;
}

const formatTanggal = (dateStr: string) => {
  const date = new Date(dateStr);
  const hari = date.toLocaleDateString('id-ID', { weekday: 'short' });
  const tanggal = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${hari}, ${tanggal}`;
};

const getStatusBadge = (status: VerifikasiStatus) => {
  const styles = {
    disetujui: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    ditolak: 'bg-red-100 text-red-700',
  };
  const labels = {
    disetujui: 'Disetujui',
    pending: 'Menunggu Verifikasi',
    ditolak: 'Ditolak',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default function JurnalHarianPage() {
  const { magang, loading: magangLoading, error: magangError } = useMagangSiswa();

  const [journals, setJournals] = useState<Logbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    type: 'none' | 'add' | 'view' | 'edit' | 'delete';
    journal?: Logbook;
  }>({ type: 'none' });

  const [todayJournalExists, setTodayJournalExists] = useState(false);

  useEffect(() => {
    fetchJournals();
  }, []);

  async function fetchJournals() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('logbook')
        .select('*')
        .order('tanggal', { ascending: false });

      if (error) throw error;

      setJournals(data || []);

      const today = new Date().toISOString().split('T')[0];
      const hasToday = data?.some((j) => j.tanggal === today);
      setTodayJournalExists(!!hasToday);
    } catch (err) {
      console.error('Error fetch logbook:', err);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => setModal({ type: 'add' });
  const openViewModal = (j: Logbook) => setModal({ type: 'view', journal: j });
  const openEditModal = (j: Logbook) => {
    if (j.status_verifikasi !== 'pending') {
      alert('Jurnal ini sudah diverifikasi, tidak bisa diedit.');
      return;
    }
    setModal({ type: 'edit', journal: j });
  };
  const openDeleteModal = (j: Logbook) => setModal({ type: 'delete', journal: j });
  const closeModal = () => setModal({ type: 'none' });

  if (magangLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa status magang Anda...</p>
        </div>
      </div>
    );
  }

  if (magangError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-red-800 mb-3">Terjadi Kesalahan</h2>
          <p className="text-red-700">{magangError}</p>
        </div>
      </div>
    );
  }

  if (!magang) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-10 text-center max-w-2xl mx-auto">
          <AlertCircle className="w-20 h-20 text-yellow-600 mx-auto mb-8" />
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">
            Anda belum memiliki data magang
          </h2>
          <p className="text-lg text-yellow-700 mb-8 leading-relaxed">
            Silahkan lakukan pendaftaran pada menu DUDI terlebih dahulu.
          </p>
          <Link
            href="/siswa/dudi"
            className="inline-flex items-center px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-medium text-lg transition-colors shadow-md"
          >
            Ke Halaman Pendaftaran Magang →
          </Link>
        </div>
      </div>
    );
  }

  // ── Konten utama jika sudah punya magang ──
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Jurnal Harian Magang</h1>
        <button
          onClick={openAddModal}
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-sm transition-colors flex items-center gap-2"
        >
          + Tambah Jurnal
        </button>
      </div>

      {!todayJournalExists && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <FileText className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900 mb-1">Jangan Lupa Jurnal Hari Ini!</h3>
            <p className="text-sm text-orange-700">
              Anda belum membuat jurnal untuk hari ini. Dokumentasikan kegiatan magang Anda sekarang.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
          >
            Buat Sekarang
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Jurnal', value: journals.length, icon: BookOpen, desc: 'Jurnal yang telah dibuat' },
          {
            title: 'Disetujui',
            value: journals.filter((j) => j.status_verifikasi === 'disetujui').length,
            icon: CheckCircle,
            desc: 'Jurnal disetujui guru',
          },
          {
            title: 'Menunggu',
            value: journals.filter((j) => j.status_verifikasi === 'pending').length,
            icon: Clock,
            desc: 'Belum diverifikasi',
          },
          {
            title: 'Ditolak',
            value: journals.filter((j) => j.status_verifikasi === 'ditolak').length,
            icon: XCircle,
            desc: 'Perlu diperbaiki',
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">{item.title}</p>
                <Icon className="w-5 h-5 text-cyan-500" />
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">{item.value}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-500" />
            Riwayat Jurnal
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Cari kegiatan atau kendala..."
                className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
            </div>
            <button className="px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Tampilkan Filter
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">Memuat jurnal...</div>
          ) : journals.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Belum ada jurnal harian</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tanggal</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Kegiatan & Kendala</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Feedback Guru</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {journals.map((journal) => (
                    <tr key={journal.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-900 font-medium">
                          {formatTanggal(journal.tanggal).split(', ')[0]}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTanggal(journal.tanggal).split(', ')[1]}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600 line-clamp-2">{journal.kegiatan}</p>
                        {journal.kendala && (
                          <p className="text-xs text-gray-500 mt-1">
                            <strong>Kendala:</strong> {journal.kendala}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(journal.status_verifikasi)}</td>
                      <td className="py-4 px-4">
                        {journal.catatan_guru ? (
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-600">{journal.catatan_guru}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">Belum ada feedback</p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openViewModal(journal)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Lihat detail"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>

                          {journal.status_verifikasi === 'pending' && (
                            <button
                              onClick={() => openEditModal(journal)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit jurnal"
                            >
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                          )}

                          <button
                            onClick={() => openDeleteModal(journal)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600 hover:text-red-700"
                            title="Hapus jurnal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-600">
              Menampilkan 1 sampai {journals.length} dari {journals.length} entri
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <ChevronsLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-sm font-medium">1</button>
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <ChevronsRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {modal.type !== 'none' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">
                {modal.type === 'add' && 'Tambah Jurnal Harian'}
                {modal.type === 'view' && 'Detail Jurnal Harian'}
                {modal.type === 'edit' && 'Edit Jurnal Harian'}
                {modal.type === 'delete' && 'Konfirmasi Hapus'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {modal.type === 'add' && (
                <AddJournalForm
                  magangId={magang.id}
                  onSuccess={() => {
                    closeModal();
                    fetchJournals();
                  }}
                  onCancel={closeModal}
                />
              )}
              {modal.type === 'view' && modal.journal && <ViewJournal journal={modal.journal} />}
              {modal.type === 'edit' && modal.journal && (
                <EditJournalForm
                  journal={modal.journal}
                  onSuccess={() => {
                    closeModal();
                    fetchJournals();
                  }}
                  onCancel={closeModal}
                />
              )}
              {modal.type === 'delete' && modal.journal && (
                <DeleteConfirm
                  journal={modal.journal}
                  onSuccess={() => {
                    closeModal();
                    fetchJournals();
                  }}
                  onCancel={closeModal}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddJournalForm({
  magangId,
  onSuccess,
  onCancel,
}: {
  magangId: number;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kegiatan, setKegiatan] = useState('');
  const [kendala, setKendala] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const karakterMin = 50;
  const karakterSekarang = kegiatan.length;
  const isValid = karakterSekarang >= karakterMin;

  const getUserId = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Anda harus login terlebih dahulu");
    return user.id;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isValid) {
      alert('Deskripsi kegiatan minimal 50 karakter.');
      return;
    }

    if (!magangId) {
      setErrorMsg('Data magang tidak ditemukan. Silakan periksa halaman Magang.');
      return;
    }

    setErrorMsg(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      let fileUrl: string | null = null;

      if (file) {
        const userId = await getUserId();
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'file';
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}-${safeFileName}`;
        const filePath = `siswa/${userId}/${tanggal}/${fileName}`;

        setUploadProgress(20);

        const { error: uploadError } = await supabase.storage
          .from('logbook')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw new Error(uploadError.message || 'Gagal mengupload file');

        setUploadProgress(70);

        const { data: publicUrlData } = supabase.storage.from('logbook').getPublicUrl(filePath);
        fileUrl = publicUrlData.publicUrl;
        setUploadProgress(100);
      }

      const { error: insertError } = await supabase
        .from('logbook')
        .insert({
          magang_id: magangId,
          tanggal,
          kegiatan,
          kendala: kendala.trim() || null,
          file: fileUrl,
          status_verifikasi: 'pending',
        });

      if (insertError) throw insertError;

      onSuccess();
    } catch (err: any) {
      console.error('Full error saat submit:', err);
      setErrorMsg(err.message || 'Gagal menyimpan jurnal. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      e.target.value = '';
      return;
    }

    const allowed = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
    const ext = selected.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowed.includes(ext)) {
      alert('Hanya file PDF, DOC, DOCX, JPG, JPEG, PNG yang diperbolehkan');
      e.target.value = '';
      return;
    }

    setFile(selected);
    setErrorMsg(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Panduan Penulisan Journal</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-blue-800">
              <li>Minimal 50 karakter untuk deskripsi kegiatan</li>
              <li>Deskripsikan kegiatan dengan detail dan spesifik</li>
              <li>Sertakan kendala yang dihadapi (jika ada)</li>
              <li>Upload dokumentasi pendukung untuk memperkuat laporan</li>
              <li>Pastikan tanggal sesuai dengan hari kerja</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Informasi Dasar</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  required
                  disabled={uploading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700">
                Menunggu Verifikasi
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-3">Kegiatan Harian</h4>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Kegiatan *</label>
          <textarea
            value={kegiatan}
            onChange={(e) => setKegiatan(e.target.value)}
            rows={6}
            disabled={uploading}
            className={`w-full px-4 py-3 border ${
              isValid ? 'border-gray-300' : 'border-red-400 focus:border-red-500'
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-sm`}
            placeholder="Contoh: Membuat desain UI aplikasi kasir menggunakan Figma..."
            required
          />
          <div className="flex justify-between text-xs mt-1.5">
            <span className={isValid ? 'text-gray-500' : 'text-red-600 font-medium'}>
              {karakterSekarang} / {karakterMin} minimum
            </span>
            {!isValid && <span className="text-red-600">Deskripsi minimal 50 karakter</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Kendala yang Dihadapi (Opsional)
          </label>
          <textarea
            value={kendala}
            onChange={(e) => setKendala(e.target.value)}
            rows={4}
            disabled={uploading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-sm"
            placeholder="Contoh: Kesulitan dalam menentukan color palette..."
          />
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-3">Dokumentasi Pendukung</h4>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Upload File (Opsional – max 5MB)
          </label>

          <div className={`border-2 border-dashed rounded-xl p-6 text-center bg-gray-50/50 relative ${uploading ? 'opacity-75' : ''}`}>
            {uploading && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-xl z-10">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-cyan-700 font-medium">Mengunggah... {uploadProgress}%</p>
              </div>
            )}

            {!file && (
              <>
                <div className="mx-auto w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-cyan-500" />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  PDF, DOC, DOCX, JPG, PNG (maks. 5 MB)
                </p>
                <label className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors">
                  Pilih File
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </>
            )}

            {file && (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
                    <FileText className="w-5 h-5 text-cyan-600" />
                    <span className="font-medium max-w-[260px] truncate">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-600 hover:text-red-800 text-xs underline"
                    disabled={uploading}
                  >
                    Hapus File
                  </button>
                </div>

                <label className="inline-block px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors">
                  Ganti File
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            )}

            {errorMsg && (
              <p className="mt-4 text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
                {errorMsg}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={uploading}
          className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={!isValid || uploading}
          className={`px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 min-w-[140px] justify-center ${
            isValid && !uploading
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Jurnal'
          )}
        </button>
      </div>
    </form>
  );
}

// Komponen ViewJournal, EditJournalForm, DeleteConfirm tetap sama seperti kode asli kamu
// Jika ingin ditambahkan di sini juga, beri tahu — tapi sebaiknya tetap di file terpisah agar file tidak terlalu panjang

function ViewJournal({ journal }: { journal: Logbook }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Tanggal</p>
          <p className="font-medium">{formatTanggal(journal.tanggal)}</p>
        </div>
        {getStatusBadge(journal.status_verifikasi)}
      </div>

      <div>
        <h4 className="font-medium text-gray-800 mb-2">Kegiatan Hari Ini</h4>
        <p className="text-gray-700 whitespace-pre-line">{journal.kegiatan}</p>
      </div>

      {journal.kendala && (
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Kendala yang Dihadapi</h4>
          <p className="text-gray-700 whitespace-pre-line">{journal.kendala}</p>
        </div>
      )}

      {journal.file && (
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Dokumentasi Pendukung</h4>
          <a
            href={journal.file}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 rounded-lg transition-colors"
          >
            <FileText className="w-5 h-5" />
            Lihat / Unduh File
          </a>
        </div>
      )}

      {journal.status_verifikasi === 'ditolak' && journal.catatan_guru && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-medium text-red-800 mb-1">Alasan Penolakan</p>
          <p className="text-sm text-red-700">{journal.catatan_guru}</p>
        </div>
      )}

      {(journal.status_verifikasi === 'disetujui' || journal.status_verifikasi === 'ditolak') &&
        (journal.catatan_guru || journal.catatan_dudi) && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="font-medium text-blue-800 mb-1">Catatan dari Guru / DUDI</p>
            {journal.catatan_guru && <p className="text-sm text-blue-700">Guru: {journal.catatan_guru}</p>}
            {journal.catatan_dudi && <p className="text-sm text-blue-700 mt-2">DUDI: {journal.catatan_dudi}</p>}
          </div>
        )}
    </div>
  );
}

function EditJournalForm({ journal, onSuccess, onCancel }: { journal: Logbook; onSuccess: () => void; onCancel: () => void }) {
  const [kegiatan, setKegiatan] = useState(journal.kegiatan);
  const [kendala, setKendala] = useState(journal.kendala || '');
  const [submitting, setSubmitting] = useState(false);

  const karakterMin = 50;
  const karakterSekarang = kegiatan.length;
  const isValid = karakterSekarang >= karakterMin;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      alert('Deskripsi kegiatan minimal 50 karakter.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('logbook')
        .update({
          kegiatan,
          kendala: kendala.trim() || null,
          status_verifikasi: 'pending',
        })
        .eq('id', journal.id);

      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      console.error('Error update jurnal:', err);
      alert('Gagal update jurnal: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
        <input
          type="text"
          value={formatTanggal(journal.tanggal)}
          readOnly
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kegiatan *</label>
        <textarea
          value={kegiatan}
          onChange={(e) => setKegiatan(e.target.value)}
          rows={6}
          disabled={submitting}
          className={`w-full px-4 py-3 border ${
            isValid ? 'border-gray-300' : 'border-red-400'
          } rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-sm`}
          required
        />
        <div className="flex justify-between text-xs mt-1.5">
          <span className={isValid ? 'text-gray-500' : 'text-red-600 font-medium'}>
            {karakterSekarang} / {karakterMin} minimum
          </span>
          {!isValid && <span className="text-red-600">Deskripsi minimal 50 karakter</span>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kendala (opsional)</label>
        <textarea
          value={kendala}
          onChange={(e) => setKendala(e.target.value)}
          rows={4}
          disabled={submitting}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-sm"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={!isValid || submitting}
          className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
            isValid && !submitting
              ? 'bg-cyan-500 text-white hover:bg-cyan-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {submitting ? 'Menyimpan...' : 'Update Jurnal'}
        </button>
      </div>
    </form>
  );
}

function DeleteConfirm({ journal, onSuccess, onCancel }: { journal: Logbook; onSuccess: () => void; onCancel: () => void }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const { error } = await supabase.from('logbook').delete().eq('id', journal.id);
      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      console.error('Error hapus jurnal:', err);
      alert('Gagal hapus: ' + err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Hapus Jurnal Ini?</h4>
        <p className="text-sm text-gray-600">
          Anda akan menghapus jurnal tanggal <strong>{formatTanggal(journal.tanggal)}</strong>.<br />
          Aksi ini tidak dapat dibatalkan.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={deleting}
          className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Batal
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? 'Menghapus...' : 'Ya, Hapus'}
        </button>
      </div>
    </div>
  );
}