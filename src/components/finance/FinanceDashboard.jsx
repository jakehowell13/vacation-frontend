import { useEffect, useMemo, useState } from "react"
import { useGetTrips } from "@/hooks/trips/useGetTrips"
import { Banknote, CalendarDays, CircleDollarSign, Plane, Save } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"

const chartConfig = {
  cost: { label: "Spent", color: "oklch(0.437 0.078 188.216 / 1)" },
  budget: { label: "Budget", color: "hsl(var(--muted-foreground))" },
  cumulativeSpend: { label: "Cumulative spend", color: "oklch(0.437 0.078 188.216 / 1)" },
  yearlyBudget: { label: "Yearly budget", color: "#dc2626" },
}

const formatMoney = (value) => (value || 0).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })

const Stat = ({ icon: Icon, label, value, detail }) => <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4"><div className="flex items-center gap-2 text-primary"><Icon className="size-4" /><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p></div><p className="mt-2 text-2xl font-black">{value}</p>{detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}</div>

export const FinanceDashboard = () => {
  const { data: trips = [] } = useGetTrips()
  const { user } = useAuth()
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [yearlyBudget, setYearlyBudget] = useState("")
  const [isSavingBudget, setIsSavingBudget] = useState(false)
  const [budgetStatus, setBudgetStatus] = useState("")

  useEffect(() => {
    const loadYearlyBudget = async () => {
      if (!user?.id) return
      setBudgetStatus("")
      const { data, error } = await supabase.from("yearly_budgets").select("total_budget").eq("user_id", user.id).eq("year", selectedYear).maybeSingle()
      if (error) {
        setBudgetStatus("Could not load yearly budget.")
        return
      }
      setYearlyBudget(data?.total_budget?.toString() ?? "")
    }
    loadYearlyBudget()
  }, [selectedYear, user?.id])

  const { years, tripsForYear, monthlyData, totals } = useMemo(() => {
    const enrichedTrips = trips.map((trip) => {
      const date = trip.startDate ? new Date(trip.startDate) : null
      const cost = Number(trip.cost ?? 0)
      const budget = Number(trip.estimatedBudget ?? 0)
      return { ...trip, date, year: date && !Number.isNaN(date.getTime()) ? date.getFullYear() : currentYear, cost: Number.isFinite(cost) ? cost : 0, budget: Number.isFinite(budget) ? budget : 0 }
    })
    const tripsInSelectedYear = enrichedTrips.filter((trip) => trip.year === selectedYear).sort((first, second) => (first.date?.getTime() ?? 0) - (second.date?.getTime() ?? 0))
    const monthly = Array.from({ length: 12 }, (_, index) => ({ month: new Date(selectedYear, index).toLocaleDateString(undefined, { month: "short" }), cost: 0, budget: 0 }))
    tripsInSelectedYear.forEach((trip) => {
      const month = trip.date?.getMonth() ?? 0
      monthly[month].cost += trip.cost
      monthly[month].budget += trip.budget
    })

    return {
      years: [...new Set([...enrichedTrips.map((trip) => trip.year), currentYear])].sort((first, second) => second - first),
      tripsForYear: tripsInSelectedYear,
      monthlyData: monthly,
      totals: tripsInSelectedYear.reduce((total, trip) => ({ cost: total.cost + trip.cost, budget: total.budget + trip.budget }), { cost: 0, budget: 0 }),
    }
  }, [trips, selectedYear, currentYear])

  const plannedBudgetRemaining = totals.budget - totals.cost
  const yearlyBudgetValue = Number(yearlyBudget) || 0
  const yearlyRemaining = yearlyBudgetValue - totals.cost
  const tripBudgetUsage = totals.budget > 0 ? Math.round((totals.cost / totals.budget) * 100) : 0
  const yearlyUsage = yearlyBudgetValue > 0 ? Math.round((totals.cost / yearlyBudgetValue) * 100) : 0
  const cumulativeMonthlyData = useMemo(() => {
    let cumulativeSpend = 0
    return monthlyData.map((month) => {
      cumulativeSpend += month.cost
      return { ...month, cumulativeSpend, yearlyBudget: yearlyBudgetValue }
    })
  }, [monthlyData, yearlyBudgetValue])

  const saveYearlyBudget = async () => {
    if (!user?.id) return
    setIsSavingBudget(true)
    setBudgetStatus("")
    const { error } = await supabase.from("yearly_budgets").upsert({ user_id: user.id, year: selectedYear, total_budget: yearlyBudgetValue }, { onConflict: "user_id,year" })
    setBudgetStatus(error ? "Could not save yearly budget." : "Saved")
    setIsSavingBudget(false)
  }

  return <div className="mx-auto flex max-w-7xl flex-col gap-6 px-3 pb-10 sm:px-5 lg:px-8">
    <section className="rounded-[2rem] border border-primary/15 bg-background p-5 shadow-sm shadow-primary/5 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary"><Banknote className="size-4" /> Financial command center</p><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl"><span className="text-primary">{selectedYear}</span> travel finances</h1><p className="mt-2 text-sm text-muted-foreground">Review the trips, plans, and spending for one year at a time.</p></div>
        <label className="grid gap-1.5 text-sm font-bold"><span className="text-muted-foreground">Viewing year</span><span className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" /><select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))} className="h-11 min-w-36 appearance-none rounded-xl border border-primary/20 bg-primary/5 py-2 pl-10 pr-8 font-black text-primary outline-none transition focus:ring-2 focus:ring-primary/20">{years.map((year) => <option key={year} value={year}>{year}</option>)}</select></span></label>
      </div>
    </section>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Stat icon={Plane} label="Trips" value={tripsForYear.length} detail={`Planned for ${selectedYear}`} /><Stat icon={CircleDollarSign} label="Trip budgets" value={formatMoney(totals.budget)} detail={`${tripBudgetUsage}% spent against plans`} /><Stat icon={Banknote} label="Spent" value={formatMoney(totals.cost)} detail={plannedBudgetRemaining >= 0 ? `${formatMoney(plannedBudgetRemaining)} below trip budgets` : `${formatMoney(Math.abs(plannedBudgetRemaining))} above trip budgets`} /><div className="rounded-2xl border border-primary/20 bg-primary/5 p-4"><div className="flex items-center gap-2 text-primary"><CalendarDays className="size-4" /><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Yearly budget</p></div><div className="mt-2 flex items-center gap-2"><span className="text-lg font-black text-muted-foreground">$</span><input type="number" min="0" step="1" value={yearlyBudget} onChange={(event) => { setYearlyBudget(event.target.value); setBudgetStatus("") }} placeholder="0" className="min-w-0 flex-1 bg-transparent text-2xl font-black outline-none" /><button type="button" onClick={saveYearlyBudget} disabled={isSavingBudget} className="rounded-lg bg-primary p-2 text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60" aria-label="Save yearly budget"><Save className="size-4" /></button></div><p className="mt-1 text-xs text-muted-foreground">{yearlyBudgetValue ? `${yearlyUsage}% spent · ${formatMoney(Math.abs(yearlyRemaining))} ${yearlyRemaining >= 0 ? "remaining" : "over"}` : budgetStatus || "Set your total target for the year"}</p></div></section>

    <section className="grid min-w-0 gap-4 lg:grid-cols-2">
      <div className="min-w-0 overflow-hidden rounded-2xl border bg-background p-4"><h2 className="text-sm font-bold uppercase text-muted-foreground">Monthly budget vs. spending</h2><ChartContainer config={chartConfig} className="mt-3 h-[220px] w-full max-w-full overflow-hidden"><BarChart data={monthlyData} margin={{ top: 8, right: 10, bottom: 4, left: 0 }}><CartesianGrid opacity={0.2} vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} padding={{ left: 4, right: 4 }} /><YAxis tickFormatter={(value) => `$${value}`} width={54} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="budget" fill={chartConfig.budget.color} radius={[4, 4, 0, 0]} /><Bar dataKey="cost" fill={chartConfig.cost.color} radius={[4, 4, 0, 0]} /></BarChart></ChartContainer></div>
      <div className="min-w-0 overflow-hidden rounded-2xl border bg-background p-4"><h2 className="text-sm font-bold uppercase text-muted-foreground">Cumulative spending vs. yearly budget</h2><ChartContainer config={chartConfig} className="mt-3 h-[220px] w-full max-w-full overflow-hidden"><LineChart data={cumulativeMonthlyData} margin={{ top: 8, right: 10, bottom: 4, left: 0 }}><CartesianGrid opacity={0.2} vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} padding={{ left: 4, right: 4 }} /><YAxis tickFormatter={(value) => `$${value}`} width={54} /><ChartTooltip content={<ChartTooltipContent />} /><Line type="monotone" dataKey="cumulativeSpend" name="Cumulative spend" stroke={chartConfig.cumulativeSpend.color} strokeWidth={3} dot={{ r: 3 }} /><Line type="linear" dataKey="yearlyBudget" name="Yearly budget" stroke={chartConfig.yearlyBudget.color} strokeWidth={3} dot={false} /></LineChart></ChartContainer></div>
    </section>

    <section className="rounded-2xl border bg-background p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{selectedYear} trips</p><h2 className="mt-1 text-2xl font-black">Year at a glance</h2></div><span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">{tripsForYear.length} trips</span></div>{tripsForYear.length ? <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{tripsForYear.map((trip) => { const percentage = trip.budget ? Math.min((trip.cost / trip.budget) * 100, 100) : 0; return <div key={trip.tripID} className="rounded-xl border border-primary/10 bg-primary/[0.03] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black">{trip.name}</p><p className="mt-1 text-xs text-muted-foreground">{trip.location || "Location TBD"} · {trip.date?.toLocaleDateString(undefined, { month: "short", day: "numeric" }) ?? "Dates TBD"}</p></div><span className="text-xs font-bold text-primary">{Math.round(percentage)}%</span></div><p className="mt-4 text-sm font-semibold">{formatMoney(trip.cost)} <span className="font-normal text-muted-foreground">of {formatMoney(trip.budget)}</span></p><div className="mt-2 h-2 overflow-hidden rounded-full bg-primary/10"><div className={`h-full rounded-full ${trip.cost > trip.budget && trip.budget > 0 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${percentage}%` }} /></div></div>})}</div> : <div className="mt-5 rounded-xl border border-dashed border-primary/20 bg-primary/[0.03] p-8 text-center"><p className="font-bold">No trips planned for {selectedYear}.</p><p className="mt-1 text-sm text-muted-foreground">Choose another year or add a new trip to start tracking it here.</p></div>}</section>
  </div>
}
