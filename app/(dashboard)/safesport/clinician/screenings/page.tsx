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
import {
  Search,
  Filter,
  Download,
  PlayIcon,
  CheckCircle2,
  Loader2,
  AlertCircle,
  XCircle,
  Eye,
  Upload,
  BrainCircuit,
} from "lucide-react";
import { mockAthletes } from "@/features/safesport/data/mock-data";
import type { Athlete, MovementScreening } from "@/features/safesport/types";
import Link from "next/link";

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
    year: "numeric",
  });
}

// Helper to format drill name
function formatDrillName(drill: string): string {
  return drill
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Helper to get screening status badge variant
function getScreeningStatusVariant(status: string) {
  switch (status) {
    case "reviewed":
      return "default";
    case "ready_for_review":
      return "secondary";
    case "processing":
      return "outline";
    case "uploading":
      return "outline";
    case "quality_failed":
      return "destructive";
    case "draft":
      return "outline";
    case "included_in_report":
      return "default";
    default:
      return "secondary";
  }
}

// Format screening status for display
function formatScreeningStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Get status icon
function getStatusIcon(status: string) {
  switch (status) {
    case "reviewed":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "ready_for_review":
      return <AlertCircle className="h-4 w-4 text-blue-600" />;
    case "processing":
      return <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />;
    case "uploading":
      return <Upload className="h-4 w-4 text-gray-600" />;
    case "quality_failed":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "draft":
      return <PlayIcon className="h-4 w-4 text-gray-400" />;
    default:
      return <PlayIcon className="h-4 w-4 text-gray-400" />;
  }
}

// Get risk level badge variant
function getRiskLevelVariant(level: string) {
  switch (level) {
    case "low":
      return "default";
    case "moderate":
      return "secondary";
    case "high":
      return "destructive";
    default:
      return "outline";
  }
}

export default function ClinicianScreeningsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [athleteFilter, setAthleteFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Collect all screenings from all athletes
  const allScreenings = useMemo(() => {
    const screenings: Array<MovementScreening & { athlete?: Athlete }> = [];
    mockAthletes.forEach((athlete) => {
      athlete.screenings.forEach((screening) => {
        screenings.push({
          ...screening,
          athlete,
        });
      });
    });
    // Sort by date descending (most recent first)
    return screenings.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, []);

  // Get unique athletes for filter
  const athletes = useMemo(() => {
    return mockAthletes
      .filter((a) => a.screenings.length > 0)
      .map((a) => ({
        id: a.id,
        name: `${a.firstName} ${a.lastName}`,
      }));
  }, []);

  // Filter screenings
  const filteredScreenings = useMemo(() => {
    return allScreenings.filter((screening) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const athleteName = screening.athlete
        ? `${screening.athlete.firstName} ${screening.athlete.lastName}`.toLowerCase()
        : "";
      const matchesSearch =
        athleteName.includes(searchLower) ||
        screening.athleteId.toLowerCase().includes(searchLower) ||
        screening.id.toLowerCase().includes(searchLower) ||
        formatDrillName(screening.drill).toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter !== "all" && screening.status !== statusFilter) {
        return false;
      }

      // Athlete filter
      if (athleteFilter !== "all" && screening.athleteId !== athleteFilter) {
        return false;
      }

      // Risk filter
      if (riskFilter !== "all") {
        if (!screening.aiResult || screening.aiResult.riskLevel !== riskFilter) {
          return false;
        }
      }

      // Date filter
      if (dateFilter !== "all") {
        const screeningDate = new Date(screening.createdAt);
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - screeningDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        switch (dateFilter) {
          case "today":
            if (daysDiff > 0) return false;
            break;
          case "week":
            if (daysDiff > 7) return false;
            break;
          case "month":
            if (daysDiff > 30) return false;
            break;
        }
      }

      return true;
    });
  }, [allScreenings, search, statusFilter, athleteFilter, riskFilter, dateFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredScreenings.length;
    const pendingReview = filteredScreenings.filter(
      (s) => s.status === "ready_for_review"
    ).length;
    const processing = filteredScreenings.filter((s) => s.status === "processing").length;
    const reviewed = filteredScreenings.filter((s) => s.status === "reviewed").length;
    const highRisk = filteredScreenings.filter(
      (s) => s.aiResult?.riskLevel === "high"
    ).length;
    const qualityFailed = filteredScreenings.filter(
      (s) => s.status === "quality_failed"
    ).length;

    return {
      total,
      pendingReview,
      processing,
      reviewed,
      highRisk,
      qualityFailed,
    };
  }, [filteredScreenings]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Movement Screenings</h1>
          <p className="text-sm text-muted-foreground">
            AI-powered movement analysis and clinical review
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="rounded-none">
            <Upload className="mr-2 h-4 w-4" />
            Upload Screening
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Screenings</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-3xl font-bold text-blue-600">{stats.pendingReview}</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Processing</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.processing}</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Reviewed</p>
              <p className="text-3xl font-bold text-green-600">{stats.reviewed}</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">High Risk</p>
              <p className="text-3xl font-bold text-red-600">{stats.highRisk}</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Quality Failed</p>
              <p className="text-3xl font-bold text-red-600">{stats.qualityFailed}</p>
            </div>
          </Card>
        </div>

        {/* AI Processing Info */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">AI Movement Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI model analyzes movement patterns to detect biomechanical risk factors
                including knee valgus, trunk lean, limb asymmetry, and stabilization time.
                Clinical interpretation and action is required for all screenings.
              </p>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Knee Valgus Angle</p>
                  <p className="text-xs text-muted-foreground">Knee collapse measurement</p>
                </div>
                <div>
                  <p className="font-medium">Trunk Lean</p>
                  <p className="text-xs text-muted-foreground">Forward lean angle</p>
                </div>
                <div>
                  <p className="font-medium">Limb Symmetry</p>
                  <p className="text-xs text-muted-foreground">Left-right balance</p>
                </div>
                <div>
                  <p className="font-medium">Stabilization Time</p>
                  <p className="text-xs text-muted-foreground">Time to stabilize</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Filters & Search */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by athlete, screening ID, or drill..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="uploading">Uploading</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="quality_failed">Quality Failed</SelectItem>
                <SelectItem value="ready_for_review">Ready for Review</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="included_in_report">Included in Report</SelectItem>
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

            <Select value={riskFilter} onValueChange={(value) => setRiskFilter(value || "all")}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="moderate">Moderate Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={(value) => setDateFilter(value || "all")}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>

            {(search ||
              statusFilter !== "all" ||
              athleteFilter !== "all" ||
              riskFilter !== "all" ||
              dateFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setAthleteFilter("all");
                  setRiskFilter("all");
                  setDateFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </Card>

        {/* Screenings Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Athlete</TableHead>
                <TableHead>Drill</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Risk Level</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Reviewed By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScreenings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No screenings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredScreenings.map((screening) => (
                  <TableRow key={screening.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {screening.athlete
                              ? `${screening.athlete.firstName[0]}${screening.athlete.lastName[0]}`
                              : "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {screening.athlete
                              ? `${screening.athlete.firstName} ${screening.athlete.lastName}`
                              : "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {screening.athleteId}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatDrillName(screening.drill)}</p>
                        <p className="text-xs text-muted-foreground">{screening.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(screening.createdAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(screening.status)}
                        <Badge variant={getScreeningStatusVariant(screening.status)}>
                          {formatScreeningStatus(screening.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {screening.aiResult ? (
                        <Badge variant={getRiskLevelVariant(screening.aiResult.riskLevel)}>
                          {screening.aiResult.riskLevel.toUpperCase()}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {screening.aiResult ? (
                        <div className="text-sm">
                          {Math.round(screening.aiResult.confidence * 100)}%
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {screening.reviewedByName ? (
                        <div>
                          <p className="text-sm font-medium">{screening.reviewedByName}</p>
                          {screening.reviewDate && (
                            <p className="text-xs text-muted-foreground">
                              {formatDate(screening.reviewDate)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not reviewed</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/safesport/clinician/screenings/${screening.id}`}
                          passHref
                        >
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            {screening.status === "ready_for_review" ? "Review" : "View"}
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Results summary */}
        <div className="text-sm text-muted-foreground text-center">
          Showing {filteredScreenings.length} of {allScreenings.length} screenings
        </div>
      </div>
    </div>
  );
}
