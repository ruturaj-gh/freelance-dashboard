"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { authenticate } from "@/actions/auth"
import { useFormStatus } from "react-dom"

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" aria-disabled={pending}>
            {pending ? "Signing in..." : "Sign in"}
        </Button>
    )
}

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleAction = async (formData: FormData) => {
    try {
      const result = await authenticate(formData);
      if (result) {
          setErrorMessage(result);
      }
    } catch (error: any) {
        console.error("Login Page Error:", error);
        // Only show error if it's not a redirect (rough check)
        if (error.message !== "NEXT_REDIRECT" && !error.message?.includes("303")) {
             setErrorMessage("An unexpected error occurred: " + error.message);
        }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <form action={handleAction} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="admin@example.com" 
                    required 
                    defaultValue="admin@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    required 
                    defaultValue="password"
                />
              </div>
              {errorMessage && (
                  <p className="text-sm text-red-500">{errorMessage}</p>
              )}
              <LoginButton />
            </form>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-center text-muted-foreground w-full">
                Use admin@example.com / password
            </p>
        </CardFooter>
      </Card>
    </div>
  )
}
