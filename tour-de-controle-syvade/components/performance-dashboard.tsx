"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { Zap, Droplets, Recycle, TrendingUp, Gauge, Factory } from "lucide-react"

const energyData = [
  { name: "Énergie électrique produite", value: 10636237, unit: "kWh", color: "#10b981" },
  { name: "Énergie électrique consommée", value: 3527, unit: "kWh", color: "#f59e0b" },
  { name: "Énergie thermique valorisée", value: 11032546, unit: "kWh", color: "#3b82f6" },
]

const biogasData = [
  { name: "CH₄", value: 46.27, color: "#10b981" },
  { name: "CO₂", value: 53.73, color: "#6b7280" },
]

const operatingHoursData = [
  { name: "GE1", hours: 6910, efficiency: 79.1 },
  { name: "GE2", hours: 6952, efficiency: 79.6 },
]

const monthlyPerformance = [
  { month: "Jan", biogas: 625080, energy: 886000, efficiency: 72 },
  { month: "Fév", biogas: 567040, energy: 802000, efficiency: 71 },
  { month: "Mar", biogas: 625080, energy: 886000, efficiency: 74 },
  { month: "Avr", biogas: 604800, energy: 857000, efficiency: 73 },
  { month: "Mai", biogas: 625080, energy: 886000, efficiency: 75 },
  { month: "Jun", biogas: 604800, energy: 857000, efficiency: 74 },
  { month: "Jul", biogas: 625080, energy: 886000, efficiency: 76 },
  { month: "Aoû", biogas: 625080, energy: 886000, efficiency: 75 },
  { month: "Sep", biogas: 604800, energy: 857000, efficiency: 74 },
  { month: "Oct", biogas: 625080, energy: 886000, efficiency: 75 },
  { month: "Nov", biogas: 604800, energy: 857000, efficiency: 73 },
  { month: "Déc", biogas: 625080, energy: 886000, efficiency: 74 },
]

export function PerformanceDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Statistiques & Rendement</h1>
          <p className="text-gray-600 dark:text-gray-400">Indicateurs de performance de l'installation</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Factory className="h-4 w-4" />
          Année 2023
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume biogaz valorisé</CardTitle>
            <Recycle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7,501k</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Nm³/an</p>
            <div className="mt-2">
              <Progress value={90.45} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Taux de valorisation: 90.45%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux CH₄ dans biogaz</CardTitle>
            <Gauge className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">46.27%</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Concentration moyenne</p>
            <div className="mt-2">
              <Progress value={46.27} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Objectif: &gt;45%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficacité captage biogaz</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">74.78%</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Rendement unité</p>
            <div className="mt-2">
              <Progress value={74.78} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Objectif: &gt;75%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eau réinjectée</CardTitle>
            <Droplets className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,816</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">m³</p>
            <div className="mt-2">
              <Progress value={85} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Taux de réinjection: 85%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Energy Production Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Production et Consommation Énergétique
            </CardTitle>
            <CardDescription>Comparaison des flux énergétiques (kWh)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis />
                <Tooltip formatter={(value: number, name: string) => [`${value.toLocaleString()} kWh`, name]} />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Biogas Composition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Recycle className="h-5 w-5 text-emerald-600" />
              Composition du Biogaz
            </CardTitle>
            <CardDescription>Répartition CH₄ / CO₂</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={biogasData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {biogasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, "Pourcentage"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-gray-600" />
              Heures de Fonctionnement
            </CardTitle>
            <CardDescription>Groupes électrogènes GE1 et GE2</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={operatingHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "hours" ? `${value} heures` : `${value}%`,
                    name === "hours" ? "Heures de fonctionnement" : "Efficacité",
                  ]}
                />
                <Bar dataKey="hours" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Évolution Mensuelle des Performances
            </CardTitle>
            <CardDescription>Biogaz collecté et efficacité de captage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "biogas"
                      ? `${value.toLocaleString()} Nm³`
                      : name === "energy"
                        ? `${value.toLocaleString()} kWh`
                        : `${value}%`,
                    name === "biogas" ? "Biogaz collecté" : name === "energy" ? "Énergie produite" : "Efficacité",
                  ]}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="biogas"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des Performances Annuelles</CardTitle>
          <CardDescription>Indicateurs clés de l'année 2023</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Production Énergétique</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Énergie électrique produite:</span>
                  <span className="font-medium">10,636 MWh</span>
                </div>
                <div className="flex justify-between">
                  <span>Énergie thermique valorisée:</span>
                  <span className="font-medium">11,033 MWh</span>
                </div>
                <div className="flex justify-between">
                  <span>Consommation interne:</span>
                  <span className="font-medium">3.5 MWh</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Valorisation Biogaz</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Volume total valorisé:</span>
                  <span className="font-medium">7,501k Nm³</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume CO₂ valorisé:</span>
                  <span className="font-medium">3,002k Nm³</span>
                </div>
                <div className="flex justify-between">
                  <span>Taux de valorisation:</span>
                  <span className="font-medium">90.45%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Autres Indicateurs</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Déchets papier collectés:</span>
                  <span className="font-medium">180 kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Heures fonctionnement GE1:</span>
                  <span className="font-medium">6,910 h</span>
                </div>
                <div className="flex justify-between">
                  <span>Heures fonctionnement GE2:</span>
                  <span className="font-medium">6,952 h</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
