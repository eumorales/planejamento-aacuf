"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, CheckCircle, RefreshCw, Calendar, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { updateTask, deleteTask, completeTask, reactivateTask } from "@/lib/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

export function AdminTaskItem({ task }: { task: Task }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [formData, setFormData] = useState({
    name: task.name,
    title: task.title,
    notes: task.notes,
    sector: task.sector,
    dueDate: new Date(task.dueDate).toISOString().split("T")[0],
    status: task.status,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await deleteTask(task._id)
      setShowDeleteAlert(false)
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const dueDate = new Date(formData.dueDate)
      dueDate.setHours(12, 0, 0, 0) 

      await updateTask(task._id, {
        name: formData.name,
        title: formData.title,
        notes: formData.notes,
        sector: formData.sector,
        dueDate: dueDate,
        status: formData.status as "active" | "expired" | "completed",
      })

      setIsOpen(false)
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReactivate = async () => {
    setIsUpdating(true)

    try {
      await reactivateTask(task._id)
    } catch (error) {
      console.error("Erro ao reativar tarefa:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleComplete = async () => {
    setIsUpdating(true)

    try {
      await completeTask(task._id)
    } catch (error) {
      console.error("Erro ao completar tarefa:", error)
    } finally {
      setIsUpdating(false)
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

  const isDateValid = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate >= today
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">{task.title}</h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{task.sector}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.dueDate)}</span>
              <Clock className="h-3 w-3 ml-2" />
              <span>{daysRemaining()}</span>
            </div>
            <p className="text-sm mt-2">{task.responsible ? `Responsável: ${task.responsible}` : "Sem responsável"}</p>
          </div>
          <div className="flex gap-1">
            {task.status === "active" && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleComplete}
                disabled={isUpdating}
                className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                title="Marcar como concluída"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            {task.status === "expired" && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleReactivate}
                disabled={isUpdating || !isDateValid()}
                className={`h-8 w-8 ${
                  isDateValid()
                    ? "text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                title={isDateValid() ? "Reativar tarefa" : "Data de vencimento inválida"}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                  title="Editar tarefa"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Tarefa</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Título</Label>
                    <Input id="edit-title" name="title" value={formData.title} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-notes">Descrição</Label>
                    <Textarea
                      id="edit-notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-sector">Setor</Label>
                      <Select
                        value={formData.sector}
                        onValueChange={(value) => handleSelectChange("sector", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um setor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Esportes">Esportes</SelectItem>
                          <SelectItem value="Eventos">Eventos</SelectItem>
                          <SelectItem value="Financeiro">Financeiro</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Produtos">Produtos</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange("status", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativa</SelectItem>
                          <SelectItem value="expired">Expirada</SelectItem>
                          <SelectItem value="completed">Concluída</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-dueDate">Data de Vencimento</Label>
                    <Input
                      id="edit-dueDate"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {task.responsible && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p className="text-sm">
                        <span className="font-medium">Responsável:</span> {task.responsible}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        O responsável não pode ser alterado através da edição.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="destructive" onClick={() => setShowDeleteAlert(true)}>
                      Excluir
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  title="Excluir tarefa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Tarefa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
