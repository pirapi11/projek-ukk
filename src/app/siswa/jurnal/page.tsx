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
import { supabase } from '@/lib/supabase'; // sesuaikan path

type VerifikasiStatus = 'pending' | 'disetujui' | 'ditolak';

interface Logbook {
  id: number;
  tanggal: string; // ISO date string dari DB
  kegiatan: string;
  kendala?: string | null;
  file?: string | null;
  status_verifikasi: VerifikasiStatus;
  catatan_guru?: string | null;
  catatan_dudi?: string | null;
  created_at: string;
}

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

      // Cek apakah sudah ada jurnal hari ini
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

  // Format tanggal jadi "Sel, 16 Jul 2024"
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

  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Jurnal Harian Magang</h1>
        <button
          onClick={openAddModal}
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-sm transition-colors flex items-center gap-2"
        >
          + Tambah Jurnal
        </button>
      </div>

      {/* ALERT - JANGAN LUPA */}
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

      {/* STATS */}
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

      {/* RIWAYAT JURNAL */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-500" />
            Riwayat Jurnal
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* SEARCH & FILTER - statis dulu, bisa dikembangkan */}
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

          {/* PAGINATION statis dulu */}
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

      {/* MODAL */}
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
              {modal.type === 'add' && <AddJournalForm onSuccess={() => { closeModal(); fetchJournals(); }} />}
              {modal.type === 'view' && modal.journal && <ViewJournal journal={modal.journal} />}
              {modal.type === 'edit' && modal.journal && (
                <EditJournalForm journal={modal.journal} onSuccess={() => { closeModal(); fetchJournals(); }} />
              )}
              {modal.type === 'delete' && modal.journal && (
                <DeleteConfirm journal={modal.journal} onSuccess={() => { closeModal(); fetchJournals(); }} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   FORM TAMBAH JURNAL
─────────────────────────────────────────────── */

function AddJournalForm({ onSuccess }: { onSuccess: () => void }) {
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kegiatan, setKegiatan] = useState('');
  const [kendala, setKendala] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const karakterMin = 50;
  const karakterSekarang = kegiatan.length;
  const isValid = karakterSekarang >= karakterMin;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      alert('Deskripsi kegiatan minimal 50 karakter.');
      return;
    }

    try {
      let filePath = null;
      if (file) {
        filePath = file.name; // sementara simpan nama saja
      }

      const { error } = await supabase.from('logbook').insert({
        tanggal,
        kegiatan,
        kendala: kendala || null,
        file: filePath,
        status_verifikasi: 'pending',
      });

      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      console.error(err);
      alert('Gagal menambah jurnal: ' + (err.message || 'Unknown error'));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Panduan Penulisan Journal */}
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

      {/* Informasi Dasar */}
      <div className="space-y-5">
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Informasi Dasar</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tanggal *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700">
                Menunggu Verifikasi
              </div>
            </div>
          </div>
        </div>

        {/* Kegiatan Harian */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Kegiatan Harian</h4>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Deskripsi Kegiatan *
          </label>
          <textarea
            value={kegiatan}
            onChange={(e) => setKegiatan(e.target.value)}
            rows={6}
            className={`w-full px-4 py-3 border ${
              isValid ? 'border-gray-300' : 'border-red-400 focus:border-red-500'
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-sm`}
            placeholder="Contoh: Membuat desain UI aplikasi kasir menggunakan Figma. Melakukan analisis user experience dan wireframing untuk interface yang user-friendly..."
            required
          />
          <div className="flex justify-between text-xs mt-1.5">
            <span className={isValid ? 'text-gray-500' : 'text-red-600 font-medium'}>
              {karakterSekarang} / {karakterMin} minimum
            </span>
            {!isValid && (
              <span className="text-red-600">Deskripsi minimal 50 karakter</span>
            )}
          </div>
        </div>

        {/* Dokumentasi Pendukung */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Dokumentasi Pendukung</h4>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Upload File (Opsional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50/50">
            <div className="mx-auto w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-cyan-500" />
            </div>
            <p className="text-base font-medium text-gray-700 mb-1">
              Pilih file dokumentasi
            </p>
            <p className="text-sm text-gray-500 mb-4">
              PDF, DOC, DOCX, JPG, PNG (Max 5MB)
            </p>

            <label className="inline-block px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors">
              Browse File
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

            {file && (
              <div className="mt-4 text-sm text-gray-600">
                Terpilih: <span className="font-medium">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="ml-3 text-red-600 hover:underline text-xs"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert bawah */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800 mb-1">Lengkapi form terlebih dahulu:</p>
            <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
              <li>Pilih tanggal yang valid</li>
              <li>Deskripsi kegiatan minimal 50 karakter</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tombol Bawah */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => {} /* onClose dari parent */}
          className="px-8 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isValid
              ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Simpan Jurnal
        </button>
      </div>
    </form>
  );
}

/* ──────────────────────────────────────────────
   VIEW & EDIT & DELETE (mirip asli, tapi pakai data real)
─────────────────────────────────────────────── */

function ViewJournal({ journal }: { journal: Logbook }) {
  const isApproved = journal.status_verifikasi === 'disetujui';
  const isPending = journal.status_verifikasi === 'pending';
  const isRejected = journal.status_verifikasi === 'ditolak';

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
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-cyan-500" />
              <span className="text-sm text-gray-700">{journal.file}</span>
            </div>
            <button className="text-cyan-600 hover:underline text-sm">Unduh</button>
          </div>
        </div>
      )}

      {isRejected && journal.catatan_guru && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-medium text-red-800 mb-1">Alasan Penolakan</p>
          <p className="text-sm text-red-700">{journal.catatan_guru}</p>
        </div>
      )}

      {(isApproved || isRejected) && (journal.catatan_guru || journal.catatan_dudi) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="font-medium text-blue-800 mb-1">Catatan dari Guru / DUDI</p>
          {journal.catatan_guru && <p className="text-sm text-blue-700">Guru: {journal.catatan_guru}</p>}
          {journal.catatan_dudi && <p className="text-sm text-blue-700 mt-2">DUDI: {journal.catatan_dudi}</p>}
        </div>
      )}
    </div>
  );
}

function EditJournalForm({ journal, onSuccess }: { journal: Logbook; onSuccess: () => void }) {
  const [kegiatan, setKegiatan] = useState(journal.kegiatan);
  const [kendala, setKendala] = useState(journal.kendala || '');
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (kegiatan.length < 50) {
      alert('Deskripsi kegiatan minimal 50 karakter.');
      return;
    }

    try {
      let filePath = journal.file;
      if (file) {
        filePath = file.name; // sementara
      }

      const { error } = await supabase
        .from('logbook')
        .update({
          kegiatan,
          kendala: kendala || null,
          file: filePath,
          status_verifikasi: 'pending', // reset ke pending setelah edit
        })
        .eq('id', journal.id);

      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      console.error(err);
      alert('Gagal update jurnal: ' + err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... isi form mirip AddJournalForm, tapi value & onChange pakai state */}
      {/* tanggal read-only */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
        <input
          type="text"
          value={formatTanggal(journal.tanggal)}
          readOnly
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
        />
      </div>

      {/* kegiatan, kendala, file upload mirip AddJournalForm */}
      {/* ... copy paste dan sesuaikan state ... */}

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={() => {}} className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50">
          Batal
        </button>
        <button type="submit" className="px-6 py-2.5 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600">
          Update Jurnal
        </button>
      </div>
    </form>
  );
}

function DeleteConfirm({ journal, onSuccess }: { journal: Logbook; onSuccess: () => void }) {
  async function handleDelete() {
    try {
      const { error } = await supabase.from('logbook').delete().eq('id', journal.id);
      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      console.error(err);
      alert('Gagal hapus: ' + err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Hapus Jurnal Ini?</h4>
        <p className="text-sm text-gray-600">
          Anda akan menghapus jurnal tanggal <strong>{formatTanggal(journal.tanggal)}</strong>.<br />
          Aksi ini <span className="font-medium text-red-600">tidak dapat dibatalkan</span>.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button onClick={() => {}} className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50">
          Batal
        </button>
        <button onClick={handleDelete} className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700">
          Ya, Hapus
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   HELPER FUNCTION (format tanggal)
─────────────────────────────────────────────── */

function formatTanggal(dateStr: string) {
  const date = new Date(dateStr);
  const hari = date.toLocaleDateString('id-ID', { weekday: 'short' });
  const tanggal = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${hari}, ${tanggal}`;
}