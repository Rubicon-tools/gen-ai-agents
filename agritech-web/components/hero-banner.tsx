"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Sparkles, TrendingUp, Users, Globe, MessageSquare, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { NewsletterModal } from "@/components/newsletter-modal"

export function HeroBanner() {
  const [mounted, setMounted] = useState(false)
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/agricultural-pattern.jpg')] bg-repeat opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Plateforme Officielle de Veille AgriTech
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight"
            style={{ fontFamily: "Chronicle Display, serif" }}
          >
            L'Avenir de l'Agriculture
            <br />
            <span className="text-foreground">Commence Ici</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Découvrez les dernières innovations, suivez les tendances mondiales et connectez-vous avec l'écosystème
            AgriTech le plus dynamique d'Afrique et du monde.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/chat">
              <Button size="lg" className="text-lg px-8 py-4 group">
                <MessageSquare className="mr-2 w-5 h-5" />
                Chat AI
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 bg-transparent"
              onClick={() => setIsNewsletterModalOpen(true)}
            >
              <Mail className="mr-2 w-5 h-5" />
              S'inscrire à la Newsletter
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="p-6 glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-count-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-primary">2,500+</div>
                  <div className="text-sm text-muted-foreground">Innovations Suivies</div>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-count-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-secondary">15,000+</div>
                  <div className="text-sm text-muted-foreground">Professionnels Connectés</div>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-count-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-chart-1/10 rounded-lg">
                  <Globe className="w-5 h-5 text-chart-1" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-chart-1">45</div>
                  <div className="text-sm text-muted-foreground">Pays Couverts</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <NewsletterModal isOpen={isNewsletterModalOpen} onClose={() => setIsNewsletterModalOpen(false)} />
    </div>
  )
}
