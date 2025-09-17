"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import {
  Droplets,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Beaker,
  Filter,
  Waves,
  CloudRain,
  Mountain,
} from "lucide-react"
import { useState } from "react"

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

export function WaterManagementDashboard() {
  const [activeWaterTab, setActiveWaterTab] = useState("overview")

  // Données pour les graphiques
  const complianceData = [
    { name: "Eaux pluviales", conforme: 95, nonConforme: 5 },
    { name: "Lixiviats bruts", conforme: 88, nonConforme: 12 },
    { name: "Eaux nanofiltrées", conforme: 98, nonConforme: 2 },
    { name: "Eaux subsurfaces", conforme: 92, nonConforme: 8 },
    { name: "Eaux souterraines", conforme: 96, nonConforme: 4 },
  ]

  const monthlyTrends = [
    { month: "Jan", pluviales: 1250, lixiviats: 3200, nanofiltrées: 2800, subsurfaces: 450, souterraines: 380 },
    { month: "Fév", pluviales: 1180, lixiviats: 3100, nanofiltrées: 2750, subsurfaces: 420, souterraines: 360 },
    { month: "Mar", pluviales: 1320, lixiviats: 3350, nanofiltrées: 2950, subsurfaces: 480, souterraines: 400 },
    { month: "Avr", pluviales: 1450, lixiviats: 3400, nanofiltrées: 3100, subsurfaces: 510, souterraines: 420 },
    { month: "Mai", pluviales: 1380, lixiviats: 3250, nanofiltrées: 2900, subsurfaces: 490, souterraines: 410 },
    { month: "Jun", pluviales: 1520, lixiviats: 3500, nanofiltrées: 3200, subsurfaces: 530, souterraines: 450 },
  ]

  const parameterData = [
    {
      parameter: "pH",
      pluviales: 7.8,
      lixiviats: 8.4,
      nanofiltrées: 6.2,
      subsurfaces: 7.6,
      souterraines: 7.3,
      limite: 8.5,
    },
    {
      parameter: "Conductivité",
      pluviales: 556,
      lixiviats: 14330,
      nanofiltrées: 2548,
      subsurfaces: 586,
      souterraines: 4610,
      limite: 2500,
    },
    {
      parameter: "DBO5",
      pluviales: 15,
      lixiviats: 350,
      nanofiltrées: 12,
      subsurfaces: 2.4,
      souterraines: 29,
      limite: 100,
    },
    {
      parameter: "Azote total",
      pluviales: 2.8,
      lixiviats: 517,
      nanofiltrées: 58.7,
      subsurfaces: 3.18,
      souterraines: 197,
      limite: 150,
    },
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <CloudRain className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Eaux pluviales</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">4 points</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">95% conformité</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Beaker className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Lixiviats bruts</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">Traités</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">88% conformité</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Nanofiltrées</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">98%</p>
                <p className="text-xs text-green-600 dark:text-green-400">Conformité</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Waves className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Subsurfaces</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">2 points</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">92% conformité</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 border-teal-200 dark:border-teal-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500 rounded-lg">
                <Mountain className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-teal-700 dark:text-teal-300">Souterraines</p>
                <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">4 piézomètres</p>
                <p className="text-xs text-teal-600 dark:text-teal-400">96% conformité</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Conformité réglementaire par type d'eau</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9CA3AF" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Bar dataKey="conforme" stackId="a" fill="#10b981" name="Conforme %" />
                <Bar dataKey="nonConforme" stackId="a" fill="#ef4444" name="Non-conforme %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">Évolution mensuelle des volumes (m³)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: "#9CA3AF" }} />
                <YAxis tick={{ fill: "#9CA3AF" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="lixiviats"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="nanofiltrées"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="pluviales"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="subsurfaces"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="souterraines"
                  stackId="1"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tableau de synthèse des paramètres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Synthèse des paramètres clés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-300">Paramètre</th>
                  <th className="text-center p-3 text-blue-300">Eaux pluviales</th>
                  <th className="text-center p-3 text-orange-300">Lixiviats bruts</th>
                  <th className="text-center p-3 text-green-300">Nanofiltrées</th>
                  <th className="text-center p-3 text-purple-300">Subsurfaces</th>
                  <th className="text-center p-3 text-teal-300">Souterraines</th>
                  <th className="text-center p-3 text-red-300">Limite</th>
                </tr>
              </thead>
              <tbody>
                {parameterData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="p-3 font-medium text-gray-200">{row.parameter}</td>
                    <td className="text-center p-3 text-gray-300">{row.pluviales}</td>
                    <td className="text-center p-3 text-gray-300">{row.lixiviats}</td>
                    <td className="text-center p-3 text-gray-300">{row.nanofiltrées}</td>
                    <td className="text-center p-3 text-gray-300">{row.subsurfaces}</td>
                    <td className="text-center p-3 text-gray-300">{row.souterraines}</td>
                    <td className="text-center p-3 text-red-400 font-medium">{row.limite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderRainwater = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CloudRain className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Points de contrôle</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">4</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">EP1 à EP4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Conformité pH</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">95%</p>
                <p className="text-xs text-green-600 dark:text-green-400">7.3 - 9.5 moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Beaker className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Conductivité moy.</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">556</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">µS/cm</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Volume mensuel</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">1,520</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">m³</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Analyses des eaux pluviales - Derniers résultats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-300">Paramètre</th>
                  <th className="text-center p-3 text-gray-300">Unité</th>
                  <th className="text-center p-3 text-gray-300">EP1</th>
                  <th className="text-center p-3 text-gray-300">EP2</th>
                  <th className="text-center p-3 text-gray-300">EP3</th>
                  <th className="text-center p-3 text-gray-300">EP4</th>
                  <th className="text-center p-3 text-gray-300">Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="p-3 text-gray-200">pH</td>
                  <td className="text-center p-3 text-gray-400">-</td>
                  <td className="text-center p-3 text-gray-300">7.6</td>
                  <td className="text-center p-3 text-gray-300">7.7</td>
                  <td className="text-center p-3 text-gray-300">9.5</td>
                  <td className="text-center p-3 text-gray-300">9.5</td>
                  <td className="text-center p-3">
                    <Badge variant="secondary" className="bg-green-900/20 text-green-300">
                      Conforme
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-3 text-gray-200">Conductivité</td>
                  <td className="text-center p-3 text-gray-400">µS/cm</td>
                  <td className="text-center p-3 text-gray-300">1091</td>
                  <td className="text-center p-3 text-gray-300">175</td>
                  <td className="text-center p-3 text-gray-300">313</td>
                  <td className="text-center p-3 text-gray-300">313</td>
                  <td className="text-center p-3">
                    <Badge variant="secondary" className="bg-green-900/20 text-green-300">
                      Conforme
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-3 text-gray-200">Matières en suspension</td>
                  <td className="text-center p-3 text-gray-400">mg/l</td>
                  <td className="text-center p-3 text-gray-300">5.0</td>
                  <td className="text-center p-3 text-gray-300">3.5</td>
                  <td className="text-center p-3 text-gray-300">&lt;2</td>
                  <td className="text-center p-3 text-gray-300">&lt;2</td>
                  <td className="text-center p-3">
                    <Badge variant="secondary" className="bg-green-900/20 text-green-300">
                      Conforme
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-3 text-gray-200">Azote total</td>
                  <td className="text-center p-3 text-gray-400">mg/l N</td>
                  <td className="text-center p-3 text-gray-300">2.88</td>
                  <td className="text-center p-3 text-gray-300">0.80</td>
                  <td className="text-center p-3 text-gray-300">1.00</td>
                  <td className="text-center p-3 text-gray-300">1.00</td>
                  <td className="text-center p-3">
                    <Badge variant="secondary" className="bg-green-900/20 text-green-300">
                      Conforme
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderLeachate = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Beaker className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Volume traité</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">3,500</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">m³/mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">DBO5 moyenne</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">350</p>
                <p className="text-xs text-red-600 dark:text-red-400">mg/l O2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Droplets className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Azote Kjeldahl</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">517</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">mg/l N</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Filter className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Efficacité traitement</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">88%</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Conformité</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Évolution des paramètres critiques</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={[
                { date: "23/02", DBO5: 400, azoteKjeldahl: 517, conductivité: 14330 },
                { date: "09/05", DBO5: 5520, azoteKjeldahl: 539, conductivité: 20720 },
                { date: "30/09", DBO5: 7290, azoteKjeldahl: 638, conductivité: 16960 },
                { date: "19/12", DBO5: 3700, azoteKjeldahl: 694, conductivité: 15370 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: "#9CA3AF" }} />
              <YAxis tick={{ fill: "#9CA3AF" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
              />
              <Line type="monotone" dataKey="DBO5" stroke="#ef4444" strokeWidth={2} name="DBO5 (mg/l)" />
              <Line
                type="monotone"
                dataKey="azoteKjeldahl"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Azote Kjeldahl (mg/l)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )

  const renderNanofiltered = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Filter className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Efficacité filtration</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">98%</p>
                <p className="text-xs text-green-600 dark:text-green-400">Conformité</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Droplets className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Volume traité</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">3,200</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">m³/mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Réduction DBO5</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">96%</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">vs lixiviats bruts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Beaker className="h-8 w-8 text-teal-600" />
              <div>
                <p className="text-sm font-medium text-teal-700 dark:text-teal-300">pH stabilisé</p>
                <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">6.2</p>
                <p className="text-xs text-teal-600 dark:text-teal-400">Optimal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Performance du traitement par nanofiltration</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { parameter: "DBO5", avant: 350, après: 12, réduction: 96 },
                { parameter: "Azote total", avant: 517, après: 58.7, réduction: 89 },
                { parameter: "Conductivité", avant: 14330, après: 2548, réduction: 82 },
                { parameter: "Chlorure", avant: 2200, après: 260, réduction: 88 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="parameter" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <YAxis tick={{ fill: "#9CA3AF" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
              />
              <Bar dataKey="avant" fill="#ef4444" name="Avant traitement" />
              <Bar dataKey="après" fill="#10b981" name="Après traitement" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )

  const renderSubsurface = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Waves className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Points de contrôle</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">2</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Surveillance continue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Conformité</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">92%</p>
                <p className="text-xs text-green-600 dark:text-green-400">Paramètres</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Droplets className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">pH moyen</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">7.6</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Stable</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Beaker className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Conductivité</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">606</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">µS/cm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Évolution des eaux subsurfaces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-300">Paramètre</th>
                  <th className="text-center p-3 text-gray-300">Unité</th>
                  <th className="text-center p-3 text-gray-300">23/02/23</th>
                  <th className="text-center p-3 text-gray-300">20/09/23</th>
                  <th className="text-center p-3 text-gray-300">Évolution</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="p-3 text-gray-200">pH</td>
                  <td className="text-center p-3 text-gray-400">-</td>
                  <td className="text-center p-3 text-gray-300">8.04</td>
                  <td className="text-center p-3 text-gray-300">7.58</td>
                  <td className="text-center p-3">
                    <Badge variant="secondary" className="bg-green-900/20 text-green-300">
                      Stable
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-3 text-gray-200">Conductivité</td>
                  <td className="text-center p-3 text-gray-400">µS/cm</td>
                  <td className="text-center p-3 text-gray-300">586</td>
                  <td className="text-center p-3 text-gray-300">626</td>
                  <td className="text-center p-3">
                    <Badge variant="secondary" className="bg-yellow-900/20 text-yellow-300">
                      Légère hausse
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-3 text-gray-200">Azote global</td>
                  <td className="text-center p-3 text-gray-400">mg/l N</td>
                  <td className="text-center p-3 text-gray-300">3.18</td>
                  <td className="text-center p-3 text-gray-300">2.13</td>
                  <td className="text-center p-3">
                    <Badge variant="secondary" className="bg-green-900/20 text-green-300">
                      Amélioration
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderGroundwater = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mountain className="h-8 w-8 text-teal-600" />
              <div>
                <p className="text-sm font-medium text-teal-700 dark:text-teal-300">Piézomètres</p>
                <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">4</p>
                <p className="text-xs text-teal-600 dark:text-teal-400">PZ1 à PZ4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Conformité</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">96%</p>
                <p className="text-xs text-green-600 dark:text-green-400">Surveillance semestrielle</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Droplets className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Température moy.</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">18.8°C</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Stable</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Points d'attention</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">2</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Conductivité élevée</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Surveillance des eaux souterraines par piézomètre</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={[
                { piezometre: "PZ1", conductivité: 4610, azoteTotal: 197, pH: 7.3 },
                { piezometre: "PZ2", conductivité: 3731, azoteTotal: 173, pH: 7.4 },
                { piezometre: "PZ3", conductivité: 2276, azoteTotal: 36.2, pH: 7.1 },
                { piezometre: "PZ4", conductivité: 15170, azoteTotal: 39.2, pH: 7.0 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="piezometre" tick={{ fill: "#9CA3AF" }} />
              <YAxis tick={{ fill: "#9CA3AF" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
              />
              <Bar dataKey="conductivité" fill="#3b82f6" name="Conductivité (µS/cm)" />
              <Bar dataKey="azoteTotal" fill="#10b981" name="Azote total (mg/l)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Alerte qualité - Points critiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-red-900/20 border border-red-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-red-300 font-medium">PZ4 - Conductivité élevée</p>
                <p className="text-red-400 text-sm">15,170 µS/cm - Dépassement seuil d'alerte (2,500 µS/cm)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-yellow-300 font-medium">PZ1 - Azote total élevé</p>
                <p className="text-yellow-400 text-sm">197 mg/l N - Surveillance renforcée recommandée</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion de l'eau</h1>
          <p className="text-gray-400">Surveillance et conformité réglementaire</p>
        </div>
      </div>

      {/* Sous-navigation */}
      <div className="flex gap-2 border-b border-gray-700 pb-4">
        <Button
          variant={activeWaterTab === "overview" ? "default" : "ghost"}
          onClick={() => setActiveWaterTab("overview")}
          className={activeWaterTab === "overview" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
        >
          Vue d'ensemble
        </Button>
        <Button
          variant={activeWaterTab === "rainwater" ? "default" : "ghost"}
          onClick={() => setActiveWaterTab("rainwater")}
          className={activeWaterTab === "rainwater" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
        >
          Eaux pluviales
        </Button>
        <Button
          variant={activeWaterTab === "leachate" ? "default" : "ghost"}
          onClick={() => setActiveWaterTab("leachate")}
          className={activeWaterTab === "leachate" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
        >
          Lixiviats bruts
        </Button>
        <Button
          variant={activeWaterTab === "nanofiltered" ? "default" : "ghost"}
          onClick={() => setActiveWaterTab("nanofiltered")}
          className={activeWaterTab === "nanofiltered" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
        >
          Eaux nanofiltrées
        </Button>
        <Button
          variant={activeWaterTab === "subsurface" ? "default" : "ghost"}
          onClick={() => setActiveWaterTab("subsurface")}
          className={activeWaterTab === "subsurface" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
        >
          Eaux subsurfaces
        </Button>
        <Button
          variant={activeWaterTab === "groundwater" ? "default" : "ghost"}
          onClick={() => setActiveWaterTab("groundwater")}
          className={activeWaterTab === "groundwater" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
        >
          Eaux souterraines
        </Button>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeWaterTab === "overview" && renderOverview()}
      {activeWaterTab === "rainwater" && renderRainwater()}
      {activeWaterTab === "leachate" && renderLeachate()}
      {activeWaterTab === "nanofiltered" && renderNanofiltered()}
      {activeWaterTab === "subsurface" && renderSubsurface()}
      {activeWaterTab === "groundwater" && renderGroundwater()}
    </div>
  )
}
