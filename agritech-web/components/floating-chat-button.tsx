"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"
import { ChatInterface } from "./chat-interface"

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          {isOpen ? (
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          ) : (
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          )}
        </Button>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-end p-6">
          <div className="bg-background rounded-2xl shadow-2xl border max-w-md w-full max-h-[600px] overflow-hidden animate-fade-in-up">
            <ChatInterface />
          </div>
        </div>
      )}
    </>
  )
}
