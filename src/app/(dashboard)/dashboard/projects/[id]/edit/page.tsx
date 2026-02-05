import { ProjectForm } from "@/components/projects/project-form"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id }
  })

  if (!project) {
    notFound()
  }

  const clients = await prisma.client.findMany({ select: { id: true, name: true } })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">Edit Project</h1>
      <div className="rounded-lg border p-4 shadow-sm">
        <ProjectForm project={project} clients={clients} />
      </div>
    </div>
  )
}
