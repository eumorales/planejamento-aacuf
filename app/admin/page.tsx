import { Suspense } from "react"
import { AdminHeader } from "@/components/admin-header"
import { AdminTaskList } from "@/components/admin-task-list"
import { CreateTaskForm } from "@/components/create-task-form"
import { AdminStats } from "@/components/admin-stats"
import { updateExpiredTasks, requireAdmin } from "@/lib/actions"
import { Plus, ListTodo } from "lucide-react"

export default async function AdminPage() {

  const user = await requireAdmin()

  await updateExpiredTasks()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AdminHeader user={user} />
      <main className="container mx-auto py-6 px-4">
        <AdminStats />
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-gray-100 dark:bg-gray-800 p-2 mr-2 border-l-2 border-green-500">
                <Plus className="text-green-500 dark:text-green-400" />
              </span>
              Criar Nova Tarefa
            </h2>
            <CreateTaskForm />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-gray-100 dark:bg-gray-800 p-2 mr-2 border-l-2 border-gray-500">
                <ListTodo className="text-gray-500 dark:text-gray-400" />
              </span>
              Gerenciar Tarefas
            </h2>
            <Suspense fallback={<div className="p-8 text-center">Carregando tarefas...</div>}>
              <AdminTaskList />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
