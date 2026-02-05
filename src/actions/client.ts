"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { auth } from "@/auth"

const ClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
})

export async function createClient(formData: FormData) {
  const session = await auth()
  if (!session) {
      throw new Error("Unauthorized")
  }

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    notes: formData.get("notes"),
  }

  const validatedFields = ClientSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await prisma.client.create({
      data: validatedFields.data,
    })
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Client.",
    }
  }

  revalidatePath("/dashboard/clients")
  redirect("/dashboard/clients")
}

export async function updateClient(id: string, formData: FormData) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")
  
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      notes: formData.get("notes"),
    }
  
    const validatedFields = ClientSchema.safeParse(rawData)
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }
  
    try {
      await prisma.client.update({
        where: { id },
        data: validatedFields.data,
      })
    } catch (error) {
      return {
        message: "Database Error: Failed to Update Client.",
      }
    }
  
    revalidatePath("/dashboard/clients")
    redirect("/dashboard/clients")
  }

export async function deleteClient(id: string) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  try {
    await prisma.client.delete({
      where: { id },
    })
    revalidatePath("/dashboard/clients")
    return { message: "Deleted Client." }
  } catch (error) {
    return { message: "Database Error: Failed to Delete Client." }
  }
}
