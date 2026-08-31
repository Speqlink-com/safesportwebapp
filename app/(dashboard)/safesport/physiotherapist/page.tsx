"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  mockScreenings,
  mockReferrals,
  mockAthletes,
  getAthleteById,
} from "@/features/safesport/data/mock-data";
import { physiotherapistNavData } from "@/features/safesport/data/physiotherapist-nav";
import {
  Plus,
  UserCheck,
  ArrowRightLeft,
  BrainCircuit,
  Search,
  Clock,
  AlertCircle,
  Activity,
  Calendar,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

// Types for rehabilitation data
type RehabStatus = "not_started" | "in_progress" | "review" | "completed" | "follow_up";

interface RehabCase {
  id: string;
  athleteId: string;
  athleteName: string;
  status: RehabStatus;
  progress: number;
  sessionsCompleted: number;
  totalSessions: number;
  lastSession?: string;
  nextSession?: string;
}

interface TodayTask {
  id: string;
  time: string;
  athleteName: string;
  type: string;
  status: "pending" | "in_progress" | "completed";
  priority: "routine" | "priority" | "urgent";
}

interface ActivityEvent {
  id: string;
  timestamp: string;
  type: string;
  athleteName: string;
  description: string;
}

// Helper function to generate rehabilitation data from referrals
function generateRehabCases(): RehabCase[] {
  const physioReferrals = mockReferrals.filter(
    (r) => r.type === "physiotherapy" && r.assignedTo === "physio-001"
  );

  return physioReferrals.map((ref, index) => {
    const athlete = getAthleteById(ref.athleteId);
    const sessionsCompleted = Math.floor(Math.random() * 8);
    const totalSessions = 10;
    
    let status: RehabStatus = "in_progress";
    if (ref.status === "pending" || ref.status === "assigned") status = "not_started";
    else if (ref.status === "in_progress") status = Math.random() > 0.7 ? "review" : "in_progress";
    else if (ref.status === "completed") status = "completed";

    return {
      id: ref.id,
      athleteId: ref.athleteId,
      athleteName: athlete ? `${athlete.firstName} ${athlete.lastName}` : "Unknown",
      status,
      progress: Math.floor((sessionsCompleted / totalSessions) * 100),
      sessionsCompleted,
      totalSessions,
      lastSession: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      nextSession: status !== "completed" ? new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    };
  });
}

// Generate activity timeline data
function generateActivityTimeline(rehabCases: RehabCase[]): ActivityEvent[] {
  const events: ActivityEvent[] = [];
  const now = Date.now();

  rehabCases.forEach((rehab) => {
    if (rehab.sessionsCompleted > 0) {
      events.push({
        id: `${rehab.id}-session`,
        timestamp: new Date(now - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: "session_completed",
        athleteName: rehab.athleteName,
        description: "Rehabilitation session completed",
      });
    }
  });

  mockScreenings
    .filter((s) => s.status === "ready_for_review")
    .forEach((screening) => {
      const athlete = getAthleteById(screening.athleteId);
      events.push({
        id: `${screening.id}-review`,
        timestamp: new Date(now - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        type: "ai_review",
        athleteName: athlete ? `${athlete.firstName} ${athlete.lastName}` : "Unknown",
        description: "AI review assigned",
      });
    });

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);
}

// Generate chart data for rehabilitation activity trend (last 30 days)
function generateRehabActivityData(): any[] {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    data.push({
      date: dayName,
      sessions: Math.floor(Math.random() * 5) + 1,
      reviews: Math.floor(Math.random() * 3),
    });
  }
  
  return data.filter((_, i) => i % 3 === 0); // Show every 3rd day for readability
}

// Generate weekly workload data
function generateWeeklyWorkload(): any[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return days.map((day) => ({
    day,
    sessions: Math.floor(Math.random() * 8) + 2,
  }));
}

function getStatusColor(status: RehabStatus): string {
  switch (status) {
    case "not_started": return "#6b7280";
    case "in_progress": return "#3b82f6";
    case "review": return "#f59e0b";
    case "completed": return "#10b981";
    case "follow_up": return "#8b5cf6";
    default: return "#6b7280";
  }
}

function getStatusLabel(status: RehabStatus): string {
  switch (status) {
    case "not_started": return "Not Started";
    case "in_progress": return "In Progress";
    case "review": return "Review";
    case "completed": return "Completed";
    case "follow_up": return "Follow-up";
    default: return status;
  }
}

export default function PhysiotherapistOverviewPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("30");
  
  const userName = physiotherapistNavData.user.name.split(" ")[0];
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Generate data
  const rehabCases = generateRehabCases();
  const aiReviewsPending = mockScreenings.filter((s) => s.status === "ready_for_review");
  const incomingReferrals = mockReferrals.filter(
    (r) => r.status === "assigned" && r.assignedTo === "physio-001"
  );
  
  const rehabActivityData = generateRehabActivityData();
  const weeklyWorkload = generateWeeklyWorkload();
  const activityTimeline = generateActivityTimeline(rehabCases);

  // Status distribution for doughnut chart
  const statusCounts = rehabCases.reduce((acc, rehab) => {
    acc[rehab.status] = (acc[rehab.status] || 0) + 1;
    return acc;
  }, {} as Record<RehabStatus, number>);

  const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
    name: getStatusLabel(status as RehabStatus),
    value: count,
    color: getStatusColor(status as RehabStatus),
  }));

  // Referral pipeline counts
  const referralPipeline = {
    incoming: mockReferrals.filter((r) => r.status === "assigned" && r.assignedTo === "physio-001").length,
    active: mockReferrals.filter((r) => r.type === "physiotherapy" && r.status === "in_progress").length,
    review: rehabCases.filter((r) => r.status === "review").length,
    completed: mockReferrals.filter((r) => r.type === "physiotherapy" && r.status === "completed").length,
  };

  // Today's tasks (simulated from referrals and sessions)
  const todayTasks: TodayTask[] = [
    ...incomingReferrals.slice(0, 2).map((ref, i) => {
      const athlete = getAthleteById(ref.athleteId);
      const priority: "routine" | "priority" | "urgent" = 
        ref.urgency === "urgent" || ref.urgency === "emergency" ? "urgent" : 
        ref.urgency === "priority" ? "priority" : "routine";
      return {
        id: ref.id,
        time: `${9 + i * 2}:00`,
        athleteName: athlete ? `${athlete.firstName} ${athlete.lastName}` : "Unknown",
        type: "Initial Assessment",
        status: "pending" as const,
        priority,
      };
    }),
    ...rehabCases.filter((r) => r.status === "in_progress").slice(0, 2).map((rehab, i) => ({
      id: rehab.id,
      time: `${13 + i * 2}:00`,
      athleteName: rehab.athleteName,
      type: "Rehabilitation Session",
      status: "pending" as const,
      priority: "routine" as const,
    })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  // Filter rehab cases by search
  const filteredRehabCases = rehabCases.filter((rehab) =>
    rehab.athleteName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Welcome, {userName}</h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Session
            </Button>
            <Button variant="outline" size="sm">
              <UserCheck className="mr-2 h-4 w-4" />
              Review Athlete
            </Button>
            <Button variant="outline" size="sm">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Open Referral
            </Button>
            <Button variant="outline" size="sm">
              <BrainCircuit className="mr-2 h-4 w-4" />
              Review AI Analysis
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-[1800px] space-y-6">
          {/* Top Row: Today's Work + Attention Required */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Today's Work */}
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#72E34D]" />
                <h2 className="text-lg font-semibold">Today's Work</h2>
                <Badge variant="secondary">{todayTasks.length}</Badge>
              </div>
              <div className="space-y-2">
                {todayTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Calendar className="mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">No tasks scheduled for today</p>
                  </div>
                ) : (
                  todayTasks.map((task) => (
                    <Link key={task.id} href={`/safesport/physiotherapist/athletes`}>
                      <div className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                        <div className="flex-shrink-0">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">{task.time}</span>
                            <span className="font-medium">{task.athleteName}</span>
                            {task.priority === "urgent" && (
                              <Badge variant="destructive" className="text-xs">Urgent</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{task.type}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </Card>

            {/* Attention Required */}
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <h2 className="text-lg font-semibold">Attention Required</h2>
                <Badge variant="destructive">
                  {aiReviewsPending.length + incomingReferrals.length + rehabCases.filter((r) => r.status === "review").length}
                </Badge>
              </div>
              <div className="space-y-2">
                {/* AI Reviews */}
                {aiReviewsPending.slice(0, 2).map((screening) => {
                  const athlete = getAthleteById(screening.athleteId);
                  return (
                    <Link key={screening.id} href={`/safesport/physiotherapist/ai-reviews/${screening.id}`}>
                      <div className="group flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                        <div className="rounded-full bg-blue-500/10 p-2">
                          <BrainCircuit className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">AI Review</p>
                          <p className="font-medium">{athlete?.firstName} {athlete?.lastName}</p>
                          <p className="text-sm text-muted-foreground">
                            {screening.drill.replace(/_/g, " ")} Screening
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">Awaiting physiotherapist review</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </Link>
                  );
                })}

                {/* Referrals */}
                {incomingReferrals.slice(0, 2).map((referral) => {
                  const athlete = getAthleteById(referral.athleteId);
                  return (
                    <Link key={referral.id} href={`/safesport/physiotherapist/referrals/incoming`}>
                      <div className="group flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                        <div className="rounded-full bg-orange-500/10 p-2">
                          <ArrowRightLeft className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Referral</p>
                          <p className="font-medium">{athlete?.firstName} {athlete?.lastName}</p>
                          <p className="text-sm text-muted-foreground">{referral.reason}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Requires action</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </Link>
                  );
                })}

                {/* Follow-ups */}
                {rehabCases
                  .filter((r) => r.status === "review")
                  .slice(0, 1)
                  .map((rehab) => (
                    <Link key={rehab.id} href={`/safesport/physiotherapist/rehabilitation`}>
                      <div className="group flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                        <div className="rounded-full bg-purple-500/10 p-2">
                          <Activity className="h-4 w-4 text-purple-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Follow-up</p>
                          <p className="font-medium">{rehab.athleteName}</p>
                          <p className="text-sm text-muted-foreground">Rehabilitation review due</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </Link>
                  ))}

                {aiReviewsPending.length === 0 && incomingReferrals.length === 0 && rehabCases.filter((r) => r.status === "review").length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <AlertCircle className="mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">No items requiring attention</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Rehabilitation Activity Chart */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#72E34D]" />
                <h2 className="text-lg font-semibold">Rehabilitation Activity</h2>
              </div>
              <Select value={timeRange} onValueChange={(value) => setTimeRange(value || "30")}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rehabActivityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    name="Sessions"
                    stroke="#72E34D"
                    strokeWidth={2}
                    dot={{ fill: "#72E34D", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reviews"
                    name="Reviews"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Middle Row: Case Distribution + Session Workload */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Case Distribution */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Case Distribution by Status</h2>
              {statusDistribution.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  <p className="text-sm">No active rehabilitation cases</p>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            {/* Session Workload */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Weekly Session Workload</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyWorkload}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar dataKey="sessions" fill="#72E34D" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Referral Pipeline */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Referral Pipeline</h2>
            <div className="grid grid-cols-4 gap-4">
              <Link href="/safesport/physiotherapist/referrals/incoming">
                <div className="group cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <p className="text-sm text-muted-foreground">Incoming</p>
                  <p className="text-3xl font-bold text-yellow-500">{referralPipeline.incoming}</p>
                </div>
              </Link>
              <Link href="/safesport/physiotherapist/referrals/mine">
                <div className="group cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-3xl font-bold text-blue-500">{referralPipeline.active}</p>
                </div>
              </Link>
              <Link href="/safesport/physiotherapist/progress">
                <div className="group cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <p className="text-sm text-muted-foreground">In Review</p>
                  <p className="text-3xl font-bold text-orange-500">{referralPipeline.review}</p>
                </div>
              </Link>
              <Link href="/safesport/physiotherapist/referrals/completed">
                <div className="group cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-green-500">{referralPipeline.completed}</p>
                </div>
              </Link>
            </div>
          </Card>

          {/* Active Rehabilitation / Athlete Workload Table */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Rehabilitation</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search athletes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[250px] pl-8"
                  />
                </div>
              </div>
            </div>
            {filteredRehabCases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Activity className="mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">No active rehabilitation cases</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Athlete</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Progress</th>
                      <th className="pb-3 font-medium">Last Session</th>
                      <th className="pb-3 font-medium">Next Action</th>
                      <th className="pb-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRehabCases.map((rehab) => (
                      <tr key={rehab.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {rehab.athleteName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{rehab.athleteName}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge
                            style={{
                              backgroundColor: `${getStatusColor(rehab.status)}20`,
                              color: getStatusColor(rehab.status),
                              borderColor: getStatusColor(rehab.status),
                            }}
                            variant="outline"
                          >
                            {getStatusLabel(rehab.status)}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-[#72E34D]"
                                style={{ width: `${rehab.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {rehab.sessionsCompleted}/{rehab.totalSessions}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {rehab.lastSession
                            ? new Date(rehab.lastSession).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="py-3 text-sm">
                          {rehab.status === "review" ? (
                            <span className="text-orange-500">Review</span>
                          ) : rehab.status === "completed" ? (
                            <span className="text-green-500">Complete</span>
                          ) : rehab.nextSession ? (
                            <span>
                              Session {new Date(rehab.nextSession).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-3">
                          <Link href={`/safesport/physiotherapist/rehabilitation`}>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Recent Clinical Activity */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Recent Clinical Activity</h2>
            <div className="space-y-4">
              {activityTimeline.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Activity className="mb-2 h-8 w-8 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                activityTimeline.map((event, index) => {
                  const date = new Date(event.timestamp);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isYesterday =
                    new Date(date.setDate(date.getDate() + 1)).toDateString() ===
                    new Date().toDateString();

                  return (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-[#72E34D]/20 p-2">
                          <Activity className="h-4 w-4 text-[#72E34D]" />
                        </div>
                        {index < activityTimeline.length - 1 && (
                          <div className="h-full w-px bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-xs text-muted-foreground">
                          {isToday ? "Today" : isYesterday ? "Yesterday" : date.toLocaleDateString()}
                        </p>
                        <p className="font-medium">{event.description}</p>
                        <p className="text-sm text-muted-foreground">{event.athleteName}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
