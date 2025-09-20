"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Search, ExternalLink, Download, Star, Calendar, Users } from "lucide-react"
import { PageHeader } from "@/components/page-header"

const publications = [
  {
    id: 1,
    title: "Intelligence Artificielle et Agriculture de Précision : Révolution des Pratiques Agricoles",
    authors: ["Dr. Marie Dubois", "Prof. Jean-Pierre Martin"],
    journal: "Nature AgriTech",
    date: "2024-12-15",
    category: "IA & Agriculture",
    abstract:
      "Cette étude examine l'impact transformateur de l'IA sur l'agriculture de précision, analysant 500 exploitations agricoles sur 3 ans.",
    citations: 127,
    impact: 8.5,
    keywords: ["IA", "Agriculture de précision", "Capteurs", "Machine Learning"],
    downloadUrl: "#",
    openAccess: true,
  },
  {
    id: 2,
    title: "Blockchain dans la Supply Chain Agricole : Traçabilité et Transparence",
    authors: ["Dr. Sarah Chen", "Prof. Ahmed El-Mansouri"],
    journal: "AgTech Review",
    date: "2024-12-10",
    category: "Blockchain",
    abstract:
      "Analyse complète de l'implémentation de la blockchain pour améliorer la traçabilité des produits agricoles du champ à l'assiette.",
    citations: 89,
    impact: 7.2,
    keywords: ["Blockchain", "Supply Chain", "Traçabilité", "Smart Contracts"],
    downloadUrl: "#",
    openAccess: false,
  },
  {
    id: 3,
    title: "Capteurs IoT pour l'Irrigation Intelligente : Optimisation de la Consommation d'Eau",
    authors: ["Dr. Lisa Wang", "Prof. Carlos Rodriguez"],
    journal: "Smart Farming International",
    date: "2024-12-08",
    category: "IoT & Capteurs",
    abstract:
      "Développement et test de capteurs IoT avancés pour optimiser l'irrigation, réduisant la consommation d'eau de 35%.",
    citations: 156,
    impact: 9.1,
    keywords: ["IoT", "Irrigation", "Capteurs", "Économie d'eau"],
    downloadUrl: "#",
    openAccess: true,
  },
  {
    id: 4,
    title: "Drones et Vision par Ordinateur pour la Surveillance des Cultures",
    authors: ["Dr. Thomas Müller", "Dr. Anna Schmidt"],
    journal: "Precision Agriculture",
    date: "2024-12-05",
    category: "Drones & Vision",
    abstract:
      "Utilisation de drones équipés de caméras multispectral et d'algorithmes de vision pour détecter précocement les maladies des cultures.",
    citations: 203,
    impact: 8.8,
    keywords: ["Drones", "Vision par ordinateur", "Surveillance", "Maladies"],
    downloadUrl: "#",
    openAccess: true,
  },
]

const categories = [
  "Toutes",
  "IA & Agriculture",
  "Blockchain",
  "IoT & Capteurs",
  "Drones & Vision",
  "Biotechnologie",
  "Robotique",
]

export default function PublicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Toutes")

  const filteredPublications = publications.filter((pub) => {
    const matchesSearch =
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors.some((author) => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pub.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "Toutes" || pub.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Publications Scientifiques" description="Dernières recherches en AgriTech">
        <Badge variant="outline" className="text-primary border-primary">
          {filteredPublications.length} publications
        </Badge>
      </PageHeader>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher par titre, auteur ou mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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
        </div>

        {/* Publications Grid */}
        <div className="space-y-6">
          {filteredPublications.map((pub) => (
            <Card
              key={pub.id}
              className="bg-card border-border hover:shadow-lg transition-all duration-300 animate-fade-in-up"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-primary border-primary">
                        {pub.category}
                      </Badge>
                      {pub.openAccess && (
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          Open Access
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-card-foreground mb-2 leading-tight">{pub.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{pub.authors.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{pub.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{pub.abstract}</p>

                <div className="flex flex-wrap gap-2">
                  {pub.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-medium">{pub.journal}</span>
                    </div>
                    <div className="text-muted-foreground">
                      <span className="font-medium">{pub.citations}</span> citations
                    </div>
                    <div className="text-muted-foreground">
                      Impact: <span className="font-medium text-primary">{pub.impact}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      Lire plus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPublications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">Aucune publication trouvée</h3>
            <p className="text-muted-foreground">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  )
}
