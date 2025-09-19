"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, FileText, Mail, Cpu, TrendingUp, Paperclip, ImageIcon, X, History, Trash2 } from "lucide-react"

const suggestedPrompts = [
  {
    icon: FileText,
    title: "Analyser les innovations",
    description: "en agriculture de précision",
    prompt: "Quelles sont les dernières innovations en agriculture de précision qui transforment le secteur ?",
  },
  {
    icon: TrendingUp,
    title: "Tendances du marché",
    description: "AgriTech 2024-2025",
    prompt: "Analyse les principales tendances du marché AgriTech pour 2024-2025",
  },
  {
    icon: Cpu,
    title: "IA dans l'agriculture",
    description: "applications concrètes",
    prompt: "Comment l'intelligence artificielle révolutionne-t-elle les pratiques agricoles modernes ?",
  },
  {
    icon: Mail,
    title: "Opportunités d'investissement",
    description: "startups prometteuses",
    prompt: "Identifie les startups AgriTech les plus prometteuses pour les investisseurs en 2024",
  },
]

interface ChatSession {
  id: string
  title: string
  messages: Array<{ id: string; content: string; sender: "user" | "ai"; timestamp: Date }>
  createdAt: Date
  updatedAt: Date
}

interface ChatWidgetProps {
  onClose: () => void
}

export function ChatWidget({ onClose }: ChatWidgetProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<
    Array<{ id: string; content: string; sender: "user" | "ai"; timestamp: Date }>
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const savedSessions = localStorage.getItem("chat-widget-sessions")
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }))
      setChatSessions(sessions)
    }
  }, [])

  const saveSessionsToStorage = useCallback((sessions: ChatSession[]) => {
    localStorage.setItem("chat-widget-sessions", JSON.stringify(sessions))
  }, [])

  useEffect(() => {
    if (messages.length > 0 && currentSessionId) {
      const sessionTitle = messages[0]?.content.slice(0, 50) + (messages[0]?.content.length > 50 ? "..." : "")

      setChatSessions((prevSessions) => {
        const existingSession = prevSessions.find((s) => s.id === currentSessionId)
        if (!existingSession) return prevSessions

        const updatedSessions = prevSessions.map((session) =>
          session.id === currentSessionId
            ? { ...session, messages, title: sessionTitle, updatedAt: new Date() }
            : session,
        )

        setTimeout(() => saveSessionsToStorage(updatedSessions), 0)

        return updatedSessions
      })
    }
  }, [messages, currentSessionId, saveSessionsToStorage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      content: message,
      sender: "user" as const,
      timestamp: new Date(),
    }

    if (!currentSessionId) {
      const newSessionId = Date.now().toString()
      const newSession: ChatSession = {
        id: newSessionId,
        title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        messages: [userMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setChatSessions((prev) => {
        const updated = [newSession, ...prev]
        setTimeout(() => saveSessionsToStorage(updated), 0)
        return updated
      })
      setCurrentSessionId(newSessionId)
      setMessages([userMessage])
    } else {
      setMessages((prev) => [...prev, userMessage])
    }

    setMessage("")
    setIsLoading(true)

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content:
          "Je suis votre assistant IA spécialisé en AgriTech. Je peux vous aider avec des informations sur les innovations, startups, événements et tendances du secteur agricole.",
        sender: "ai" as const,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handlePromptClick = (prompt: (typeof suggestedPrompts)[0]) => {
    setMessage(prompt.prompt)
  }

  const loadChatSession = (session: ChatSession) => {
    setMessages(session.messages)
    setCurrentSessionId(session.id)
    setShowHistory(false)
  }

  const startNewChat = () => {
    setMessages([])
    setCurrentSessionId(null)
    setShowHistory(false)
  }

  const deleteChatSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setChatSessions((prev) => {
      const updatedSessions = prev.filter((session) => session.id !== sessionId)
      saveSessionsToStorage(updatedSessions)
      return updatedSessions
    })

    if (currentSessionId === sessionId) {
      startNewChat()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#1B4332] to-[#2D6A4F]">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold text-white text-sm">Chat IA AgriTech</h3>
            <p className="text-white/80 text-xs">Assistant spécialisé</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowHistory(!showHistory)}
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-white hover:bg-white/20 rounded-full"
          >
            <History className="w-4 h-4" />
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-white hover:bg-white/20 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showHistory && (
        <div className="border-b bg-gray-50 max-h-48 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-[#1B4332]">Historique des conversations</h4>
              <Button
                onClick={startNewChat}
                variant="ghost"
                size="sm"
                className="text-xs text-[#2D6A4F] hover:bg-[#E9F5EC]/50 rounded-lg px-2 py-1"
              >
                Nouveau chat
              </Button>
            </div>
            <div className="space-y-2">
              {chatSessions.length === 0 ? (
                <p className="text-xs text-[#6C757D] text-center py-4">Aucune conversation sauvegardée</p>
              ) : (
                chatSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => loadChatSession(session)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs group ${
                      currentSessionId === session.id ? "bg-[#E9F5EC] border border-[#2D6A4F]/20" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1B4332] truncate">{session.title}</p>
                      <p className="text-[#6C757D] text-xs">
                        {session.updatedAt.toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Button
                      onClick={(e) => deleteChatSession(session.id, e)}
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-4 h-full flex flex-col">
            <div className="text-center mb-4">
              <h4 className="text-lg font-semibold text-[#1B4332] mb-2">
                Bonjour <span className="text-[#2D6A4F]">Badr</span>
              </h4>
              <p className="text-[#6C757D] text-sm">Que souhaitez-vous savoir ?</p>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-4 flex-1 overflow-y-auto">
              {suggestedPrompts.map((prompt, index) => {
                const IconComponent = prompt.icon
                return (
                  <div
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="bg-[#E9F5EC] rounded-xl p-3 cursor-pointer transition-all duration-300 hover:shadow-md hover:bg-[#E9F5EC]/80 group border-0"
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent className="w-4 h-4 text-[#2D6A4F] mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-[#1B4332] text-xs mb-1 leading-tight">{prompt.title}</h5>
                        <p className="text-[#6C757D] text-xs leading-relaxed">{prompt.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#6C757D] hover:text-[#2D6A4F] text-xs hover:bg-[#E9F5EC]/50 rounded-lg"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Actualiser
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white"
                        : "text-[#1B4332]"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="p-3 rounded-xl">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-[#2D6A4F] rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 bg-[#2D6A4F] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-[#2D6A4F] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-2 bg-white rounded-full p-2 shadow-sm border">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-[#6C757D] hover:text-[#2D6A4F] hover:bg-[#E9F5EC]/50 rounded-full"
            >
              <Paperclip className="w-3 h-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-[#6C757D] hover:text-[#2D6A4F] hover:bg-[#E9F5EC]/50 rounded-full"
            >
              <ImageIcon className="w-3 h-3" />
            </Button>

            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Posez votre question…"
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#6C757D] text-xs px-2 h-6 text-[#1B4332] shadow-none"
              disabled={isLoading}
            />

            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !message.trim()}
              className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full w-6 h-6 shadow-sm disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
