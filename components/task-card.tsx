"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { assignTask, completeTask } from "@/lib/actions"
import { Calendar, Clock, CheckCircle } from "lucide-react"

type Task = {
  _id: string
  name: string
  title: string
  notes: string
  sector: string
  dueDate: Date
  responsible?: string
  status: "active" | "expired" | "completed"
  createdAt: Date
}

type User = {
  id?: string
  username: string
  name?: string
  role: string
  sector?: string
}

export function TaskCard({ task, user }: { task: Task; user?: User }) {
  const [isAssigning, setIsAssigning] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const handleAssign = async () => {
    setIsAssigning(true)

    try {

      await assignTask(task._id, user?.name || user?.username || "Usuário")
    } catch (error) {
      console.error("Erro ao assumir tarefa:", error)
    } finally {
      setIsAssigning(false)
    }
  }

  const handleComplete = async () => {
    setIsCompleting(true)

    try {
      await completeTask(task._id)
    } catch (error) {
      console.error("Erro ao completar tarefa:", error)
    } finally {
      setIsCompleting(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  const getStatusBadge = () => {
    switch (task.status) {
      case "active":
        return <Badge className="bg-green-500 text-white border-0">Ativa</Badge>
      case "expired":
        return (
          <Badge variant="destructive" className="border-0">
            Expirada
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Concluída
          </Badge>
        )
      default:
        return null
    }
  }

  const daysRemaining = () => {
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Vencida"
    if (diffDays === 0) return "Vence hoje"
    return `${diffDays} dia${diffDays !== 1 ? "s" : ""} restante${diffDays !== 1 ? "s" : ""}`
  }

  const isAdmin = user?.role === "admin"

  const isResponsible = task.responsible === user?.name || task.responsible === user?.username

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="h-full flex flex-col overflow-hidden border-t-2 border-t-primary">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            {getStatusBadge()}
          </div>
          <CardDescription className="flex items-center gap-1 mt-1">
            <span>{task.sector}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{task.notes}</p>

          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.dueDate)}</span>
            <Clock className="h-3 w-3 ml-2" />
            <span>{daysRemaining()}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4 bg-gray-50 dark:bg-gray-800">
          <div className="text-sm">
            {task.responsible ? (
              <span>Responsável: {task.responsible}</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400">Sem responsável</span>
            )}
          </div>
          <div className="flex gap-2">
            {isResponsible && task.status === "active" && (
              <Button
                size="sm"
                onClick={handleComplete}
                disabled={isCompleting}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                {isCompleting ? "Concluindo..." : "Concluir"}
              </Button>
            )}

            {!task.responsible && task.status === "active" && !isAdmin && (
              <Button
                size="sm"
                onClick={handleAssign}
                disabled={isAssigning}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isAssigning ? "Assumindo..." : "Assumir"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
