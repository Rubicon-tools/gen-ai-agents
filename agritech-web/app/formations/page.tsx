"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, Star, Calendar, Play, BookOpen, Award, Filter } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/page-header"

const formations = [
  {
    id: 1,
    title: "Intelligence Artificielle en Agriculture",
    instructor: "Dr. Sarah Johnson",
    instructorAvatar: "/professional-woman-instructor.jpg",
    duration: "8 semaines",
    students: 1250,
    rating: 4.9,
    price: "299€",
    level: "Intermédiaire",
    category: "IA & Tech",
    thumbnail: "/placeholder-gi15d.png",
    description:
      "Maîtrisez les applications de l'IA dans l'agriculture moderne : vision par ordinateur, apprentissage automatique et analyse prédictive.",
    modules: 12,
    certificate: true,
    startDate: "15 Mars 2024",
  },
  {
    id: 2,
    title: "Agriculture de Précision et Drones",
    instructor: "Ahmed Ben Salah",
    instructorAvatar: "/professional-man-instructor.jpg",
    duration: "6 semaines",
    students: 890,
    rating: 4.8,
    price: "249€",
    level: "Débutant",
    category: "Technologie",
    thumbnail: "/placeholder-yn7g2.png",
    description:
      "Apprenez à utiliser les drones et capteurs pour optimiser vos pratiques agricoles et maximiser vos rendements.",
    modules: 10,
    certificate: true,
    startDate: "22 Mars 2024",
  },
  {
    id: 3,
    title: "Financement et Investissement AgriTech",
    instructor: "Prof. Maria Rodriguez",
    instructorAvatar: "/professional-woman-finance.png",
    duration: "4 semaines",
    students: 567,
    rating: 4.7,
    price: "199€",
    level: "Avancé",
    category: "Business",
    thumbnail: "/placeholder-176rr.png",
    description:
      "Découvrez les stratégies de financement, les métriques clés et les opportunités d'investissement dans l'AgriTech.",
    modules: 8,
    certificate: true,
    startDate: "1 Avril 2024",
  },
]

export default function FormationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Toutes")
  const [selectedLevel, setSelectedLevel] = useState("Tous")

  const categories = ["Toutes", "IA & Tech", "Technologie", "Business", "Durabilité"]
  const levels = ["Tous", "Débutant", "Intermédiaire", "Avancé"]

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Formations AgriTech"
        description="Développez vos compétences avec nos formations certifiantes dispensées par des experts du secteur"
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Catégorie:</span>
            <div className="flex gap-1">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Niveau:</span>
            <div className="flex gap-1">
              {levels.map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className="rounded-full"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {formations.map((formation) => (
            <Card key={formation.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img
                  src={formation.thumbnail || "/placeholder.svg"}
                  alt={formation.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">{formation.category}</Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">{formation.level}</Badge>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg leading-tight">{formation.title}</CardTitle>
                  <span className="text-2xl font-bold text-primary">{formation.price}</span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={formation.instructorAvatar || "/placeholder.svg"} alt={formation.instructor} />
                    <AvatarFallback>
                      {formation.instructor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{formation.instructor}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formation.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {formation.students}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {formation.rating}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{formation.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span>{formation.modules} modules</span>
                    </div>
                    {formation.certificate && (
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-primary" />
                        <span>Certificat</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Début: {formation.startDate}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1">S'inscrire</Button>
                  <Button variant="outline" size="sm">
                    Aperçu
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
