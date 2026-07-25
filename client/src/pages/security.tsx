import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, Key, CheckCircle, Lock } from "lucide-react"

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Security & Gate Access</h1>
        <p className="text-muted-foreground">
          Manage API keys for RFID scanner terminals, librarian staff roles, and login options.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* API Tokens */}
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="size-4 text-primary" /> RFID Gate Terminal Token
            </CardTitle>
            <CardDescription>
              Use this secret key to connect student entrance gates with the central database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold">Live Access Key</label>
              <div className="flex gap-2">
                <Input value="ethics_rfid_live_9481237a8b9cd2" readOnly className="font-mono text-xs bg-muted rounded-none" />
                <Button variant="outline" className="rounded-none">Copy</Button>
              </div>
            </div>
            <Button size="sm" className="rounded-none">Regenerate Token</Button>
          </CardContent>
        </Card>

        {/* Security Checklist */}
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="size-4 text-primary" /> Gateway Security Controls
            </CardTitle>
            <CardDescription>
              Toggle safety rules to keep reader records safe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="text-sm font-medium">Automatic Fine Calculations</p>
                <p className="text-xs text-muted-foreground">Enabled via Server CRON Job daily</p>
              </div>
              <CheckCircle className="size-5 text-emerald-500" />
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="text-sm font-medium">RFID Entrance Logging</p>
                <p className="text-xs text-muted-foreground">Log each scan at the front doors</p>
              </div>
              <CheckCircle className="size-5 text-emerald-500" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Two-Factor Auth (2FA) for Admins</p>
                <p className="text-xs text-muted-foreground">Require OTP upon logging into panel</p>
              </div>
              <span className="text-xs text-muted-foreground font-semibold bg-muted px-2 py-0.5">Disabled</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Roll Card */}
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="size-4 text-primary" /> Active Librarian Roles
          </CardTitle>
          <CardDescription>Accounts authorized to issue books and collect fines.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-semibold text-sm">Super Admin</span>
            <span className="text-xs text-muted-foreground">Mani (admin@ethicslibrary.com)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Assistant Librarian</span>
            <span className="text-xs text-muted-foreground">Rajesh Kumar (rajesh@ethicslibrary.com)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
