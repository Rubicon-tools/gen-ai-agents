"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Linkedin, Twitter, ExternalLink, MapPin, Users, TrendingUp } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/page-header"

const influencers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "CEO & Fondatrice, GreenTech Innovations",
    location: "San Francisco, CA",
    followers: "125K",
    engagement: "8.5%",
    avatar: "/professional-woman-ceo.png",
    cover: "/placeholder-jneqk.png",
    bio: "Pionnière en agriculture de précision et intelligence artificielle appliquée à l'agriculture durable.",
    specialties: ["IA Agricole", "Agriculture de Précision", "Durabilité"],
    lastPost: {
      content:
        "L'avenir de l'agriculture réside dans l'harmonisation entre technologie et nature. Nos derniers algorithmes d'IA permettent une réduction de 40% de l'usage d'eau tout en augmentant les rendements de 25%.",
      timestamp: "Il y a 2 heures",
      likes: 1250,
      shares: 89,
    },
    linkedin: "https://linkedin.com/in/sarahjohnson",
    twitter: "https://twitter.com/sarahjohnson",
  },
  {
    id: 2,
    name: "Ahmed Ben Salah",
    title: "Directeur Innovation, AgriTech Africa",
    location: "Casablanca, Maroc",
    followers: "89K",
    engagement: "12.3%",
    avatar: "/professional-man-director.jpg",
    cover: "/moroccan-agriculture-technology.jpg",
    bio: "Expert en solutions AgriTech adaptées aux défis africains. Spécialiste en irrigation intelligente et agriculture climato-résiliente.",
    specialties: ["Irrigation Intelligente", "Agriculture Africaine", "Climat"],
    lastPost: {
      content:
        "Fier d'annoncer que notre système d'irrigation intelligente a permis à 500 agriculteurs marocains d'économiser 60% d'eau cette saison. L'innovation au service de notre continent ! 🌍",
      timestamp: "Il y a 5 heures",
      likes: 892,
      shares: 156,
    },
    linkedin: "https://linkedin.com/in/ahmedbensalah",
    twitter: "https://twitter.com/ahmedbensalah",
  },
  {
    id: 3,
    name: "Prof. Maria Rodriguez",
    title: "Chercheuse Senior, MIT AgriLab",
    location: "Boston, MA",
    followers: "156K",
    engagement: "15.7%",
    avatar: "/professional-woman-professor.png",
    cover: "/mit-laboratory-agriculture.jpg",
    bio: "Professeure et chercheuse en biotechnologies agricoles. Pionnière dans le développement de cultures résistantes au changement climatique.",
    specialties: ["Biotechnologies", "Génétique Végétale", "Recherche"],
    lastPost: {
      content:
        "Nos dernières recherches sur les cultures résistantes à la sécheresse montrent des résultats prometteurs. Publication complète dans Nature Biotechnology la semaine prochaine.",
      timestamp: "Il y a 1 jour",
      likes: 2341,
      shares: 445,
    },
    linkedin: "https://linkedin.com/in/mariarodriguez",
    twitter: "https://twitter.com/mariarodriguez",
  },
]

export default function InfluencersPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const categories = ["Tous", "IA Agricole", "Durabilité", "Innovation", "Recherche"]

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Influenceurs AgriTech"
        description="Découvrez les leaders d'opinion qui façonnent l'avenir de l'agriculture mondiale"
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {influencers.map((influencer) => (
            <Card key={influencer.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-32 bg-gradient-to-r from-primary/20 to-secondary/20">
                <img
                  src={influencer.cover || "/placeholder.svg"}
                  alt={`${influencer.name} cover`}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <CardHeader className="relative -mt-12 pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                    <AvatarImage src={influencer.avatar || "/placeholder.svg"} alt={influencer.name} />
                    <AvatarFallback>
                      {influencer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 pt-8">
                    <CardTitle className="text-lg mb-1">{influencer.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">{influencer.title}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {influencer.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {influencer.followers}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {influencer.engagement}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{influencer.bio}</p>

                <div className="flex flex-wrap gap-1">
                  {influencer.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Dernière publication</span>
                    <span className="text-xs text-muted-foreground">{influencer.lastPost.timestamp}</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3">{influencer.lastPost.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{influencer.lastPost.likes} likes</span>
                    <span>{influencer.lastPost.shares} partages</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                    <a href={influencer.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-1" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                    <a href={influencer.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-4 h-4 mr-1" />
                      Twitter
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
