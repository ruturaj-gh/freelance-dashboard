import { auth } from "@/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">FreelanceHub</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Manage your freelance business with ease.
      </p>
      
      {session ? (
        <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      ) : (
        <div className="flex gap-4">
            <Button asChild>
                <Link href="/api/auth/signin">Sign In</Link>
            </Button>
        </div>
      )}
    </div>
  )
}
