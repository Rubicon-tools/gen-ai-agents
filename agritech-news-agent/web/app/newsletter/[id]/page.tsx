"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { NewsletterModal } from "@/components/newsletter-modal"
import { Calendar, Eye, Download, Share2, Mail, ArrowRight, Clock } from "lucide-react"

const newsletters = [
  {
    id: 1,
    title: "Newsletter #47 – 15 déc. 2024",
    date: "2024-12-15",
    description: "Irrigation intelligente : les nouvelles technologies qui révolutionnent l'agriculture de précision",
    tags: ["Irrigation intelligente", "IA & Données", "Durabilité"],
    featured: true,
    views: 2847,
    readTime: "8 min",
    content: `
      <h2>L'irrigation intelligente : une révolution en marche</h2>
      <p>L'agriculture de précision connaît une transformation majeure grâce aux nouvelles technologies d'irrigation intelligente. Ces innovations permettent aux agriculteurs d'optimiser l'utilisation de l'eau tout en maximisant les rendements.</p>
      
      <h3>Les capteurs IoT au cœur du système</h3>
      <p>Les capteurs d'humidité du sol, connectés en temps réel, permettent un monitoring précis des besoins hydriques des cultures. Cette technologie réduit la consommation d'eau de 30% en moyenne.</p>
      
      <h3>Intelligence artificielle et prédiction</h3>
      <p>Les algorithmes d'IA analysent les données météorologiques, l'état du sol et les besoins des cultures pour prédire les besoins d'irrigation avec une précision remarquable.</p>
      
      <h3>Impact environnemental et économique</h3>
      <p>Ces technologies permettent non seulement de préserver les ressources en eau, mais aussi de réduire les coûts opérationnels de 25% en moyenne pour les exploitations agricoles.</p>
    `,
    relatedNewsletters: [2, 3, 5],
  },
  {
    id: 2,
    title: "Newsletter #46 – 8 déc. 2024",
    date: "2024-12-08",
    description: "Start-ups AgriTech : 5 levées de fonds remarquables ce mois-ci et leurs innovations prometteuses",
    tags: ["Start-ups", "Investissements", "IA & Données"],
    featured: false,
    views: 1923,
    readTime: "6 min",
    content: `
      <h2>Les levées de fonds qui marquent le secteur AgriTech</h2>
      <p>Ce mois-ci, plusieurs start-ups AgriTech ont réalisé des levées de fonds remarquables, témoignant de la vitalité du secteur.</p>
      
      <h3>CropTech Solutions - 15M€</h3>
      <p>Spécialisée dans l'analyse prédictive des cultures, CropTech Solutions a levé 15 millions d'euros pour accélérer son expansion européenne.</p>
      
      <h3>AgroBot - 8M€</h3>
      <p>Cette start-up développe des robots autonomes pour la récolte et a séduit les investisseurs avec sa technologie de vision par ordinateur.</p>
    `,
    relatedNewsletters: [1, 4],
  },
  // Add more newsletters with content...
]

export default function NewsletterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const newsletter = newsletters.find((n) => n.id === Number.parseInt(params.id as string))

  if (!newsletter) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Newsletter non trouvée</h1>
          <p className="text-gray-600">Cette newsletter n'existe pas ou a été supprimée.</p>
        </div>
      </div>
    )
  }

  const relatedNewsletters = newsletters.filter((n) => newsletter.relatedNewsletters?.includes(n.id)).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50/30">
      <PageHeader title={newsletter.title} description={newsletter.description}>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-500 bg-transparent">
            <Download className="w-4 h-4 mr-1" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
            <Share2 className="w-4 h-4 mr-1" />
            Partager
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[#1B4332] hover:bg-green-700 text-white" size="sm">
            <Mail className="w-4 h-4 mr-1" />
            S'abonner
          </Button>
        </div>
      </PageHeader>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(newsletter.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {newsletter.readTime} de lecture
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {newsletter.views.toLocaleString()} vues
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {newsletter.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: newsletter.content }} />
          </div>

          {/* Newsletter Subscription CTA */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6 mb-8">
            <div className="text-center">
              <Mail className="w-12 h-12 text-[#1B4332] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ne manquez aucune newsletter</h3>
              <p className="text-gray-600 mb-4">
                Recevez chaque semaine les dernières actualités AgriTech directement dans votre boîte mail
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#1B4332] hover:bg-green-700 text-white px-6 py-2"
              >
                <Mail className="w-4 h-4 mr-2" />
                S'abonner gratuitement
              </Button>
            </div>
          </div>

          {/* Related Newsletters */}
          {relatedNewsletters.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Newsletters similaires</h3>
              <div className="space-y-4">
                {relatedNewsletters.map((related) => (
                  <div
                    key={related.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-green-300 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{related.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{related.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(related.date).toLocaleDateString("fr-FR")}
                        <span className="mx-2">•</span>
                        <Eye className="w-3 h-3 mr-1" />
                        {related.views.toLocaleString()}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-4 hover:bg-green-50 hover:border-green-500 bg-transparent"
                      onClick={() => router.push(`/newsletter/${related.id}`)}
                    >
                      Lire
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <NewsletterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
