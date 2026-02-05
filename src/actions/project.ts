"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { auth } from "@/auth"

const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]),
  budget: z.coerce.number().min(0).optional(),
  clientId: z.string().min(1, "Client is required"),
})

export async function createProject(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
    budget: formData.get("budget"),
    clientId: formData.get("clientId"),
  }

  const validatedFields = ProjectSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await prisma.project.create({
      data: validatedFields.data,
    })
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Project.",
    }
  }

  revalidatePath("/dashboard/projects")
  redirect("/dashboard/projects")
}

export async function updateProject(id: string, formData: FormData) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")
  
    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status"),
      budget: formData.get("budget"),
      clientId: formData.get("clientId"),
    }
  
    const validatedFields = ProjectSchema.safeParse(rawData)
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }
  
    try {
      await prisma.project.update({
        where: { id },
        data: validatedFields.data,
      })
    } catch (error) {
      return {
        message: "Database Error: Failed to Update Project.",
      }
    }
  
    revalidatePath("/dashboard/projects")
    redirect("/dashboard/projects")
  }

export async function deleteProject(id: string) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  try {
    await prisma.project.delete({
      where: { id },
    })
    revalidatePath("/dashboard/projects")
    return { message: "Deleted Project." }
  } catch (error) {
    return { message: "Database Error: Failed to Delete Project." }
  }
}
