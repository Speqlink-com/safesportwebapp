"use client";

import { SafeSportSidebar } from "@/components/safesport-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ThemeSwitcher from "@/components/theme_switcher";
import {
  getClinicianDashboardStats,
  mockPPEAssessments,
  mockReferrals,
  mockIncidents,
  mockSchedule,
  mockScreenings,
  getAthleteById,
  mockAthletes,
} from "@/features/safesport/data/mock-data";
import { clinicianNavData } from "@/features/safesport/data/clinician-nav";
import {
  ClipboardListIcon,
  AlertCircleIcon,
  ArrowRightLeftIcon,
  ClockIcon,
  ActivityIcon,
  CalendarIcon,
  ChevronRightIcon,
  UsersIcon,
  BrainCircuitIcon,
  SearchIcon,
  FileTextIcon,
  PlusIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export default function ClinicianDashboardPage() {
  const stats = getClinicianDashboardStats();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate eligibility distribution
  const eligibilityData = [
    {
      name: "Cleared",
      value: mockAthletes.filter((a) => a.eligibilityStatus === "cleared").length,
      fill: "#72E34D",
    },
    {
      name: "Monitoring",
      value: mockAthletes.filter((a) => a.eligibilityStatus === "cleared_with_monitoring")
        .length,
      fill: "#A3E635",
    },
    {
      name: "Pending",
      value: mockAthletes.filter((a) => a.eligibilityStatus === "pending_evaluation").length,
      fill: "#FCD34D",
    },
    {
      name: "Restricted",
      value: mockAthletes.filter(
        (a) =>
          a.eligibilityStatus === "sport_specific_restriction" ||
          a.eligibilityStatus === "temporarily_not_cleared"
      ).length,
      fill: "#F87171",
    },
  ];

  // Clinical activity trend (last 7 days)
  const activityData = [
    { date: "Aug 25", ppe: 4, screenings: 6, incidents: 1 },
    { date: "Aug 26", ppe: 3, screenings: 8, incidents: 2 },
    { date: "Aug 27", ppe: 5, screenings: 5, incidents: 0 },
    { date: "Aug 28", ppe: 2, screenings: 7, incidents: 1 },
    { date: "Aug 29", ppe: 6, screenings: 4, incidents: 2 },
    { date: "Aug 30", ppe: 4, screenings: 9, incidents: 1 },
    { date: "Aug 31", ppe: 3, screenings: 5, incidents: 0 },
  ];

  // Incidents by type
  const incidentTypeData = [
    { type: "Ankle", count: 3 },
    { type: "Knee", count: 5 },
    { type: "Hamstring", count: 4 },
    { type: "Shoulder", count: 2 },
    { type: "Concussion", count: 1 },
  ];

  // PPE Completion gauge
  const ppeCompleted = mockPPEAssessments.filter((p) => p.status === "complete").length;
  const ppeTotal = mockPPEAssessments.length;
  const ppeCompletionPercent = Math.round((ppeCompleted / ppeTotal) * 100);

  const activityChartConfig = {
    ppe: { label: "PPE", color: "#72E34D" },
    screenings: { label: "Screenings", color: "#A3E635" },
    incidents: { label: "Incidents", color: "#FCD34D" },
  } satisfies ChartConfig;

  const incidentChartConfig = {
    count: { label: "Incidents", color: "#72E34D" },
  } satisfies ChartConfig;

  return (
    <SidebarProvider>
      <SafeSportSidebar navData={clinicianNavData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Clinician Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeSwitcher />
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold">Good morning, Dr. Ndungu</h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-5 gap-4">
            <Card className="p-6">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  <UsersIcon className="size-5 text-muted-foreground" />
                  <p className="text-4xl font-bold">{mockAthletes.length}</p>
                </div>
                <p className="text-center text-sm text-muted-foreground">Athletes under care</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-4xl font-bold text-primary">{stats.ppeDue}</p>
                <p className="text-center text-sm text-muted-foreground">PPE due</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-4xl font-bold text-destructive">{stats.pendingReviews}</p>
                <p className="text-center text-sm text-muted-foreground">Reviews</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-4xl font-bold">{stats.activeReferrals}</p>
                <p className="text-center text-sm text-muted-foreground">Referrals</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-4xl font-bold">{stats.reassessmentsDue}</p>
                <p className="text-center text-sm text-muted-foreground">Reassessments</p>
              </div>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Clinical Activity Trend */}
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold">Clinical Activity</h3>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>
              <ChartContainer config={activityChartConfig} className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="fillPPE" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#72E34D" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#72E34D" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="fillScreenings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A3E635" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#A3E635" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="fillIncidents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FCD34D" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="ppe"
                      stroke="#72E34D"
                      strokeWidth={2}
                      fill="url(#fillPPE)"
                    />
                    <Area
                      type="monotone"
                      dataKey="screenings"
                      stroke="#A3E635"
                      strokeWidth={2}
                      fill="url(#fillScreenings)"
                    />
                    <Area
                      type="monotone"
                      dataKey="incidents"
                      stroke="#FCD34D"
                      strokeWidth={2}
                      fill="url(#fillIncidents)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 flex justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#72E34D]" />
                  <span className="text-muted-foreground">PPE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#A3E635]" />
                  <span className="text-muted-foreground">Screenings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#FCD34D]" />
                  <span className="text-muted-foreground">Incidents</span>
                </div>
              </div>
            </Card>

            {/* Eligibility Distribution */}
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold">Eligibility Distribution</h3>
                <p className="text-sm text-muted-foreground">{mockAthletes.length} athletes</p>
              </div>
              <ChartContainer config={{}} className="mx-auto h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={eligibilityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {eligibilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid gap-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="size-2 rounded-full"
                                    style={{ backgroundColor: payload[0].payload.fill }}
                                  />
                                  <span className="text-sm font-medium">
                                    {payload[0].name}: {payload[0].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {eligibilityData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Incidents by Type */}
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold">Incidents by Type</h3>
                <p className="text-sm text-muted-foreground">Last 30 days</p>
              </div>
              <ChartContainer config={incidentChartConfig} className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentTypeData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="type"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#72E34D" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>

            {/* PPE Completion Gauge */}
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold">PPE Completion</h3>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>
              <div className="relative">
                <ChartContainer config={{}} className="mx-auto h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="90%"
                      data={[{ value: ppeCompletionPercent, fill: "#72E34D" }]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar
                        dataKey="value"
                        cornerRadius={10}
                        background={{ fill: "hsl(var(--muted))" }}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold">{ppeCompletionPercent}%</p>
                  <p className="text-sm text-muted-foreground">
                    {ppeCompleted} / {ppeTotal} athletes
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Schedule & Referrals */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Today's Schedule */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Today's Schedule</h3>
                <CalendarIcon className="size-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {mockSchedule.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex gap-3 rounded-lg border p-3">
                    <div className="w-16 text-sm text-muted-foreground">
                      {new Date(event.startTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                    <Badge variant={event.status === "in_progress" ? "default" : "outline"}>
                      {event.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="mt-4 w-full" size="sm">
                View full schedule
              </Button>
            </Card>

            {/* Active Referrals */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Active Referrals</h3>
                <Badge>{stats.activeReferrals}</Badge>
              </div>
              <div className="space-y-2">
                {mockReferrals
                  .filter((r) => r.status !== "completed")
                  .slice(0, 3)
                  .map((referral) => {
                    const athlete = getAthleteById(referral.athleteId);
                    return (
                      <div
                        key={referral.id}
                        className="flex items-center justify-between rounded-lg border p-3 text-sm"
                      >
                        <div className="flex-1">
                          <p className="font-medium">
                            {athlete?.firstName} {athlete?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {referral.type.replace(/_/g, " ")}
                          </p>
                        </div>
                        <Badge
                          variant={referral.urgency === "priority" ? "destructive" : "outline"}
                          className="ml-2"
                        >
                          {referral.urgency}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
              <Button variant="ghost" className="mt-4 w-full" size="sm">
                View all referrals
              </Button>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Quick Actions</h3>
            <div className="grid gap-3 md:grid-cols-5">
              <Button variant="default" className="rounded-none">
                <SearchIcon className="mr-2 size-4" />
                Find Athlete
              </Button>
              <Button variant="default" className="rounded-none">
                <PlusIcon className="mr-2 size-4" />
                Start PPE
              </Button>
              <Button variant="default" className="rounded-none">
                <FileTextIcon className="mr-2 size-4" />
                Record Incident
              </Button>
              <Button variant="default" className="rounded-none">
                <ArrowRightLeftIcon className="mr-2 size-4" />
                Create Referral
              </Button>
              <Button variant="default" className="rounded-none">
                <BrainCircuitIcon className="mr-2 size-4" />
                Review Screening
              </Button>
            </div>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
