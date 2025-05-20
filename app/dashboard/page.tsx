import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { AllTasksList } from "@/components/all-tasks-list"
import { UserTasksList } from "@/components/user-tasks-list"
import { AvailableTasksList } from "@/components/available-tasks-list"
import { DashboardStats } from "@/components/dashboard-stats"
import { updateExpiredTasks, requireAuth } from "@/lib/actions"
import { ClipboardList, Users, CheckSquare } from "lucide-react"

export default async function DashboardPage() {

  const user = await requireAuth()

  await updateExpiredTasks()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DashboardHeader user={user} />
      <main className="container mx-auto py-6 px-4">
        <DashboardStats user={user} />

        <UserTasksSection user={user} />
        <AvailableTasksSection user={user} />

        <h1 className="text-2xl font-bold mb-6 mt-12 flex items-center">
          <span className="bg-gray-100 dark:bg-gray-800 p-2 mr-2 border-l-2 border-gray-500">
            <Users className="text-gray-500 dark:text-gray-400" />
          </span>
          Todas as Tarefas
        </h1>
        <Suspense fallback={<div className="p-8 text-center">Carregando tarefas...</div>}>
          <AllTasksList user={user} />
        </Suspense>
      </main>
    </div>
  )
}

function UserTasksSection({ user }: { user?: any }) {
  return (
    <Suspense fallback={null}>
      <UserTasksSectionContent user={user} />
    </Suspense>
  )
}

async function UserTasksSectionContent({ user }: { user?: any }) {
  const tasks = await getTasks()

  const hasUserTasks = tasks.some(
    (task) =>
      (task.responsible === user?.name || task.responsible === user?.username) &&
      task.responsible !== undefined &&
      task.responsible !== "",
  )

  if (!hasUserTasks) return null

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 mt-8 flex items-center">
        <span className="bg-gray-100 dark:bg-gray-800 p-2 mr-2 border-l-2 border-gray-500">
          <ClipboardList className="text-gray-500 dark:text-gray-400" />
        </span>
        Suas Tarefas
      </h1>
      <UserTasksList user={user} />
    </>
  )
}

function AvailableTasksSection({ user }: { user?: any }) {
  return (
    <Suspense fallback={null}>
      <AvailableTasksSectionContent user={user} />
    </Suspense>
  )
}

async function AvailableTasksSectionContent({ user }: { user?: any }) {
  const tasks = await getTasks()

  const hasAvailableTasks = tasks.some((task) => !task.responsible && task.status === "active")

  if (!hasAvailableTasks) return null

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 mt-12 flex items-center">
        <span className="bg-gray-100 dark:bg-gray-800 p-2 mr-2 border-l-2 border-gray-500">
          <CheckSquare className="text-gray-500 dark:text-gray-400" />
        </span>
        Tarefas Disponíveis
      </h1>
      <AvailableTasksList user={user} />
    </>
  )
}

async function getTasks() {
  const { getTasks } = await import("@/lib/actions")
  return getTasks()
}
