"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"
import { ChatWidget } from "./chat-widget"

export function GlobalFloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  if (pathname === "/chat") {
    return null
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] hover:from-[#2D6A4F] hover:to-[#40916C]"
        >
          {isOpen ? (
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          ) : (
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          )}
        </Button>
      </div>

      {/* Chat Widget Modal */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden h-full">
              <ChatWidget onClose={() => setIsOpen(false)} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
