import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
        name: 'Credentials',
        credentials: {
          email: { label: "Email", type: "email", placeholder: "user@example.com" },
          password: { label: "Password", type: "password" }
        },
        authorize: async (credentials) => {
          // Mock authentication for demonstration purposes
          // In a real app, verify against database using bcrypt
          
          if (!credentials?.email || !credentials?.password) return null

          // Seeded Mock User or Logic to find user
          // For this CRUD demo, we will allow any login if email matches a pattern or just create a user on the fly if needed
          // But for strict CRUD, let's just use a hardcoded check or DB check.
          
          // Basic logic: If email exists in DB, check password (mocked).
          // For simplicity in this demo:
          // If email is 'admin@example.com', password 'password' -> return User
          
          if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
             const user = await prisma.user.upsert({
                where: { email: 'admin@example.com' },
                update: {},
                create: {
                    email: 'admin@example.com',
                    name: 'Admin User',
                }
             })
             return user
          }
          
          return null
        }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
        if (session.user && token.sub) {
            session.user.id = token.sub
        }
        return session
    }
  },
  pages: {
      signIn: '/login' // Custom login page
  }
})
