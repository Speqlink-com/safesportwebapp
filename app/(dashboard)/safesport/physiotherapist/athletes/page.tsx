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
import { Search, Filter, Download } from "lucide-react";
import {
  mockAthletes,
  mockReferrals,
  mockScreenings,
} from "@/features/safesport/data/mock-data";

const PHYSIO_ID = "physio-001";

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Helper to get referral status for athlete
function getAthleteReferralStatus(athleteId: string): string {
  const referral = mockReferrals.find(
    (r) => r.athleteId === athleteId && r.type === "physiotherapy" && r.assignedTo === PHYSIO_ID
  );
  if (!referral) return "none";
  return referral.status;
}

// Helper to get latest screening date
function getLatestScreeningDate(athleteId: string): string | null {
  const screenings = mockScreenings
    .filter((s) => s.athleteId === athleteId)
    .sort((a, b) => {
      // Sort by status priority (ready_for_review > reviewed > other)
      const priority = { ready_for_review: 3, reviewed: 2 };
      return (priority[b.status as keyof typeof priority] || 0) - (priority[a.status as keyof typeof priority] || 0);
    });
  
  if (screenings.length === 0) return null;
  return new Date().toISOString(); // Use current date as placeholder
}

// Helper to get referral status badge variant
function getReferralStatusVariant(status: string) {
  switch (status) {
    case "completed":
      return "default";
    case "in_progress":
      return "secondary";
    case "assigned":
      return "outline";
    case "pending":
      return "outline";
    default:
      return "outline";
  }
}

// Format referral status for display
function formatReferralStatus(status: string): string {
  if (status === "none") return "No Referral";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function PhysiotherapistAthletesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sportFilter, setSportFilter] = useState("all");

  // Get athletes assigned to this physiotherapist
  const assignedAthletes = useMemo(() => {
    return mockAthletes.filter(a => 
      mockReferrals.some(r => 
        r.athleteId === a.id && 
        r.type === "physiotherapy" && 
        r.assignedTo === PHYSIO_ID
      ) ||
      mockScreenings.some(s => s.athleteId === a.id)
    );
  }, []);

  // Get unique sports for filters
  const sports = useMemo(() => {
    return Array.from(
      new Set(assignedAthletes.map((a) => a.currentSport?.name).filter(Boolean)),
    ) as string[];
  }, [assignedAthletes]);

  // Filter athletes
  const filteredAthletes = useMemo(() => {
    return assignedAthletes.filter((athlete) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const fullName = `${athlete.firstName} ${athlete.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchLower) ||
        athlete.id.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter !== "all") {
        const referralStatus = getAthleteReferralStatus(athlete.id);
        if (referralStatus !== statusFilter) {
          return false;
        }
      }

      // Sport filter
      if (sportFilter !== "all" && athlete.currentSport?.name !== sportFilter) {
        return false;
      }

      return true;
    });
  }, [assignedAthletes, search, statusFilter, sportFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredAthletes.length;
    const active = filteredAthletes.filter(
      (a) => getAthleteReferralStatus(a.id) === "in_progress"
    ).length;
    const assigned = filteredAthletes.filter(
      (a) => getAthleteReferralStatus(a.id) === "assigned"
    ).length;
    const completed = filteredAthletes.filter(
      (a) => getAthleteReferralStatus(a.id) === "completed"
    ).length;

    return {
      total,
      active,
      assigned,
      completed,
    };
  }, [filteredAthletes]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Assigned Athletes</h1>
          <p className="text-sm text-muted-foreground">
            Athletes assigned to your care
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Athletes</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Treatment</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.active}
              </p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Newly Assigned</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.assigned}
              </p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.completed}
              </p>
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
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />

              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value || "all")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="assigned">Newly Assigned</SelectItem>
                  <SelectItem value="in_progress">Active Treatment</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="none">No Referral</SelectItem>
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
                  <TableHead>Sport</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAthletes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No athletes found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAthletes.map((athlete) => {
                    const referralStatus = getAthleteReferralStatus(athlete.id);
                    const lastScreening = getLatestScreeningDate(athlete.id);
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
                        <TableCell className="capitalize">
                          {athlete.currentSport?.name || "—"}
                        </TableCell>
                        <TableCell>
                          {athlete.currentTeam?.name || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getReferralStatusVariant(referralStatus)}>
                            {formatReferralStatus(referralStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {lastScreening ? (
                            <span className="text-sm">
                              {formatDate(lastScreening)}
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
                              View Profile
                            </Button>
                            {referralStatus === "assigned" && (
                              <Button size="sm" className="rounded-none">
                                Start Treatment
                              </Button>
                            )}
                            {referralStatus === "in_progress" && (
                              <Button size="sm" className="rounded-none">
                                Continue
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
