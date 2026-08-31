"use client"

import { SafeSportSidebar } from "@/components/safesport-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ThemeSwitcher from "@/components/theme_switcher"
import { 
  mockOrganizations,
  mockAthletes,
} from "@/features/safesport/data/mock-data"
import { sysAdminNavData } from "@/features/safesport/data/sys-admin-nav"
import { 
  UsersIcon,
  BuildingIcon,
  ServerIcon,
  ShieldCheckIcon,
  AlertCircleIcon,
  ActivityIcon,
} from "lucide-react"

export default function SysAdminDashboardPage() {
  const totalUsers = 12
  const totalOrganizations = mockOrganizations.length
  const totalAthletes = mockAthletes.length
  const systemHealth = "Healthy"
  const activeIntegrations = 2
  const recentErrors = 0
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <SidebarProvider>
      <SafeSportSidebar navData={sysAdminNavData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>System Administration</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeSwitcher />
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold">System Administration</h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>

          {/* System Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <UsersIcon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
                  <BuildingIcon className="size-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalOrganizations}</p>
                  <p className="text-sm text-muted-foreground">Organizations</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                  <ActivityIcon className="size-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalAthletes}</p>
                  <p className="text-sm text-muted-foreground">Total Athletes</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <ServerIcon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{systemHealth}</p>
                  <p className="text-sm text-muted-foreground">System Health</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Organizations */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Organizations</h2>
                <Badge>{totalOrganizations}</Badge>
              </div>
              <div className="space-y-3">
                {mockOrganizations.map((org) => (
                  <div key={org.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{org.type}</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* System Health */}
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <ServerIcon className="size-5" />
                <h2 className="text-lg font-semibold">System Health</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Application Status</p>
                    <p className="text-sm text-muted-foreground">All services operational</p>
                  </div>
                  <Badge variant="default">
                    <ShieldCheckIcon className="mr-1 size-3" />
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Database</p>
                    <p className="text-sm text-muted-foreground">Response time: 12ms</p>
                  </div>
                  <Badge variant="default">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">API Services</p>
                    <p className="text-sm text-muted-foreground">Uptime: 99.9%</p>
                  </div>
                  <Badge variant="default">Healthy</Badge>
                </div>
              </div>
            </Card>

            {/* Integrations */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Integrations</h2>
                <Badge>{activeIntegrations}</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Authentication Service</p>
                    <p className="text-sm text-muted-foreground">OAuth 2.0</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">File Storage</p>
                    <p className="text-sm text-muted-foreground">Cloud Storage</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <ActivityIcon className="size-5" />
                <h2 className="text-lg font-semibold">Recent Audit Activity</h2>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">New user created</p>
                  <p className="text-sm text-muted-foreground">Admin created user account for James Ochieng</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Organization updated</p>
                  <p className="text-sm text-muted-foreground">Green Valley Academy settings modified</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">System configuration changed</p>
                  <p className="text-sm text-muted-foreground">Email notification settings updated</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </Card>
          </div>

          {/* System Status */}
          <Card className="border-primary/50 bg-primary/5 p-6">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="size-5 text-primary" />
              <h3 className="font-semibold">System Status: All Services Operational</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              SafeSport™ platform is running smoothly. {recentErrors} errors in the last 24 hours. 
              All integrations active and system performance is optimal.
            </p>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
