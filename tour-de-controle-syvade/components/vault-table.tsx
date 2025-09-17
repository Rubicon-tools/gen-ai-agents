import { Avatar } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react"

const processes = [
  {
    name: "Collecte lixiviats bruts",
    type: "Traitement des eaux",
    volume: "52,203 m³",
    daily: "+3.7%",
    efficiency: "84.5%",
    status: "Actif",
    startDate: "01.01.2023",
    performance: "high",
  },
  {
    name: "Traitement lixiviats",
    type: "Épuration",
    volume: "44,105 m³",
    daily: "+2.8%",
    efficiency: "84.5%",
    status: "Actif",
    startDate: "01.01.2023",
    performance: "high",
  },
  {
    name: "Stockage déchets",
    type: "Casier S-E",
    volume: "52,843 t",
    daily: "+4.6%",
    efficiency: "98.0%",
    status: "Actif",
    startDate: "01.01.2023",
    performance: "high",
  },
  {
    name: "Collecte biogaz",
    type: "Valorisation énergétique",
    volume: "58,470 m³",
    daily: "+3.8%",
    efficiency: "92.3%",
    status: "Actif",
    startDate: "01.01.2023",
    performance: "medium",
  },
  {
    name: "Recyclage lixiviats",
    type: "Réutilisation",
    volume: "5,015 m³",
    daily: "+1.2%",
    efficiency: "100%",
    status: "Actif",
    startDate: "01.04.2023",
    performance: "high",
  },
  {
    name: "Rejet milieu naturel",
    type: "Contrôle environnemental",
    volume: "0 m³",
    daily: "0%",
    efficiency: "100%",
    status: "Conforme",
    startDate: "01.01.2023",
    performance: "high",
  },
]

export function VaultTable() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Indicateurs d'exploitation</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Processus</TableHead>
            <TableHead>Évolution ↓</TableHead>
            <TableHead>Volume/Tonnage ↓</TableHead>
            <TableHead>Efficacité ↓</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.map((process) => (
            <TableRow key={process.name}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <img
                      src={`/abstract-geometric-shapes.png?height=24&width=24&query=${process.type}`}
                      alt={process.name}
                    />
                  </Avatar>
                  <div>
                    <div className="font-medium">{process.name}</div>
                    <div className="text-xs text-muted-foreground">{process.type}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell
                className={
                  process.daily.startsWith("+")
                    ? "text-emerald-600"
                    : process.daily === "0%"
                      ? "text-muted-foreground"
                      : "text-destructive"
                }
              >
                {process.daily}
              </TableCell>
              <TableCell>{process.volume}</TableCell>
              <TableCell>{process.efficiency}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    process.status === "Actif"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : process.status === "Conforme"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {process.status}
                </span>
              </TableCell>
              <TableCell>{process.startDate}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-3 rounded-full ${
                        i < (process.performance === "high" ? 3 : process.performance === "medium" ? 2 : 1)
                          ? "bg-emerald-500"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
