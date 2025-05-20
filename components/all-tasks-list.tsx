import { getTasks } from "@/lib/actions"
import { TaskCard } from "@/components/task-card"

type User = {
  id?: string
  username: string
  name?: string
  role: string
  sector?: string
}

export async function AllTasksList({ user }: { user?: User }) {
  const tasks = await getTasks()

  // Ordena as tarefas por data, com as mais recentes no topo
  const sortedTasks = tasks.sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime()
    const dateB = new Date(b.dueDate).getTime()
    return dateB - dateA  // Ordem decrescente
  })

  return (
    <div className="space-y-8">
      {sortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTasks.map((task) => (
            <TaskCard key={task._id.toString()} task={task} user={user} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Não há tarefas cadastradas no sistema.</p>
        </div>
      )}
    </div>
  )
}
