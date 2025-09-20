"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User, Eye, MessageCircle, Heart, Clock } from "lucide-react"
import { PageHeader } from "@/components/page-header"

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "L'Intelligence Artificielle révolutionne l'agriculture marocaine",
    excerpt:
      "Découvrez comment les nouvelles technologies IA transforment les pratiques agricoles traditionnelles au Maroc et augmentent les rendements de 30%.",
    author: "Dr. Amina Benali",
    date: "2024-01-15",
    category: "IA & Agriculture",
    readTime: "5 min",
    views: 1250,
    comments: 23,
    likes: 89,
    image: "/ai-agriculture-morocco-technology.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Startups AgriTech : Les licornes de demain",
    excerpt:
      "Analyse des tendances du marché AgriTech et présentation des startups les plus prometteuses qui façonnent l'avenir de l'agriculture.",
    author: "Youssef El Mansouri",
    date: "2024-01-12",
    category: "Startups",
    readTime: "8 min",
    views: 980,
    comments: 15,
    likes: 67,
    image: "/agritech-startups-innovation-technology.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "Irrigation intelligente : Économiser l'eau avec l'IoT",
    excerpt:
      "Les capteurs IoT et l'analyse de données permettent une gestion optimale de l'irrigation, réduisant la consommation d'eau de 40%.",
    author: "Fatima Zahra Alami",
    date: "2024-01-10",
    category: "IoT & Capteurs",
    readTime: "6 min",
    views: 756,
    comments: 12,
    likes: 45,
    image: "/smart-irrigation-iot-sensors-water-management.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "Blockchain dans la traçabilité alimentaire",
    excerpt:
      "Comment la blockchain garantit la transparence de la chaîne alimentaire et renforce la confiance des consommateurs.",
    author: "Omar Benjelloun",
    date: "2024-01-08",
    category: "Blockchain",
    readTime: "7 min",
    views: 623,
    comments: 8,
    likes: 34,
    image: "/blockchain-food-traceability-supply-chain.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "Drones agricoles : Surveillance et optimisation des cultures",
    excerpt:
      "L'utilisation de drones équipés de capteurs multispectral révolutionne le monitoring des cultures et la détection précoce des maladies.",
    author: "Rachid Tazi",
    date: "2024-01-05",
    category: "Drones & Imagerie",
    readTime: "9 min",
    views: 892,
    comments: 19,
    likes: 78,
    image: "/agricultural-drones-crop-monitoring-multispectral.jpg",
    featured: true,
  },
]

const categories = ["Tous", "IA & Agriculture", "Startups", "IoT & Capteurs", "Blockchain", "Drones & Imagerie"]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [sortBy, setSortBy] = useState("recent")

  const filteredPosts = blogPosts
    .filter(
      (post) =>
        (selectedCategory === "Tous" || post.category === selectedCategory) &&
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === "popular") return b.views - a.views
      if (sortBy === "liked") return b.likes - a.likes
      return 0
    })

  const featuredPost = blogPosts.find((post) => post.featured)

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Blog AgriTech" description="Actualités, analyses et tendances de l'agriculture intelligente" />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher des articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-green-200 focus:border-green-400 focus:ring-green-400"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-green-400"
              >
                <option value="recent">Plus récents</option>
                <option value="popular">Plus vus</option>
                <option value="liked">Plus aimés</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    : "border-green-200 text-green-700 hover:bg-green-50"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {featuredPost && selectedCategory === "Tous" && !searchTerm && (
          <Card className="mb-8 overflow-hidden border-green-200 shadow-lg">
            <div className="relative">
              <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                Article vedette
              </Badge>
              <img
                src={featuredPost.image || "/placeholder.svg"}
                alt={featuredPost.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <Badge className="mb-2 bg-green-600/80 text-white">{featuredPost.category}</Badge>
                <h2 className="text-2xl font-bold mb-2">{featuredPost.title}</h2>
                <p className="text-gray-200 mb-4">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredPost.date).toLocaleDateString("fr-FR")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden border-green-100 hover:shadow-lg transition-all duration-300 hover:border-green-200"
            >
              <div className="relative">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
                <Badge className="absolute top-3 left-3 bg-green-600/90 text-white text-xs">{post.category}</Badge>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2 text-gray-800 hover:text-green-700 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 text-gray-600">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                  Lire l'article
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 bg-transparent"
          >
            Charger plus d'articles
          </Button>
        </div>
      </div>
    </div>
  )
}
