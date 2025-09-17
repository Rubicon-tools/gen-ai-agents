"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MetricsCard } from "@/components/metrics-card"
import { StatsChart } from "@/components/stats-chart"
import { VaultTable } from "@/components/vault-table"
import { TgapDashboard } from "@/components/tgap-dashboard"
import { WasteAcceptanceDashboard } from "@/components/waste-acceptance-dashboard"
import { PerformanceDashboard } from "@/components/performance-dashboard"
import { WasteTreatmentDashboard } from "@/components/waste-treatment-dashboard"
import { WaterManagementDashboard } from "@/components/water-management-dashboard"
import { IncidentsDashboard } from "@/components/incidents-dashboard"
import { EnergyConsumptionDashboard } from "@/components/energy-consumption-dashboard"
import {
  BarChart3,
  ChevronDown,
  Factory,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Recycle,
  Droplets,
  Zap,
  Euro,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { useState } from "react"

export default function Page() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="border-r bg-card/50 backdrop-blur">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Factory className="h-6 w-6 text-emerald-600" />
            <span className="font-bold text-emerald-600">Tour de contrôle Syvade</span>
          </div>
          <div className="px-4 py-4">
            <Input placeholder="Rechercher..." className="bg-background/50" />
          </div>
          <nav className="space-y-2 px-2">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 hover:bg-muted ${
                activeTab === "dashboard"
                  ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                  : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard className="h-4 w-4" />
              Tableau de bord
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 hover:bg-muted ${
                activeTab === "stats"
                  ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                  : ""
              }`}
              onClick={() => setActiveTab("stats")}
            >
              <BarChart3 className="h-4 w-4" />
              Statistiques & Rendement
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 hover:bg-muted ${
                activeTab === "tgap"
                  ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                  : ""
              }`}
              onClick={() => setActiveTab("tgap")}
            >
              <Euro className="h-4 w-4" />
              Gestion TGAP
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 hover:bg-muted ${
                activeTab === "acceptance"
                  ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                  : ""
              }`}
              onClick={() => setActiveTab("acceptance")}
            >
              <CheckCircle className="h-4 w-4" />
              Acceptation des déchets
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 hover:bg-muted ${
                activeTab === "treatment"
                  ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                  : ""
              }`}
              onClick={() => setActiveTab("treatment")}
            >
              <Recycle className="h-4 w-4" />
              Traitement des déchets
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 hover:bg-muted ${
                activeTab === "water"
                  ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                  : ""
              }`}
              onClick={() => setActiveTab("water")}
            >
              <Droplets className="h-4 w-4" />
              Gestion de l'eau
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 hover:bg-muted ${
                activeTab === "incidents"
                  ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                  : ""
              }`}
              onClick={() => setActiveTab("incidents")}
            >
              <AlertTriangle className="h-4 w-4" />
              Incidents & Accidents
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 hover:bg-muted ${
                activeTab === "energy"
                  ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                  : ""
              }`}
              onClick={() => setActiveTab("energy")}
            >
              <Zap className="h-4 w-4" />
              Consommation énergétique
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-muted">
              <LifeBuoy className="h-4 w-4" />
              Support
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-muted">
              <Settings className="h-4 w-4" />
              Paramètres
            </Button>
          </nav>
        </aside>
        <main className="p-6">
          {activeTab === "dashboard" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">Vue d'ensemble des opérations</h1>
                  <div className="text-sm text-muted-foreground">13 août 2023 - 18 août 2023</div>
                </div>
                <Button variant="outline" className="gap-2 bg-transparent">
                  Usine Principale
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <MetricsCard
                  title="Tonnage déchets stockés"
                  value="52,843"
                  unit="tonnes"
                  change={{ value: "2,341", percentage: "+4.6%", isPositive: true }}
                />
                <MetricsCard
                  title="Volume lixiviats collectés"
                  value="52,203"
                  unit="m³"
                  change={{ value: "1,847", percentage: "+3.7%", isPositive: true }}
                />
                <MetricsCard
                  title="Volume lixiviats traités"
                  value="44,105"
                  unit="m³"
                  change={{ value: "1,205", percentage: "+2.8%", isPositive: true }}
                />
                <MetricsCard
                  title="Densité moyenne déchets"
                  value="0.98"
                  unit="t/m³"
                  change={{ value: "0.02", percentage: "+2.1%", isPositive: true }}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3 mt-4">
                <MetricsCard
                  title="Volume biogas collecté"
                  value="58,470"
                  unit="m³"
                  change={{ value: "2,134", percentage: "+3.8%", isPositive: true }}
                />
                <MetricsCard
                  title="Vide de fouille annuel"
                  value="93,473"
                  unit="m³"
                  change={{ value: "4,521", percentage: "+5.1%", isPositive: true }}
                />
                <MetricsCard
                  title="Volume rejeté milieu naturel"
                  value="0"
                  unit="m³"
                  change={{ value: "0", percentage: "0%", isPositive: true }}
                />
              </div>
              <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Statistiques générales de l'usine</h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      Aujourd'hui
                    </Button>
                    <Button size="sm" variant="ghost">
                      Semaine
                    </Button>
                    <Button size="sm" variant="ghost">
                      Mois
                    </Button>
                    <Button size="sm" variant="ghost">
                      6 mois
                    </Button>
                    <Button size="sm" variant="ghost">
                      Année
                    </Button>
                  </div>
                </div>
                <StatsChart />
              </Card>
              <div className="mt-6">
                <VaultTable />
              </div>
            </>
          )}

          {activeTab === "tgap" && <TgapDashboard />}

          {activeTab === "acceptance" && <WasteAcceptanceDashboard />}

          {activeTab === "stats" && <PerformanceDashboard />}

          {activeTab === "treatment" && <WasteTreatmentDashboard />}

          {activeTab === "water" && <WaterManagementDashboard />}

          {activeTab === "incidents" && <IncidentsDashboard />}

          {activeTab === "energy" && <EnergyConsumptionDashboard />}
        </main>
      </div>
    </div>
  )
}
