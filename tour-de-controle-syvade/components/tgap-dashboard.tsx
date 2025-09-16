"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MetricsCard } from "@/components/metrics-card"
import { CheckCircle, Euro, Target, Lightbulb } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Données simulées pour la TGAP
const tgapEvolutionData = [
  { month: "Jan", tgapCost: 3250000, tonnage: 50000, optimizedCost: 2925000 },
  { month: "Fév", tgapCost: 3380000, tonnage: 52000, optimizedCost: 3042000 },
  { month: "Mar", tgapCost: 3445000, tonnage: 53000, optimizedCost: 3100500 },
  { month: "Avr", tgapCost: 3315000, tonnage: 51000, optimizedCost: 2983500 },
  { month: "Mai", tgapCost: 3510000, tonnage: 54000, optimizedCost: 3159000 },
  { month: "Jun", tgapCost: 3575000, tonnage: 55000, optimizedCost: 3217500 },
]

const optimizationOpportunities = [
  {
    title: "Amélioration du captage biogaz",
    currentRate: 68,
    targetRate: 75,
    potentialSaving: 325000,
    priority: "Haute",
    description: "Atteindre 75% de captage pour bénéficier du tarif réduit TGAP",
  },
  {
    title: "Réduction tonnage enfouissement",
    currentRate: 85,
    targetRate: 78,
    potentialSaving: 455000,
    priority: "Haute",
    description: "Améliorer le tri et la valorisation pour réduire les déchets enfouis",
  },
  {
    title: "Optimisation gestion lixiviats",
    currentRate: 92,
    targetRate: 98,
    potentialSaving: 125000,
    priority: "Moyenne",
    description: "Éviter les dépassements et majorations environnementales",
  },
]

export function TgapDashboard() {
  const currentYearTgap = 41600000 // 41.6M€ estimé pour l'année
  const potentialSavings = 905000 // 905k€ d'économies potentielles
  const currentTonnage = 640000 // 640k tonnes/an
  const biogasCaptureRate = 68 // 68%

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Gestion TGAP - Optimisation Fiscale</h1>
          <div className="text-sm text-muted-foreground">Taxe Générale sur les Activités Polluantes - Année 2024</div>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Euro className="h-4 w-4" />
          Rapport TGAP
        </Button>
      </div>

      {/* Métriques principales TGAP */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricsCard
          title="Coût TGAP annuel estimé"
          value="41.6"
          unit="M€"
          change={{ value: "2.8M€", percentage: "+7.2%", isPositive: false }}
        />
        <MetricsCard
          title="Tonnage soumis TGAP"
          value="640"
          unit="k tonnes"
          change={{ value: "25k", percentage: "+4.1%", isPositive: false }}
        />
        <MetricsCard
          title="Taux captage biogaz"
          value="68"
          unit="%"
          change={{ value: "3%", percentage: "+4.6%", isPositive: true }}
        />
        <MetricsCard
          title="Économies potentielles"
          value="905"
          unit="k€"
          change={{ value: "125k€", percentage: "+16%", isPositive: true }}
        />
      </div>

      {/* Tarifs TGAP actuels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5 text-amber-600" />
            Tarifs TGAP 2024-2025
          </CardTitle>
          <CardDescription>Évolution des tarifs selon la réglementation en vigueur</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Déchets enfouis (stockage)</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tarif standard</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600 dark:text-red-400">65€/tonne</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">2025</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Déchets incinérés</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Traitement thermique</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-orange-600 dark:text-orange-400">41€/tonne</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">2025</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Tarif réduit (captage &gt;75%)</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avec valorisation biogaz</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600 dark:text-green-400">-20%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Réduction</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Limite réglementaire</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tonnage maximum autorisé</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600 dark:text-blue-400">105k tonnes</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Annuel</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graphique évolution TGAP */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des coûts TGAP</CardTitle>
          <CardDescription>Comparaison coût actuel vs coût optimisé (en €)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tgapEvolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `${(value as number).toLocaleString()}€`,
                  name === "tgapCost" ? "Coût actuel" : "Coût optimisé",
                ]}
              />
              <Line type="monotone" dataKey="tgapCost" stroke="#ef4444" strokeWidth={2} name="Coût actuel" />
              <Line
                type="monotone"
                dataKey="optimizedCost"
                stroke="#22c55e"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Coût optimisé"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Opportunités d'optimisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-600" />
            Opportunités d'optimisation TGAP
          </CardTitle>
          <CardDescription>Actions prioritaires pour réduire les coûts fiscaux</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationOpportunities.map((opportunity, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <div>
                      <h3 className="font-medium">{opportunity.title}</h3>
                      <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={opportunity.priority === "Haute" ? "destructive" : "secondary"}>
                      {opportunity.priority}
                    </Badge>
                    <div className="text-sm font-medium text-green-600 mt-1">
                      +{opportunity.potentialSaving.toLocaleString()}€/an
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Progression: {opportunity.currentRate}% → {opportunity.targetRate}%
                    </span>
                    <span>{Math.round((opportunity.currentRate / opportunity.targetRate) * 100)}% atteint</span>
                  </div>
                  <Progress value={(opportunity.currentRate / opportunity.targetRate) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions recommandées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            Plan d'action recommandé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-emerald-600">Actions immédiates (0-3 mois)</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Audit du système de captage biogaz
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Installation de capteurs IoT supplémentaires
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Optimisation des circuits de collecte
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-blue-600">Actions moyen terme (3-12 mois)</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Amélioration du tri à la source
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Mise en place d'une filière de valorisation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Formation des équipes opérationnelles
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
