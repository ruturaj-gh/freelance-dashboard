"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { auth } from "@/auth"

const InvoiceSchema = z.object({
  amount: z.coerce.number().min(0, "Amount must be positive"),
  status: z.enum(["PENDING", "PAID", "OVERDUE"]),
  dueDate: z.string().optional(), // Receive as string from date picker usually, convert to Date
  projectId: z.string().min(1, "Project is required"),
})

export async function createInvoice(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  // Handle Date conversion if present
  const docDate = formData.get("dueDate") as string
  
  const rawData = {
    amount: formData.get("amount"),
    status: formData.get("status"),
    projectId: formData.get("projectId"),
    dueDate: docDate || undefined, 
  }

  const validatedFields = InvoiceSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Convert dueDate string to Date object
  const dataToSave = {
      ...validatedFields.data,
      dueDate: validatedFields.data.dueDate ? new Date(validatedFields.data.dueDate) : null
  }

  try {
    await prisma.invoice.create({
      data: dataToSave,
    })
  } catch (error) {
    console.error(error)
    return {
      message: "Database Error: Failed to Create Invoice.",
    }
  }

  revalidatePath("/dashboard/invoices")
  redirect("/dashboard/invoices")
}

export async function updateInvoice(id: string, formData: FormData) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")
    
    // Handle Date conversion if present
    const docDate = formData.get("dueDate") as string

    const rawData = {
      amount: formData.get("amount"),
      status: formData.get("status"),
      projectId: formData.get("projectId"),
      dueDate: docDate || undefined,
    }
  
    const validatedFields = InvoiceSchema.safeParse(rawData)
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const dataToSave = {
        ...validatedFields.data,
        dueDate: validatedFields.data.dueDate ? new Date(validatedFields.data.dueDate) : null
    }
  
    try {
      await prisma.invoice.update({
        where: { id },
        data: dataToSave,
      })
    } catch (error) {
      return {
        message: "Database Error: Failed to Update Invoice.",
      }
    }
  
    revalidatePath("/dashboard/invoices")
    redirect("/dashboard/invoices")
  }

export async function deleteInvoice(id: string) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  try {
    await prisma.invoice.delete({
      where: { id },
    })
    revalidatePath("/dashboard/invoices")
    return { message: "Deleted Invoice." }
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." }
  }
}
