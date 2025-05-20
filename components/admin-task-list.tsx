import { getTasks } from "@/lib/actions"
import { AdminTaskItem } from "@/components/admin-task-item"

export async function AdminTaskList() {
  const tasks = await getTasks()

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">Não há tarefas cadastradas.</p>
      </div>
    )
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = { active: 0, expired: 1, completed: 2 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      {sortedTasks.map((task) => (
        <AdminTaskItem key={task._id.toString()} task={task} />
      ))}
    </div>
  )
}
