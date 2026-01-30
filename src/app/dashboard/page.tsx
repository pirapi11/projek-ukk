import { redirect } from "next/navigation"
import { supabaseserver } from "@/lib/supabaseserver"

export default async function DashboardPage() {
  const supabase = await supabaseserver()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // belum login → ke login
  if (!user) {
    redirect("/login")
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    redirect("/login")
  }

  // redirect berdasarkan role
  redirect(`/dashboard/${profile.role}`)
}
