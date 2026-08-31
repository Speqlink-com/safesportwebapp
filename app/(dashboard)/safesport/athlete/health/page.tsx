"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { SafeSportSidebar } from "@/components/safesport-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/theme_switcher";
import { athleteNavData } from "@/features/safesport/data/athlete-nav";
import { mockAthletes } from "@/features/safesport/data/mock-data";
import {
  ActivityIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  HeartPulseIcon,
  TrendingUpIcon,
  CalendarIcon,
  FileTextIcon,
  AwardIcon,
} from "lucide-react";

export default function AthleteHealthPage() {
  const athlete = mockAthletes[0]; // Brian Otieno

  // Use query params for tab state
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "overview";

  const handleTabChange = (value: string) => {
    router.push(`/safesport/athlete/screening`);
  };

  return (
    <SidebarProvider>
      <SafeSportSidebar navData={athleteNavData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/safesport/athlete">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>My Health</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeSwitcher />
        </header>

        <div className="flex flex-1 flex-col p-6">
          <div className="mx-auto w-full max-w-[1400px]">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">My Health</h1>
              <p className="text-sm text-muted-foreground">
                Your complete health journey, assessments, and clinical status
              </p>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="flex flex-col"
            >
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="assessments" className={"hidden"}>
                  Assessments
                </TabsTrigger>
                <TabsTrigger value="injuries">Injuries</TabsTrigger>
                <TabsTrigger value="rehabilitation">Rehabilitation</TabsTrigger>
                <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6 flex-none">
                <div className="space-y-6">
                  {/* Health Status Summary */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                          <HeartPulseIcon className="size-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            Clinical Status
                          </p>
                          <p className="text-xl font-semibold">
                            {athlete.ppeAssessments[0]?.status === "complete"
                              ? "Complete"
                              : "In Progress"}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                          <CheckCircle2Icon className="size-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            Eligibility
                          </p>
                          <Badge
                            variant={
                              athlete.eligibilityStatus === "cleared"
                                ? "default"
                                : athlete.eligibilityStatus.includes(
                                      "restriction",
                                    )
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {athlete.eligibilityStatus.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                          <AlertCircleIcon className="size-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            Active Incidents
                          </p>
                          <p className="text-xl font-semibold">
                            {athlete.incidents.length}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                      <ActivityIcon className="size-5" />
                      Recent Health Activity
                    </h3>
                    <div className="space-y-3">
                      {athlete.ppeAssessments.slice(0, 3).map((assessment) => (
                        <div
                          key={assessment.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <ClipboardListIcon className="size-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">PPE Assessment</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  assessment.assessmentDate,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              assessment.status === "complete"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {assessment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      Quick Actions
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleTabChange("assessments")}
                      >
                        <ClipboardListIcon className="mr-2 size-4" />
                        View All Screenings
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleTabChange("injuries")}
                      >
                        <AlertCircleIcon className="mr-2 size-4" />
                        View Injury History
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleTabChange("eligibility")}
                      >
                        <CheckCircle2Icon className="mr-2 size-4" />
                        Check Eligibility Status
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <FileTextIcon className="mr-2 size-4" />
                        Download Health Records
                      </Button>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Assessments Tab */}
              <TabsContent
                value="assessments"
                className="mt-6 flex-none hidden"
              >
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      PPE Assessments
                    </h3>
                    <div className="space-y-3">
                      {athlete.ppeAssessments.map((assessment) => (
                        <div
                          key={assessment.id}
                          className="rounded-lg border p-4"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">PPE Assessment</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  assessment.assessmentDate,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant={
                                assessment.status === "complete"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {assessment.status}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Clinician:
                              </span>
                              <span>{assessment.clinicianName}</span>
                            </div>
                            {assessment.eligibilityDecision && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Outcome:
                                </span>
                                <Badge variant="outline">
                                  {assessment.eligibilityDecision.status.replace(
                                    /_/g,
                                    " ",
                                  )}
                                </Badge>
                              </div>
                            )}
                          </div>

                          <div className="mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Injuries Tab */}
              <TabsContent value="injuries" className="mt-6 flex-none">
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      Injury History
                    </h3>
                    {athlete.incidents.length > 0 ? (
                      <div className="space-y-3">
                        {athlete.incidents.map((incident) => (
                          <div
                            key={incident.id}
                            className="rounded-lg border p-4"
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">
                                  {incident.type.replace(/_/g, " ")}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(
                                    incident.incidentDate,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant="secondary">
                                {incident.severity}
                              </Badge>
                            </div>

                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-medium">Severity:</span>{" "}
                                {incident.severity}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Description:
                                </span>{" "}
                                {incident.description}
                              </p>
                              <p>
                                <span className="font-medium">Location:</span>{" "}
                                {incident.location}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <CheckCircle2Icon className="mx-auto mb-2 size-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No injury history recorded
                        </p>
                      </div>
                    )}
                  </Card>
                </div>
              </TabsContent>

              {/* Rehabilitation Tab */}
              <TabsContent value="rehabilitation" className="mt-6 flex-none">
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      Rehabilitation Programs
                    </h3>
                    {athlete.incidents.length > 0 ? (
                      <div className="space-y-3">
                        {athlete.incidents.map((incident) => (
                          <div
                            key={incident.id}
                            className="rounded-lg border p-4"
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">
                                  Recovery: {incident.type.replace(/_/g, " ")}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Started:{" "}
                                  {new Date(
                                    incident.incidentDate,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant="secondary">Active</Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Severity
                                </span>
                                <span className="font-medium">
                                  {incident.severity}
                                </span>
                              </div>
                              {incident.treatment && (
                                <div className="rounded-lg bg-muted/50 p-3">
                                  <p className="text-sm font-medium">
                                    Treatment
                                  </p>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {incident.treatment}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="mt-3 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                View Program
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                Log Progress
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <TrendingUpIcon className="mx-auto mb-2 size-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No active rehabilitation programs
                        </p>
                      </div>
                    )}
                  </Card>
                </div>
              </TabsContent>

              {/* Eligibility Tab */}
              <TabsContent value="eligibility" className="mt-6 flex-none">
                <div className="space-y-6">
                  {/* Current Eligibility Status */}
                  <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      Current Eligibility Status
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">Participation Status</p>
                          <p className="text-sm text-muted-foreground">
                            {athlete.readiness.replace(/_/g, " ")}
                          </p>
                        </div>
                        <Badge
                          variant={
                            athlete.eligibilityStatus === "cleared"
                              ? "default"
                              : "outline"
                          }
                        >
                          {athlete.eligibilityStatus.replace(/_/g, " ")}
                        </Badge>
                      </div>

                      {athlete.nextReview && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarIcon className="size-4" />
                          Next Review:{" "}
                          {new Date(athlete.nextReview).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Eligibility History */}
                  <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      Eligibility History
                    </h3>
                    {athlete.eligibilityHistory.length > 0 ? (
                      <div className="space-y-3">
                        {athlete.eligibilityHistory.map((decision) => (
                          <div
                            key={decision.id}
                            className="rounded-lg border p-4"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  {new Date(
                                    decision.decisionDate,
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  By {decision.clinicianName}
                                </p>
                              </div>
                              <Badge variant="outline">
                                {decision.status.replace(/_/g, " ")}
                              </Badge>
                            </div>
                            {decision.restrictions &&
                              decision.restrictions.length > 0 && (
                                <p className="text-sm text-muted-foreground">
                                  Restrictions:{" "}
                                  {decision.restrictions.join(", ")}
                                </p>
                              )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <FileTextIcon className="mx-auto mb-2 size-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No eligibility history available
                        </p>
                      </div>
                    )}
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
