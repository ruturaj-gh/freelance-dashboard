"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createInvoice, updateInvoice } from "@/actions/invoice"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { format } from "date-fns"

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  status: z.enum(["PENDING", "PAID", "OVERDUE"]),
  dueDate: z.string().optional(),
  projectId: z.string().min(1, "Project is required"),
})

interface InvoiceFormProps {
    invoice?: {
        id: string
        amount: number
        status: string
        dueDate: Date | null
        projectId: string
    }
    projects: { id: string; title: string }[]
}

export function InvoiceForm({ invoice, projects }: InvoiceFormProps) {
  const [loading, setLoading] = useState(false)

  // Format date to YYYY-MM-DD for input type="date"
  const defaultDate = invoice?.dueDate ? format(invoice.dueDate, 'yyyy-MM-dd') : ''

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: invoice?.amount?.toString() || "",
      status: (invoice?.status as "PENDING" | "PAID" | "OVERDUE") || "PENDING",
      dueDate: defaultDate,
      projectId: invoice?.projectId || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    const formData = new FormData()
    formData.append("amount", values.amount)
    formData.append("status", values.status)
    if (values.dueDate) formData.append("dueDate", values.dueDate)
    formData.append("projectId", values.projectId)

    if (invoice) {
        await updateInvoice(invoice.id, formData)
    } else {
        await createInvoice(formData)
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
        
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
             <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Amount ($)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="1000" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : (invoice ? "Update Invoice" : "Create Invoice")}
        </Button>
      </form>
    </Form>
  )
}
