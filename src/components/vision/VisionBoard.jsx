import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { CalendarDays, Compass, ExternalLink, Lightbulb, Pencil, Plus, Save, Sparkles, Trash2, X } from "lucide-react"
import { useAuth } from "@/providers/AuthProvider"
import { useGetTrips } from "@/hooks/trips/useGetTrips"
import { supabase } from "@/lib/supabase"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const currentYear = new Date().getFullYear()
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const blankIdea = (year = currentYear) => ({ title: "", description: "", destinations: "", savedItems: "", budgetLow: "", budgetHigh: "", idealTiming: "", optionSet: "", optionWindowStartMonth: 1, optionWindowEndMonth: 1, targetYear: year, targetMonth: new Date().getMonth() + 1, priority: "considering" })
const money = (value) => Number(value || 0).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const dateParts = (value) => { const match = String(value ?? "").match(/^(\d{4})-(\d{2})/); return match ? { year: Number(match[1]), month: Number(match[2]) } : null }
const chartConfig = { tripSpend: { label: "Trip spend", color: "oklch(0.437 0.078 188.216 / 1)" }, visionLow: { label: "Vision low", color: "#8b5cf6" }, visionHigh: { label: "Vision high", color: "#8b5cf6" }, yearlyBudget: { label: "Yearly budget", color: "#dc2626" } }

const MonthSelect = ({ value, onChange, disabled }) => <select value={value} onChange={onChange} disabled={disabled} className="h-11 rounded-xl border border-input bg-background px-3 font-normal outline-none disabled:opacity-45 focus:ring-2 focus:ring-primary/20">{months.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}</select>
const Field = ({ label, children, className = "" }) => <label className={`grid gap-2 text-sm font-bold ${className}`}>{label}{children}</label>

export const VisionBoard = () => {
  const { user } = useAuth()
  const { data: trips = [] } = useGetTrips()
  const [ideas, setIdeas] = useState([])
  const [yearlyBudgets, setYearlyBudgets] = useState([])
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [form, setForm] = useState(blankIdea)
  const [editingId, setEditingId] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [message, setMessage] = useState("")

  const loadData = async () => {
    if (!user?.id) return
    setLoading(true)
    const [ideasResult, budgetsResult] = await Promise.all([supabase.from("vision_boards").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }), supabase.from("yearly_budgets").select("year, total_budget").eq("user_id", user.id)])
    setIdeas(ideasResult.data ?? []); setYearlyBudgets(budgetsResult.data ?? [])
    setMessage(ideasResult.error || budgetsResult.error ? "Could not load your vision board data." : "")
    setLoading(false)
  }
  useEffect(() => { loadData() }, [user?.id])

  const years = useMemo(() => [...new Set([currentYear, ...ideas.map((idea) => Number(idea.target_year)), ...yearlyBudgets.map((budget) => Number(budget.year)), ...trips.map((trip) => dateParts(trip.startDate)?.year).filter(Boolean)])].sort((a, b) => a - b), [ideas, yearlyBudgets, trips])
  const ideasForYear = useMemo(() => ideas.filter((idea) => Number(idea.target_year) === selectedYear), [ideas, selectedYear])
  const yearlyBudget = useMemo(() => Number(yearlyBudgets.find((budget) => Number(budget.year) === selectedYear)?.total_budget ?? 0), [yearlyBudgets, selectedYear])
  const forecastData = useMemo(() => {
    const tripSpendByMonth = Array(12).fill(0)
    trips.forEach((trip) => { const date = dateParts(trip.startDate); if (date?.year === selectedYear) tripSpendByMonth[date.month - 1] += Number(trip.cost ?? 0) })
    const optionSlots = new Map()
    ideasForYear.forEach((idea) => {
      const optionSet = String(idea.option_set ?? "").trim()
      const key = optionSet ? `option:${optionSet.toLocaleLowerCase()}` : `idea:${idea.id}`
      const targetMonth = Number(idea.target_month)
      const month = optionSet ? Number(idea.option_window_end_month ?? targetMonth) : targetMonth
      if (month < 1 || month > 12) return
      const slot = optionSlots.get(key) ?? { month, options: [] }
      slot.month = Math.max(slot.month, month)
      slot.options.push({ low: Number(idea.budget_low ?? 0), high: Number(idea.budget_high ?? idea.budget_low ?? 0) })
      optionSlots.set(key, slot)
    })
    const visionByMonth = Array.from({ length: 12 }, () => ({ low: 0, high: 0 }))
    optionSlots.forEach((slot) => { visionByMonth[slot.month - 1].low += Math.min(...slot.options.map((option) => option.low)); visionByMonth[slot.month - 1].high += Math.max(...slot.options.map((option) => option.high)) })
    let tripSpend = 0; let visionLow = 0; let visionHigh = 0
    return months.map((month, index) => { tripSpend += tripSpendByMonth[index]; visionLow += visionByMonth[index].low; visionHigh += visionByMonth[index].high; return { month: month.slice(0, 3), tripSpend, visionLow: tripSpend + visionLow, visionHigh: tripSpend + visionHigh, yearlyBudget } })
  }, [ideasForYear, selectedYear, trips, yearlyBudget])

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const closeForm = () => { setForm(blankIdea(selectedYear)); setEditingId(null); setIsFormOpen(false) }
  const openNew = () => { closeForm(); setIsFormOpen(true) }
  const editIdea = (idea) => { setEditingId(idea.id); setForm({ title: idea.title ?? "", description: idea.description ?? "", destinations: (idea.destination_options ?? []).join(", "), savedItems: (idea.saved_items ?? []).join("\n"), budgetLow: idea.budget_low ?? "", budgetHigh: idea.budget_high ?? "", idealTiming: idea.ideal_timing ?? "", optionSet: idea.option_set ?? "", optionWindowStartMonth: idea.option_window_start_month ?? idea.target_month ?? 1, optionWindowEndMonth: idea.option_window_end_month ?? idea.target_month ?? 1, targetYear: idea.target_year ?? selectedYear, targetMonth: idea.target_month ?? 1, priority: idea.priority ?? "considering" }); setIsFormOpen(true) }
  const saveIdea = async (event) => {
    event.preventDefault(); if (!form.title.trim() || !user?.id) return
    const hasOptionSet = form.optionSet.trim().length > 0
    const payload = { id: editingId ?? undefined, user_id: user.id, title: form.title.trim(), description: form.description.trim() || null, destination_options: form.destinations.split(",").map((item) => item.trim()).filter(Boolean), saved_items: form.savedItems.split("\n").map((item) => item.trim()).filter(Boolean), budget_low: form.budgetLow ? Number(form.budgetLow) : null, budget_high: form.budgetHigh ? Number(form.budgetHigh) : null, ideal_timing: form.idealTiming.trim() || null, option_set: hasOptionSet ? form.optionSet.trim() : null, option_window_start_month: hasOptionSet ? Number(form.optionWindowStartMonth) : null, option_window_end_month: hasOptionSet ? Number(form.optionWindowEndMonth) : null, target_year: Number(form.targetYear), target_month: Number(form.targetMonth), priority: form.priority }
    setSaving(true); const { error } = await supabase.from("vision_boards").upsert(payload); setSaving(false)
    if (error) { setMessage("Could not save this idea."); return }
    setSelectedYear(Number(form.targetYear)); closeForm(); loadData()
  }
  const deleteIdea = async (idea) => {
    if (!user?.id || !window.confirm(`Delete “${idea.title}”? This cannot be undone.`)) return
    setDeletingId(idea.id); setMessage("")
    const { error } = await supabase.from("vision_boards").delete().eq("id", idea.id).eq("user_id", user.id)
    setDeletingId(null)
    if (error) { setMessage("Could not delete this idea."); return }
    if (editingId === idea.id) closeForm()
    setIdeas((current) => current.filter((currentIdea) => currentIdea.id !== idea.id))
  }

  return <div className="mx-auto flex max-w-7xl flex-col gap-6 px-3 pb-10 sm:px-5 lg:px-8">
    <section className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/15 via-background to-fuchsia-500/10 p-6 sm:p-8"><div className="absolute -right-12 -top-12 size-56 rounded-full bg-primary/15 blur-3xl" /><div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary"><Lightbulb className="size-4" /> Travel possibilities</p><h1 className="mt-3 text-4xl font-black tracking-tight">Vision board</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Place possibilities into a year and month, then see the financial picture take shape.</p></div><div className="flex flex-wrap items-end gap-3"><Field label="Planning year"><span className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" /><select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))} className="h-11 min-w-32 appearance-none rounded-xl border border-primary/20 bg-background/80 py-2 pl-10 pr-7 font-black text-primary outline-none focus:ring-2 focus:ring-primary/20">{years.map((year) => <option key={year} value={year}>{year}</option>)}</select></span></Field><button type="button" onClick={openNew} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20"><Plus className="size-4" /> Add an idea</button></div></div></section>
    <section className="overflow-hidden rounded-[2rem] border border-primary/15 bg-background p-5 shadow-sm shadow-primary/5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{selectedYear} affordability</p><h2 className="mt-1 text-2xl font-black">Monthly vision forecast</h2><p className="mt-1 text-sm text-muted-foreground">Each option set contributes only its lowest low and highest high estimate, against the {money(yearlyBudget)} yearly budget.</p><ChartContainer config={chartConfig} className="mt-4 h-[240px] w-full max-w-full overflow-hidden"><LineChart data={forecastData} margin={{ top: 8, right: 10, bottom: 4, left: 0 }}><CartesianGrid opacity={0.2} vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} padding={{ left: 4, right: 4 }} /><YAxis tickFormatter={(value) => `$${value}`} width={58} /><ChartTooltip content={<ChartTooltipContent />} /><Line type="monotone" dataKey="tripSpend" stroke={chartConfig.tripSpend.color} strokeWidth={3} dot={{ r: 3 }} /><Line type="monotone" dataKey="visionLow" stroke={chartConfig.visionLow.color} strokeWidth={2} strokeDasharray="6 5" dot={false} /><Line type="monotone" dataKey="visionHigh" stroke={chartConfig.visionHigh.color} strokeWidth={2} strokeDasharray="6 5" dot={false} /><Line type="linear" dataKey="yearlyBudget" stroke={chartConfig.yearlyBudget.color} strokeWidth={3} dot={false} /></LineChart></ChartContainer></section>
    {isFormOpen && <section className="rounded-[2rem] border border-primary/20 bg-background p-5 shadow-xl sm:p-7"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{editingId ? "Refine an idea" : "New possibility"}</p><h2 className="mt-1 text-2xl font-black">{editingId ? "Edit trip idea" : "Map it out"}</h2></div><button type="button" onClick={closeForm} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X className="size-5" /></button></div><form onSubmit={saveIdea} className="grid gap-4 sm:grid-cols-2"><Field label="Idea name" className="sm:col-span-2"><input required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Ecuador in the spring" className="h-11 rounded-xl border border-input bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-primary/20" /></Field><Field label="Target year"><select value={form.targetYear} onChange={(event) => update("targetYear", event.target.value)} className="h-11 rounded-xl border border-input bg-background px-3 font-normal">{years.map((year) => <option key={year} value={year}>{year}</option>)}</select></Field><Field label="Target month"><MonthSelect value={form.targetMonth} onChange={(event) => update("targetMonth", event.target.value)} /></Field><Field label="Option set" className="sm:col-span-2"><input value={form.optionSet} onChange={(event) => update("optionSet", event.target.value)} placeholder="Spring escape — choose one" className="h-11 rounded-xl border border-input bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-primary/20" /><span className="text-xs font-normal text-muted-foreground">Use the same name for alternatives. They are not summed in the forecast.</span></Field><Field label="Option window starts"><MonthSelect value={form.optionWindowStartMonth} onChange={(event) => update("optionWindowStartMonth", event.target.value)} disabled={!form.optionSet.trim()} /></Field><Field label="Option window ends"><MonthSelect value={form.optionWindowEndMonth} onChange={(event) => update("optionWindowEndMonth", event.target.value)} disabled={!form.optionSet.trim()} /></Field><Field label="Low estimate"><input type="number" min="0" value={form.budgetLow} onChange={(event) => update("budgetLow", event.target.value)} placeholder="$3,000" className="h-11 rounded-xl border border-input bg-background px-3 font-normal" /></Field><Field label="Stretch estimate"><input type="number" min="0" value={form.budgetHigh} onChange={(event) => update("budgetHigh", event.target.value)} placeholder="$5,000" className="h-11 rounded-xl border border-input bg-background px-3 font-normal" /></Field><Field label="Destination options"><input value={form.destinations} onChange={(event) => update("destinations", event.target.value)} placeholder="Quito, Galápagos" className="h-11 rounded-xl border border-input bg-background px-3 font-normal" /></Field><Field label="Status"><select value={form.priority} onChange={(event) => update("priority", event.target.value)} className="h-11 rounded-xl border border-input bg-background px-3 font-normal"><option value="dream">Dream</option><option value="considering">Considering</option><option value="planning">Actively planning</option></select></Field><Field label="Why this trip?" className="sm:col-span-2"><textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={3} className="resize-none rounded-xl border border-input bg-background px-3 py-2 font-normal" /></Field><Field label="Saved things / ideas" className="sm:col-span-2"><textarea value={form.savedItems} onChange={(event) => update("savedItems", event.target.value)} placeholder="One link, hotel, restaurant, or note per line" rows={4} className="resize-none rounded-xl border border-input bg-background px-3 py-2 font-normal" /></Field><div className="flex justify-end gap-3 sm:col-span-2"><button type="button" onClick={closeForm} className="rounded-xl border px-4 py-2.5 text-sm font-bold">Cancel</button><button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"><Save className="size-4" /> {saving ? "Saving…" : "Save idea"}</button></div></form></section>}
    {message && <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{message}</p>}
    {loading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-[1.75rem] bg-primary/10" />)}</div> : ideasForYear.length ? <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{ideasForYear.map((idea) => <article key={idea.id} className="group relative overflow-hidden rounded-[1.75rem] border border-primary/15 bg-background p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold capitalize text-primary">{idea.priority}</span><div className="flex items-center gap-1"><button type="button" onClick={() => editIdea(idea)} className="rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary" aria-label={`Edit ${idea.title}`}><Pencil className="size-4" /></button><button type="button" onClick={() => deleteIdea(idea)} disabled={deletingId === idea.id} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50" aria-label={`Delete ${idea.title}`}><Trash2 className="size-4" /></button></div></div><h2 className="mt-4 text-2xl font-black">{idea.title}</h2>{idea.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{idea.description}</p>}<div className="mt-5 grid grid-cols-2 gap-3 border-t border-primary/10 pt-4"><div><p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">Rough cost</p><p className="mt-1 text-sm font-black">{idea.budget_low || idea.budget_high ? `${money(idea.budget_low)} – ${money(idea.budget_high)}` : "TBD"}</p></div><div><p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">Time</p><p className="mt-1 text-sm font-black">{months[Number(idea.target_month ?? 1) - 1]}</p></div></div>{idea.option_set && <p className="mt-4 rounded-lg bg-fuchsia-500/10 px-3 py-2 text-xs font-bold text-fuchsia-700">Option set: {idea.option_set} · {months[Number(idea.option_window_start_month ?? 1) - 1]}–{months[Number(idea.option_window_end_month ?? 1) - 1]}</p>}<div className="mt-4 flex flex-wrap gap-2">{(idea.destination_options ?? []).map((destination) => <span key={destination} className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">{destination}</span>)}</div>{(idea.saved_items ?? []).length > 0 && <div className="mt-4 border-t border-primary/10 pt-4">{idea.saved_items.slice(0, 2).map((item) => <a key={item} href={item.startsWith("http") ? item : undefined} target="_blank" rel="noreferrer" className="flex items-center gap-2 truncate text-sm font-medium text-primary hover:underline"><ExternalLink className="size-3.5 shrink-0" />{item}</a>)}</div>}<Link to="/trips" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"><Compass className="size-4" /> Start planning</Link></article>)}</section> : <section className="rounded-[2rem] border border-dashed border-primary/25 bg-primary/[0.03] p-10 text-center"><Sparkles className="mx-auto size-7 text-primary" /><h2 className="mt-4 text-2xl font-black">Nothing planned for {selectedYear} yet</h2><button type="button" onClick={openNew} className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">Add an idea</button></section>}
  </div>
}
