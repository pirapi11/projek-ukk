"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

export default function Page() {
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-xl font-semibold text-gray-800 mb-6">
        Manajemen Siswa Magang
      </h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          ["Total Siswa", "6", "Siswa magang terdaftar"],
          ["Aktif", "3", "Sedang magang"],
          ["Selesai", "2", "Magang selesai"],
          ["Pending", "1", "Menunggu penempatan"],
        ].map((i, idx) => (
          <div key={idx} className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">{i[0]}</p>
            <p className="text-2xl font-semibold">{i[1]}</p>
            <p className="text-xs text-gray-400">{i[2]}</p>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border">
        <div className="p-5 border-b flex justify-between items-center">
          <p className="font-semibold">Daftar Siswa Magang</p>
          <button
            onClick={() => setOpenTambah(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            <Plus size={16} /> Tambah
          </button>
        </div>

        {/* FILTER */}
        <div className="p-5 flex justify-between">
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                className="pl-9 pr-3 py-2 border rounded-lg text-sm w-[260px]"
                placeholder="Cari siswa, guru, atau DUDI..."
              />
            </div>
            <button className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm">
              <Filter size={16} /> Filter <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* TABLE CONTENT */}
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-5 py-3 text-left">Siswa</th>
              <th className="px-5 py-3 text-left">Guru</th>
              <th className="px-5 py-3 text-left">DUDI</th>
              <th className="px-5 py-3 text-left">Periode</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-5 py-4 font-medium">Ahmad Rizki</td>
              <td className="px-5 py-4">Pak Suryanto</td>
              <td className="px-5 py-4">PT Kreatif Teknologi</td>
              <td className="px-5 py-4">1 Feb – 30 Mei 2024</td>
              <td className="px-5 py-4">
                <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                  Aktif
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setOpenEdit(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setOpenDelete(true)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                    >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="p-5 flex justify-between text-sm text-gray-500">
          <p>Menampilkan 1 sampai 1 dari 6 entri</p>
          <div className="flex gap-2">
            <button className="p-2 border rounded-lg">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">
              1
            </button>
            <button className="p-2 border rounded-lg">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL TAMBAH ================= */}
      {openTambah && (
        <Modal title="Tambah Data Siswa Magang" onClose={() => setOpenTambah(false)}>
          <FormTambah />
        </Modal>
      )}

      {/* ================= MODAL EDIT ================= */}
      {openEdit && (
        <Modal title="Edit Data Siswa Magang" onClose={() => setOpenEdit(false)}>
          <FormEdit />
        </Modal>
      )}

      {openDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-[360px] rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-2">
                Konfirmasi Hapus
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Apakah Anda yakin ingin menghapus jurnal ini?
                Aksi ini tidak bisa dibatalkan.
            </p>

            <div className="flex justify-end gap-3">
                <button
                onClick={() => setOpenDelete(false)}
                className="px-4 py-2 border rounded-lg text-sm"
                >
                Batal
                </button>
                <button
                onClick={() => {
                    // TODO: panggil fungsi delete di sini
                    setOpenDelete(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                Ya, Hapus
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
}

/* ================= MODAL WRAPPER ================= */
function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[720px] rounded-xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b flex justify-between items-center">
          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-xs text-gray-500">
              Masukkan informasi data magang siswa
            </p>
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ================= FORM TAMBAH ================= */
function FormTambah() {
  return (
    <>
      <Section title="Siswa & Pembimbing">
        <Select label="Siswa" />
        <Select label="Guru Pembimbing" />
      </Section>

      <Section title="Tempat Magang">
        <Select label="Dunia Usaha / Dunia Industri" />
      </Section>

      <Section title="Periode & Status" grid>
        <Input label="Tanggal Mulai" type="date" />
        <Input label="Tanggal Selesai" type="date" />
        <Select label="Status" />
      </Section>

      <Footer action="Simpan" />
    </>
  );
}

/* ================= FORM EDIT ================= */
function FormEdit() {
  return (
    <>
      <Section title="Periode & Status" grid>
        <Input label="Tanggal Mulai" type="date" />
        <Input label="Tanggal Selesai" type="date" />
        <Select label="Status" />
      </Section>

      <Section title="Penilaian">
        <Input
          label="Nilai Akhir"
          placeholder="Hanya bisa diisi jika status selesai"
          disabled
        />
        <p className="text-xs text-gray-400 mt-1">
          Nilai hanya dapat diisi setelah status magang selesai
        </p>
      </Section>

      <Footer action="Update" />
    </>
  );
}

/* ================= UI PARTS ================= */
function Section({ title, children, grid = false }: any) {
  return (
    <div className="mb-6">
      <p className="font-medium mb-3">{title}</p>
      <div className={grid ? "grid grid-cols-3 gap-4" : "grid grid-cols-2 gap-4"}>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        {...props}
        className="mt-1 w-full border rounded-lg px-3 py-2 text-sm disabled:bg-gray-100"
      />
    </div>
  );
}

function Select({ label }: any) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <select className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
        <option>Pilih {label}</option>
      </select>
    </div>
  );
}

function Footer({ action }: any) {
  return (
    <div className="flex justify-end gap-3 border-t pt-4">
      <button className="px-4 py-2 border rounded-lg text-sm">
        Batal
      </button>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
        {action}
      </button>
    </div>
  );
}