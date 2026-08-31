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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Filter,
  Download,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowRightLeft,
  UserPlus,
} from "lucide-react";
import {
  mockReferrals,
  mockAthletes,
  mockPPEAssessments,
  mockIncidents,
} from "@/features/safesport/data/mock-data";
import type { Referral, ReferralStatus, ReferralType, ReferralUrgency } from "@/features/safesport/types";
import { CreateReferralModal } from "@/features/safesport/components/referrals/CreateReferralModal";
import Link from "next/link";

// Helper to get athlete name
function getAthleteName(athleteId: string): string {
  const athlete = mockAthletes.find((a) => a.id === athleteId);
  return athlete ? `${athlete.firstName} ${athlete.lastName}` : "Unknown";
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

// Helper to format time
function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Helper to get status badge variant
function getStatusVariant(status: ReferralStatus) {
  switch (status) {
    case "completed":
      return "default"; // Green
    case "in_progress":
      return "secondary"; // Blue
    case "assigned":
      return "outline"; // Gray
    case "pending":
      return "outline"; // Yellow-ish
    case "overdue":
      return "destructive"; // Red
    default:
      return "secondary";
  }
}

// Helper to get urgency badge variant
function getUrgencyVariant(urgency: ReferralUrgency) {
  switch (urgency) {
    case "emergency":
      return "destructive";
    case "urgent":
      return "destructive";
    case "priority":
      return "outline";
    case "routine":
      return "secondary";
    default:
      return "secondary";
  }
}

// Helper to format referral type
function formatReferralType(type: ReferralType): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Helper to format status
function formatStatus(status: ReferralStatus): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Helper to format urgency
function formatUrgency(urgency: ReferralUrgency): string {
  return urgency.charAt(0).toUpperCase() + urgency.slice(1);
}

// Status pipeline stats
function getStatusStats(referrals: Referral[]) {
  return {
    pending: referrals.filter((r) => r.status === "pending").length,
    assigned: referrals.filter((r) => r.status === "assigned").length,
    in_progress: referrals.filter((r) => r.status === "in_progress").length,
    overdue: referrals.filter((r) => r.status === "overdue").length,
    completed: referrals.filter((r) => r.status === "completed").length,
    total: referrals.length,
  };
}

// Get status icon
function getStatusIcon(status: ReferralStatus) {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "assigned":
      return <UserPlus className="h-4 w-4" />;
    case "in_progress":
      return <ArrowRightLeft className="h-4 w-4" />;
    case "overdue":
      return <AlertCircle className="h-4 w-4" />;
    case "completed":
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return null;
  }
}

export default function ReferralsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Get status stats
  const stats = useMemo(() => getStatusStats(mockReferrals), []);

  // Get unique types for filter
  const referralTypes = useMemo(() => {
    return Array.from(new Set(mockReferrals.map((r) => r.type)));
  }, []);

  // Filter referrals
  const filteredReferrals = useMemo(() => {
    return mockReferrals.filter((referral) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const athleteName = getAthleteName(referral.athleteId).toLowerCase();
      const matchesSearch =
        athleteName.includes(searchLower) ||
        referral.id.toLowerCase().includes(searchLower) ||
        referral.reason.toLowerCase().includes(searchLower) ||
        referral.type.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter !== "all" && referral.status !== statusFilter) {
        return false;
      }

      // Urgency filter
      if (urgencyFilter !== "all" && referral.urgency !== urgencyFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== "all" && referral.type !== typeFilter) {
        return false;
      }

      return true;
    });
  }, [search, statusFilter, urgencyFilter, typeFilter]);

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Referrals</h1>
            <p className="text-muted-foreground">
              Manage athlete referrals to specialists
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Referral
            </Button>
          </div>
        </div>

        <CreateReferralModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          showTrigger={false}
        />

      {/* Status Pipeline Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/20">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
              <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assigned</p>
              <p className="text-2xl font-bold">{stats.assigned}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
              <ArrowRightLeft className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{stats.in_progress}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold">{stats.overdue}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/20">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
              <ArrowRightLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search referrals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={urgencyFilter} onValueChange={(value) => setUrgencyFilter(value || "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgency Levels</SelectItem>
              <SelectItem value="routine">Routine</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value || "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Destinations</SelectItem>
              {referralTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {formatReferralType(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Referrals Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referral ID</TableHead>
              <TableHead>Athlete</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Appointment</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReferrals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No referrals found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredReferrals.map((referral) => {
                const athlete = mockAthletes.find(
                  (a) => a.id === referral.athleteId
                );
                const initials = athlete
                  ? `${athlete.firstName[0]}${athlete.lastName[0]}`
                  : "?";

                return (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/safesport/clinician/referrals/${referral.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {referral.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {getAthleteName(referral.athleteId)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {referral.athleteId}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatReferralType(referral.type)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {referral.reason}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getUrgencyVariant(referral.urgency)}>
                        {formatUrgency(referral.urgency)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(referral.status)}>
                        <span className="mr-1">{getStatusIcon(referral.status)}</span>
                        {formatStatus(referral.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {referral.assignedToName ? (
                        <div>
                          <p className="font-medium text-sm">
                            {referral.assignedToName}
                          </p>
                          {referral.providerFacility && (
                            <p className="text-xs text-muted-foreground">
                              {referral.providerFacility}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Not assigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {referral.appointmentDate
                        ? formatDate(referral.appointmentDate)
                        : "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(referral.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/safesport/clinician/referrals/${referral.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Summary footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {filteredReferrals.length} of {mockReferrals.length} referrals
        </p>
        <p>
          {stats.overdue > 0 && (
            <span className="text-red-600 font-medium">
              {stats.overdue} overdue referral{stats.overdue !== 1 ? "s" : ""}
            </span>
          )}
        </p>
      </div>
      </div>
    </div>
  );
}
