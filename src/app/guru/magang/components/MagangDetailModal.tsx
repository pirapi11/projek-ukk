"use client";

import Modal from "./Modal";
import StatusBadge from "./StatusBadge";

type Status =
  | "pending"
  | "diterima"
  | "ditolak"
  | "berlangsung"
  | "selesai"
  | "dibatalkan";

type Magang = {
  nama: string;
  instansi: string;
  posisi: string;
  status: Status;
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: Magang | null;
};

export default function MagangDetailModal({
  open,
  onClose,
  data,
}: Props) {
  if (!data) return null;

  return (
    <Modal open={open} title="Detail Magang" onClose={onClose}>
      <div className="space-y-4 text-sm">
        <div>
          <p className="text-gray-500">Nama</p>
          <p className="font-medium">{data.nama}</p>
        </div>

        <div>
          <p className="text-gray-500">Instansi</p>
          <p className="font-medium">{data.instansi}</p>
        </div>

        <div>
          <p className="text-gray-500">Posisi</p>
          <p className="font-medium">{data.posisi}</p>
        </div>

        <div>
          <p className="text-gray-500 mb-1">Status</p>
          <StatusBadge status={data.status} />
        </div>
      </div>
    </Modal>
  );
}