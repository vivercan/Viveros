"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, signOut } from "@/lib/supabase/auth"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const { user, profile } = await getCurrentUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      setUser({ ...user, profile })
      setLoading(false)
    }

    loadUser()
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">FX27 CRM</h1>
        </div>

        <nav className="space-y-2">
          <a href="/dashboard" className="block px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
            Dashboard
          </a>
          <a href="/dashboard/leads" className="block px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
            Leads
          </a>
          <a href="/dashboard/opportunities" className="block px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
            Oportunidades
          </a>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.profile?.full_name || user?.email}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{user?.profile?.role || "Usuario"}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Cerrar Sesion
          </Button>
        </div>
      </aside>

      <main className="ml-64 p-8">{children}</main>
    </div>
  )
}
