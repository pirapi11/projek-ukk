import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Magang, StatusMagang } from "../types";

export function useMagang() {
  const [data, setData] = useState<Magang[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMagang();
  }, []);

  async function fetchMagang() {
    setLoading(true);

    const { data, error, count } = await supabase
      .from("magang")
      .select(
        `
        id,
        tanggal_mulai,
        tanggal_selesai,
        status,
        nilai_akhir,
        siswa:siswa_id (id, nama, nis, jurusan, kelas),
        guru:guru_id (id, nama, nip),
        dudi:dudi_id (id, nama_perusahaan, alamat)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      // 🔥 TRANSFORM ARRAY → OBJECT (INI YANG HILANG)
      const transformed: Magang[] = data.map((row: any) => ({
        id: row.id,
        tanggal_mulai: row.tanggal_mulai,
        tanggal_selesai: row.tanggal_selesai,
        status: row.status,
        nilai_akhir: row.nilai_akhir,

        siswa: row.siswa?.[0] ?? null,
        guru: row.guru?.[0] ?? null,
        dudi: row.dudi?.[0] ?? null,
      }));

      setData(transformed);
      setTotal(count || 0);
    }

    setLoading(false);
  }

  async function updateStatus(id: number, status: StatusMagang) {
    await supabase.from("magang").update({ status }).eq("id", id);
    await fetchMagang();
  }

  return {
    data,
    total,
    loading,
    refetch: fetchMagang,
    updateStatus,
  };
}