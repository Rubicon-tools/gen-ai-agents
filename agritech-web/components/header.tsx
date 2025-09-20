"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, User } from "lucide-react"
import { NewsletterModal } from "./newsletter-modal"

export function Header() {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false)

  return (
    <>
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-foreground rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-balance">Votre portail unique vers l'innovation agricole</h1>
                <p className="text-primary-foreground/80">Bienvenue Badr</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setIsNewsletterOpen(true)}
              >
                S'inscrire à la newsletter
              </Button>
              <Bell className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      <NewsletterModal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />
    </>
  )
}
