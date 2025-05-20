import { getTasks } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, CheckCircle, AlertTriangle, Clock } from "lucide-react"

type User = {
  id?: string
  username: string
  name?: string
  role: string
  sector?: string
}

export async function DashboardStats({ user }: { user?: User }) {
  const tasks = await getTasks()

  const activeTasks = tasks.filter((task) => task.status === "active").length
  const expiredTasks = tasks.filter((task) => task.status === "expired").length
  const completedTasks = tasks.filter((task) => task.status === "completed").length

  const userSectorTasks = user?.sector ? tasks.filter((task) => task.sector === user.sector).length : 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const tasksDueToday = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() === today.getTime() && task.status === "active"
  }).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow border-t-2 border-t-blue-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Tarefas Ativas</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTasks}</div>
          <p className="text-xs text-muted-foreground">{activeTasks === 1 ? "Tarefa pendente" : "Tarefas pendentes"}</p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow border-t-2 border-t-red-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Tarefas Expiradas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{expiredTasks}</div>
          <p className="text-xs text-muted-foreground">
            {expiredTasks === 1 ? "Tarefa expirada" : "Tarefas expiradas"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow border-t-2 border-t-green-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks}</div>
          <p className="text-xs text-muted-foreground">
            {completedTasks === 1 ? "Tarefa finalizada" : "Tarefas finalizadas"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow border-t-2 border-t-purple-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            {user?.sector ? `Tarefas de ${user.sector}` : "Vence Hoje"}
          </CardTitle>
          <CalendarDays className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user?.sector ? userSectorTasks : tasksDueToday}</div>
          <p className="text-xs text-muted-foreground">
            {user?.sector
              ? userSectorTasks === 1
                ? "Tarefa no seu setor"
                : "Tarefas no seu setor"
              : tasksDueToday === 1
                ? "Tarefa para hoje"
                : "Tarefas para hoje"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
