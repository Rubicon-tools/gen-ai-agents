"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Calendar, TrendingUp, Clock, MapPin, Briefcase } from "lucide-react"

interface DetailedSectionProps {
  section: string | null
  onClose: () => void
}

export function DetailedSection({ section, onClose }: DetailedSectionProps) {
  if (!section) return null

  const getSectionContent = () => {
    switch (section) {
      case "agenda":
        return {
          title: "Agenda AgriTech Mondial",
          icon: Calendar,
          content: (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Découvrez les événements majeurs du secteur AgriTech à travers le monde.
              </p>
              <div className="grid gap-4">
                {[
                  {
                    title: "AgTech Summit Paris",
                    date: "15 Jan 2024",
                    location: "Paris",
                    description: "Le plus grand rassemblement européen des innovations agricoles",
                    attendees: "2000+",
                  },
                  {
                    title: "Salon de l'Agriculture",
                    date: "24 Fév 2024",
                    location: "Paris Expo",
                    description: "Salon international de l'agriculture et de l'élevage",
                    attendees: "600k+",
                  },
                  {
                    title: "Innovation Week",
                    date: "10 Mar 2024",
                    location: "Lyon",
                    description: "Semaine dédiée aux innovations technologiques agricoles",
                    attendees: "500+",
                  },
                ].map((event, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{event.title}</h4>
                      <Badge variant="outline">{event.attendees} participants</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ),
        }
      case "startups":
        return {
          title: "Startups à la Une",
          icon: TrendingUp,
          content: (
            <div className="space-y-4">
              <p className="text-muted-foreground">Les startups les plus prometteuses du secteur AgriTech.</p>
              <div className="grid gap-4">
                {[
                  {
                    name: "AgroSense",
                    sector: "Capteurs IoT",
                    funding: "2.5M€",
                    description: "Capteurs intelligents pour l'agriculture de précision",
                    employees: "25",
                  },
                  {
                    name: "CropAI",
                    sector: "IA Prédictive",
                    funding: "1.8M€",
                    description: "Intelligence artificielle pour la prédiction des rendements",
                    employees: "18",
                  },
                  {
                    name: "GreenTech Solutions",
                    sector: "Agriculture Verticale",
                    funding: "4.2M€",
                    description: "Solutions innovantes pour l'agriculture urbaine",
                    employees: "45",
                  },
                ].map((startup, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{startup.name}</h4>
                      <Badge variant="secondary">{startup.employees} employés</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{startup.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {startup.sector}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {startup.funding}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ),
        }
      default:
        return null
    }
  }

  const sectionData = getSectionContent()
  if (!sectionData) return null

  const Icon = sectionData.icon

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5" />
              {sectionData.title}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">{sectionData.content}</CardContent>
      </Card>
    </div>
  )
}
