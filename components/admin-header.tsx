"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AACUFLogo } from "@/components/aacuf-logo"
import { motion } from "framer-motion"
import { logout } from "@/lib/actions"
import { LayoutDashboard, Users, LogOut } from "lucide-react"

type User = {
  id?: string
  username: string
  name?: string
  role: string
  sector?: string
}

export function AdminHeader({ user }: { user?: User }) {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <motion.header
      className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700"
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Painel Administrativo</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Tarefas</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/users")}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Usuários</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Painel Diretoria</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
