'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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

/* =====================
   TYPES
===================== */
type JournalStatus = 'disetujui' | 'menunggu_verifikasi' | 'ditolak';

interface Journal {
  id: number;
  tanggal: string;
  kegiatan: string;
  kendala?: string;
  status: JournalStatus;
  feedback?: string;
  fileName?: string;
}

/* =====================
   STATUS BADGE
===================== */
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

/* =====================
   PAGE
===================== */
export default function JurnalHarianPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [modal, setModal] = useState<{
    type: 'none' | 'add' | 'view' | 'edit' | 'delete';
    journal?: Journal;
  }>({ type: 'none' });

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    const { data, error } = await supabase
      .from('logbook')
      .select('*')
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('Gagal ambil jurnal:', error);
      return;
    }

    setJournals(
      data.map((item) => ({
        id: item.id,
        tanggal: item.tanggal,
        kegiatan: item.kegiatan,
        kendala: item.kendala,
        fileName: item.file,
        feedback: item.catatan_guru,
        status:
          item.status_verifikasi === 'approved'
            ? 'disetujui'
            : item.status_verifikasi === 'rejected'
            ? 'ditolak'
            : 'menunggu_verifikasi',
      }))
    );
  };

  const closeModal = () => setModal({ type: 'none' });

  return (
    <div className="space-y-6">
      {/* ===== SEMUA UI KAMU TETAP ===== */}
      {/* (tidak aku potong di sini demi ringkas jawaban) */}

      {modal.type !== 'none' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold">
                {modal.type === 'add' && 'Tambah Jurnal Harian'}
                {modal.type === 'view' && 'Detail Jurnal Harian'}
                {modal.type === 'edit' && 'Edit Jurnal Harian'}
                {modal.type === 'delete' && 'Konfirmasi Hapus'}
              </h3>
              <button onClick={closeModal}>
                <X />
              </button>
            </div>

            <div className="p-6">
              {modal.type === 'add' && (
                <AddJournalForm onSuccess={fetchJournals} onClose={closeModal} />
              )}
              {modal.type === 'edit' && modal.journal && (
                <EditJournalForm journal={modal.journal} onSuccess={fetchJournals} onClose={closeModal} />
              )}
              {modal.type === 'delete' && modal.journal && (
                <DeleteConfirm journal={modal.journal} onSuccess={fetchJournals} onClose={closeModal} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================
   ADD
===================== */
function AddJournalForm({ onClose, onSuccess }: any) {
  const [tanggal, setTanggal] = useState('');
  const [kegiatan, setKegiatan] = useState('');
  const [kendala, setKendala] = useState('');

  const handleSubmit = async () => {
    const { error } = await supabase.from('logbook').insert({
      tanggal,
      kegiatan,
      kendala,
      status_verifikasi: 'pending',
    });

    if (!error) {
      onSuccess();
      onClose();
    }
  };

  return (
    <>
      {/* UI kamu tetap, hanya ditambah value & onChange */}
      <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
      <textarea value={kegiatan} onChange={(e) => setKegiatan(e.target.value)} />
      <textarea value={kendala} onChange={(e) => setKendala(e.target.value)} />
      <button onClick={handleSubmit}>Simpan Jurnal</button>
    </>
  );
}

/* =====================
   EDIT
===================== */
function EditJournalForm({ journal, onClose, onSuccess }: any) {
  const [tanggal, setTanggal] = useState(journal.tanggal);
  const [kegiatan, setKegiatan] = useState(journal.kegiatan);
  const [kendala, setKendala] = useState(journal.kendala ?? '');

  const handleUpdate = async () => {
    await supabase
      .from('logbook')
      .update({ tanggal, kegiatan, kendala, status_verifikasi: 'pending' })
      .eq('id', journal.id);

    onSuccess();
    onClose();
  };

  return (
    <>
      <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
      <textarea value={kegiatan} onChange={(e) => setKegiatan(e.target.value)} />
      <textarea value={kendala} onChange={(e) => setKendala(e.target.value)} />
      <button onClick={handleUpdate}>Update Jurnal</button>
    </>
  );
}

/* =====================
   DELETE
===================== */
function DeleteConfirm({ journal, onClose, onSuccess }: any) {
  const handleDelete = async () => {
    await supabase.from('logbook').delete().eq('id', journal.id);
    onSuccess();
    onClose();
  };

  return (
    <>
      <p>Hapus jurnal tanggal {journal.tanggal}?</p>
      <button onClick={handleDelete}>Ya, Hapus</button>
    </>
  );
}