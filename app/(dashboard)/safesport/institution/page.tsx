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
  mockAthletes,
  mockPPEAssessments,
  mockReferrals,
  mockIncidents,
} from "@/features/safesport/data/mock-data"
import { institutionNavData } from "@/features/safesport/data/institution-nav"
import { 
  UsersIcon,
  ShieldCheckIcon,
  ClipboardCheckIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  CheckCircleIcon,
} from "lucide-react"

export default function InstitutionDashboardPage() {
  // Green Valley Academy athletes
  const institutionAthletes = mockAthletes.filter(a => a.currentOrganization?.id === "org-001")
  const cleared = institutionAthletes.filter(a => a.eligibilityStatus === "cleared").length
  const clearedWithMonitoring = institutionAthletes.filter(a => a.eligibilityStatus === "cleared_with_monitoring").length
  const pending = institutionAthletes.filter(a => a.eligibilityStatus === "pending_evaluation").length
  const restricted = institutionAthletes.filter(a => 
    a.eligibilityStatus === "temporarily_not_cleared" || 
    a.eligibilityStatus === "not_cleared"
  ).length
  
  const ppeComplete = mockPPEAssessments.filter(p => p.status === "complete").length
  const ppeInProgress = mockPPEAssessments.filter(p => p.status === "in_progress" || p.status === "not_started").length
  const activeReferrals = mockReferrals.filter(r => r.status !== "completed").length
  const recentIncidents = mockIncidents.length
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <SidebarProvider>
      <SafeSportSidebar navData={institutionNavData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Institution Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeSwitcher />
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold">Green Valley Academy</h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>

          {/* Athlete Readiness */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircleIcon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{cleared}</p>
                  <p className="text-sm text-muted-foreground">Cleared</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
                  <ShieldCheckIcon className="size-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{clearedWithMonitoring}</p>
                  <p className="text-sm text-muted-foreground">With Monitoring</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                  <ClipboardCheckIcon className="size-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertTriangleIcon className="size-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{restricted}</p>
                  <p className="text-sm text-muted-foreground">Restricted</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Operational Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
              <div>
                <p className="text-2xl font-bold">{institutionAthletes.length}</p>
                <p className="text-sm text-muted-foreground">Total Athletes</p>
              </div>
            </Card>

            <Card className="p-4">
              <div>
                <p className="text-2xl font-bold">{ppeComplete}/{ppeComplete + ppeInProgress}</p>
                <p className="text-sm text-muted-foreground">PPE Complete</p>
              </div>
            </Card>

            <Card className="p-4">
              <div>
                <p className="text-2xl font-bold">{activeReferrals}</p>
                <p className="text-sm text-muted-foreground">Active Referrals</p>
              </div>
            </Card>

            <Card className="p-4">
              <div>
                <p className="text-2xl font-bold">{recentIncidents}</p>
                <p className="text-sm text-muted-foreground">Recent Incidents</p>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* PPE Status */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">PPE Assessment Status</h2>
                <Badge>{Math.round((ppeComplete / (ppeComplete + ppeInProgress)) * 100)}% Complete</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Completed</p>
                    <p className="text-sm text-muted-foreground">Athletes with complete PPE</p>
                  </div>
                  <Badge variant="default">{ppeComplete}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">In Progress</p>
                    <p className="text-sm text-muted-foreground">Assessments underway</p>
                  </div>
                  <Badge variant="outline">{ppeInProgress}</Badge>
                </div>
              </div>
            </Card>

            {/* Teams */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Teams</h2>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">U16 Football</p>
                      <p className="text-sm text-muted-foreground">
                        {institutionAthletes.filter(a => a.currentTeam?.id === "team-001").length} athletes
                      </p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">U18 Football</p>
                      <p className="text-sm text-muted-foreground">
                        {institutionAthletes.filter(a => a.currentTeam?.id === "team-002").length} athletes
                      </p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Active Referrals */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Active Referrals</h2>
                <Badge>{activeReferrals}</Badge>
              </div>
              <div className="space-y-3">
                {mockReferrals.filter(r => r.status !== "completed").map((referral) => {
                  const athlete = mockAthletes.find(a => a.id === referral.athleteId)
                  return (
                    <div key={referral.id} className="rounded-lg border p-3">
                      <p className="font-medium">{athlete?.firstName} {athlete?.lastName}</p>
                      <p className="text-sm text-muted-foreground">{referral.type.replace(/_/g, " ")}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant={referral.urgency === "priority" ? "destructive" : "outline"}>
                          {referral.urgency}
                        </Badge>
                        <Badge variant="secondary">{referral.status.replace(/_/g, " ")}</Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Injury Trends */}
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUpIcon className="size-5" />
                <h2 className="text-lg font-semibold">Injury Trends (Last 30 Days)</h2>
              </div>
              <div className="space-y-3">
                {mockIncidents.map((incident) => {
                  const athlete = mockAthletes.find(a => a.id === incident.athleteId)
                  return (
                    <div key={incident.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{incident.type.replace(/_/g, " ")}</p>
                          <p className="text-sm text-muted-foreground">{athlete?.firstName} {athlete?.lastName}</p>
                        </div>
                        <Badge variant={incident.severity === "severe" ? "destructive" : "outline"}>
                          {incident.severity}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Compliance Notice */}
          <Card className="border-primary/50 bg-primary/5 p-6">
            <h3 className="mb-2 font-semibold">Institutional SafeSport Status</h3>
            <p className="text-sm text-muted-foreground">
              Your institution maintains {Math.round((cleared / institutionAthletes.length) * 100)}% clearance rate. 
              Continue monitoring athlete readiness and ensuring timely PPE assessments for all participants.
            </p>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
