"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ClientForm } from "../../../components/ClientForm"
import { toast } from "sonner"

const clientSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  company: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().optional(),
  status: z.enum(["novo", "ativo", "inativo"]),
  notes: z.string().optional(),
  tags: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

export default function NewClientPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      status: "novo",
    },
  })

  async function onSubmit(data: ClientFormData) {
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar cliente")
      }

      toast.success("Cliente criado com sucesso!")
      router.push("/clients")
    } catch (error) {
      toast.error((error as Error).message || "Erro desconhecido")
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Novo Cliente</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ClientForm register={register} errors={errors} isSubmitting={isSubmitting} />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Salvando..." : "Salvar Cliente"}
          </button>
        </div>
      </form>
    </div>
  )
}