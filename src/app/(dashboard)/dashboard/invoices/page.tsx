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
import { deleteInvoice } from "@/actions/invoice"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: { project: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Invoices</h1>
        <Button asChild size="sm">
            <Link href="/dashboard/invoices/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Invoice
            </Link>
        </Button>
      </div>
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        No invoices found.
                    </TableCell>
                </TableRow>
            ) : invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.project.title}</TableCell>
                <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                <TableCell>
                    <Badge variant={invoice.status === 'PAID' ? 'default' : (invoice.status === 'OVERDUE' ? 'destructive' : 'secondary')}>
                        {invoice.status}
                    </Badge>
                </TableCell>
                <TableCell>
                    {invoice.dueDate ? format(invoice.dueDate, 'MMM d, yyyy') : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </Button>
                        <form action={async () => {
                            "use server"
                            await deleteInvoice(invoice.id)
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
