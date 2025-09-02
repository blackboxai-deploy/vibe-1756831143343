"use client"

import { useEffect, useState } from "react"
import { ClientList } from "@/components/ClientList"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function fetchClients() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/clients")
      if (!res.ok) throw new Error("Erro ao carregar clientes")
      const data = await res.json()
      setClients(data)
    } catch (err: any) {
      setError(err.message || "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Clientes</h2>
        <Link href="/clients/new" passHref>
          <Button>Cadastrar Cliente</Button>
        </Link>
      </header>

      {loading && <p>Carregando clientes...</p>}
      {error && <p className="text-red-600">Erro: {error}</p>}
      {!loading && !error && (
        <>
          {clients.length === 0 ? (
            <p>Nenhum cliente cadastrado.</p>
          ) : (
            <ClientList clients={clients} onRefresh={fetchClients} />
          )}
        </>
      )}
    </div>
  )
}