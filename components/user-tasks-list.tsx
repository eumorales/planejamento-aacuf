import { getTasks } from "@/lib/actions"
import { TaskCard } from "@/components/task-card"

type User = {
  id?: string
  username: string
  name?: string
  role: string
  sector?: string
}

export async function UserTasksList({ user }: { user?: User }) {
  const tasks = await getTasks()

  const userTasks = tasks.filter(
    (task) =>
      (task.responsible === user?.name || task.responsible === user?.username) &&
      task.responsible !== undefined &&
      task.responsible !== "",
  )

  if (userTasks.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userTasks.map((task) => (
        <TaskCard key={task._id.toString()} task={task} user={user} />
      ))}
    </div>
  )
}
