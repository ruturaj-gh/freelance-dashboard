"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wand2 } from "lucide-react"
import { generateProjectDescription } from "@/actions/ai"

interface AiGeneratorProps {
    onGenerate: (description: string) => void
}

export function AiGenerator({ onGenerate }: AiGeneratorProps) {
  const [keywords, setKeywords] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!keywords) return
    setLoading(true)
    const description = await generateProjectDescription(keywords)
    onGenerate(description)
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-md bg-muted/20">
        <label className="text-sm font-medium text-muted-foreground">AI Description Generator</label>
        <div className="flex gap-2">
            <Input 
                placeholder="e.g. E-commerce Website, CRM System" 
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
            />
            <Button 
                type="button" 
                variant="secondary" 
                onClick={handleGenerate}
                disabled={loading || !keywords}
            >
                <Wand2 className="mr-2 h-4 w-4" />
                {loading ? "Generating..." : "Generate"}
            </Button>
        </div>
        <p className="text-xs text-muted-foreground">
            Enter a project topic to generate a structure proposal.
        </p>
    </div>
  )
}
