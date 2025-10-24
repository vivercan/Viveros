"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/supabase/auth"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const { user } = await getCurrentUser()
      
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirigiendo...</div>
    </div>
  )
}
