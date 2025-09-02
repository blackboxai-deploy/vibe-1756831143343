import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar clientes.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, company, email, phone, status, notes, tags } = data

    if (!name || !email) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios.' }, { status: 400 })
    }

    const newClient = await prisma.client.create({
      data: {
        name,
        company: company || null,
        email,
        phone: phone || null,
        status: status || 'novo',
        notes: notes || null,
        tags: tags || [],
      },
    })

    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar cliente.' }, { status: 500 })
  }
}