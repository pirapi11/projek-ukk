export type StatusMagang =
  | "pending"
  | "diterima"
  | "ditolak"
  | "berlangsung"
  | "selesai"
  | "dibatalkan";

export type Siswa = {
  id: number;
  nama: string;
  nis: string;
  jurusan: string;
  kelas: string;
};

export type Guru = {
  id: number;
  nama: string;
  nip: string;
};

export type Dudi = {
  id: number;
  nama_perusahaan: string;
  alamat: string;
};

export type Magang = {
  id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: StatusMagang;
  nilai_akhir?: number | null;

  siswa: Siswa | null;
  guru: Guru | null;
  dudi: Dudi | null;
};
