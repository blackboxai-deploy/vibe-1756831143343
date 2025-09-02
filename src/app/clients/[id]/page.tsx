import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ClientForm from '@/components/ClientForm'

interface ClientPageProps {
  params: {
    id: string
  }
}

export default async function ClientPage({ params }: ClientPageProps) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
  })

  if (!client) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow">
      <h2 className="text-2xl font-semibold mb-4">Editar Cliente</h2>
      <ClientForm client={client} />
    </div>
  )
}