import { ProjectForm } from "@/components/projects/project-form"
import prisma from "@/lib/prisma"

export default async function NewProjectPage() {
  const clients = await prisma.client.findMany({ select: { id: true, name: true } })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">New Project</h1>
      <div className="rounded-lg border p-4 shadow-sm">
        <ProjectForm clients={clients} />
      </div>
    </div>
  )
}
