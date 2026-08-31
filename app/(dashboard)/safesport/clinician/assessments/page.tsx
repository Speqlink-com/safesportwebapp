"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, FileText, Filter, Download, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { mockAthletes, mockPPEAssessments } from "@/features/safesport/data/mock-data";
import type { Athlete, PPEAssessment } from "@/features/safesport/types";
import { Progress } from "@/components/ui/progress";

// Helper to get athlete by ID
function getAthleteById(athleteId: string): Athlete | undefined {
  return mockAthletes.find((a) => a.id === athleteId);
}

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
}

// Helper to get PPE status badge variant
function getPPEStatusVariant(status: string) {
  switch (status) {
    case "complete":
      return "default";
    case "in_progress":
      return "secondary";
    case "needs_review":
      return "outline";
    case "not_started":
      return "outline";
    case "blocked":
      return "destructive";
    default:
      return "secondary";
  }
}

// Format PPE status for display
function formatPPEStatus(status: string): string {
  return status
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Get status icon
function getStatusIcon(status: string) {
  switch (status) {
    case "complete":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "in_progress":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "needs_review":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case "blocked":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
}

// Calculate workflow progress
function calculateProgress(ppe: PPEAssessment): number {
  let completed = 0;
  const total = 8; // Total stages in PPE workflow

  // 1. Registration (always complete if PPE exists)
  completed += 1;

  // 2. Consent
  if (ppe.consent !== "pending") completed += 1;

  // 3. History
  if (ppe.history === "complete") completed += 1;

  // 4. Examination
  if (ppe.examination !== "not_started") completed += 1;

  // 5. Baseline
  if (ppe.baseline !== "not_started") completed += 1;

  // 6. Movement Screening
  if (ppe.movementScreening && ppe.movementScreening !== "pending") completed += 1;

  // 7. Eligibility
  if (ppe.eligibilityDecision) completed += 1;

  // 8. Certificate
  if (ppe.certificate) completed += 1;

  return Math.round((completed / total) * 100);
}

// Get current stage description
function getCurrentStage(ppe: PPEAssessment): string {
  if (ppe.status === "complete") return "Complete";
  if (ppe.status === "blocked") return "Blocked";
  if (ppe.status === "needs_review") return "Needs Review";

  if (!ppe.certificate && ppe.eligibilityDecision) return "Certificate";
  if (!ppe.eligibilityDecision) return "Eligibility Decision";
  if (!ppe.movementScreening || ppe.movementScreening === "pending") return "Movement Screening";
  if (ppe.baseline === "not_started") return "Baseline Assessment";
  if (ppe.examination === "not_started") return "Physical Examination";
  if (ppe.history === "not_started" || ppe.history === "in_progress") return "Medical History";
  if (ppe.consent === "pending") return "Consent";

  return "Registration";
}

export default function AssessmentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [athleteFilter, setAthleteFilter] = useState("all");

  // Get unique athletes for filter
  const athletes = useMemo(() => {
    return mockAthletes.map((a) => ({ 
      id: a.id, 
      name: `${a.firstName} ${a.lastName}` 
    }));
  }, []);

  // Combine PPE with athlete data
  const ppeWithAthletes = useMemo(() => {
    return mockPPEAssessments.map((ppe) => ({
      ...ppe,
      athlete: getAthleteById(ppe.athleteId),
      progress: calculateProgress(ppe),
      currentStage: getCurrentStage(ppe),
    }));
  }, []);

  // Filter assessments
  const filteredAssessments = useMemo(() => {
    return ppeWithAthletes.filter((ppe) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const athleteName = ppe.athlete ? `${ppe.athlete.firstName} ${ppe.athlete.lastName}`.toLowerCase() : "";
      const matchesSearch =
        athleteName.includes(searchLower) ||
        ppe.athleteId.toLowerCase().includes(searchLower) ||
        ppe.id.toLowerCase().includes(searchLower) ||
        ppe.clinicianName.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter !== "all" && ppe.status !== statusFilter) {
        return false;
      }

      // Athlete filter
      if (athleteFilter !== "all" && ppe.athleteId !== athleteFilter) {
        return false;
      }

      return true;
    });
  }, [ppeWithAthletes, search, statusFilter, athleteFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredAssessments.length;
    const inProgress = filteredAssessments.filter((p) => p.status === "in_progress").length;
    const needsReview = filteredAssessments.filter((p) => p.status === "needs_review").length;
    const complete = filteredAssessments.filter((p) => p.status === "complete").length;
    const blocked = filteredAssessments.filter((p) => p.status === "blocked").length;

    // This month
    const now = new Date();
    const thisMonth = filteredAssessments.filter((p) => {
      const date = new Date(p.assessmentDate);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    return {
      total,
      inProgress,
      needsReview,
      complete,
      blocked,
      thisMonth,
    };
  }, [filteredAssessments]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">PPE Assessments</h1>
          <p className="text-sm text-muted-foreground">
            Manage pre-participation health and performance assessments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="rounded-none">
            <FileText className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-6 gap-4">
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total PPE</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Needs Review</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.needsReview}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Complete</p>
                <p className="text-3xl font-bold text-green-600">{stats.complete}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-3xl font-bold text-red-600">{stats.blocked}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold">{stats.thisMonth}</p>
              </div>
            </Card>
          </div>

          {/* Workflow Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">PPE Workflow Stages</h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium">1. Registration</p>
                <p className="text-xs text-muted-foreground">Athlete profile & consent</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">2. History</p>
                <p className="text-xs text-muted-foreground">Medical questionnaire</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">3. Examination</p>
                <p className="text-xs text-muted-foreground">Physical assessment</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">4. Baseline</p>
                <p className="text-xs text-muted-foreground">Functional testing</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">5. Movement Screen</p>
                <p className="text-xs text-muted-foreground">AI video analysis</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">6. Review</p>
                <p className="text-xs text-muted-foreground">Clinician validation</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">7. Eligibility</p>
                <p className="text-xs text-muted-foreground">Clearance decision</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">8. Certificate</p>
                <p className="text-xs text-muted-foreground">Generate clearance</p>
              </div>
            </div>
          </Card>

          {/* Filters and Search */}
          <Card>
            <div className="flex items-center justify-between gap-4 p-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by athlete, ID, or clinician..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="needs_review">Needs Review</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={athleteFilter} onValueChange={(value) => setAthleteFilter(value || "all")}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Athlete" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Athletes</SelectItem>
                    {athletes.map((athlete) => (
                      <SelectItem key={athlete.id} value={athlete.id}>
                        {athlete.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assessments Table */}
            <div className="border-t">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Athlete</TableHead>
                    <TableHead>Assessment ID</TableHead>
                    <TableHead>Clinician</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Stage</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Review Flags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssessments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No assessments found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAssessments.map((ppe) => {
                      const athlete = ppe.athlete;
                      const fullName = athlete ? `${athlete.firstName} ${athlete.lastName}` : "Unknown";
                      const initials = athlete
                        ? `${athlete.firstName[0]}${athlete.lastName[0]}`.toUpperCase()
                        : "??";

                      return (
                        <TableRow key={ppe.id}>
                          <TableCell>
                            {athlete ? (
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-[#72E34D] text-black text-xs font-semibold">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{fullName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {athlete.currentSport?.name || "—"} • {athlete.currentTeam?.name || "—"}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unknown</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs">{ppe.id}</code>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">{ppe.clinicianName}</p>
                              <p className="text-xs text-muted-foreground">
                                {ppe.clinicianId}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{formatDate(ppe.assessmentDate)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(ppe.status)}
                              <Badge variant={getPPEStatusVariant(ppe.status)}>
                                {formatPPEStatus(ppe.status)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">{ppe.currentStage}</span>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-medium">{ppe.progress}%</span>
                              </div>
                              <Progress value={ppe.progress} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            {ppe.reviewFlags && ppe.reviewFlags.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {ppe.reviewFlags.slice(0, 2).map((flag, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs border-yellow-600 text-yellow-600"
                                  >
                                    <AlertCircle className="mr-1 h-3 w-3" />
                                    {flag.type}
                                  </Badge>
                                ))}
                                {ppe.reviewFlags.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{ppe.reviewFlags.length - 2} more
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {ppe.status === "complete" ? (
                                <>
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Certificate
                                  </Button>
                                </>
                              ) : ppe.status === "needs_review" ? (
                                <>
                                  <Button size="sm" className="rounded-none">
                                    Review
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </>
                              ) : ppe.status === "in_progress" ? (
                                <>
                                  <Button size="sm" className="rounded-none">
                                    Continue
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </>
                              ) : (
                                <Button size="sm" className="rounded-none">
                                  Start
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
  );
}
