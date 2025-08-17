"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function N8nButton() {
  return (
    <Button className="w-full" onClick={() => window.open("https://genai.rubicon.ma/n8n/", "_blank")}>
      <ExternalLink className="mr-2 h-4 w-4" />
      Open n8n
    </Button>
  )
}
