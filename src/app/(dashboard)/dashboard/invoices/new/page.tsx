import { InvoiceForm } from "@/components/invoices/invoice-form"
import prisma from "@/lib/prisma"

export default async function NewInvoicePage() {
  const projects = await prisma.project.findMany({ select: { id: true, title: true } })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">New Invoice</h1>
      <div className="rounded-lg border p-4 shadow-sm">
        <InvoiceForm projects={projects} />
      </div>
    </div>
  )
}
