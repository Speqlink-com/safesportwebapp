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
  mockScreenings,
  mockReferrals,
  mockAthletes,
  getAthleteById,
} from "@/features/safesport/data/mock-data"
import { physiotherapistNavData } from "@/features/safesport/data/physiotherapist-nav"
import { 
  UsersIcon,
  CalendarIcon,
  BrainCircuitIcon,
  ActivityIcon,
  ArrowRightLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

export default function PhysiotherapistDashboardPage() {
  // Assigned athletes (those with referrals or screenings)
  const assignedAthletes = mockAthletes.filter(a => 
    mockReferrals.some(r => r.athleteId === a.id && r.assignedTo === "physio-001") ||
    mockScreenings.some(s => s.athleteId === a.id && s.performedBy === "physio-001")
  )
  
  const aiReviewsPending = mockScreenings.filter(s => s.status === "ready_for_review").length
  const activeRehab = mockReferrals.filter(r => r.type === "physiotherapy" && r.status === "in_progress").length
  const incomingReferrals = mockReferrals.filter(r => r.status === "assigned" && r.assignedTo === "physio-001").length
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <SidebarProvider>
      <SafeSportSidebar navData={physiotherapistNavData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Physiotherapist Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeSwitcher />
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold">Welcome, {physiotherapistNavData.user.name.split(' ')[0]}</h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <UsersIcon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{assignedAthletes.length}</p>
                  <p className="text-sm text-muted-foreground">Assigned Athletes</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
                  <BrainCircuitIcon className="size-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{aiReviewsPending}</p>
                  <p className="text-sm text-muted-foreground">AI Reviews</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
                  <ActivityIcon className="size-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeRehab}</p>
                  <p className="text-sm text-muted-foreground">Active Rehab</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                  <ArrowRightLeftIcon className="size-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{incomingReferrals}</p>
                  <p className="text-sm text-muted-foreground">New Referrals</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* AI Reviews Pending */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">AI Reviews Pending</h2>
                <Badge variant="destructive">{aiReviewsPending}</Badge>
              </div>
              <div className="space-y-3">
                {mockScreenings
                  .filter(s => s.status === "ready_for_review")
                  .map((screening) => {
                    const athlete = getAthleteById(screening.athleteId)
                    return (
                      <div key={screening.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50">
                        <Avatar>
                          <AvatarFallback>
                            {athlete?.firstName[0]}{athlete?.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{athlete?.firstName} {athlete?.lastName}</p>
                          <p className="text-sm text-muted-foreground">{screening.drill.replace(/_/g, " ")}</p>
                          {screening.aiResult && (
                            <Badge variant={screening.aiResult.riskLevel === "moderate" ? "outline" : "default"} className="mt-1">
                              {screening.aiResult.riskLevel} risk
                            </Badge>
                          )}
                        </div>
                        <Button size="sm" variant="ghost">
                          <ChevronRightIcon className="size-4" />
                        </Button>
                      </div>
                    )
                  })}
              </div>
            </Card>

            {/* Incoming Referrals */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Incoming Referrals</h2>
                <Badge>{incomingReferrals}</Badge>
              </div>
              <div className="space-y-3">
                {mockReferrals
                  .filter(r => r.status === "assigned" && r.assignedTo === "physio-001")
                  .map((referral) => {
                    const athlete = getAthleteById(referral.athleteId)
                    return (
                      <div key={referral.id} className="rounded-lg border p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <p className="font-medium">{athlete?.firstName} {athlete?.lastName}</p>
                          <Badge variant={referral.urgency === "priority" ? "destructive" : "outline"}>
                            {referral.urgency}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{referral.type.replace(/_/g, " ")}</p>
                        <p className="mt-1 text-sm">{referral.reason}</p>
                        {referral.appointmentDate && (
                          <p className="mt-1 text-sm font-medium">
                            Appointment: {new Date(referral.appointmentDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )
                  })}
              </div>
            </Card>

            {/* Active Rehabilitation */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Active Rehabilitation</h2>
                <Badge>{activeRehab}</Badge>
              </div>
              <div className="space-y-3">
                {mockReferrals
                  .filter(r => r.type === "physiotherapy" && r.status === "in_progress")
                  .map((referral) => {
                    const athlete = getAthleteById(referral.athleteId)
                    return (
                      <div key={referral.id} className="rounded-lg border p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <p className="font-medium">{athlete?.firstName} {athlete?.lastName}</p>
                          <Badge>In Progress</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{referral.reason}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-muted">
                            <div className="h-2 w-2/3 rounded-full bg-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground">Session 4/6</span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </Card>

            {/* Assigned Athletes */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">My Athletes</h2>
                <Badge>{assignedAthletes.length}</Badge>
              </div>
              <div className="space-y-3">
                {assignedAthletes.map((athlete) => (
                  <div key={athlete.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50">
                    <Avatar>
                      <AvatarFallback>
                        {athlete.firstName[0]}{athlete.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{athlete.firstName} {athlete.lastName}</p>
                      <p className="text-sm text-muted-foreground">{athlete.currentSport?.name} • {athlete.currentTeam?.name}</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ChevronRightIcon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Today's Sessions */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <CalendarIcon className="size-5" />
              <h2 className="text-lg font-semibold">Today's Sessions</h2>
            </div>
            <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
              No sessions scheduled for today
            </div>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
