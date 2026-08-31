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
  mockSchedule,
  mockReferrals,
  getAthleteById,
} from "@/features/safesport/data/mock-data"
import { operationsNavData } from "@/features/safesport/data/operations-nav"
import { 
  CalendarIcon,
  ClipboardCheckIcon,
  ArrowRightLeftIcon,
  AlertCircleIcon,
  UsersIcon,
} from "lucide-react"

export default function OperationsDashboardPage() {
  const todayAppointments = mockSchedule.filter(e => e.status === "scheduled" || e.status === "in_progress").length
  const pendingReferrals = mockReferrals.filter(r => r.status === "pending").length
  const overdueReferrals = mockReferrals.filter(r => r.status === "overdue").length
  const activeEvents = 3
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <SidebarProvider>
      <SafeSportSidebar navData={operationsNavData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Operations Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeSwitcher />
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold">Operations Center</h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarIcon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{todayAppointments}</p>
                  <p className="text-sm text-muted-foreground">Today's Appointments</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
                  <ClipboardCheckIcon className="size-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeEvents}</p>
                  <p className="text-sm text-muted-foreground">Active Events</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                  <ArrowRightLeftIcon className="size-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingReferrals}</p>
                  <p className="text-sm text-muted-foreground">Pending Referrals</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertCircleIcon className="size-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overdueReferrals}</p>
                  <p className="text-sm text-muted-foreground">Overdue Items</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Today's Schedule */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Today's Appointments</h2>
                <Badge>{todayAppointments}</Badge>
              </div>
              <div className="space-y-3">
                {mockSchedule.map((event) => (
                  <div key={event.id} className="flex gap-3 rounded-lg border p-3">
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.startTime).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                      <p className="text-sm text-muted-foreground">Dr. {event.clinicianName}</p>
                    </div>
                    <Badge variant={event.status === "in_progress" ? "default" : "outline"}>
                      {event.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Referral Management */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Referral Coordination</h2>
                <Badge>{mockReferrals.length}</Badge>
              </div>
              <div className="space-y-3">
                {mockReferrals.map((referral) => {
                  const athlete = getAthleteById(referral.athleteId)
                  return (
                    <div key={referral.id} className="rounded-lg border p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <p className="font-medium">{athlete?.firstName} {athlete?.lastName}</p>
                        <Badge variant={
                          referral.status === "overdue" ? "destructive" :
                          referral.status === "completed" ? "default" : "outline"
                        }>
                          {referral.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{referral.type.replace(/_/g, " ")}</p>
                      <p className="text-sm">{referral.reason}</p>
                      {referral.appointmentDate && (
                        <p className="mt-1 text-sm font-medium">
                          {new Date(referral.appointmentDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Clinician Coverage */}
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <UsersIcon className="size-5" />
                <h2 className="text-lg font-semibold">Clinician Coverage</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Dr. Sarah Ndungu</p>
                    <p className="text-sm text-muted-foreground">Green Valley Academy</p>
                  </div>
                  <Badge variant="default">On Duty</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">James Ochieng (Physio)</p>
                    <p className="text-sm text-muted-foreground">Movement Lab</p>
                  </div>
                  <Badge variant="default">Available</Badge>
                </div>
              </div>
            </Card>

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
                      <p className="font-medium">U18 Football PPE Clinic</p>
                      <p className="text-sm text-muted-foreground">Tomorrow, 9:00 AM • Clinic Room 1</p>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Movement Screening Session</p>
                      <p className="text-sm text-muted-foreground">Monday, 2:00 PM • Movement Lab</p>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Service Status */}
          <Card className="border-primary/50 bg-primary/5 p-6">
            <h3 className="mb-2 font-semibold">Service Delivery Status</h3>
            <p className="text-sm text-muted-foreground">
              All service delivery operations are running smoothly. {todayAppointments} appointments scheduled for today with adequate coverage.
            </p>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
