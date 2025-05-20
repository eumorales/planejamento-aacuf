"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AACUFLogo } from "@/components/aacuf-logo"
import { motion } from "framer-motion"
import { logout } from "@/lib/actions"
import { ArrowLeft } from "lucide-react"

type User = {
  id?: string
  username: string
  name?: string
  role: string
  sector?: string
}

export function DashboardHeader({ user }: { user?: User }) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user?.role === "admin") {
      setIsAdmin(true)
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <motion.header
      className="bg-white dark:bg-gray-800 shadow-sm border-b-2 border-gray-200 dark:border-gray-700"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
            <AACUFLogo variant="mascote" className="w-10 h-10" />
          </div>
          <div>
            <h2 className="font-bold text-xl">AACUF</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Painel da Diretoria</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <Button variant="outline" onClick={() => router.push("/admin")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar ao Painel Admin</span>
            </Button>
          )}
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
