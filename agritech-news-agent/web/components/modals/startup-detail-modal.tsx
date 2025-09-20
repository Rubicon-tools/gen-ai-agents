"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, MapPin, Calendar, DollarSign, Users, TrendingUp, ExternalLink, Globe } from "lucide-react"

interface Startup {
  id: number
  name: string
  description: string
  logo: string
  founded: string
  location: string
  stage: string
  funding: string
  employees: string
  category: string
  website: string
  growth: string
  investors: string[]
  keyMetrics: {
    customers: string
    revenue: string
    growth: string
  }
}

interface StartupDetailModalProps {
  startup: Startup | null
  isOpen: boolean
  onClose: () => void
}

export function StartupDetailModal({ startup, isOpen, onClose }: StartupDetailModalProps) {
  if (!startup) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center border border-primary/20">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl text-card-foreground mb-2">{startup.name}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary">
                  {startup.category}
                </Badge>
                <Badge variant="secondary">{startup.stage}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed text-lg">{startup.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{startup.founded}</p>
                <p className="text-sm text-muted-foreground">Fondée</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{startup.location}</p>
                <p className="text-sm text-muted-foreground">Localisation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{startup.funding}</p>
                <p className="text-sm text-muted-foreground">Financement</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{startup.employees}</p>
                <p className="text-sm text-muted-foreground">Employés</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Métriques clés</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{startup.keyMetrics.customers}</div>
                <div className="text-sm text-muted-foreground">Clients</div>
              </div>
              <div className="text-center p-4 bg-secondary/5 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{startup.keyMetrics.revenue}</div>
                <div className="text-sm text-muted-foreground">Revenus annuels</div>
              </div>
              <div className="text-center p-4 bg-chart-1/5 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="w-5 h-5 text-chart-1" />
                  <span className="text-2xl font-bold text-chart-1">{startup.keyMetrics.growth}</span>
                </div>
                <div className="text-sm text-muted-foreground">Croissance</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-3">Investisseurs</h3>
            <div className="flex flex-wrap gap-2">
              {startup.investors.map((investor, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {investor}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1 bg-primary text-primary-foreground">
              <Globe className="w-4 h-4 mr-2" />
              Visiter le site web
            </Button>
            <Button variant="outline" size="icon">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
