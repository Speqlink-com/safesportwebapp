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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import ThemeSwitcher from "@/components/theme_switcher"
import { 
  mockAthletes,
} from "@/features/safesport/data/mock-data"
import { coachNavData } from "@/features/safesport/data/coach-nav"
import { 
  UsersIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronRightIcon,
} from "lucide-react"

export default function CoachDashboardPage() {
  // U18 Football team athletes
  const teamAthletes = mockAthletes.filter(a => a.currentTeam?.id === "team-002")
  const cleared = teamAthletes.filter(a => a.eligibilityStatus === "cleared").length
  const clearedWithMonitoring = teamAthletes.filter(a => a.eligibilityStatus === "cleared_with_monitoring").length
  const restricted = teamAthletes.filter(a => a.eligibilityStatus === "temporarily_not_cleared" || a.eligibilityStatus === "not_cleared").length
  const pending = teamAthletes.filter(a => a.eligibilityStatus === "pending_evaluation").length
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <SidebarProvider>
      <SafeSportSidebar navData={coachNavData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Coach Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeSwitcher />
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold">Welcome, Coach {coachNavData.user.name.split(' ')[1]}</h1>
            <p className="text-sm text-muted-foreground">{today}</p>
            <p className="text-sm font-medium">U18 Football • Green Valley Academy</p>
          </div>

          {/* Team Readiness */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircleIcon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{cleared + clearedWithMonitoring}</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
                  <AlertTriangleIcon className="size-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{clearedWithMonitoring}</p>
                  <p className="text-sm text-muted-foreground">With Restrictions</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
                  <XCircleIcon className="size-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{restricted}</p>
                  <p className="text-sm text-muted-foreground">Not Cleared</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                  <UsersIcon className="size-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{teamAthletes.length}</p>
                  <p className="text-sm text-muted-foreground">Total Roster</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Team Roster */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Team Roster</h2>
              <Badge>{teamAthletes.length} Athletes</Badge>
            </div>
            <div className="space-y-2">
              {teamAthletes.map((athlete) => (
                <div key={athlete.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50">
                  <Avatar>
                    <AvatarFallback>
                      {athlete.firstName[0]}{athlete.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{athlete.firstName} {athlete.lastName}</p>
                    <p className="text-sm text-muted-foreground">
                      {athlete.teams.find(t => t.teamId === "team-002")?.position || "Player"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {athlete.eligibilityStatus === "cleared" && (
                      <Badge variant="default">
                        <CheckCircleIcon className="mr-1 size-3" />
                        Cleared
                      </Badge>
                    )}
                    {athlete.eligibilityStatus === "cleared_with_monitoring" && (
                      <Badge variant="outline">
                        <AlertTriangleIcon className="mr-1 size-3" />
                        Restrictions
                      </Badge>
                    )}
                    {(athlete.eligibilityStatus === "temporarily_not_cleared" || athlete.eligibilityStatus === "not_cleared") && (
                      <Badge variant="destructive">
                        <XCircleIcon className="mr-1 size-3" />
                        Not Cleared
                      </Badge>
                    )}
                    {athlete.eligibilityStatus === "pending_evaluation" && (
                      <Badge variant="secondary">
                        Pending
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" variant="ghost">
                    <ChevronRightIcon className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Athlete Restrictions */}
          {clearedWithMonitoring > 0 && (
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangleIcon className="size-5 text-secondary" />
                <h2 className="text-lg font-semibold">Active Restrictions</h2>
              </div>
              <div className="space-y-3">
                {teamAthletes
                  .filter(a => a.eligibilityStatus === "cleared_with_monitoring")
                  .map((athlete) => (
                    <div key={athlete.id} className="rounded-lg border border-secondary/50 bg-secondary/10 p-3">
                      <p className="font-medium">{athlete.firstName} {athlete.lastName}</p>
                      <p className="text-sm text-muted-foreground">Monitoring required - refer to medical team for details</p>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {/* Upcoming Events */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <CalendarIcon className="size-5" />
              <h2 className="text-lg font-semibold">Upcoming Events</h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Training Session</p>
                    <p className="text-sm text-muted-foreground">Tomorrow, 3:00 PM • Training Ground A</p>
                  </div>
                  <Badge variant="outline">Training</Badge>
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Match vs Nairobi FC</p>
                    <p className="text-sm text-muted-foreground">Saturday, 10:00 AM • Home Ground</p>
                  </div>
                  <Badge>Match</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Safety Notice */}
          <Card className="border-primary/50 bg-primary/5 p-6">
            <h3 className="mb-2 font-semibold">Safety Notice</h3>
            <p className="text-sm text-muted-foreground">
              As a coach, you have access to participation status information only. For detailed medical information, please contact the medical team. 
              Always respect athlete restrictions and follow SafeSport protocols.
            </p>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
