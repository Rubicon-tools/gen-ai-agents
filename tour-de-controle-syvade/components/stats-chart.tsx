"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, ReferenceLine, XAxis, YAxis } from "recharts"

const data = [
  { date: "Jan", tonnage: 98200 },
  { date: "Fév", tonnage: 101300 },
  { date: "Mar", tonnage: 97800 },
  { date: "Avr", tonnage: 103500 },
  { date: "Mai", tonnage: 99700 },
  { date: "Jun", tonnage: 102800 },
  { date: "Jul", tonnage: 104200 },
  { date: "Aoû", tonnage: 96500 },
  { date: "Sep", tonnage: 100900 },
  { date: "Oct", tonnage: 103800 },
  { date: "Nov", tonnage: 98900 },
  { date: "Déc", tonnage: 102100 },
]

export function StatsChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            domain={[90000, 110000]}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <ReferenceLine
            y={105000}
            stroke="#ef4444"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{ value: "Limite réglementaire (105 000 T)", position: "topRight", fill: "#ef4444", fontSize: 12 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-sm">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Tonnage produit</span>
                        <span className="font-bold text-emerald-600">{payload[0].value?.toLocaleString()} T</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Période</span>
                        <span className="font-bold">{payload[0].payload.date}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Statut</span>
                        <span className={`font-bold ${payload[0].value < 105000 ? "text-green-600" : "text-red-600"}`}>
                          {payload[0].value < 105000 ? "Conforme" : "Dépassement"}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="tonnage"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
