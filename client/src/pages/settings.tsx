import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, Landmark } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Platform Configurations</h1>
        <p className="text-muted-foreground">
          Configure default study room seat rules, daily late fine values, and library timings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Circulation Settings */}
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="size-4 text-primary" /> Circulation & Borrowing
            </CardTitle>
            <CardDescription>Configure limits on active book checkouts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold">Max Books per Member</label>
              <Input type="number" defaultValue="3" className="rounded-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Standard Borrowing Period (Days)</label>
              <Input type="number" defaultValue="14" className="rounded-none" />
            </div>
          </CardContent>
        </Card>

        {/* Fine Settings */}
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Landmark className="size-4 text-primary" /> Overdue Fine Policies
            </CardTitle>
            <CardDescription>Set rates for daily late book returns.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold">Daily Fine Rate (₹)</label>
              <Input type="number" defaultValue="5" className="rounded-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Grace Period Days (No Fine)</label>
              <Input type="number" defaultValue="2" className="rounded-none" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Library Hours */}
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="size-4 text-primary" /> Library Operational Timings
          </CardTitle>
          <CardDescription>Specify desk booking slot windows.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold">Opening Hours</label>
              <Input type="time" defaultValue="08:00" className="rounded-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Closing Hours</label>
              <Input type="time" defaultValue="22:00" className="rounded-none" />
            </div>
          </div>
          <div className="flex gap-2 justify-end border-t pt-4">
            <Button variant="outline" className="rounded-none">Reset</Button>
            <Button className="rounded-none">Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
