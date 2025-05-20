import { AdminHeader } from "@/components/admin-header"
import { UserManagement } from "@/components/user-management"
import { requireAdmin } from "@/lib/actions"
import { Users } from "lucide-react"

export default async function UsersPage() {

  const user = await requireAdmin()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AdminHeader user={user} />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <span className="bg-gray-100 dark:bg-gray-800 p-2 mr-2 border-l-2 border-gray-500">
            <Users className="text-gray-500 dark:text-gray-400" />
          </span>
          Gerenciar Usuários
        </h1>
        <UserManagement />
      </main>
    </div>
  )
}
