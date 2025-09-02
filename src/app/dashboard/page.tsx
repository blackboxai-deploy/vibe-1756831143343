"use client"

import { useEffect, useState } from "react"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { ClientList } from "@/components/ClientList"
import { ProjectList } from "@/components/ProjectList"
import { TaskList } from "@/components/TaskList"

type DashboardData = {
  totalClients: number
  activeClients: number
  totalProjects: number
  openProjects: number
  totalTasks: number
  pendingTasks: number
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard")
        if (!res.ok) throw new Error("Failed to fetch dashboard data")
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) return <p>Carregando dashboard...</p>
  if (!data) return <p>Erro ao carregar dados do dashboard.</p>

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Clientes</h3>
          <p>Total: <span className="font-bold">{data.totalClients}</span></p>
          <p>Ativos: <span className="font-bold">{data.activeClients}</span></p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Projetos</h3>
          <p>Total: <span className="font-bold">{data.totalProjects}</span></p>
          <p>Em andamento: <span className="font-bold">{data.openProjects}</span></p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Tarefas</h3>
          <p>Total: <span className="font-bold">{data.totalTasks}</span></p>
          <p>Pendentes: <span className="font-bold">{data.pendingTasks}</span></p>
        </div>
      </section>
    </div>
  )
}