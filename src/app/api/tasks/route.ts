import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: {
          select: {
            id: true,
            name: true,
            clientId: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    })
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar tarefas.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const {
      title,
      description,
      projectId,
      assignedToId,
      priority,
      status,
      dueDate,
    } = data

    if (!title || !projectId) {
      return NextResponse.json(
        { error: 'Título e projeto são obrigatórios.' },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        projectId,
        assignedToId: assignedToId || null,
        priority: priority || 'medium',
        status: status || 'pending',
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar tarefa.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const {
      id,
      title,
      description,
      projectId,
      assignedToId,
      priority,
      status,
      dueDate,
    } = data

    if (!id) {
      return NextResponse.json({ error: 'ID da tarefa é obrigatório.' }, { status: 400 })
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        projectId,
        assignedToId,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar tarefa.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID da tarefa é obrigatório.' }, { status: 400 })
    }

    await prisma.task.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Tarefa deletada com sucesso.' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar tarefa.' }, { status: 500 })
  }
}