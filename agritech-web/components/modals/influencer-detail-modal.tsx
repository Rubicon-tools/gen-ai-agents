"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Users, ExternalLink, Twitter, Linkedin, Globe, TrendingUp } from "lucide-react"

interface Influencer {
  id: number
  name: string
  title: string
  bio: string
  avatar: string
  location: string
  followers: string
  engagement: string
  category: string
  expertise: string[]
  socialLinks: {
    twitter?: string
    linkedin?: string
    website?: string
  }
  recentPosts: number
  influence: string
}

interface InfluencerDetailModalProps {
  influencer: Influencer | null
  isOpen: boolean
  onClose: () => void
}

export function InfluencerDetailModal({ influencer, isOpen, onClose }: InfluencerDetailModalProps) {
  if (!influencer) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border border-primary/20">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl text-card-foreground mb-1">{influencer.name}</DialogTitle>
              <p className="text-lg text-muted-foreground mb-2">{influencer.title}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary">
                  {influencer.category}
                </Badge>
                <Badge variant="secondary">{influencer.influence}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">{influencer.bio}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{influencer.location}</p>
                <p className="text-sm text-muted-foreground">Localisation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{influencer.followers}</p>
                <p className="text-sm text-muted-foreground">Abonnés</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{influencer.engagement}</p>
                <p className="text-sm text-muted-foreground">Engagement</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-3">Domaines d'expertise</h3>
            <div className="flex flex-wrap gap-2">
              {influencer.expertise.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-3">Réseaux sociaux</h3>
            <div className="flex gap-3">
              {influencer.socialLinks.twitter && (
                <Button variant="outline" size="sm">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
              )}
              {influencer.socialLinks.linkedin && (
                <Button variant="outline" size="sm">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              )}
              {influencer.socialLinks.website && (
                <Button variant="outline" size="sm">
                  <Globe className="w-4 h-4 mr-2" />
                  Site web
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1 bg-primary text-primary-foreground">Suivre l'influenceur</Button>
            <Button variant="outline" size="icon">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
