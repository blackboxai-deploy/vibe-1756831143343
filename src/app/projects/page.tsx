"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Client, Project } from "@prisma/client"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { ProjectList } from "@/components/ProjectList"
import { prisma } from "@/lib/prisma"

interface ProjectWithClient extends Project {
  client: Client | null
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithClient[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  async function fetchProjects() {
    setLoading(true)
    try {
      const res = await fetch("/api/projects")
      if (!res.ok) throw new Error("Erro ao carregar projetos")
      const data: ProjectWithClient[] = await res.json()
      setProjects(data)
    } catch (error) {
      toast.error(String(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao excluir projeto")
      toast.success("Projeto excluído com sucesso")
      fetchProjects()
    } catch (error) {
      toast.error(String(error))
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Projetos</h2>
        <Link href="/projects/new">
          <Button>+ Novo Projeto</Button>
        </Link>
      </div>

      {loading ? (
        <p>Carregando projetos...</p>
      ) : projects.length === 0 ? (
        <p>Nenhum projeto encontrado.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Nome</th>
              <th className="border border-gray-300 p-2 text-left">Cliente</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              <th className="border border-gray-300 p-2 text-left">Prioridade</th>
              <th className="border border-gray-300 p-2 text-left">Início</th>
              <th className="border border-gray-300 p-2 text-left">Prazo</th>
              <th className="border border-gray-300 p-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline">
                    {project.name}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2">{project.client?.name || "—"}</td>
                <td className="border border-gray-300 p-2 capitalize">{project.status}</td>
                <td className="border border-gray-300 p-2 capitalize">{project.priority}</td>
                <td className="border border-gray-300 p-2">
                  {project.startDate ? format(new Date(project.startDate), "dd/MM/yyyy") : "—"}
                </td>
                <td className="border border-gray-300 p-2">
                  {project.dueDate ? format(new Date(project.dueDate), "dd/MM/yyyy") : "—"}
                </td>
                <td className="border border-gray-300 p-2 text-center space-x-2">
                  <Link href={`/projects/${project.id}`}>
                    <Button variant="outline" size="sm">Editar</Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}