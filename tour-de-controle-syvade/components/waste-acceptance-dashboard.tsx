"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, Shield, Clock, TrendingUp, Activity, Scan } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AlertCircle } from "lucide-react"

const acceptanceData = [
  { month: "Jan", accepted: 8420, rejected: 180, compliance: 97.9 },
  { month: "Fév", accepted: 8650, rejected: 150, compliance: 98.3 },
  { month: "Mar", accepted: 8890, rejected: 120, compliance: 98.7 },
  { month: "Avr", accepted: 8750, rejected: 200, compliance: 97.8 },
  { month: "Mai", accepted: 9100, rejected: 90, compliance: 99.0 },
  { month: "Jun", accepted: 9250, rejected: 110, compliance: 98.8 },
]

const tonnageAdmisData = [
  { name: "Encombrants", value: 30.4, color: "#8b5cf6", fullName: "Déchets encombrants" },
  { name: "OM", value: 49.1, color: "#f59e0b", fullName: "Ordures ménagères" },
  { name: "Refus de tri", value: 20.5, color: "#ef4444", fullName: "Refus de tri" },
]

const tonnageTraiteData = [
  { name: "Encombrants", value: 23.6, color: "#3b82f6" },
  { name: "OM", value: 53.9, color: "#f97316" },
  { name: "Refus de tri", value: 22.5, color: "#6b7280" },
]

const evolutionTonnageData = [
  { year: "2016", enregistre: 139191, maximal: 105000 },
  { year: "2017", enregistre: 136638, maximal: 105000 },
  { year: "2018", enregistre: 118270, maximal: 105000 },
  { year: "2019", enregistre: 106264, maximal: 105000 },
  { year: "2020", enregistre: 79801, maximal: 105000 },
  { year: "2021", enregistre: 75411, maximal: 105000 },
  { year: "2022", enregistre: 88462, maximal: 105000 },
  { year: "2023", enregistre: 85642, maximal: 105000 },
]

const wasteTypeData = [
  { name: "Déchets ménagers", value: 45, color: "#10b981" },
  { name: "Déchets industriels", value: 30, color: "#3b82f6" },
  { name: "Déchets verts", value: 15, color: "#84cc16" },
  { name: "Déchets dangereux", value: 10, color: "#f59e0b" },
]

export function WasteAcceptanceDashboard() {
  return (
    <div className="space-y-8 bg-gray-900 text-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Acceptation des déchets</h1>
          <p className="text-lg text-gray-300">Traçabilité et conformité des flux entrants</p>
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <Activity className="h-4 w-4" />
            <span>Système actif • Dernière mise à jour: il y a 2 min</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              Taux d'acceptation
            </CardTitle>
            <div className="p-2 bg-emerald-200 dark:bg-emerald-800 rounded-full">
              <CheckCircle className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-1">98.8%</div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <p className="text-sm text-emerald-700 dark:text-emerald-400">+0.5% vs mois dernier</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-blue-800 dark:text-blue-300">Déchets traçables</CardTitle>
            <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-full">
              <Shield className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">99.2%</div>
            <p className="text-sm text-blue-700 dark:text-blue-400">Blockchain activée</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-orange-800 dark:text-orange-300">
              Temps moyen contrôle
            </CardTitle>
            <div className="p-2 bg-orange-200 dark:bg-orange-800 rounded-full">
              <Clock className="h-5 w-5 text-orange-700 dark:text-orange-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-1">3.2 min</div>
            <p className="text-sm text-orange-700 dark:text-orange-400">-0.8 min vs objectif</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-red-800 dark:text-red-300">Non-conformités</CardTitle>
            <div className="p-2 bg-red-200 dark:bg-red-800 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-700 dark:text-red-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900 dark:text-red-100 mb-1">12</div>
            <p className="text-sm text-red-700 dark:text-red-400">Ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="border-0 shadow-xl bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white">Répartition des tonnages admis 2023</CardTitle>
            <p className="text-sm text-gray-300">ISDND de la Gabarre par natures de déchets</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={tonnageAdmisData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={50}
                  dataKey="value"
                  stroke="#1f2937"
                  strokeWidth={3}
                  animationBegin={0}
                  animationDuration={1000}
                  label={({ name, value }) => `${value}%`}
                  labelLine={false}
                >
                  {tonnageAdmisData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      style={{
                        filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    color: "#fff",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                  }}
                  formatter={(value, name, props) => [`${value}%`, props.payload.fullName]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-1 gap-3">
              {tonnageAdmisData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm font-medium text-white">{entry.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">{entry.value}%</span>
                    <div className="w-16 bg-gray-600 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{
                          width: `${(entry.value / 50) * 100}%`,
                          backgroundColor: entry.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white">Déchets admis et traités 2023</CardTitle>
            <p className="text-sm text-gray-300">ISDND de la Gabarre</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={tonnageTraiteData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  dataKey="value"
                  stroke="#374151"
                  strokeWidth={2}
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {tonnageTraiteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white">Évolution des tonnages enfouis</CardTitle>
            <p className="text-sm text-gray-300">ISDND de la Gabarre (2016-2023)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={evolutionTonnageData}>
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="enregistre" fill="#3b82f6" name="Tonnage enregistré" radius={[4, 4, 0, 0]} />
                <Bar dataKey="maximal" fill="#ef4444" name="Tonnage maximal admissible" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-0 shadow-xl bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white">Évolution des acceptations</CardTitle>
            <p className="text-sm text-gray-300">Tendance mensuelle 2024</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={acceptanceData}>
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="accepted" fill="#10b981" name="Acceptés" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" fill="#ef4444" name="Rejetés" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white">Répartition par type de déchet</CardTitle>
            <p className="text-sm text-gray-300">Distribution actuelle</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={wasteTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="value"
                  stroke="#374151"
                  strokeWidth={2}
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
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">Solutions d'optimisation</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/30">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
                <div className="p-2 bg-emerald-200 dark:bg-emerald-800 rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Traçabilité blockchain</div>
                  <div className="text-sm font-normal text-emerald-600 dark:text-emerald-400">Solution complète</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                Solution blockchain de traçabilité complète des déchets depuis leur collecte jusqu'à leur traitement.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400">Couverture actuelle</span>
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">99.2%</span>
                </div>
                <Progress value={99.2} className="h-3 bg-emerald-100 dark:bg-emerald-900" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-blue-800 dark:text-blue-300">
                <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-lg">
                  <Scan className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Contrôles automatisés</div>
                  <div className="text-sm font-normal text-blue-600 dark:text-blue-400">IA & IoT</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Automatisation des contrôles d'entrée via traitement d'image et capteurs IoT pour identification en
                temps réel.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 dark:text-blue-400">Automatisation</span>
                  <span className="font-semibold text-blue-800 dark:text-blue-300">85%</span>
                </div>
                <Progress value={85} className="h-3 bg-blue-100 dark:bg-blue-900" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-orange-800 dark:text-orange-300">
                <div className="p-2 bg-orange-200 dark:bg-orange-800 rounded-lg">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Alertes temps réel</div>
                  <div className="text-sm font-normal text-orange-600 dark:text-orange-400">Prévention active</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-orange-700 dark:text-orange-400">
                Système d'alertes en temps réel pour détecter les déchets non conformes et prévenir les incidents.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-orange-600 dark:text-orange-400">Réactivité</span>
                  <span className="font-semibold text-orange-800 dark:text-orange-300">&lt; 30s</span>
                </div>
                <Progress value={95} className="h-3 bg-orange-100 dark:bg-orange-900" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-gray-800">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-white">Dernières acceptations</CardTitle>
              <p className="text-sm text-gray-300 mt-1">Activité en temps réel</p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              En direct
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: "WA-2024-001", type: "Déchets ménagers", tonnage: "12.5t", status: "Accepté", time: "09:15" },
              { id: "WA-2024-002", type: "Déchets industriels", tonnage: "8.2t", status: "Accepté", time: "09:32" },
              { id: "WA-2024-003", type: "Déchets dangereux", tonnage: "2.1t", status: "Contrôle", time: "09:45" },
              { id: "WA-2024-004", type: "Déchets verts", tonnage: "15.8t", status: "Accepté", time: "10:12" },
              { id: "WA-2024-005", type: "Déchets ménagers", tonnage: "9.7t", status: "Rejeté", time: "10:28" },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-600 rounded-xl bg-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-200">{item.id.split("-")[2]}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.id}</p>
                    <p className="text-sm text-gray-300">{item.type}</p>
                  </div>
                  <div className="text-sm text-gray-200 font-semibold bg-gray-600 px-3 py-1 rounded-full">
                    {item.tonnage}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      item.status === "Accepté" ? "default" : item.status === "Rejeté" ? "destructive" : "secondary"
                    }
                    className={
                      item.status === "Accepté"
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 px-3 py-1"
                        : item.status === "Contrôle"
                          ? "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-300 px-3 py-1"
                          : "px-3 py-1"
                    }
                  >
                    {item.status}
                  </Badge>
                  <span className="text-sm text-gray-300 font-medium min-w-[3rem] text-right">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
