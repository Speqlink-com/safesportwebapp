"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  ShieldCheckIcon,
  SmartphoneIcon,
  MonitorIcon,
  KeyIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
} from "lucide-react"

interface ProfileSecurityTabProps {
  athleteEmail: string
}

export function ProfileSecurityTab({ athleteEmail }: ProfileSecurityTabProps) {
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  // Mock security data
  const twoFactorEnabled = false
  const lastPasswordChange = new Date(Date.now() - 32 * 24 * 60 * 60 * 1000) // 32 days ago
  
  const activeSessions = [
    {
      id: "current",
      device: "MacBook Pro",
      browser: "Chrome",
      location: "Nairobi, Kenya",
      isCurrent: true,
      lastActive: new Date(),
    },
    {
      id: "mobile",
      device: "iPhone",
      browser: "Safari",
      location: "Nairobi, Kenya",
      isCurrent: false,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  ]

  const securityActivity = [
    { id: 1, action: "Password changed", date: lastPasswordChange },
    { id: 2, action: "New login from iPhone", date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 3, action: "Profile updated", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  ]

  const handlePasswordChange = () => {
    console.log("Password change requested:", passwordData)
    // In production: API call to change password
    setPasswordData({ current: "", new: "", confirm: "" })
    setChangingPassword(false)
  }

  const handleEnable2FA = () => {
    console.log("2FA enable requested")
    // In production: Navigate to 2FA setup flow
  }

  const handleSignOutOthers = () => {
    console.log("Sign out other sessions requested")
    // In production: API call to invalidate other sessions
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <ShieldCheckIcon className="size-10 text-primary shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Account security</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Keep your SafeSport account secure with strong passwords and two-factor authentication
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="size-4 text-primary" />
                <span className="text-sm">Password set</span>
              </div>
              {twoFactorEnabled ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-4 text-primary" />
                  <span className="text-sm">2FA enabled</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="size-4 text-amber-500" />
                  <span className="text-sm">2FA not enabled</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Authentication */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold">Authentication</h3>
          <p className="text-sm text-muted-foreground">Manage your account credentials</p>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-6">
          {/* Email */}
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Email</Label>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="font-medium">{athleteEmail}</span>
              <Badge variant="outline" className="text-xs">Verified</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This is your account email for authentication
            </p>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-muted-foreground">Password</Label>
              {!changingPassword && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setChangingPassword(true)}
                  className="gap-2"
                >
                  <KeyIcon className="size-4" />
                  Change password
                </Button>
              )}
            </div>

            {changingPassword ? (
              <div className="space-y-4 p-4 rounded-lg border">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handlePasswordChange}>Save password</Button>
                  <Button variant="outline" onClick={() => setChangingPassword(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Last changed {lastPasswordChange.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {' '}({Math.ceil((Date.now() - lastPasswordChange.getTime()) / (1000 * 60 * 60 * 24))} days ago)
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold">Two-factor authentication</h3>
          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
        </div>
        <Separator className="mb-4" />

        <div className="flex items-start gap-4">
          <SmartphoneIcon className="size-10 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-medium">Status</p>
              <Badge variant={twoFactorEnabled ? "default" : "outline"}>
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {twoFactorEnabled 
                ? "Your account is protected with two-factor authentication"
                : "Protect your account with an additional verification step during sign-in"}
            </p>
            <Button onClick={handleEnable2FA} variant={twoFactorEnabled ? "outline" : "default"}>
              {twoFactorEnabled ? "Manage 2FA" : "Enable 2FA"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Active Sessions */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold">Active sessions</h3>
          <p className="text-sm text-muted-foreground">Devices where you're currently signed in</p>
        </div>
        <Separator className="mb-4" />

        <div className="space-y-3 mb-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-start gap-3 p-4 rounded-lg border">
              <MonitorIcon className="size-8 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{session.device}</p>
                  {session.isCurrent && (
                    <Badge variant="default" className="text-xs">Current session</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{session.browser} • {session.location}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {session.isCurrent 
                    ? "Active now" 
                    : `Last active ${Math.round((Date.now() - session.lastActive.getTime()) / (1000 * 60 * 60))} hours ago`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {activeSessions.length > 1 && (
          <Button variant="outline" onClick={handleSignOutOthers} className="w-full">
            Sign out other sessions
          </Button>
        )}
      </Card>

      {/* Security Activity */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold">Security activity</h3>
          <p className="text-sm text-muted-foreground">Recent security-related changes to your account</p>
        </div>
        <Separator className="mb-4" />

        <div className="space-y-3">
          {securityActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Security Tips */}
      <Card className="p-4 bg-muted/50 border-muted">
        <p className="text-xs text-muted-foreground mb-2">
          <strong>Security tips:</strong>
        </p>
        <ul className="text-xs text-muted-foreground space-y-1 ml-4">
          <li>• Use a strong, unique password for your SafeSport account</li>
          <li>• Enable two-factor authentication for additional protection</li>
          <li>• Sign out from shared or public devices after use</li>
          <li>• Never share your password with anyone</li>
        </ul>
      </Card>
    </div>
  )
}
