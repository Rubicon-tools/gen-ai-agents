"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Sparkles, FileText, Mail, Cpu } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

const suggestedPrompts = [
  {
    icon: FileText,
    title: "Créer une liste de tâches",
    description: "pour un projet agricole ou une exploitation",
  },
  {
    icon: Mail,
    title: "Générer un email",
    description: "pour une opportunité d'investissement AgriTech",
  },
  {
    icon: Cpu,
    title: "Comment l'IA fonctionne",
    description: "dans le secteur agricole moderne",
  },
]

export function ChatInterface() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(message),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleSuggestedPrompt = (prompt: (typeof suggestedPrompts)[0]) => {
    const fullPrompt = `${prompt.title} ${prompt.description}`
    setMessage(fullPrompt)
  }

  const generateAIResponse = (userMessage: string): string => {
    const responses = {
      innovation:
        "Les dernières innovations en AgriTech incluent l'agriculture de précision avec des drones, l'IA pour l'optimisation des cultures, et les capteurs IoT pour le monitoring en temps réel. Ces technologies permettent d'augmenter les rendements tout en réduisant l'impact environnemental.",
      startup:
        "Parmi les startups prometteuses, on trouve des entreprises spécialisées dans l'agriculture verticale, la biotechnologie agricole, et les solutions de traçabilité blockchain. Ces startups révolutionnent la façon dont nous produisons et distribuons les aliments.",
      événement:
        "Les prochains événements majeurs incluent le Salon International de l'Agriculture, AgTech Summit, et diverses conférences sur l'innovation agricole. Ces événements sont cruciaux pour le networking et la découverte de nouvelles technologies.",
      tendance:
        "Les tendances 2024 montrent une forte croissance de l'agriculture durable, l'adoption massive de l'IA, et l'émergence de nouvelles protéines alternatives. Le marché se dirige vers plus de durabilité et d'efficacité.",
    }

    const lowerMessage = userMessage.toLowerCase()
    if (lowerMessage.includes("innovation") || lowerMessage.includes("agritech")) {
      return responses.innovation
    } else if (lowerMessage.includes("startup")) {
      return responses.startup
    } else if (lowerMessage.includes("événement") || lowerMessage.includes("event")) {
      return responses.événement
    } else if (lowerMessage.includes("tendance") || lowerMessage.includes("marché")) {
      return responses.tendance
    }

    return "Je suis votre assistant IA spécialisé en AgriTech. Je peux vous aider avec des informations sur les innovations, startups, événements et tendances du secteur agricole. Posez-moi une question spécifique !"
  }

  return (
    <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
      {/* Header with AI branding */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-gray-900">AgriTech AI</span>
        </div>
        <Avatar className="w-8 h-8">
          <AvatarImage src="/diverse-user-avatars.png" />
          <AvatarFallback className="bg-green-100 text-green-800 text-sm">U</AvatarFallback>
        </Avatar>
      </div>

      <CardContent className="p-0">
        {messages.length === 0 ? (
          <div className="p-8 text-center">
            {/* Welcome message */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Salut Badr</h2>
              <h3 className="text-xl font-medium text-gray-700 mb-3">Que souhaitez-vous savoir ?</h3>
              <p className="text-gray-500 text-sm">Utilisez l'un des prompts les plus courants ci-dessous</p>
              <p className="text-gray-500 text-sm">ou utilisez le vôtre pour commencer</p>
            </div>

            {/* Suggested prompts cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {suggestedPrompts.map((prompt, index) => {
                const IconComponent = prompt.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 text-left flex flex-col items-start gap-2 bg-gray-50 hover:bg-green-50 border-gray-200 hover:border-green-200 transition-colors"
                    onClick={() => handleSuggestedPrompt(prompt)}
                  >
                    <IconComponent className="w-5 h-5 text-green-700" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{prompt.title}</div>
                      <div className="text-gray-600 text-xs mt-1">{prompt.description}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        ) : (
          <ScrollArea className="h-64 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "ai" && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-card-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
        )}

        {/* Input section */}
        <div className="p-6 border-t border-gray-100">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-2 bg-gray-50 rounded-full border border-gray-200 p-2">
              <div className="pl-2">
                <Sparkles className="w-4 h-4 text-gray-400" />
              </div>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Demandez tout ce que vous voulez"
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !message.trim()}
                className="bg-green-700 hover:bg-green-800 text-white rounded-full w-8 h-8"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
