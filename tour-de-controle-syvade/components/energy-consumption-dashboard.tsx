"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { Zap, TrendingUp, TrendingDown, Factory, Lightbulb, Gauge, Target, Euro, Calendar } from "lucide-react"

const monthlyConsumption = [
  { month: "Jan", consumption: 145000, cost: 18500, target: 140000 },
  { month: "Fév", consumption: 152000, cost: 19400, target: 140000 },
  { month: "Mar", consumption: 148000, cost: 18900, target: 140000 },
  { month: "Avr", consumption: 143000, cost: 18200, target: 140000 },
  { month: "Mai", consumption: 156000, cost: 19900, target: 140000 },
  { month: "Jun", consumption: 162000, cost: 20700, target: 140000 },
  { month: "Jul", consumption: 168000, cost: 21400, target: 140000 },
  { month: "Aoû", consumption: 165000, cost: 21000, target: 140000 },
]

const equipmentConsumption = [
  { name: "Compacteurs", value: 35, consumption: 58000, color: "#8b5cf6" },
  { name: "Pompes lixiviats", value: 25, consumption: 41500, color: "#06b6d4" },
  { name: "Torchère biogaz", value: 20, consumption: 33200, color: "#f59e0b" },
  { name: "Éclairage", value: 12, consumption: 19900, color: "#10b981" },
  { name: "Bureaux", value: 8, consumption: 13300, color: "#ef4444" },
]

const dailyProfile = [
  { hour: "00h", consumption: 85 },
  { hour: "04h", consumption: 78 },
  { hour: "08h", consumption: 145 },
  { hour: "12h", consumption: 165 },
  { hour: "16h", consumption: 158 },
  { hour: "20h", consumption: 125 },
]

const efficiencyMetrics = [
  { metric: "kWh/tonne déchets", current: 2.8, target: 2.5, unit: "kWh/t" },
  { metric: "Facteur de charge", current: 78, target: 85, unit: "%" },
  { metric: "Rendement énergétique", current: 82, target: 90, unit: "%" },
]

export function EnergyConsumptionDashboard() {
  const currentConsumption = 165000
  const previousConsumption = 162000
  const consumptionChange = (((currentConsumption - previousConsumption) / previousConsumption) * 100).toFixed(1)

  const currentCost = 21000
  const previousCost = 20700
  const costChange = (((currentCost - previousCost) / previousCost) * 100).toFixed(1)

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Consommation Énergétique
          </h1>
          <p className="text-gray-400 mt-2">Suivi et optimisation de la consommation énergétique</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-transparent border-gray-600 text-white hover:bg-gray-800">
            <Calendar className="h-4 w-4 mr-2" />
            Août 2023
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Consommation Mensuelle</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{currentConsumption.toLocaleString()}</div>
            <div className="text-xs text-gray-400">kWh</div>
            <div className="flex items-center mt-2">
              {Number.parseFloat(consumptionChange) > 0 ? (
                <TrendingUp className="h-3 w-3 text-red-400 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-green-400 mr-1" />
              )}
              <span
                className={`text-xs ${Number.parseFloat(consumptionChange) > 0 ? "text-red-400" : "text-green-400"}`}
              >
                {consumptionChange}% vs mois précédent
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Coût Énergétique</CardTitle>
            <Euro className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{currentCost.toLocaleString()} €</div>
            <div className="text-xs text-gray-400">Facture mensuelle</div>
            <div className="flex items-center mt-2">
              {Number.parseFloat(costChange) > 0 ? (
                <TrendingUp className="h-3 w-3 text-red-400 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-green-400 mr-1" />
              )}
              <span className={`text-xs ${Number.parseFloat(costChange) > 0 ? "text-red-400" : "text-green-400"}`}>
                {costChange}% vs mois précédent
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Puissance Moyenne</CardTitle>
            <Gauge className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">221</div>
            <div className="text-xs text-gray-400">kW</div>
            <div className="flex items-center mt-2">
              <div className="text-xs text-gray-400">Pic: 285 kW à 14h30</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Objectif Mensuel</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">118%</div>
            <div className="text-xs text-gray-400">de l'objectif</div>
            <Progress value={118} className="mt-2 h-2" />
            <div className="text-xs text-red-400 mt-1">+25,000 kWh dépassement</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Evolution */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              Évolution Mensuelle 2023
            </CardTitle>
            <CardDescription className="text-gray-400">Consommation vs Objectifs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyConsumption}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  name="Consommation (kWh)"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Objectif (kWh)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Equipment Distribution */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Factory className="h-5 w-5 text-blue-500" />
              Répartition par Équipement
            </CardTitle>
            <CardDescription className="text-gray-400">Consommation par type d'équipement</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={equipmentConsumption}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {equipmentConsumption.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                  }}
                  formatter={(value, name, props) => [
                    `${value}% (${props.payload.consumption.toLocaleString()} kWh)`,
                    props.payload.name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {equipmentConsumption.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-300">{item.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Profile and Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Profile */}
        <Card className="bg-gray-900/50 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-cyan-500" />
              Profil de Consommation Journalier
            </CardTitle>
            <CardDescription className="text-gray-400">Consommation moyenne par tranche horaire</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyProfile}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                  }}
                />
                <Bar dataKey="consumption" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Efficiency Metrics */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Indicateurs d'Efficacité
            </CardTitle>
            <CardDescription className="text-gray-400">Performance énergétique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {efficiencyMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{metric.metric}</span>
                  <Badge variant={metric.current <= metric.target ? "default" : "destructive"} className="text-xs">
                    {metric.current <= metric.target ? "Objectif atteint" : "À améliorer"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-semibold">
                    {metric.current} {metric.unit}
                  </span>
                  <span className="text-gray-400">
                    Objectif: {metric.target} {metric.unit}
                  </span>
                </div>
                <Progress
                  value={metric.unit === "%" ? metric.current : (metric.current / metric.target) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Euro className="h-5 w-5 text-green-500" />
            Analyse des Coûts Énergétiques
          </CardTitle>
          <CardDescription className="text-gray-400">Évolution des coûts et opportunités d'économies</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyConsumption}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
              />
              <Line type="monotone" dataKey="cost" stroke="#10B981" strokeWidth={3} name="Coût mensuel (€)" />
            </LineChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">Économies Potentielles</h4>
              <div className="text-2xl font-bold text-white">3,200 €/mois</div>
              <div className="text-xs text-gray-400">Optimisation des équipements</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Coût par Tonne</h4>
              <div className="text-2xl font-bold text-white">0.42 €</div>
              <div className="text-xs text-gray-400">Coût énergétique unitaire</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-400 font-semibold mb-2">Budget Annuel</h4>
              <div className="text-2xl font-bold text-white">252,000 €</div>
              <div className="text-xs text-gray-400">Projection 2023</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
