// hooks/useMagangSiswa.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useMagangSiswa() {
  const [magang, setMagang] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMagang() {
      try {
        // 1. Ambil user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Belum login');

        // 2. Ambil siswa.id
        const { data: siswa, error: errSiswa } = await supabase
          .from('siswa')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (errSiswa || !siswa) throw new Error('Data siswa tidak ditemukan');

        // 3. Ambil magang aktif (asumsi hanya 1)
        const { data, error: errMagang } = await supabase
          .from('magang')
          .select(`
            id,
            status,
            tanggal_mulai,
            tanggal_selesai,
            guru:guru_id (nama, nip),
            dudi:dudi_id (nama_perusahaan, alamat, telepon),
            siswa:siswa_id (nama, nis, kelas, jurusan)
          `)
          .eq('siswa_id', siswa.id)
          .eq('status', 'diterima')
          .maybeSingle();

        if (errMagang) throw errMagang;

        setMagang(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMagang();
  }, []);

  return { magang, loading, error };
}