import { ClientForm } from "@/components/clients/client-form"

export default function NewClientPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">New Client</h1>
      <div className="rounded-lg border p-4 shadow-sm">
        <ClientForm />
      </div>
    </div>
  )
}
