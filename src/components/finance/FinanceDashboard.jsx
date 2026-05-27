import { useMemo, useState } from "react"
import { useGetTrips } from "@/hooks/trips/useGetTrips"
import {
  Banknote,
  TrendingUp,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

const chartConfig = {
  cost: {
    label: "Cost",
    color: "oklch(0.437 0.078 188.216 / 1)",
  },
  budget: {
    label: "Budget",
    color: "hsl(var(--muted-foreground))",
  },
}

const formatMoney = (v) =>
  (v || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

export const FinanceDashboard = () => {
  const { data: trips } = useGetTrips()
  const [selectedTrip, setSelectedTrip] = useState(null)

  const {
    yearlyData,
    monthlyData,
    enrichedTrips,
    totals,
  } = useMemo(() => {
    const safeTrips = (trips || []).map((t) => {
      const cost = Number(t.cost ?? 0)
      const budget = Number(t.estimatedBudget ?? 0)

      const date = t.startDate
        ? new Date(t.startDate)
        : new Date()

      return {
        ...t,
        cost: Number.isFinite(cost) ? cost : 0,
        budget: Number.isFinite(budget) ? budget : 0,
        date,
      }
    })

    const yearMap = new Map()
    const monthMap = new Map()

    let totalCost = 0
    let totalBudget = 0

    const enriched = []

    for (const t of safeTrips) {
      const cost = t.cost
      const budget = t.budget

      totalCost += cost
      totalBudget += budget

      const year = t.date.getFullYear()
      const month = t.date.toISOString().slice(0, 7)

      if (!yearMap.has(year)) {
        yearMap.set(year, { year, cost: 0, budget: 0 })
      }

      yearMap.get(year).cost += cost
      yearMap.get(year).budget += budget

      if (!monthMap.has(month)) {
        monthMap.set(month, { month, cost: 0 })
      }

      monthMap.get(month).cost += cost

      const pct = budget > 0 ? (cost / budget) * 100 : 0

      enriched.push({
        ...t,
        year,
        pct,
        status:
          pct > 100
            ? "over"
            : pct > 80
              ? "warning"
              : "good",
      })
    }

    return {
      yearlyData: [...yearMap.values()].sort(
        (a, b) => a.year - b.year
      ),
      monthlyData: [...monthMap.values()].sort(
        (a, b) => a.month.localeCompare(b.month)
      ),
      enrichedTrips: enriched.sort(
        (a, b) => b.cost - a.cost
      ),
      totals: {
        cost: totalCost,
        budget: totalBudget,
      },
    }
  }, [trips])

  const usage =
    totals.budget > 0
      ? (totals.cost / totals.budget) * 100
      : 0

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-3 pb-10 sm:px-5 lg:px-8">

      {/* HEADER (unchanged) */}
      <section className="rounded-[2rem] border bg-background p-6">
        <div className="flex items-center gap-2 text-primary">
          <Banknote className="size-5" />
          <p className="text-xs font-black uppercase tracking-[0.2em]">
            Financial Command Center
          </p>
        </div>

        <h1 className="mt-4 text-4xl font-black">
          Travel finances,
          <span className="block text-primary">
            under control.
          </span>
        </h1>
      </section>

      {/* CHARTS (unchanged) */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-background p-4">
          <h2 className="text-sm font-bold uppercase text-muted-foreground">
            Yearly Overview
          </h2>

          <ChartContainer config={chartConfig} className="mt-2 h-[220px]">
            <ResponsiveContainer>
              <BarChart data={yearlyData}>
                <CartesianGrid opacity={0.2} />
                <XAxis dataKey="year" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cost" fill={chartConfig.cost.color} />
                <Bar dataKey="budget" fill={chartConfig.budget.color} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="rounded-2xl border bg-background p-4">
          <h2 className="text-sm font-bold uppercase text-muted-foreground">
            Spending Trend
          </h2>

          <ChartContainer config={chartConfig} className="mt-2 h-[220px]">
            <ResponsiveContainer>
              <LineChart data={monthlyData}>
                <CartesianGrid opacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke={chartConfig.cost.color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </section>

      {/* 🧭 UPGRADED TRIP STRIP */}
      <section className="rounded-2xl border bg-background p-4">
        <h2 className="text-sm font-bold uppercase text-muted-foreground">
          Trip Financial Breakdown
        </h2>

        <div className="relative mt-3">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-background to-transparent" />

          <div className="overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
            <div className="flex gap-3">

              {enrichedTrips.map((t) => {
                const pct = Math.min(t.pct || 0, 100)

                return (
                  <button
                    key={t.tripID}
                    onClick={() => setSelectedTrip(t.tripID)}
                    className="min-w-[260px] rounded-xl border bg-primary/5 p-4 text-left transition hover:-translate-y-1"
                  >
                    {/* TOP ROW */}
                    <div className="flex items-start justify-between">
                      <p className="font-black">{t.name}</p>

                      <span
                        className={`text-xs font-bold ${
                          t.status === "over"
                            ? "text-red-500"
                            : t.status === "warning"
                              ? "text-amber-500"
                              : "text-primary"
                        }`}
                      >
                        {t.pct.toFixed(0)}%
                      </span>
                    </div>

                    {/* COST */}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatMoney(t.cost)} /{" "}
                      {formatMoney(t.budget)}
                    </p>

                    {/* BAR VISUAL */}
                    <div className="mt-3 h-2 w-full rounded-full bg-black/10">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          t.status === "over"
                            ? "bg-red-500"
                            : "bg-[oklch(0.437_0.078_188.216_/_1)]"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {/* FOOTER META */}
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t.year}</span>

                      <span>
                        {t.status === "over"
                          ? "Over budget"
                          : t.status === "warning"
                            ? "Close"
                            : "On track"}
                      </span>
                    </div>
                  </button>
                )
              })}

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}