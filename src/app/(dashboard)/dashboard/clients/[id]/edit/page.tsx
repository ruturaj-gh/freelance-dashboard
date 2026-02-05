import { ClientForm } from "@/components/clients/client-form"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id }
  })

  if (!client) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">Edit Client</h1>
      <div className="rounded-lg border p-4 shadow-sm">
        <ClientForm client={client} />
      </div>
    </div>
  )
}
