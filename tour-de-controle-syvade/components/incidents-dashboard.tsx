"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, Clock, Filter, Search, TrendingDown, TrendingUp, Users } from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { useState } from "react"

const incidentData = [
  {
    id: "Inc-01",
    date: "21/07/2023",
    type: "Accident de travail",
    location: "ISDND / Unité de Cogénération de biogaz / TAR",
    severity: "Sa/Se",
    status: "Résolu",
    description: "Blessure à la main (Agent Séché Environnement)",
    consequences: "Douleurs musculaires. Aucun impact sur l'activité d'exploitation.",
    actions:
      "Consultation pour achat de pompes supplémentaires de déplacement produits chimiques entre janvier et avril 2023.",
    sesInteraction: true,
  },
  {
    id: "Inc-02",
    date: "09/12/2023",
    type: "Coupure EDF",
    location: "ISDND",
    severity: "Q",
    status: "Résolu",
    description: "Panne que équipements EDF extérieurs à l'ISDND",
    consequences: "Coupure électrique EDF à 10h40. Toutes installations techniques arrêtées.",
    actions: "Moteurs biogaz mis en mode secours. Réparations par services techniques EDF.",
    sesInteraction: false,
  },
  {
    id: "Inc-03",
    date: "13/02/2023",
    type: "Chute poteau électrique",
    location: "ISDND",
    severity: "Q",
    status: "Résolu",
    description: "Mauvaise manœuvre par camion (CTA, sous-traitant de Gaddarkhan & Fils TT)",
    consequences: "Poteau bois support de câbles cassé, un câble fibre optique abîmé.",
    actions: "Accès VL vers Ecodoc et base vie SES bloqué avec balisage pour éviter de rouler sur les câbles.",
    sesInteraction: false,
  },
  {
    id: "Inc-04",
    date: "21/07/2023",
    type: "Blessure à la main",
    location: "ISDND / base vie SES",
    severity: "Sa/Se",
    status: "Résolu",
    description: "Manipulation sur fourche chariot élévateur sans précautions ni port de gants de protection",
    consequences: "Plaie au pouce gauche",
    actions: "Premiers soins apportés par encadrement technique. Rappel oral sur l'efficacité du port des EPI.",
    sesInteraction: true,
  },
  {
    id: "Inc-05",
    date: "24/07/2023",
    type: "Déclenchement fusée de détresse",
    location: "ISDND / Subdivision S2",
    severity: "Se/E",
    status: "Résolu",
    description: "Déclenchement fusée de détresse dans les OM pendant l'opération de compactage",
    consequences: "Dégagement momentané de fumées à partir de 9h30",
    actions: "Flamme étouffée par l'aide du compacteur. Rappel des consignes d'étouffement à l'aide de terre.",
    sesInteraction: false,
  },
]

const monthlyIncidents = [
  { month: "Jan", total: 3, resolved: 3, pending: 0 },
  { month: "Fév", total: 5, resolved: 4, pending: 1 },
  { month: "Mar", total: 2, resolved: 2, pending: 0 },
  { month: "Avr", total: 4, resolved: 3, pending: 1 },
  { month: "Mai", total: 6, resolved: 5, pending: 1 },
  { month: "Jun", total: 3, resolved: 3, pending: 0 },
  { month: "Jul", total: 8, resolved: 6, pending: 2 },
  { month: "Aoû", total: 4, resolved: 4, pending: 0 },
  { month: "Sep", total: 2, resolved: 2, pending: 0 },
  { month: "Oct", total: 5, resolved: 4, pending: 1 },
  { month: "Nov", total: 3, resolved: 3, pending: 0 },
  { month: "Déc", total: 7, resolved: 5, pending: 2 },
]

const severityData = [
  { name: "Sa/Se (Sécurité)", value: 12, color: "#dc2626" },
  { name: "Q (Qualité)", value: 18, color: "#ea580c" },
  { name: "Se/E (Sécurité/Environnement)", value: 8, color: "#ca8a04" },
  { name: "Q/E (Qualité/Environnement)", value: 4, color: "#16a34a" },
]

export function IncidentsDashboard() {
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIncidents = incidentData.filter((incident) => {
    const matchesType = filterType === "all" || incident.type.toLowerCase().includes(filterType.toLowerCase())
    const matchesStatus = filterStatus === "all" || incident.status === filterStatus
    const matchesSearch =
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Sa/Se":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "Q":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
      case "Se/E":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Q/E":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Résolu":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "En cours":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
      case "En attente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Incidents & Accidents</h1>
          <p className="text-gray-400 mt-1">Suivi et gestion des incidents survenus</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Déclarer un incident
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs opacity-90 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -12% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Incidents Résolus</CardTitle>
            <CheckCircle className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs opacity-90 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              90.5% taux de résolution
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">En Cours</CardTitle>
            <Clock className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs opacity-90">Délai moyen: 3.2 jours</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Interaction SES</CardTitle>
            <Users className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs opacity-90">35.7% des incidents</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Évolution Mensuelle des Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyIncidents}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
                <Line type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={2} name="Total" />
                <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} name="Résolus" />
                <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="En cours" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Répartition par Gravité</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${value}`}
                  labelLine={false}
                >
                  {severityData.map((entry, index) => (
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
                  formatter={(value: number, name: string) => [`${value} incidents`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {severityData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par description ou lieu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Type d'incident" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="accident">Accident de travail</SelectItem>
                <SelectItem value="coupure">Coupure électrique</SelectItem>
                <SelectItem value="équipement">Défaillance équipement</SelectItem>
                <SelectItem value="environnement">Incident environnemental</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Résolu">Résolu</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Incidents Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Liste des Incidents</CardTitle>
          <p className="text-gray-400 text-sm">{filteredIncidents.length} incident(s) trouvé(s)</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-white border-gray-600">
                      {incident.id}
                    </Badge>
                    <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                    <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                    {incident.sesInteraction && (
                      <Badge variant="outline" className="text-blue-300 border-blue-500">
                        SES-SYVADE
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">{incident.date}</span>
                </div>

                <div className="grid gap-3">
                  <div>
                    <h4 className="font-medium text-white mb-1">{incident.type}</h4>
                    <p className="text-sm text-gray-300 mb-2">{incident.location}</p>
                    <p className="text-sm text-gray-400">{incident.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-gray-700">
                    <div>
                      <h5 className="text-sm font-medium text-white mb-1">Conséquences</h5>
                      <p className="text-sm text-gray-400">{incident.consequences}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-white mb-1">Actions correctives</h5>
                      <p className="text-sm text-gray-400">{incident.actions}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
