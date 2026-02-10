import {StatusBadge} from "./StatusBadge";
import { Magang, StatusMagang } from "../types";

export default function MagangTable({
  data,
  onChangeStatus,
}: {
  data: Magang[];
  onChangeStatus: (id: number, status: StatusMagang) => void;
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="px-4 py-2 text-left">Siswa</th>
          <th className="px-4 py-2">DUDI</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="border-b">
            <td className="px-4 py-2">{item.siswa?.nama || "-"}</td>
            <td className="px-4 py-2">{item.dudi?.nama_perusahaan || "-"}</td>
            <td className="px-4 py-2">
              <StatusBadge status={item.status} />
            </td>
            <td className="px-4 py-2">
              <select
                value={item.status}
                onChange={(e) =>
                  onChangeStatus(item.id, e.target.value as StatusMagang)
                }
                className="border rounded px-2 py-1"
              >
                <option value="pending">Pending</option>
                <option value="diterima">Diterima</option>
                <option value="berlangsung">Berlangsung</option>
                <option value="selesai">Selesai</option>
                <option value="ditolak">Ditolak</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
