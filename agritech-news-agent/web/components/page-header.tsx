import type React from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PageHeaderProps {
  title: string
  description: string
  showBackButton?: boolean
  children?: React.ReactNode
  extra?: React.ReactNode
}

export function PageHeader({ title, description, showBackButton = true, children, extra }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
            )}
            <div>
              <h1 className="text-3xl font-bold text-foreground gradient-text">{title}</h1>
              <p className="text-muted-foreground mt-1">{description}</p>
            </div>
            {extra && <div className="ml-6">{extra}</div>}
          </div>
          {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
      </div>
    </div>
  )
}
