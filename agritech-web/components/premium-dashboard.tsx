"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Calendar,
  FileText,
  Rocket,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Users,
  GraduationCap,
} from "lucide-react"

export function PremiumDashboard() {
  return (
    <div className="space-y-8 p-6">
      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements à Venir</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary animate-count-up">127</div>
            <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publications Scientifiques</CardTitle>
            <FileText className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary animate-count-up">2,847</div>
            <p className="text-xs text-muted-foreground">+8% cette semaine</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Start-ups Actives</CardTitle>
            <Rocket className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1 animate-count-up">1,234</div>
            <p className="text-xs text-muted-foreground">+23% ce trimestre</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fonds Levés (M€)</CardTitle>
            <DollarSign className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2 animate-count-up">€847M</div>
            <p className="text-xs text-muted-foreground">+34% cette année</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Latest Events - Enhanced with calendar icons */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Événements Prochains
              </span>
              <Link href="/events">
                <Button variant="ghost" size="sm">
                  Voir tout <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "AgriTech Summit 2024", date: "15 Déc", location: "Casablanca", type: "Conférence" },
              { title: "Smart Farming Expo", date: "22 Déc", location: "Rabat", type: "Exposition" },
              { title: "Innovation Forum", date: "8 Jan", location: "Marrakech", type: "Forum" },
            ].map((event, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <div>
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    {event.type}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Latest Publications */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary" />
                Publications Récentes
              </span>
              <Link href="/publications">
                <Button variant="ghost" size="sm">
                  Voir tout <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "IA et Agriculture de Précision", journal: "Nature AgriTech", date: "2 jours" },
              { title: "Blockchain dans la Supply Chain", journal: "AgTech Review", date: "5 jours" },
              { title: "Capteurs IoT pour l'Irrigation", journal: "Smart Farming", date: "1 semaine" },
            ].map((pub, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <h4 className="font-medium text-sm mb-1">{pub.title}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{pub.journal}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{pub.date}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Startups */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-chart-1" />
                Start-ups Tendances
              </span>
              <Link href="/startups">
                <Button variant="ghost" size="sm">
                  Voir tout <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "GreenTech Solutions", funding: "€15M", stage: "Série A", trend: "+45%" },
              { name: "AgriBot Systems", funding: "€8M", stage: "Seed", trend: "+32%" },
              { name: "CropAI Analytics", funding: "€22M", stage: "Série B", trend: "+67%" },
            ].map((startup, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <h4 className="font-medium text-sm">{startup.name}</h4>
                  <p className="text-xs text-muted-foreground">{startup.stage}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{startup.funding}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">{startup.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Influencers to Follow */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Influenceurs à Suivre
              </span>
              <Link href="/influencers">
                <Button variant="ghost" size="sm">
                  Voir tout <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Dr. Sarah Chen", role: "AgriTech Expert", followers: "125K", platform: "LinkedIn" },
              { name: "Marc Dubois", role: "Innovation Director", followers: "89K", platform: "Twitter" },
              { name: "Prof. Amina Alami", role: "Smart Farming", followers: "156K", platform: "LinkedIn" },
            ].map((influencer, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {influencer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{influencer.name}</h4>
                    <p className="text-xs text-muted-foreground">{influencer.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{influencer.followers}</p>
                  <p className="text-xs text-muted-foreground">{influencer.platform}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Formations */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Formations Recommandées
            </span>
            <Link href="/formations">
              <Button variant="ghost" size="sm">
                Voir tout <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "IA en Agriculture",
                provider: "AgriTech Academy",
                duration: "6 semaines",
                level: "Intermédiaire",
                price: "€299",
              },
              {
                title: "Blockchain & Supply Chain",
                provider: "Tech Institute",
                duration: "4 semaines",
                level: "Avancé",
                price: "€399",
              },
              {
                title: "IoT pour l'Agriculture",
                provider: "Smart Farm School",
                duration: "8 semaines",
                level: "Débutant",
                price: "€199",
              },
            ].map((formation, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <Badge variant="outline" className="text-xs">
                    {formation.level}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm mb-1">{formation.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{formation.provider}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{formation.duration}</span>
                  <span className="font-medium text-sm text-blue-600">{formation.price}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
