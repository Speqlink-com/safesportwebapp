"use client";

import { useState, useMemo } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SafeSportSidebar } from "@/components/safesport-sidebar";
import { clinicianNavData } from "@/features/safesport/data/clinician-nav";
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
import { Search, UserPlus, Filter, Download } from "lucide-react";
import {
  mockAthletes,
  mockPPEAssessments,
} from "@/features/safesport/data/mock-data";
import type { Athlete, PPEAssessment } from "@/features/safesport/types";

// Helper to get PPE status for athlete
function getAthletePPEStatus(athleteId: string): PPEAssessment | undefined {
  return mockPPEAssessments.find((ppe) => ppe.athleteId === athleteId);
}

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Helper to get eligibility badge variant
function getEligibilityVariant(eligibility: string) {
  switch (eligibility) {
    case "cleared":
      return "default"; // Green
    case "cleared_with_monitoring":
      return "secondary"; // Blue
    case "pending":
      return "outline"; // Yellow
    case "restricted":
      return "destructive"; // Red
    case "not_cleared":
      return "destructive";
    default:
      return "secondary";
  }
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

// Format eligibility for display
function formatEligibility(eligibility: string): string {
  return eligibility
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Format PPE status for display
function formatPPEStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AthletesPage() {
  const [search, setSearch] = useState("");
  const [eligibilityFilter, setEligibilityFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [sportFilter, setSportFilter] = useState("all");
  const [ppeStatusFilter, setPpeStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Get unique teams and sports for filters
  const teams = useMemo(() => {
    return Array.from(
      new Set(mockAthletes.map((a) => a.currentTeam?.name).filter(Boolean)),
    ) as string[];
  }, []);

  const sports = useMemo(() => {
    return Array.from(
      new Set(mockAthletes.map((a) => a.currentSport?.name).filter(Boolean)),
    ) as string[];
  }, []);

  // Filter athletes
  const filteredAthletes = useMemo(() => {
    return mockAthletes.filter((athlete) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const fullName = `${athlete.firstName} ${athlete.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchLower) ||
        athlete.id.toLowerCase().includes(searchLower) ||
        athlete.currentOrganization?.name.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Eligibility filter
      if (
        eligibilityFilter !== "all" &&
        athlete.eligibilityStatus !== eligibilityFilter
      ) {
        return false;
      }

      // Team filter
      if (teamFilter !== "all" && athlete.currentTeam?.name !== teamFilter) {
        return false;
      }

      // Sport filter
      if (sportFilter !== "all" && athlete.currentSport?.name !== sportFilter) {
        return false;
      }

      // PPE status filter
      if (ppeStatusFilter !== "all") {
        const ppe = getAthletePPEStatus(athlete.id);
        if (!ppe || ppe.status !== ppeStatusFilter) {
          return false;
        }
      }

      return true;
    });
  }, [search, eligibilityFilter, teamFilter, sportFilter, ppeStatusFilter]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, eligibilityFilter, teamFilter, sportFilter, ppeStatusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAthletes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAthletes = filteredAthletes.slice(startIndex, endIndex);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredAthletes.length;
    const cleared = filteredAthletes.filter(
      (a) => a.eligibilityStatus === "cleared",
    ).length;
    const monitoring = filteredAthletes.filter(
      (a) => a.eligibilityStatus === "cleared_with_monitoring",
    ).length;
    const pending = filteredAthletes.filter(
      (a) => a.eligibilityStatus === "pending_evaluation",
    ).length;
    const restricted = filteredAthletes.filter(
      (a) =>
        a.eligibilityStatus === "sport_specific_restriction" ||
        a.eligibilityStatus === "temporarily_not_cleared",
    ).length;

    const ppeComplete = filteredAthletes.filter((a) => {
      const ppe = getAthletePPEStatus(a.id);
      return ppe?.status === "complete";
    }).length;

    const ppeInProgress = filteredAthletes.filter((a) => {
      const ppe = getAthletePPEStatus(a.id);
      return ppe?.status === "in_progress";
    }).length;

    const ppeNotStarted = filteredAthletes.filter((a) => {
      const ppe = getAthletePPEStatus(a.id);
      return !ppe || ppe.status === "not_started";
    }).length;

    return {
      total,
      cleared,
      monitoring,
      pending,
      restricted,
      ppeComplete,
      ppeInProgress,
      ppeNotStarted,
    };
  }, [filteredAthletes]);

  return (
    <SidebarProvider>
      <SafeSportSidebar navData={clinicianNavData} />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
          <div>
            <h1 className="text-2xl font-bold">Athletes</h1>
            <p className="text-sm text-muted-foreground">
              Manage athlete profiles, eligibility, and PPE assessments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="rounded-none hidden">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Athlete
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 space-y-6 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4">
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Athletes</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Cleared</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.cleared}
                </p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Monitoring</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.monitoring}
                </p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Restricted</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.restricted}
                </p>
              </div>
            </Card>
          </div>

          {/* PPE Stats Cards */}
          <div className="grid grid-cols-3 gap-4 hidden">
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">PPE Complete</p>
                <p className="text-2xl font-bold">{stats.ppeComplete}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">PPE In Progress</p>
                <p className="text-2xl font-bold">{stats.ppeInProgress}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">PPE Not Started</p>
                <p className="text-2xl font-bold">{stats.ppeNotStarted}</p>
              </div>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <div className="flex items-center justify-between gap-4 p-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or organization..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />

                <Select
                  value={eligibilityFilter}
                  onValueChange={(value) =>
                    setEligibilityFilter(value || "all")
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Eligibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Eligibility</SelectItem>
                    <SelectItem value="cleared">Cleared</SelectItem>
                    <SelectItem value="cleared_with_monitoring">
                      Monitoring
                    </SelectItem>
                    <SelectItem value="pending_evaluation">Pending</SelectItem>
                    <SelectItem value="sport_specific_restriction">
                      Restricted
                    </SelectItem>
                    <SelectItem value="not_cleared">Not Cleared</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={ppeStatusFilter}
                  onValueChange={(value) => setPpeStatusFilter(value || "all")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="PPE Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All PPE Status</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="needs_review">Needs Review</SelectItem>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={teamFilter}
                  onValueChange={(value) => setTeamFilter(value || "all")}
                >
                  <SelectTrigger className="w-[140px] hidden">
                    <SelectValue placeholder="Team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={sportFilter}
                  onValueChange={(value) => setSportFilter(value || "all")}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sports</SelectItem>
                    {sports.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Athletes Table */}
            <div className="border-t">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Athlete</TableHead>
                    <TableHead>SafeSport ID</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead>Eligibility</TableHead>
                    <TableHead>PPE Status</TableHead>
                    <TableHead>Last Assessment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAthletes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No athletes found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAthletes.map((athlete) => {
                      const ppe = getAthletePPEStatus(athlete.id);
                      const fullName = `${athlete.firstName} ${athlete.lastName}`;
                      const initials =
                        `${athlete.firstName[0]}${athlete.lastName[0]}`.toUpperCase();

                      return (
                        <TableRow key={athlete.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-[#72E34D] text-black text-xs font-semibold">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{fullName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Age {athlete.age}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs">{athlete.id}</code>
                          </TableCell>
                          <TableCell>
                            {athlete.currentOrganization?.name || "—"}
                          </TableCell>
                          <TableCell>
                            {athlete.currentTeam?.name || "—"}
                          </TableCell>
                          <TableCell className="capitalize">
                            {athlete.currentSport?.name || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getEligibilityVariant(
                                athlete.eligibilityStatus,
                              )}
                            >
                              {formatEligibility(athlete.eligibilityStatus)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {ppe ? (
                              <Badge variant={getPPEStatusVariant(ppe.status)}>
                                {formatPPEStatus(ppe.status)}
                              </Badge>
                            ) : (
                              <Badge variant="outline">Not Started</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {ppe ? (
                              <span className="text-sm">
                                {formatDate(ppe.assessmentDate)}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                              {!ppe || ppe.status === "not_started" ? (
                                <Button size="sm" className="rounded-none">
                                  Start PPE
                                </Button>
                              ) : ppe.status === "in_progress" ? (
                                <Button size="sm" className="rounded-none">
                                  Continue
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm">
                                  History
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
      </SidebarInset>
    </SidebarProvider>
  );
}
