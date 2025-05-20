"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { createTask } from "@/lib/actions"
import { AlertCircle } from "lucide-react"

export function CreateTaskForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    notes: "",
    sector: "",
    dueDate: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "dueDate") {
      setError("")
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sector: value }))
  }

  const isDateValid = (dateString: string) => {
    const selectedDate = new Date(dateString)
    selectedDate.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return selectedDate >= today
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isDateValid(formData.dueDate)) {
      setError("A data de vencimento não pode ser no passado.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {

      const dueDate = new Date(formData.dueDate)
      dueDate.setHours(12, 0, 0, 0) 

      await createTask({
        name: formData.name,
        title: formData.title,
        notes: formData.notes,
        sector: formData.sector,
        dueDate: dueDate,
      })

      setFormData({
        name: "",
        title: "",
        notes: "",
        sector: "",
        dueDate: "",
      })
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Descrição</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                required
                className="border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Setor</Label>
              <Select value={formData.sector} onValueChange={handleSelectChange} required>
                <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:ring-0">
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
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-0"
              />
              {error && (
                <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Tarefa"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
