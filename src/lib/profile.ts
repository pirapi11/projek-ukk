import { createBrowserClient } from '@supabase/ssr'

function getBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
export async function isSiswaProfileComplete() {
  const supabase = getBrowserClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('siswa')
    .select('nis, kelas, jurusan, alamat, telepon')
    .eq('user_id', user.id)
    .single()

  if (error || !data) return false

  return !!(
    data.nis?.trim() &&
    data.kelas?.trim() &&
    data.jurusan?.trim() &&
    data.alamat?.trim() &&
    data.telepon?.trim()
  )
}

export async function getSiswaProfile() {
  const supabase = getBrowserClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('siswa')
    .select('id, nama, nis, kelas, jurusan, alamat, telepon')
    .eq('user_id', user.id)
    .single()

  return data
}