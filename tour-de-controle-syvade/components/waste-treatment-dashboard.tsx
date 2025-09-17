"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricsCard } from "@/components/metrics-card"
import { ChevronDown, CheckCircle, Clock, Layers } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Données pour les graphiques
const layerData = [
  { month: "Jan", couches: 12, volume: 8500, compaction: 0.85 },
  { month: "Fév", couches: 15, volume: 9200, compaction: 0.88 },
  { month: "Mar", couches: 18, volume: 10100, compaction: 0.82 },
  { month: "Avr", couches: 14, volume: 8900, compaction: 0.86 },
  { month: "Mai", couches: 16, volume: 9800, compaction: 0.84 },
  { month: "Jun", couches: 13, volume: 8700, compaction: 0.87 },
]

const wasteTypeData = [
  { name: "Déchets ménagers", value: 45, color: "#10b981" },
  { name: "Déchets industriels", value: 30, color: "#3b82f6" },
  { name: "Déchets verts", value: 15, color: "#84cc16" },
  { name: "Refus de tri", value: 10, color: "#ef4444" },
]

const optimizationData = [
  { indicator: "Durée de vie ISDND", current: "12.5 ans", target: "15 ans", progress: 83 },
  { indicator: "Taux de compaction", current: "0.85 t/m³", target: "0.90 t/m³", progress: 94 },
  { indicator: "Réduction impact CO2", current: "15%", target: "25%", progress: 60 },
  { indicator: "Optimisation couches", current: "85%", target: "95%", progress: 89 },
]

export function WasteTreatmentDashboard() {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Traitement des déchets</h1>
          <div className="text-sm text-muted-foreground">
            Enfouissement par couches successives - ISDND de la Gabarre
          </div>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          Zone d'enfouissement A
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricsCard
          title="Couches actives"
          value="16"
          unit="couches"
          change={{ value: "2", percentage: "+14.3%", isPositive: true }}
        />
        <MetricsCard
          title="Volume traité mensuel"
          value="9,800"
          unit="m³"
          change={{ value: "900", percentage: "+10.1%", isPositive: true }}
        />
        <MetricsCard
          title="Taux de compaction"
          value="0.84"
          unit="t/m³"
          change={{ value: "0.02", percentage: "+2.4%", isPositive: true }}
        />
        <MetricsCard
          title="Durée de vie restante"
          value="12.5"
          unit="années"
          change={{ value: "2.5", percentage: "+25%", isPositive: true }}
        />
      </div>

      {/* Métriques secondaires */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricsCard
          title="Épaisseur moyenne couche"
          value="2.8"
          unit="mètres"
          change={{ value: "0.3", percentage: "+12%", isPositive: true }}
        />
        <MetricsCard
          title="Temps de stabilisation"
          value="45"
          unit="jours"
          change={{ value: "5", percentage: "-10%", isPositive: true }}
        />
        <MetricsCard
          title="Efficacité enfouissement"
          value="94.2"
          unit="%"
          change={{ value: "1.8", percentage: "+1.9%", isPositive: true }}
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Évolution des couches */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Évolution des couches d'enfouissement</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost">
                6M
              </Button>
              <Button size="sm" variant="ghost">
                1A
              </Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={layerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f9fafb",
                }}
              />
              <Bar dataKey="couches" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Répartition par type de déchets */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Répartition par type de déchets</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={wasteTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {wasteTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f9fafb",
                }}
                formatter={(value: number) => [`${value}%`, "Pourcentage"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {wasteTypeData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Optimisation de la gestion */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Optimisation de la gestion des déchets enfouis</h2>
          <p className="text-sm text-muted-foreground">
            Stratégies pour prolonger la durée de vie de l'ISDND et réduire l'impact environnemental
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {optimizationData.map((item, index) => (
            <div key={index} className="p-4 rounded-lg border bg-card/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{item.indicator}</h3>
                <span className="text-sm text-muted-foreground">{item.progress}%</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Actuel: {item.current}</span>
                <span className="text-sm text-emerald-600">Objectif: {item.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Indicateurs de performance */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium">Conformité réglementaire</p>
              <p className="text-2xl font-bold text-emerald-600">100%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Layers className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Couches optimisées</p>
              <p className="text-2xl font-bold text-blue-600">89%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium">Temps de traitement</p>
              <p className="text-2xl font-bold text-amber-600">-15%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
