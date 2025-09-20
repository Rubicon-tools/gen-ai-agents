"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Clock, Search, ExternalLink } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EventDetailModal } from "@/components/modals/event-detail-modal"

const allEvents = [
  {
    id: 1,
    title: "AgTech Innovation Summit",
    date: "2025-01-20",
    time: "09:00 - 18:00",
    location: "Paris, France",
    venue: "Palais des Congrès",
    type: "Conférence",
    description: "Le plus grand événement européen dédié aux innovations en agriculture numérique.",
    speakers: ["Dr. Marie Dubois", "Jean-Pierre Martin", "Sarah Chen"],
    price: "Gratuit",
    status: "Ouvert",
  },
  {
    id: 2,
    title: "Forum Agriculture Numérique",
    date: "2025-01-25",
    time: "14:00 - 17:00",
    location: "Lyon, France",
    venue: "Centre de Congrès de Lyon",
    type: "Forum",
    description: "Rencontres entre agriculteurs et développeurs de solutions numériques.",
    speakers: ["Pierre Durand", "Lisa Wang"],
    price: "50€",
    status: "Places limitées",
  },
  {
    id: 3,
    title: "Salon des Technologies Vertes",
    date: "2025-02-03",
    time: "10:00 - 19:00",
    location: "Toulouse, France",
    venue: "Parc des Expositions",
    type: "Salon",
    description: "Exposition des dernières innovations en technologies agricoles durables.",
    speakers: ["Marc Leroy", "Anna Schmidt", "Carlos Rodriguez"],
    price: "25€",
    status: "Ouvert",
  },
  {
    id: 4,
    title: "Webinaire IA & Agriculture",
    date: "2025-02-08",
    time: "16:00 - 17:30",
    location: "En ligne",
    venue: "Plateforme Zoom",
    type: "Webinaire",
    description: "Comment l'intelligence artificielle transforme l'agriculture moderne.",
    speakers: ["Dr. Thomas Müller"],
    price: "Gratuit",
    status: "Ouvert",
  },
  {
    id: 5,
    title: "Pitch Day AgriTech",
    date: "2025-02-12",
    time: "11:00 - 16:00",
    location: "Bordeaux, France",
    venue: "Technopole Bordeaux",
    type: "Pitch",
    description: "Présentation des startups les plus prometteuses du secteur AgriTech.",
    speakers: ["Investisseurs", "Startups"],
    price: "Gratuit",
    status: "Sur invitation",
  },
]

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("Tous")
  const [selectedEvent, setSelectedEvent] = useState<(typeof allEvents)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const eventTypes = ["Tous", "Conférence", "Forum", "Salon", "Webinaire", "Pitch"]

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "Tous" || event.type === selectedType
    return matchesSearch && matchesType
  })

  const openEventModal = (event: (typeof allEvents)[0]) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Agenda des Événements" description="Tous les événements AgriTech à venir" />

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {eventTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className={selectedType === type ? "bg-primary text-primary-foreground" : ""}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-card-foreground mb-2">{event.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{event.type}</Badge>
                      <Badge
                        variant={event.status === "Ouvert" ? "default" : "secondary"}
                        className={event.status === "Ouvert" ? "bg-primary text-primary-foreground" : ""}
                      >
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{event.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>
                      {event.venue}, {event.location}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Prix: {event.price}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.speakers.length} intervenant{event.speakers.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => openEventModal(event)}
                    >
                      Voir détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">Aucun événement trouvé</h3>
            <p className="text-muted-foreground">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal event={selectedEvent} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
