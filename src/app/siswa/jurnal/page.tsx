'use client';

import { useState } from 'react';
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

const getStatusBadge = (status: JournalStatus) => {
    const styles = {
      disetujui: 'bg-green-100 text-green-700',
      menunggu_verifikasi: 'bg-yellow-100 text-yellow-700',
      ditolak: 'bg-red-100 text-red-700',
    };
    const labels = {
      disetujui: 'Disetujui',
      menunggu_verifikasi: 'Menunggu Verifikasi',
      ditolak: 'Ditolak',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

type JournalStatus = 'disetujui' | 'menunggu_verifikasi' | 'ditolak';

interface Journal {
  id: number;
  tanggal: string;           // contoh: "Sel, 16 Jul 2024"
  kegiatan: string;
  status: JournalStatus;
  feedback?: string;
  fileName?: string;         // nama file yang diupload
}

export default function JurnalHarianPage() {
  const [journals, setJournals] = useState<Journal[]>([
    {
      id: 1,
      tanggal: 'Sel, 16 Jul 2024',
      kegiatan: 'Belajar backend Laravel untuk membangun REST API sistem kasir. Mempelajari konsep MVC dan routing.',
      status: 'menunggu_verifikasi',
      fileName: 'screenshot_laravel_routing.png',
    },
    {
      id: 2,
      tanggal: 'Sen, 15 Jul 2024',
      kegiatan: 'Membuat desain UI aplikasi kasir menggunakan Figma. Melakukan analisis user experience dan wireframing untuk interface yang user-friendly.',
      status: 'disetujui',
      feedback: 'Bagus sekali, lanjutkan implementasi dengan baik ya',
      fileName: 'figma_kasir_ui_v1.pdf',
    },
  ]);

  const [modal, setModal] = useState<{
    type: 'none' | 'add' | 'view' | 'edit' | 'delete';
    journal?: Journal;
  }>({ type: 'none' });

  const openAddModal = () => setModal({ type: 'add' });
  const openViewModal = (j: Journal) => setModal({ type: 'view', journal: j });
  const openEditModal = (j: Journal) => setModal({ type: 'edit', journal: j });
  const openDeleteModal = (j: Journal) => setModal({ type: 'delete', journal: j });
  const closeModal = () => setModal({ type: 'none' });

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
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
        <FileText className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-orange-900 mb-1">Jangan Lupa Jurnal Hari Ini!</h3>
          <p className="text-sm text-orange-700">
            Anda belum membuat jurnal untuk hari ini. Dokumentasikan kegiatan magang Anda sekarang.
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors">
          Buat Sekarang
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Jurnal', value: journals.length, icon: BookOpen, desc: 'Jurnal yang telah dibuat' },
          {
            title: 'Disetujui',
            value: journals.filter((j) => j.status === 'disetujui').length,
            icon: CheckCircle,
            desc: 'Jurnal disetujui guru',
          },
          {
            title: 'Menunggu',
            value: journals.filter((j) => j.status === 'menunggu_verifikasi').length,
            icon: Clock,
            desc: 'Belum diverifikasi',
          },
          {
            title: 'Ditolak',
            value: journals.filter((j) => j.status === 'ditolak').length,
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
          {/* SEARCH & FILTER - bisa dikembangkan nanti */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Cari kegiatan atau kendala..."
                className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>
            <button className="px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Tampilkan Filter
            </button>
          </div>

          {/* TABLE */}
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
                      <p className="text-sm text-gray-900 font-medium">{journal.tanggal.split(', ')[0]}</p>
                      <p className="text-xs text-gray-500">{journal.tanggal.split(', ')[1]}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{journal.kegiatan}</p>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(journal.status)}</td>
                    <td className="py-4 px-4">
                      {journal.feedback ? (
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-600">{journal.feedback}</p>
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

                        {journal.status !== 'disetujui' && (
                          <button
                            onClick={() => openEditModal(journal)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title={journal.status === 'ditolak' ? 'Perbaiki jurnal' : 'Edit (masih menunggu)'}
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

          {/* PAGINATION - statis dulu */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-600">Menampilkan 1 sampai {journals.length} dari {journals.length} entri</p>
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

      {/* ──────────────────────────────────────────────
          MODAL AREA
      ────────────────────────────────────────────── */}
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
              {modal.type === 'add' && <AddJournalForm onClose={closeModal} />}
              {modal.type === 'view' && modal.journal && <ViewJournal journal={modal.journal} />}
              {modal.type === 'edit' && modal.journal && <EditJournalForm journal={modal.journal} onClose={closeModal} />}
              {modal.type === 'delete' && modal.journal && (
                <DeleteConfirm journal={modal.journal} onClose={closeModal} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   KOMPONEN MODAL
─────────────────────────────────────────────── */

function AddJournalForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
        <p className="font-semibold mb-2">Panduan Penulisan Jurnal</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Minimal 50 karakter untuk deskripsi kegiatan</li>
          <li>Deskripsikan kegiatan dengan detail dan spesifik</li>
          <li>Sertakan kendala yang dihadapi (jika ada)</li>
          <li>Upload dokumentasi pendukung untuk memperkuat laporan</li>
          <li>Pastikan tanggal sesuai dengan hari kerja</li>
        </ul>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="date" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kegiatan * (min 50 karakter)</label>
          <textarea
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            placeholder="Contoh: Melanjutkan pengembangan frontend dengan React.js. Implementasi komponen dashboard dan integrasi dengan API..."
          />
          <p className="text-xs text-gray-500 mt-1 text-right">0 / 50 minimum</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Dokumentasi (Opsional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">PDF, DOCX, JPG, PNG (Max 5MB)</p>
            <button className="mt-3 px-5 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 text-sm">
              Pilih File
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50">
            Batal
          </button>
          <button className="px-6 py-2.5 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600">
            Simpan Jurnal
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewJournal({ journal }: { journal: Journal }) {
  const isApproved = journal.status === 'disetujui';
  const isPending = journal.status === 'menunggu_verifikasi';
  const isRejected = journal.status === 'ditolak';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Tanggal</p>
          <p className="font-medium">{journal.tanggal}</p>
        </div>
        {getStatusBadge(journal.status)}
      </div>

      <div>
        <h4 className="font-medium text-gray-800 mb-2">Kegiatan Hari Ini</h4>
        <p className="text-gray-700 whitespace-pre-line">{journal.kegiatan}</p>
      </div>

      {journal.fileName && (
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Dokumentasi Pendukung</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-cyan-500" />
              <span className="text-sm text-gray-700">{journal.fileName}</span>
            </div>
            <button className="text-cyan-600 hover:underline text-sm">Unduh</button>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-medium text-red-800 mb-1">Alasan Penolakan</p>
          <p className="text-sm text-red-700">Deskripsi kurang detail, kurang menyebutkan kendala yang dihadapi, dan dokumentasi kurang lengkap.</p>
        </div>
      )}

      {isApproved && journal.feedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="font-medium text-blue-800 mb-1">Catatan dari Guru</p>
          <p className="text-sm text-blue-700">{journal.feedback}</p>
        </div>
      )}
    </div>
  );
}

function EditJournalForm({ journal, onClose }: { journal: Journal; onClose: () => void }) {
  const isRejected = journal.status === 'ditolak';

  return (
    <div className="space-y-6">
      {isRejected && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-medium text-red-800 mb-1">Jurnal ini ditolak</p>
          <p className="text-sm text-red-700">Silakan perbaiki sesuai catatan guru dan upload ulang dokumentasi jika diperlukan.</p>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
          <input
            type="text"
            value={journal.tanggal}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kegiatan *</label>
          <textarea
            defaultValue={journal.kegiatan}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Dokumentasi (Opsional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            {journal.fileName ? (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-700">{journal.fileName}</span>
                <button className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">PDF, DOCX, JPG, PNG (Max 5MB)</p>
              </>
            )}
            <button className="mt-3 px-5 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 text-sm">
              {journal.fileName ? 'Ganti File' : 'Pilih File'}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50">
            Batal
          </button>
          <button className="px-6 py-2.5 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600">
            Update Jurnal
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ journal, onClose }: { journal: Journal; onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Hapus Jurnal Ini?</h4>
        <p className="text-sm text-gray-600">
          Anda akan menghapus jurnal tanggal <strong>{journal.tanggal}</strong>.<br />
          Aksi ini <span className="font-medium text-red-600">tidak dapat dibatalkan</span>.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50">
          Batal
        </button>
        <button className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700">
          Ya, Hapus
        </button>
      </div>
    </div>
  );
}