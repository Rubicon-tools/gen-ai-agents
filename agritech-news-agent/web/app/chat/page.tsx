"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, Sparkles, FileText, Mail, Cpu, TrendingUp, Paperclip, ImageIcon } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { useUser } from "@clerk/nextjs"

const suggestedPrompts = [
  { icon: FileText, title: "Analyser les innovations", description: "en agriculture de précision", prompt: "Quelles sont les dernières innovations en agriculture de précision qui transforment le secteur ?" },
  { icon: TrendingUp, title: "Tendances du marché", description: "AgriTech 2024-2025", prompt: "Analyse les principales tendances du marché AgriTech pour 2024-2025" },
  { icon: Cpu, title: "IA dans l'agriculture", description: "applications concrètes", prompt: "Comment l'intelligence artificielle révolutionne-t-elle les pratiques agricoles modernes ?" },
  { icon: Mail, title: "Opportunités d'investissement", description: "startups prometteuses", prompt: "Identifie les startups AgriTech les plus prometteuses pour les investisseurs en 2024" },
]

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Array<{ id: string; content: string; sender: "user" | "ai"; timestamp: Date }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = useUser()
  if (!user) return null
  const fullName = `${user.firstName} ${user.lastName}`

  const callRagApi = async (userMessage: string) => {
    try {
      const res = await fetch("http://localhost:8000/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "rag-agritech-agent",
          messages: [{ role: "user", content: userMessage }],
        }),
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      if (data.choices?.[0]?.message?.content) return data.choices[0].message.content
      throw new Error("Unexpected response format from API")
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    const userMessage = { id: Date.now().toString(), content: message, sender: "user" as const, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    const currentMessage = message
    setMessage("")
    setIsLoading(true)
    setError(null)
    try {
      const aiContent = await callRagApi(currentMessage)
      const aiResponse = { id: (Date.now() + 1).toString(), content: aiContent, sender: "ai" as const, timestamp: new Date() }
      setMessages(prev => [...prev, aiResponse])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur API")
      const errorResponse = { id: (Date.now() + 1).toString(), content: "Désolé, une erreur est survenue lors de la communication avec l'API.", sender: "ai" as const, timestamp: new Date() }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptClick = (prompt: (typeof suggestedPrompts)[0]) => setMessage(prompt.prompt)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {messages.length > 0 && <PageHeader title="Chat IA AgriTech" description="Assistant IA spécialisé en agriculture et technologies agricoles" showBackButton={false} />}
      <div className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-16">
                <h1 className="text-4xl font-bold mb-4"><span className="text-gray-900">Bonjour </span><span className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#95D5B2] bg-clip-text text-transparent">{fullName}</span></h1>
                <h2 className="text-4xl font-medium bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] bg-clip-text text-transparent mb-8">que souhaitez-vous savoir ?</h2>
                <p className="text-[#6C757D] text-lg font-medium">Utilisez l'une des suggestions ci-dessous ou posez votre propre question</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-3xl mx-auto">
                {suggestedPrompts.map((prompt, index) => {
                  const Icon = prompt.icon
                  return (
                    <div key={index} onClick={() => handlePromptClick(prompt)} className="w-full h-[120px] bg-[#E9F5EC] rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-green-100/50 hover:bg-[#E9F5EC]/80 group border-0">
                      <div className="flex flex-col h-full">
                        <div className="mb-3"><Icon className="w-6 h-6 text-[#2D6A4F] group-hover:text-[#1B4332] transition-colors" /></div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1B4332] text-sm mb-1 leading-tight">{prompt.title}</h3>
                          <p className="text-[#6C757D] text-xs leading-relaxed">{prompt.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mb-12">
                <Button variant="ghost" className="text-[#6C757D] hover:text-[#2D6A4F] text-sm font-medium hover:bg-[#E9F5EC]/50 rounded-xl px-6 py-3 transition-all duration-200">
                  <Sparkles className="w-4 h-4 mr-2" />Actualiser les suggestions
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border-0 p-8 mb-32">
              <div className="space-y-6 max-h-[calc(100vh-400px)] overflow-y-auto">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "ai" && <div className="w-10 h-10 bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-full flex items-center justify-center flex-shrink-0 shadow-md"><Bot className="w-5 h-5 text-white" /></div>}
                    <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === "user" ? "bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white" : "bg-[#E9F5EC] text-[#1B4332] border border-green-100"}`}>{msg.content}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-full flex items-center justify-center flex-shrink-0 shadow-md"><Bot className="w-5 h-5 text-white" /></div>
                    <div className="bg-[#E9F5EC] p-4 rounded-2xl border border-green-100">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[#2D6A4F] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#2D6A4F] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-[#2D6A4F] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">{error}</div>}
              </div>
            </div>
          )}

          <div className="fixed bottom-0 left-[230px] right-0 border-t border-gray-200 z-50">
            <div className="container mx-auto px-6 py-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-center">
                  <div className="max-w-[900px] w-full">
                    <div className="bg-white rounded-3xl shadow-lg border-0 p-4">
                      <form onSubmit={handleSubmit} className="relative">
                        <div className="flex items-center gap-4 min-h-[52px]">
                          <div className="flex items-center gap-3">
                            <Button type="button" variant="ghost" size="icon" className="w-10 h-10 text-[#6C757D] hover:text-[#2D6A4F] hover:bg-[#E9F5EC]/50 rounded-xl transition-all duration-200"><Paperclip className="w-5 h-5" /></Button>
                            <Button type="button" variant="ghost" size="icon" className="w-10 h-10 text-[#6C757D] hover:text-[#2D6A4F] hover:bg-[#E9F5EC]/50 rounded-xl transition-all duration-200"><ImageIcon className="w-5 h-5" /></Button>
                          </div>
                          <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Posez votre question sur l'AgriTech…" className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#6C757D] text-base px-0 h-[52px] text-[#1B4332]" disabled={isLoading} />
                          <Button type="submit" size="icon" disabled={isLoading || !message.trim()} className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full w-10 h-10 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"><Send className="w-5 h-5" /></Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
