"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Users, ExternalLink, Download, Eye } from "lucide-react"

interface Publication {
  id: number
  title: string
  authors: string[]
  journal: string
  date: string
  abstract: string
  category: string
  type: string
  doi: string
  citations: number
  downloads: number
  keywords: string[]
  url: string
}

interface PublicationDetailModalProps {
  publication: Publication | null
  isOpen: boolean
  onClose: () => void
}

export function PublicationDetailModal({ publication, isOpen, onClose }: PublicationDetailModalProps) {
  if (!publication) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center border border-primary/20">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl text-card-foreground mb-2 leading-tight">{publication.title}</DialogTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-primary border-primary">
                  {publication.category}
                </Badge>
                <Badge variant="secondary">{publication.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{publication.journal}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{publication.date}</p>
                <p className="text-sm text-muted-foreground">Date de publication</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{publication.citations}</p>
                <p className="text-sm text-muted-foreground">Citations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{publication.downloads}</p>
                <p className="text-sm text-muted-foreground">Téléchargements</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Auteurs</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {publication.authors.map((author, index) => (
                <Badge key={index} variant="outline">
                  {author}
                </Badge>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-3">Résumé</h3>
            <p className="text-muted-foreground leading-relaxed">{publication.abstract}</p>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-3">Mots-clés</h3>
            <div className="flex flex-wrap gap-2">
              {publication.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="text-sm text-muted-foreground mb-4">
              <strong>DOI:</strong> {publication.doi}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1 bg-primary text-primary-foreground">
              <Download className="w-4 h-4 mr-2" />
              Télécharger le PDF
            </Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Voir en ligne
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
