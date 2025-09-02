import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        client: true,
        tasks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar projetos.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const {
      name,
      description,
      clientId,
      status = 'planning',
      priority = 'medium',
      startDate,
      dueDate,
    } = data

    if (!name || !clientId) {
      return NextResponse.json({ error: 'Nome e cliente são obrigatórios.' }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        clientId,
        status,
        priority,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar projeto.' }, { status: 500 })
  }
}