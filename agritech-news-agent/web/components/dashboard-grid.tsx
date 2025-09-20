"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Lightbulb, Target, ExternalLink, Clock, MapPin, Users, Briefcase } from "lucide-react"

const agendaEvents = [
  { title: "AgTech Summit Paris", date: "15 Jan 2024", location: "Paris", type: "Conférence" },
  { title: "Salon de l'Agriculture", date: "24 Fév 2024", location: "Paris Expo", type: "Salon" },
  { title: "Innovation Week", date: "10 Mar 2024", location: "Lyon", type: "Workshop" },
  { title: "FoodTech Forum", date: "18 Mar 2024", location: "Bordeaux", type: "Forum" },
]

const startups = [
  { name: "AgroSense", sector: "Capteurs IoT", funding: "2.5M€", stage: "Série A" },
  { name: "CropAI", sector: "IA Prédictive", funding: "1.8M€", stage: "Seed" },
  { name: "GreenTech Solutions", sector: "Agriculture Verticale", funding: "4.2M€", stage: "Série B" },
  { name: "BioFarm", sector: "Biotechnologie", funding: "3.1M€", stage: "Série A" },
]

const insights = [
  { title: "Adoption IA en Agriculture", progress: 78, trend: "+12%" },
  { title: "Investissements AgriTech", progress: 65, trend: "+8%" },
  { title: "Agriculture Durable", progress: 89, trend: "+15%" },
  { title: "Robotique Agricole", progress: 45, trend: "+22%" },
]

const opportunities = [
  { title: "Appel à projets Innovation", deadline: "30 Jan 2024", budget: "500K€" },
  { title: "Concours AgriTech", deadline: "15 Fév 2024", budget: "1M€" },
  { title: "Subvention Recherche", deadline: "28 Fév 2024", budget: "750K€" },
]

export function DashboardGrid() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Agenda AgriTech */}
      <Card
        className="bg-primary text-primary-foreground min-h-[350px] hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setSelectedSection(selectedSection === "agenda" ? null : "agenda")}
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Calendar className="w-5 h-5" />
            Agenda AgriTech mondial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {agendaEvents.map((event, index) => (
            <div key={index} className="p-3 bg-primary-foreground/10 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">{event.title}</h4>
                <Badge variant="secondary" className="text-xs">
                  {event.type}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <Clock className="w-3 h-3" />
                {event.date}
              </div>
              <div className="flex items-center gap-2 text-xs opacity-90 mt-1">
                <MapPin className="w-3 h-3" />
                {event.location}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Startups à la une */}
      <Card
        className="bg-primary text-primary-foreground min-h-[350px] hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setSelectedSection(selectedSection === "startups" ? null : "startups")}
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="w-5 h-5" />
            Startups à la une
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {startups.map((startup, index) => (
            <div key={index} className="p-3 bg-primary-foreground/10 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">{startup.name}</h4>
                <Badge variant="secondary" className="text-xs">
                  {startup.stage}
                </Badge>
              </div>
              <p className="text-xs opacity-90 mb-2">{startup.sector}</p>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <Briefcase className="w-3 h-3" />
                {startup.funding}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tendances & Insights */}
      <Card
        className="bg-card border-2 border-primary min-h-[350px] hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setSelectedSection(selectedSection === "insights" ? null : "insights")}
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
            <Lightbulb className="w-5 h-5" />
            Tendances & Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-card-foreground">{insight.title}</span>
                <Badge variant="outline" className="text-xs text-green-600">
                  {insight.trend}
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${insight.progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground text-right">{insight.progress}%</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Opportunités & appels à projets */}
      <Card
        className="bg-primary text-primary-foreground min-h-[350px] hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setSelectedSection(selectedSection === "opportunities" ? null : "opportunities")}
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Target className="w-5 h-5" />
            Opportunités & appels à projets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {opportunities.map((opportunity, index) => (
            <div key={index} className="p-3 bg-primary-foreground/10 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">{opportunity.title}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs opacity-90 mb-1">
                <Clock className="w-3 h-3" />
                Échéance: {opportunity.deadline}
              </div>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <Users className="w-3 h-3" />
                Budget: {opportunity.budget}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
