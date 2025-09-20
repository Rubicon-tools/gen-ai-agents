"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, DollarSign, ExternalLink } from "lucide-react"

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  venue: string
  type: string
  description: string
  speakers: string[]
  price: string
  status: string
}

interface EventDetailModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl text-card-foreground mb-2">{event.title}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{event.type}</Badge>
                <Badge
                  variant={event.status === "Ouvert" ? "default" : "secondary"}
                  className={event.status === "Ouvert" ? "bg-primary text-primary-foreground" : ""}
                >
                  {event.status}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{event.date}</p>
                  <p className="text-sm text-muted-foreground">Date</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{event.time}</p>
                  <p className="text-sm text-muted-foreground">Horaires</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{event.venue}</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{event.price}</p>
                  <p className="text-sm text-muted-foreground">Prix</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Intervenants ({event.speakers.length})</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.speakers.map((speaker, index) => (
                <Badge key={index} variant="secondary">
                  {speaker}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1 bg-primary text-primary-foreground">S'inscrire à l'événement</Button>
            <Button variant="outline" size="icon">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
