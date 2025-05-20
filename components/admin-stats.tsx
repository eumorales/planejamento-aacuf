import { getTasks, getUsers } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, AlertTriangle, Clock } from "lucide-react"

export async function AdminStats() {
  const [tasks, users] = await Promise.all([getTasks(), getUsers()])

  // Count tasks by status
  const activeTasks = tasks.filter((task) => task.status === "active").length
  const expiredTasks = tasks.filter((task) => task.status === "expired").length
  const completedTasks = tasks.filter((task) => task.status === "completed").length

  // Count users
  const totalUsers = users.length

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
          <CardTitle className="text-sm font-medium">Usuários</CardTitle>
          <Users className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            {totalUsers === 1 ? "Usuário cadastrado" : "Usuários cadastrados"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
