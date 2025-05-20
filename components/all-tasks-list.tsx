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

  const tasksBySector = tasks.reduce(
    (acc, task) => {
      if (!acc[task.sector]) {
        acc[task.sector] = []
      }
      acc[task.sector].push(task)
      return acc
    },
    {} as Record<string, typeof tasks>,
  )

  let sectors = Object.keys(tasksBySector)

  if (user?.sector && sectors.includes(user.sector)) {
    sectors = [user.sector, ...sectors.filter((sector) => sector !== user.sector)]
  }

  return (
    <div className="space-y-8">
      {sectors.map((sector) => (
        <div key={sector} className="category-section">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">{sector}</h2>
          {tasksBySector[sector].length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasksBySector[sector].map((task) => (
                <TaskCard key={task._id.toString()} task={task} user={user} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No momento, não há tarefas para este setor.</p>
            </div>
          )}
        </div>
      ))}

      {sectors.length === 0 && (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Não há tarefas cadastradas no sistema.</p>
        </div>
      )}
    </div>
  )
}
