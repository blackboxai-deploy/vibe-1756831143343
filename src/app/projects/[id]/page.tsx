import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import TaskList from '@/components/TaskList'
import TaskForm from '@/components/TaskForm'

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      tasks: {
        orderBy: { dueDate: 'asc' },
      },
    },
  })

  if (!project) {
    notFound()
  }

  const completedTasks = project.tasks.filter((t) => t.status === 'COMPLETED').length
  const totalTasks = project.tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold">{project.name}</h2>
        <Link
          href="/projects"
          className="text-sm text-blue-600 hover:underline mt-2 sm:mt-0"
        >
          &larr; Voltar para projetos
        </Link>
      </header>

      <section className="bg-white rounded-md shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Detalhes do Projeto</h3>
        <p className="mb-2">{project.description || 'Sem descrição'}</p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
          <div>
            <dt className="font-semibold">Cliente</dt>
            <dd>{project.client?.name || 'Não associado'}</dd>
          </div>
          <div>
            <dt className="font-semibold">Status</dt>
            <dd className="capitalize">{project.status.toLowerCase().replace('_', ' ')}</dd>
          </div>
          <div>
            <dt className="font-semibold">Prioridade</dt>
            <dd className="capitalize">{project.priority.toLowerCase()}</dd>
          </div>
          <div>
            <dt className="font-semibold">Data Início</dt>
            <dd>{project.startDate ? format(project.startDate, 'dd/MM/yyyy') : '-'}</dd>
          </div>
          <div>
            <dt className="font-semibold">Data Final Prevista</dt>
            <dd>{project.dueDate ? format(project.dueDate, 'dd/MM/yyyy') : '-'}</dd>
          </div>
          <div>
            <dt className="font-semibold">Progresso</dt>
            <dd>{progress}% concluído</dd>
          </div>
        </dl>
      </section>

      <section className="bg-white rounded-md shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Tarefas do Projeto</h3>
        <TaskList tasks={project.tasks} projectId={project.id} />
        <div className="mt-6">
          <TaskForm projectId={project.id} />
        </div>
      </section>
    </div>
  )
}