import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle, Pencil, Trash } from "lucide-react"
import prisma from "@/lib/prisma"
import { deleteProject } from "@/actions/project"
import { Badge } from "@/components/ui/badge"

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { client: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Projects</h1>
        <Button asChild size="sm">
            <Link href="/dashboard/projects/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
            </Link>
        </Button>
      </div>
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        No projects found.
                    </TableCell>
                </TableRow>
            ) : projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{project.client.name}</TableCell>
                <TableCell>
                    <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {project.status}
                    </Badge>
                </TableCell>
                <TableCell>${project.budget?.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/projects/${project.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </Button>
                        <form action={async () => {
                            "use server"
                            await deleteProject(project.id)
                        }}>
                             <Button variant="ghost" size="icon" type="submit">
                                <Trash className="h-4 w-4 text-destructive" />
                             </Button>
                        </form>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
