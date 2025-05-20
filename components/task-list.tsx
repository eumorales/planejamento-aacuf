import { getTasksBySector } from "@/lib/actions"
import { TaskCard } from "@/components/task-card"

type User = {
  id?: string
  username: string
  name?: string
  role: string
  sector?: string
}

export async function TaskList({ sector, user }: { sector: string; user?: User }) {
  const tasks = await getTasksBySector(sector)

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">No momento, não há tarefas para este setor.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task._id.toString()} task={task} user={user} />
      ))}
    </div>
  )
}
