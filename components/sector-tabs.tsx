"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

const sectors = ["Esportes", "Eventos", "Financeiro", "Marketing", "Produtos", "Outros"]

export function SectorTabs({ children }: { children: React.ReactNode[] }) {
  const [activeTab, setActiveTab] = useState("Esportes")

  return (
    <Tabs defaultValue="Esportes" onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-1">
        {sectors.map((sector, index) => (
          <TabsTrigger key={sector} value={sector} className="relative">
            {sector}
            {activeTab === sector && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {sectors.map((sector, index) => (
        <TabsContent key={sector} value={sector} className="mt-0">
          {children[index]}
        </TabsContent>
      ))}
    </Tabs>
  )
}
