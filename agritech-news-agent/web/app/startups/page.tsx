"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Rocket, Search, ExternalLink, TrendingUp, MapPin, DollarSign, Users, Calendar } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StartupDetailModal } from "@/components/modals/startup-detail-modal"

const startups = [
  {
    id: 1,
    name: "GreenTech Solutions",
    description:
      "Plateforme IA pour l'optimisation des rendements agricoles utilisant l'analyse prédictive et les données satellitaires.",
    logo: "/placeholder.svg?height=60&width=60&text=GTS",
    founded: "2022",
    location: "Paris, France",
    stage: "Série A",
    funding: "€15M",
    employees: "45-60",
    category: "IA & Analytics",
    website: "https://greentech-solutions.com",
    growth: "+145%",
    investors: ["Partech", "Bpifrance", "AgFunder"],
    keyMetrics: {
      customers: "500+",
      revenue: "€2.5M ARR",
      growth: "+145%",
    },
  },
  {
    id: 2,
    name: "AgriBot Systems",
    description:
      "Robots autonomes pour la surveillance et la maintenance des cultures, équipés de capteurs IoT avancés.",
    logo: "/placeholder.svg?height=60&width=60&text=ABS",
    founded: "2021",
    location: "Lyon, France",
    stage: "Seed",
    funding: "€8M",
    employees: "25-35",
    category: "Robotique",
    website: "https://agribot-systems.com",
    growth: "+89%",
    investors: ["Techstars", "SOSV", "InnoEnergy"],
    keyMetrics: {
      customers: "150+",
      revenue: "€1.2M ARR",
      growth: "+89%",
    },
  },
  {
    id: 3,
    name: "CropAI Analytics",
    description:
      "Solutions d'analyse prédictive pour l'agriculture, utilisant l'IA pour prédire les maladies des cultures.",
    logo: "/placeholder.svg?height=60&width=60&text=CAA",
    founded: "2020",
    location: "Toulouse, France",
    stage: "Série B",
    funding: "€22M",
    employees: "80-100",
    category: "IA & Analytics",
    website: "https://cropai-analytics.com",
    growth: "+67%",
    investors: ["Balderton", "Index Ventures", "AgFunder"],
    keyMetrics: {
      customers: "1200+",
      revenue: "€5.8M ARR",
      growth: "+67%",
    },
  },
  {
    id: 4,
    name: "AquaTech Innovations",
    description:
      "Systèmes d'irrigation intelligente basés sur l'IoT pour optimiser la consommation d'eau en agriculture.",
    logo: "/placeholder.svg?height=60&width=60&text=ATI",
    founded: "2023",
    location: "Bordeaux, France",
    stage: "Pre-Seed",
    funding: "€3M",
    employees: "15-20",
    category: "IoT & Capteurs",
    website: "https://aquatech-innovations.com",
    growth: "+234%",
    investors: ["Station F", "NUMA", "French Tech Seed"],
    keyMetrics: {
      customers: "80+",
      revenue: "€400K ARR",
      growth: "+234%",
    },
  },
]

const categories = ["Toutes", "IA & Analytics", "Robotique", "IoT & Capteurs", "Biotechnologie", "Blockchain", "Drones"]
const stages = ["Tous", "Pre-Seed", "Seed", "Série A", "Série B", "Série C+"]

export default function StartupsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Toutes")
  const [selectedStage, setSelectedStage] = useState("Tous")
  const [selectedStartup, setSelectedStartup] = useState<(typeof startups)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredStartups = startups.filter((startup) => {
    const matchesSearch =
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Toutes" || startup.category === selectedCategory
    const matchesStage = selectedStage === "Tous" || startup.stage === selectedStage
    return matchesSearch && matchesCategory && matchesStage
  })

  const openStartupModal = (startup: (typeof startups)[0]) => {
    setSelectedStartup(startup)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Start-ups AgriTech" description="Écosystème des entreprises innovantes">
        <Badge variant="outline" className="text-primary border-primary">
          {filteredStartups.length} start-ups
        </Badge>
      </PageHeader>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, description ou localisation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-primary text-primary-foreground" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="w-px bg-border mx-2"></div>
            <div className="flex gap-2 flex-wrap">
              {stages.map((stage) => (
                <Button
                  key={stage}
                  variant={selectedStage === stage ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStage(stage)}
                  className={selectedStage === stage ? "bg-secondary text-secondary-foreground" : ""}
                >
                  {stage}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Startups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStartups.map((startup) => (
            <Card
              key={startup.id}
              className="bg-card border-border hover:shadow-lg transition-all duration-300 animate-fade-in-up"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center border border-primary/20">
                      <Rocket className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-card-foreground">{startup.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-primary border-primary">
                          {startup.category}
                        </Badge>
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          {startup.stage}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{startup.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Fondée en {startup.founded}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{startup.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span>{startup.funding} levés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{startup.employees} employés</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{startup.keyMetrics.customers}</div>
                      <div className="text-xs text-muted-foreground">Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary">{startup.keyMetrics.revenue}</div>
                      <div className="text-xs text-muted-foreground">Revenus</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="w-4 h-4 text-chart-1" />
                        <span className="text-lg font-bold text-chart-1">{startup.keyMetrics.growth}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Croissance</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Investisseurs: {startup.investors.join(", ")}</div>
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground"
                      onClick={() => openStartupModal(startup)}
                    >
                      Voir profil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStartups.length === 0 && (
          <div className="text-center py-12">
            <Rocket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">Aucune start-up trouvée</h3>
            <p className="text-muted-foreground">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Startup Detail Modal */}
      <StartupDetailModal startup={selectedStartup} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
