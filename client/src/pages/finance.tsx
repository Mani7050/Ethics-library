import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLibrary } from "@/context/LibraryContext"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Search, Plus, MoreVertical, ArrowUpRight, ArrowDownRight, Printer } from "lucide-react"

export default function FinancePage() {
  const { 
    transactions, 
    expenses, 
    collectFee, 
    logExpense, 
    members 
  } = useLibrary()

  const [activeTab, setActiveTab] = React.useState<"revenue" | "expenses">("revenue")

  // Form states for Collect Fee (Revenue)
  const [revenueEmail, setRevenueEmail] = React.useState("")
  const [revenuePlan, setRevenuePlan] = React.useState("Premium Reading Desk")
  const [revenueAmount, setRevenueAmount] = React.useState("1500")
  const [revenueMethod, setRevenueMethod] = React.useState("UPI (GPay)")
  const [isRevenueSheetOpen, setIsRevenueSheetOpen] = React.useState(false)

  // Form states for Log Expense (Expenses)
  const [expenseTitle, setExpenseTitle] = React.useState("")
  const [expenseCategory, setExpenseCategory] = React.useState("Rent")
  const [expenseAmount, setExpenseAmount] = React.useState("")
  const [isExpenseSheetOpen, setIsExpenseSheetOpen] = React.useState(false)

  // Local search query
  const [searchTerm, setSearchTerm] = React.useState("")

  // Predefined Plan prices for auto-filling
  const planPrices: Record<string, string> = {
    "General Library Access": "800",
    "Premium Reading Desk": "1500",
    "VIP Quiet Cabin": "3000"
  }

  // Auto-fill amount when plan changes
  React.useEffect(() => {
    if (planPrices[revenuePlan]) {
      setRevenueAmount(planPrices[revenuePlan])
    }
  }, [revenuePlan])

  // Get current date string formatted like "Jul 24, 2026"
  const todayStr = React.useMemo(() => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
    return new Date().toLocaleDateString("en-US", options)
  }, [])

  // Helper to parse currency strings to numbers
  const parseAmount = (amtStr: string) => {
    return parseInt(amtStr.replace(/[₹,]/g, ""), 10) || 0
  }

  // Dynamic calculations
  const todayCollection = React.useMemo(() => {
    return transactions
      .filter((tx) => tx.date.includes(todayStr))
      .reduce((sum, tx) => sum + parseAmount(tx.amount), 0)
  }, [transactions, todayStr])

  const monthlyRevenue = React.useMemo(() => {
    return transactions.reduce((sum, tx) => sum + parseAmount(tx.amount), 0)
  }, [transactions])

  const totalExpenses = React.useMemo(() => {
    return expenses.reduce((sum, exp) => sum + parseAmount(exp.amount), 0)
  }, [expenses])

  const netIncome = monthlyRevenue - totalExpenses

  // Form handlers
  const handleCollectFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!revenueEmail || !revenueAmount) return

    collectFee(revenueEmail, revenuePlan, Number(revenueAmount), revenueMethod)
    setRevenueEmail("")
    setIsRevenueSheetOpen(false)
  }

  const handleLogExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!expenseTitle || !expenseAmount) return

    logExpense(expenseTitle, expenseCategory, Number(expenseAmount))
    setExpenseTitle("")
    setExpenseAmount("")
    setIsExpenseSheetOpen(false)
  }

  // Filtering transactions / expenses
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(
      (tx) =>
        tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.method.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [transactions, searchTerm])

  const filteredExpenses = React.useMemo(() => {
    return expenses.filter(
      (exp) =>
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [expenses, searchTerm])

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Revenue & Expenses</h1>
        <p className="text-muted-foreground font-medium">
          Track student subscription revenues, daily fee collection logs, and library operational expenses.
        </p>
      </div>

      {/* Finance KPI cards */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-none border border-border shadow-sm">
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-0.5">
                <ArrowUpRight className="size-3 text-emerald-500 mr-0.5" />
                Today's Collection
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5">₹{todayCollection.toLocaleString()}</h3>
            </div>
            <div className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs font-bold shrink-0">
              ₹{(todayCollection / 1000).toFixed(1)}k
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border border-border shadow-sm">
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Monthly Revenue</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-0.5">₹{monthlyRevenue.toLocaleString()}</h3>
            </div>
            <div className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold shrink-0">
              ₹{(monthlyRevenue / 1000).toFixed(1)}k
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border border-border shadow-sm">
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-0.5">
                <ArrowDownRight className="size-3 text-rose-500 mr-0.5" />
                Total Expenses
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-rose-600 mt-0.5">₹{totalExpenses.toLocaleString()}</h3>
            </div>
            <div className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-bold shrink-0">
              ₹{(totalExpenses / 1000).toFixed(1)}k
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border border-border bg-emerald-50/10 shadow-sm">
          <CardContent className="p-3.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-600">Net Library Income</p>
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5">₹{netIncome.toLocaleString()}</h3>
            </div>
            <div className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 text-xs font-bold shrink-0">
              ₹{(netIncome / 1000).toFixed(1)}k
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Switcher - High Fidelity borderless */}
      <div className="flex border-b border-border">
        <button
          onClick={() => {
            setActiveTab("revenue")
            setSearchTerm("")
          }}
          className={`px-4 py-2.5 font-bold text-xs border-b-2 cursor-pointer transition-colors ${
            activeTab === "revenue"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Fee Collections (Revenue)
        </button>
        <button
          onClick={() => {
            setActiveTab("expenses")
            setSearchTerm("")
          }}
          className={`px-4 py-2.5 font-bold text-xs border-b-2 cursor-pointer transition-colors ${
            activeTab === "expenses"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Facility Expenditures (Expenses)
        </button>
      </div>

      {/* Control bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between py-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={activeTab === "revenue" ? "Search collections by student..." : "Search expenditure logs..."} 
            className="pl-9 rounded-none font-medium" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 items-center">
          {activeTab === "revenue" ? (
            /* Collect Fee Form Sheet */
            <Sheet open={isRevenueSheetOpen} onOpenChange={setIsRevenueSheetOpen}>
              <SheetTrigger asChild>
                <Button className="rounded-none gap-1 h-9 cursor-pointer font-bold">
                  <Plus className="size-4" /> Collect Member Fee
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:!max-w-xl p-6 bg-background">
                <SheetHeader className="pb-6">
                  <SheetTitle className="font-bold text-xl">Collect Subscription Fee</SheetTitle>
                  <SheetDescription className="font-medium">
                    Record a payment transaction details for a library seat subscription.
                  </SheetDescription>
                </SheetHeader>
                
                <form onSubmit={handleCollectFeeSubmit} className="flex flex-col flex-1 justify-between">
                  <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Choose Active Member</label>
                      <select
                        required
                        value={revenueEmail}
                        onChange={(e) => setRevenueEmail(e.target.value)}
                        className="w-full text-xs p-2.5 bg-background border border-input rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">-- Select Member --</option>
                        {members.filter(m => m.status === 'Active').map((m) => (
                          <option key={m.email} value={m.email}>{m.name} ({m.email})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Membership Plan</label>
                      <select
                        value={revenuePlan}
                        onChange={(e) => setRevenuePlan(e.target.value)}
                        className="w-full text-xs p-2.5 bg-background border border-input rounded-none focus:outline-none"
                      >
                        <option value="General Library Access">General Library Access (₹800)</option>
                        <option value="Premium Reading Desk">Premium Reading Desk (₹1,500)</option>
                        <option value="VIP Quiet Cabin">VIP Quiet Cabin (₹3,000)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Amount Collected (₹)</label>
                      <Input
                        required
                        type="number"
                        placeholder="e.g. 1500"
                        value={revenueAmount}
                        onChange={(e) => setRevenueAmount(e.target.value)}
                        className="rounded-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Payment Mode</label>
                      <select
                        value={revenueMethod}
                        onChange={(e) => setRevenueMethod(e.target.value)}
                        className="w-full text-xs p-2.5 bg-background border border-input rounded-none focus:outline-none"
                      >
                        <option value="UPI (GPay)">UPI (GPay)</option>
                        <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                      </select>
                    </div>
                  </div>

                  <SheetFooter className="pt-4 border-t mt-auto flex flex-row items-center justify-end gap-2.5">
                    <SheetClose asChild>
                      <Button type="button" variant="outline" size="sm" className="rounded-none cursor-pointer font-bold px-4 text-xs">Cancel</Button>
                    </SheetClose>
                    <Button type="submit" disabled={!revenueEmail || !revenueAmount} size="sm" className="rounded-none cursor-pointer font-bold px-4 text-xs">Collect Fee</Button>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          ) : (
            /* Log Expense Form Sheet */
            <Sheet open={isExpenseSheetOpen} onOpenChange={setIsExpenseSheetOpen}>
              <SheetTrigger asChild>
                <Button className="rounded-none gap-1 h-9 cursor-pointer font-bold">
                  <Plus className="size-4" /> Log Facility Expense
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:!max-w-xl p-6 bg-background">
                <SheetHeader className="pb-6">
                  <SheetTitle className="font-bold text-xl">Log Library Expenditure</SheetTitle>
                  <SheetDescription className="font-medium">
                    Record facility costs such as rent, assistant wages, or utility bills.
                  </SheetDescription>
                </SheetHeader>
                
                <form onSubmit={handleLogExpenseSubmit} className="flex flex-col flex-1 justify-between">
                  <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Expense Title / Description</label>
                      <Input
                        required
                        placeholder="e.g. Electric AC Monthly Bill"
                        value={expenseTitle}
                        onChange={(e) => setExpenseTitle(e.target.value)}
                        className="rounded-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Category</label>
                      <select
                        value={expenseCategory}
                        onChange={(e) => setExpenseCategory(e.target.value)}
                        className="w-full text-xs p-2.5 bg-background border border-input rounded-none focus:outline-none"
                      >
                        <option value="Rent">Rent</option>
                        <option value="Utility">Utility Bills</option>
                        <option value="Salary">Staff Salary</option>
                        <option value="Maintenance">Maintenance & Repairs</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Amount Paid (₹)</label>
                      <Input
                        required
                        type="number"
                        placeholder="e.g. 8000"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        className="rounded-none"
                      />
                    </div>
                  </div>

                  <SheetFooter className="pt-4 border-t mt-auto flex flex-row items-center justify-end gap-2.5">
                    <SheetClose asChild>
                      <Button type="button" variant="outline" size="sm" className="rounded-none cursor-pointer font-bold px-4 text-xs">Cancel</Button>
                    </SheetClose>
                    <Button type="submit" disabled={!expenseTitle || !expenseAmount} size="sm" className="rounded-none cursor-pointer font-bold px-4 text-xs">Save Expense</Button>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      {/* Dynamic Tab Tables list - Borderless High Fidelity */}
      {activeTab === "revenue" ? (
        <>
          {/* Mobile View: High-Density Cards */}
          <div className="space-y-3 sm:hidden">
            {filteredTransactions.map((tx) => (
              <Card key={tx.id} className="rounded-none border border-border p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${tx.color}`}>
                      {tx.initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{tx.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{tx.plan}</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600 text-sm">₹{tx.amount}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/50 text-muted-foreground">
                  <span>{tx.method} • {tx.date}</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {tx.status}
                  </span>
                </div>
              </Card>
            ))}
            {filteredTransactions.length === 0 && (
              <div className="p-8 text-center text-muted-foreground font-semibold border border-dashed rounded-none">
                No transactions found.
              </div>
            )}
          </div>

          {/* Desktop View: Full Data Table */}
          <div className="hidden sm:block overflow-x-auto w-full max-w-full border-t border-b border-border shadow-sm">
            <table className="w-full text-xs text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-border bg-muted/10 font-bold text-zinc-800 dark:text-zinc-200">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Plan Subscribed</th>
                  <th className="p-4">Paid Fees</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Receipt Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-muted/10 transition-colors last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${tx.color}`}>
                          {tx.initial}
                        </div>
                        <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{tx.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-medium">{tx.plan}</td>
                    <td className="p-4 font-bold text-emerald-600 text-sm">₹{tx.amount}</td>
                    <td className="p-4 text-muted-foreground font-medium">{tx.method}</td>
                    <td className="p-4 text-muted-foreground font-medium">{tx.date}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="sm" className="rounded-none h-7 px-2 text-[10px] font-semibold cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <Printer className="size-3 mr-1" /> Invoice
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground font-semibold">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* Mobile View: High-Density Expense Cards */}
          <div className="space-y-3 sm:hidden">
            {filteredExpenses.map((exp) => (
              <Card key={exp.id} className="rounded-none border border-border p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${exp.color}`}>
                      {exp.initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{exp.title}</h4>
                      <span className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-1.5 py-0.2 rounded text-[9px] font-bold">
                        {exp.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-rose-600 text-sm">-₹{exp.amount}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/50 text-muted-foreground">
                  <span>{exp.date}</span>
                  <span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 font-bold">
                    <span className="size-1.5 rounded-full bg-zinc-400" />
                    Cleared
                  </span>
                </div>
              </Card>
            ))}
            {filteredExpenses.length === 0 && (
              <div className="p-8 text-center text-muted-foreground font-semibold border border-dashed rounded-none">
                No expenditures found.
              </div>
            )}
          </div>

          {/* Desktop View: Full Expense Table */}
          <div className="hidden sm:block overflow-x-auto w-full max-w-full border-t border-b border-border shadow-sm">
            <table className="w-full text-xs text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-border bg-muted/10 font-bold text-zinc-800 dark:text-zinc-200">
                  <th className="p-4">Expense Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Cost</th>
                  <th className="p-4">Paid Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="border-b border-border hover:bg-muted/10 transition-colors last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${exp.color}`}>
                          {exp.initial}
                        </div>
                        <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{exp.title}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-rose-600 text-sm">-₹{exp.amount}</td>
                    <td className="p-4 text-muted-foreground font-medium">{exp.date}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-0.5 text-[10px] font-bold">
                        <span className="size-1.5 rounded-full bg-zinc-400" />
                        Cleared
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon-sm" className="rounded-none text-muted-foreground cursor-pointer">
                        <MoreVertical className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredExpenses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground font-semibold">
                      No expenditures found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
