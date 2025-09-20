"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Globe, Search, Calendar, ExternalLink, TrendingUp, ArrowRight, MapPin } from "lucide-react"
import { PageHeader } from "@/components/page-header"

// Mock data for government news by regions
const governmentNews = [
  {
    id: 1,
    title: "Nouvelle stratégie agricole nationale 2025-2030",
    region: "Maroc",
    date: "2024-12-18",
    source: "Ministère de l'Agriculture",
    category: "Politique Agricole",
    summary:
      "Le gouvernement marocain lance une stratégie ambitieuse pour moderniser l'agriculture avec un budget de 50 milliards de dirhams.",
    impact: "Élevé",
    tags: ["Agriculture", "Investissement", "Modernisation"],
    url: "#",
  },
  {
    id: 2,
    title: "Pacte Vert Européen : nouvelles mesures pour l'agriculture durable",
    region: "Europe",
    date: "2024-12-17",
    source: "Commission Européenne",
    category: "Environnement",
    summary:
      "L'UE annonce de nouvelles directives pour réduire l'empreinte carbone de l'agriculture de 30% d'ici 2030.",
    impact: "Très Élevé",
    tags: ["Durabilité", "Carbone", "Réglementation"],
    url: "#",
  },
  {
    id: 3,
    title: "Initiative africaine pour la sécurité alimentaire",
    region: "Afrique",
    date: "2024-12-16",
    source: "Union Africaine",
    category: "Sécurité Alimentaire",
    summary:
      "Lancement d'un programme continental de 15 milliards $ pour améliorer la productivité agricole en Afrique.",
    impact: "Élevé",
    tags: ["Sécurité Alimentaire", "Productivité", "Financement"],
    url: "#",
  },
  {
    id: 4,
    title: "Brésil : nouveau plan d'investissement en AgriTech",
    region: "Amérique Latine",
    date: "2024-12-15",
    source: "Ministère de l'Agriculture du Brésil",
    category: "Innovation",
    summary:
      "Le Brésil investit 2 milliards de réais dans les technologies agricoles pour maintenir sa position de leader mondial.",
    impact: "Élevé",
    tags: ["Innovation", "Technologie", "Leadership"],
    url: "#",
  },
  {
    id: 5,
    title: "Chine : révolution de l'agriculture intelligente",
    region: "Asie",
    date: "2024-12-14",
    source: "Ministère de l'Agriculture de Chine",
    category: "Technologie",
    summary: "La Chine déploie l'IA et l'IoT dans 10 000 fermes pilotes pour optimiser les rendements agricoles.",
    impact: "Très Élevé",
    tags: ["IA", "IoT", "Optimisation"],
    url: "#",
  },
  {
    id: 6,
    title: "Inde : subventions pour l'agriculture de précision",
    region: "Asie",
    date: "2024-12-13",
    source: "Gouvernement Indien",
    category: "Financement",
    summary:
      "L'Inde alloue 5 milliards de roupies pour soutenir l'adoption de technologies de précision par les petits agriculteurs.",
    impact: "Élevé",
    tags: ["Précision", "Subventions", "Petits Agriculteurs"],
    url: "#",
  },
  {
    id: 7,
    title: "Argentine : exportations agricoles et nouvelles réglementations",
    region: "Amérique Latine",
    date: "2024-12-12",
    source: "Ministère de l'Économie Argentine",
    category: "Commerce",
    summary: "L'Argentine révise ses politiques d'exportation agricole pour stimuler la croissance économique.",
    impact: "Moyen",
    tags: ["Exportation", "Réglementation", "Croissance"],
    url: "#",
  },
  {
    id: 8,
    title: "Nigeria : programme de mécanisation agricole",
    region: "Afrique",
    date: "2024-12-11",
    source: "Ministère de l'Agriculture du Nigeria",
    category: "Mécanisation",
    summary:
      "Le Nigeria lance un programme de mécanisation pour moderniser l'agriculture et réduire la dépendance aux importations.",
    impact: "Élevé",
    tags: ["Mécanisation", "Modernisation", "Autosuffisance"],
    url: "#",
  },
]

const regions = ["Toutes", "Maroc", "Europe", "Afrique", "Amérique Latine", "Asie", "Amérique du Nord", "Océanie"]
const categories = [
  "Toutes",
  "Politique Agricole",
  "Environnement",
  "Sécurité Alimentaire",
  "Innovation",
  "Technologie",
  "Financement",
  "Commerce",
  "Mécanisation",
]

export default function GovernmentNewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("Toutes")
  const [selectedCategory, setSelectedCategory] = useState("Toutes")

  const filteredNews = governmentNews.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.source.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === "Toutes" || news.region === selectedRegion
    const matchesCategory = selectedCategory === "Toutes" || news.category === selectedCategory
    return matchesSearch && matchesRegion && matchesCategory
  })

  const getRegionColor = (region: string) => {
    const colors = {
      Maroc: "bg-green-100 text-green-800 border-green-200",
      Europe: "bg-emerald-100 text-emerald-800 border-emerald-200",
      Afrique: "bg-lime-100 text-lime-800 border-lime-200",
      "Amérique Latine": "bg-teal-100 text-teal-800 border-teal-200",
      Asie: "bg-green-200 text-green-900 border-green-300",
      "Amérique du Nord": "bg-forest-100 text-forest-800 border-forest-200",
      Océanie: "bg-sage-100 text-sage-800 border-sage-200",
    }
    return colors[region as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Très Élevé":
        return "bg-green-800 text-white"
      case "Élevé":
        return "bg-green-600 text-white"
      case "Moyen":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Actualités Institutionnelles"
        description="Suivez les dernières décisions politiques et réglementaires qui impactent l'agriculture mondiale"
      >
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          <Globe className="w-4 h-4" />
          Veille Institutionnelle Mondiale
        </div>
      </PageHeader>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher dans les actualités institutionnelles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-200 focus:border-green-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-md focus:border-green-500 focus:outline-none"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-md focus:border-green-500 focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* News List - Horizontal Bands */}
        <div className="space-y-4">
          {filteredNews.map((news) => (
            <Card
              key={news.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden hover:border-green-200"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6">
                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`${getRegionColor(news.region)} border`}>
                        <MapPin className="w-3 h-3 mr-1" />
                        {news.region}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {news.category}
                      </Badge>
                      <Badge className={`${getImpactColor(news.impact)} text-xs`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {news.impact}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">
                      {news.title}
                    </h3>

                    <p className="text-gray-600 mb-3 line-clamp-2">{news.summary}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {news.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(news.date).toLocaleDateString("fr-FR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {news.source}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-green-50 hover:border-green-500 bg-transparent"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Lire
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune actualité trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredNews.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
            >
              Charger plus d'actualités
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
