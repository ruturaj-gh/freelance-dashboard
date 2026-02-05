import { InvoiceForm } from "@/components/invoices/invoice-form"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id }
  })

  if (!invoice) {
    notFound()
  }

  const projects = await prisma.project.findMany({ select: { id: true, title: true } })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">Edit Invoice</h1>
      <div className="rounded-lg border p-4 shadow-sm">
        <InvoiceForm invoice={invoice} projects={projects} />
      </div>
    </div>
  )
}
