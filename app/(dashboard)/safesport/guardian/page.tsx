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
  mockPPEAssessments,
  getAthleteById,
} from "@/features/safesport/data/mock-data"
import { guardianNavData } from "@/features/safesport/data/guardian-nav"
import { 
  UsersIcon,
  ShieldCheckIcon,
  FileSignatureIcon,
  AlertCircleIcon,
  ClipboardCheckIcon,
  ChevronRightIcon,
} from "lucide-react"

export default function GuardianDashboardPage() {
  // Guardian viewing their children (example: Brian Otieno's guardian)
  const myChildren = [mockAthletes[0]] // Brian Otieno
  const pendingConsent = 1
  const pendingQuestionnaires = 0
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <SidebarProvider>
      <SafeSportSidebar navData={guardianNavData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Guardian Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeSwitcher />
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold">Good day, {guardianNavData.user.name.split(' ')[0]}</h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <UsersIcon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myChildren.length}</p>
                  <p className="text-sm text-muted-foreground">My Children</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
                  <FileSignatureIcon className="size-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingConsent}</p>
                  <p className="text-sm text-muted-foreground">Pending Consent</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
                  <ClipboardCheckIcon className="size-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingQuestionnaires}</p>
                  <p className="text-sm text-muted-foreground">Pending Forms</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* My Children */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">My Children</h2>
                <Badge>{myChildren.length}</Badge>
              </div>
              <div className="space-y-3">
                {myChildren.map((child) => (
                  <div key={child.id} className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted/50">
                    <Avatar className="size-12">
                      <AvatarFallback>
                        {child.firstName[0]}{child.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{child.firstName} {child.lastName}</p>
                      <p className="text-sm text-muted-foreground">{child.currentSport?.name} • {child.currentTeam?.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant={child.eligibilityStatus === "cleared" ? "default" : "outline"} className="text-xs">
                          {child.eligibilityStatus.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ChevronRightIcon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Action Required */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Action Required</h2>
                <Badge variant="destructive">{pendingConsent}</Badge>
              </div>
              <div className="space-y-3">
                {pendingConsent > 0 && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircleIcon className="size-5 text-destructive" />
                      <div className="flex-1">
                        <p className="font-medium">Video Consent Required</p>
                        <p className="text-sm text-muted-foreground">
                          Consent required for Brian Otieno's movement screening video
                        </p>
                        <Button size="sm" className="mt-2">
                          Review & Sign
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {pendingConsent > 0 && pendingQuestionnaires > 0 && (
                  <p className="text-sm text-muted-foreground">No pending actions</p>
                )}
              </div>
            </Card>

            {/* Health Status */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Health Status</h2>
                <ShieldCheckIcon className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {myChildren.map((child) => {
                  const childPPE = mockPPEAssessments.filter(p => p.athleteId === child.id)
                  const latestPPE = childPPE[childPPE.length - 1]
                  
                  return (
                    <div key={child.id} className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium">{child.firstName} {child.lastName}</p>
                        <Badge variant={child.eligibilityStatus === "cleared" ? "default" : "outline"}>
                          {child.eligibilityStatus.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      {latestPPE ? (
                        <>
                          <p className="text-sm text-muted-foreground">
                            Last Assessment: {new Date(latestPPE.assessmentDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Status: {latestPPE.status.replace(/_/g, " ")}
                          </p>
                          {child.nextReview && (
                            <p className="mt-1 text-sm font-medium">
                              Next Review: {new Date(child.nextReview).toLocaleDateString()}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">No assessment on record</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Recent Documents */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Documents</h2>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Medical Clearance Certificate</p>
                      <p className="text-sm text-muted-foreground">Brian Otieno • Issued Aug 15, 2026</p>
                    </div>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Movement Screening Report</p>
                      <p className="text-sm text-muted-foreground">Brian Otieno • Aug 18, 2026</p>
                    </div>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Important Information */}
          <Card className="border-primary/50 bg-primary/5 p-6">
            <h3 className="mb-2 font-semibold">Important Information</h3>
            <p className="text-sm text-muted-foreground">
              As a guardian, you have access to permitted health and safety information about your child. 
              Please review consent forms and questionnaires promptly to ensure your child can participate safely.
            </p>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
