"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from "react"
import { prisma } from "@/lib/prisma"
import { Client } from "@prisma/client"
import { toast } from "sonner"

const projectSchema = z.object({
  name: z.string().min(3, "Nome do projeto deve ter ao menos 3 caracteres"),
  description: z.string().optional(),
  clientId: z.string().min(1, "Cliente é obrigatório"),
  status: z.enum(["planejamento", "andamento", "pausado", "concluido"]),
  priority: z.enum(["baixa", "media", "alta"]),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

export default function NewProjectPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(true)

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/clients")
        if (!res.ok) throw new Error("Erro ao carregar clientes")
        const data = await res.json()
        setClients(data)
      } catch (error) {
        toast.error("Erro ao carregar clientes")
      } finally {
        setLoadingClients(false)
      }
    }
    fetchClients()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: "planejamento",
      priority: "media",
    },
  })

  async function onSubmit(data: ProjectFormData) {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Erro ao criar projeto")
      toast.success("Projeto criado com sucesso")
      router.push("/projects")
    } catch (error) {
      toast.error("Erro ao criar projeto")
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Novo Projeto</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Nome do Projeto <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring ${
              errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="clientId" className="block font-medium mb-1">
            Cliente <span className="text-red-500">*</span>
          </label>
          {loadingClients ? (
            <p>Carregando clientes...</p>
          ) : (
            <select
              id="clientId"
              {...register("clientId")}
              className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring ${
                errors.clientId ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.company}
                </option>
              ))}
            </select>
          )}
          {errors.clientId && <p className="text-red-600 text-sm mt-1">{errors.clientId.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block font-medium mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              {...register("status")}
              className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring ${
                errors.status ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="planejamento">Planejamento</option>
              <option value="andamento">Em andamento</option>
              <option value="pausado">Pausado</option>
              <option value="concluido">Concluído</option>
            </select>
            {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>}
          </div>

          <div>
            <label htmlFor="priority" className="block font-medium mb-1">
              Prioridade <span className="text-red-500">*</span>
            </label>
            <select
              id="priority"
              {...register("priority")}
              className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring ${
                errors.priority ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            {errors.priority && <p className="text-red-600 text-sm mt-1">{errors.priority.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block font-medium mb-1">
              Data de Início
            </label>
            <input
              id="startDate"
              type="date"
              {...register("startDate")}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block font-medium mb-1">
              Data Final Prevista
            </label>
            <input
              id="dueDate"
              type="date"
              {...register("dueDate")}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50`}
          >
            {isSubmitting ? "Salvando..." : "Criar Projeto"}
          </button>
        </div>
      </form>
    </div>
  )
}