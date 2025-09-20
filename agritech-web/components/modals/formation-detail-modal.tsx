"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Calendar, Clock, MapPin, Users, DollarSign, Star, ExternalLink } from "lucide-react"

interface Formation {
  id: number
  title: string
  provider: string
  description: string
  duration: string
  format: string
  level: string
  price: string
  startDate: string
  location: string
  instructor: string
  rating: number
  students: number
  category: string
  skills: string[]
  prerequisites: string[]
  certification: boolean
}

interface FormationDetailModalProps {
  formation: Formation | null
  isOpen: boolean
  onClose: () => void
}

export function FormationDetailModal({ formation, isOpen, onClose }: FormationDetailModalProps) {
  if (!formation) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center border border-primary/20">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl text-card-foreground mb-2 leading-tight">{formation.title}</DialogTitle>
              <p className="text-lg text-muted-foreground mb-2">{formation.provider}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary">
                  {formation.category}
                </Badge>
                <Badge variant="secondary">{formation.level}</Badge>
                {formation.certification && (
                  <Badge variant="default" className="bg-chart-1 text-white">
                    Certification
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">{formation.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{formation.duration}</p>
                <p className="text-sm text-muted-foreground">Durée</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{formation.startDate}</p>
                <p className="text-sm text-muted-foreground">Début</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{formation.location}</p>
                <p className="text-sm text-muted-foreground">Format</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{formation.price}</p>
                <p className="text-sm text-muted-foreground">Prix</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
              <Star className="w-6 h-6 text-primary" />
              <div>
                <p className="text-xl font-bold text-primary">{formation.rating}/5</p>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-lg">
              <Users className="w-6 h-6 text-secondary" />
              <div>
                <p className="text-xl font-bold text-secondary">{formation.students}</p>
                <p className="text-sm text-muted-foreground">Étudiants inscrits</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-3">Compétences acquises</h3>
            <div className="flex flex-wrap gap-2">
              {formation.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-3">Prérequis</h3>
            <div className="flex flex-wrap gap-2">
              {formation.prerequisites.map((prereq, index) => (
                <Badge key={index} variant="outline">
                  {prereq}
                </Badge>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="text-sm text-muted-foreground mb-4">
              <strong>Formateur:</strong> {formation.instructor}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1 bg-primary text-primary-foreground">S'inscrire à la formation</Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Aperçu gratuit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
