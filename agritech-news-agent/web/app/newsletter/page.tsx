"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Added useRouter import
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Calendar, Eye, Download, Search } from "lucide-react"
import { NewsletterModal } from "@/components/newsletter-modal"
import { PageHeader } from "@/components/page-header"

const newsletters = [
  {
    id: 1,
    title: "Newsletter #47 – 15 déc. 2024",
    date: "2024-12-15",
    description: "Irrigation intelligente : les nouvelles technologies qui révolutionnent l'agriculture de précision",
    tags: ["Irrigation intelligente", "IA & Données", "Durabilité"],
    featured: true,
    views: 2847,
  },
  {
    id: 2,
    title: "Newsletter #46 – 8 déc. 2024",
    date: "2024-12-08",
    description: "Start-ups AgriTech : 5 levées de fonds remarquables ce mois-ci et leurs innovations prometteuses",
    tags: ["Start-ups", "Investissements", "IA & Données"],
    featured: false,
    views: 1923,
  },
  {
    id: 3,
    title: "Newsletter #45 – 1 déc. 2024",
    date: "2024-12-01",
    description: "LiveStockTech : comment l'IoT transforme l'élevage moderne et améliore le bien-être animal",
    tags: ["LiveStockTech", "IA & Données", "Durabilité"],
    featured: false,
    views: 1456,
  },
  {
    id: 4,
    title: "Newsletter #44 – 24 nov. 2024",
    date: "2024-11-24",
    description: "Investissements Q4 : analyse des tendances de financement dans l'AgriTech européenne",
    tags: ["Investissements", "Start-ups"],
    featured: false,
    views: 3241,
  },
  {
    id: 5,
    title: "Newsletter #43 – 17 nov. 2024",
    date: "2024-11-17",
    description: "Agriculture durable : les solutions innovantes pour réduire l'empreinte carbone des exploitations",
    tags: ["Durabilité", "Irrigation intelligente"],
    featured: false,
    views: 2156,
  },
]

const thematicTags = [
  "Tous",
  "Irrigation intelligente",
  "Start-ups",
  "IA & Données",
  "LiveStockTech",
  "Investissements",
  "Durabilité",
]

export default function NewsletterPage() {
  const router = useRouter() // Added router hook
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("Tous")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredNewsletters = newsletters.filter((newsletter) => {
    const matchesSearch =
      newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsletter.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === "Tous" || newsletter.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="min-h-screen bg-gray-50/30">
      <PageHeader
        title="Nos Newsletters"
        description="Consultez l'ensemble des éditions hebdomadaires et inscrivez-vous pour ne rien manquer"
      >
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1B4332] hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          S'inscrire à la Newsletter
        </Button>
      </PageHeader>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par mot-clé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="min-w-[200px]">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="h-11 border-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <SelectValue placeholder="Filtrer par période" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {thematicTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full transition-all ${
                  selectedTag === tag
                    ? "bg-[#1B4332] hover:bg-green-700 text-white"
                    : "border-gray-300 hover:border-green-500 hover:text-green-600 bg-white"
                }`}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredNewsletters.map((newsletter) => (
            <div
              key={newsletter.id}
              className={`bg-white rounded-lg border transition-all hover:shadow-md ${
                newsletter.featured
                  ? "border-l-4 border-l-green-500 shadow-sm"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex items-center text-gray-500 text-sm min-w-[120px]">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(newsletter.date).toLocaleDateString("fr-FR")}
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold mb-2 text-gray-900 ${newsletter.featured ? "font-bold" : ""}`}
                    >
                      {newsletter.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">{newsletter.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {newsletter.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 min-w-[200px] justify-end">
                    <div className="flex items-center text-gray-500 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      {newsletter.views.toLocaleString()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-green-50 hover:border-green-500 border-gray-300 bg-transparent"
                      onClick={() => router.push(`/newsletter/${newsletter.id}`)} // Fixed navigation using router.push
                    >
                      Consulter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-blue-50 hover:border-blue-500 border-gray-300 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-[#1B4332] mb-1">{newsletters.length}</div>
              <div className="text-gray-600 text-sm">Newsletters publiées</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1B4332] mb-1">15,247</div>
              <div className="text-gray-600 text-sm">Abonnés actifs</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">
                Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        </div>

        {filteredNewsletters.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune newsletter trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>

      <NewsletterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
