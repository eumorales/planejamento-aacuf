import { getTasks } from "@/lib/actions"
import { TaskCard } from "@/components/task-card"

type User = {
  id?: string
  username: string
  name?: string
  role: string
  sector?: string
}

export async function AvailableTasksList({ user }: { user?: User }) {
  const tasks = await getTasks()

  const availableTasks = tasks.filter((task) => !task.responsible && task.status === "active")

  if (availableTasks.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {availableTasks.map((task) => (
        <TaskCard key={task._id.toString()} task={task} user={user} />
      ))}
    </div>
  )
}
