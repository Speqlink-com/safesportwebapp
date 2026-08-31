"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Search,
  Download,
  Clock,
  Activity,
  CheckCircle2,
} from "lucide-react";
import {
  mockReferrals,
  mockAthletes,
  getAthleteById,
} from "@/features/safesport/data/mock-data";
import type { ReferralUrgency } from "@/features/safesport/types";
import Link from "next/link";

const PHYSIO_ID = "physio-001";

// Helper functions
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getUrgencyVariant(urgency: ReferralUrgency) {
  switch (urgency) {
    case "emergency":
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

function formatReferralType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function PhysiotherapistReferralsPage() {
  const [activeTab, setActiveTab] = useState("incoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  // Get physiotherapy referrals assigned to this physiotherapist
  const incomingReferrals = useMemo(() => {
    return mockReferrals.filter(
      (r) =>
        r.type === "physiotherapy" &&
        r.assignedTo === PHYSIO_ID &&
        (r.status === "assigned" || r.status === "pending")
    );
  }, []);

  const myReferrals = useMemo(() => {
    return mockReferrals.filter(
      (r) =>
        r.type === "physiotherapy" &&
        r.assignedTo === PHYSIO_ID &&
        r.status === "in_progress"
    );
  }, []);

  const completedReferrals = useMemo(() => {
    return mockReferrals.filter(
      (r) =>
        r.type === "physiotherapy" &&
        r.assignedTo === PHYSIO_ID &&
        r.status === "completed"
    );
  }, []);

  // Filter function
  const filterReferrals = (referrals: typeof mockReferrals) => {
    return referrals.filter((referral) => {
      const athlete = getAthleteById(referral.athleteId);
      const athleteName = athlete
        ? `${athlete.firstName} ${athlete.lastName}`.toLowerCase()
        : "";

      // Search filter
      const matchesSearch =
        !searchQuery ||
        athleteName.includes(searchQuery.toLowerCase()) ||
        referral.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        referral.reason.toLowerCase().includes(searchQuery.toLowerCase());

      // Urgency filter
      const matchesUrgency =
        urgencyFilter === "all" || referral.urgency === urgencyFilter;

      return matchesSearch && matchesUrgency;
    });
  };

  const filteredIncoming = filterReferrals(incomingReferrals);
  const filteredMyReferrals = filterReferrals(myReferrals);
  const filteredCompleted = filterReferrals(completedReferrals);

  // Render referral table
  const renderReferralTable = (referrals: typeof mockReferrals, tab: string) => {
    if (referrals.length === 0) {
      const emptyMessage =
        tab === "incoming"
          ? "No incoming referrals"
          : tab === "mine"
            ? "No active referrals"
            : "No completed referrals";

      return (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          {tab === "incoming" && <Clock className="mb-2 h-8 w-8 opacity-50" />}
          {tab === "mine" && <Activity className="mb-2 h-8 w-8 opacity-50" />}
          {tab === "completed" && <CheckCircle2 className="mb-2 h-8 w-8 opacity-50" />}
          <p className="text-sm">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Athlete</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Referred By</TableHead>
            <TableHead>Date</TableHead>
            {tab === "completed" && <TableHead>Completed</TableHead>}
            {tab !== "completed" && <TableHead>Appointment</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral) => {
            const athlete = getAthleteById(referral.athleteId);
            const fullName = athlete
              ? `${athlete.firstName} ${athlete.lastName}`
              : "Unknown";
            const initials = athlete
              ? `${athlete.firstName[0]}${athlete.lastName[0]}`.toUpperCase()
              : "??";

            return (
              <TableRow key={referral.id}>
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
                        {referral.athleteId}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-xs truncate text-sm">{referral.reason}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={getUrgencyVariant(referral.urgency)}>
                    {referral.urgency.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{referral.createdByName}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{formatDate(referral.createdAt)}</p>
                </TableCell>
                {tab === "completed" && referral.closedAt && (
                  <TableCell>
                    <p className="text-sm">{formatDate(referral.closedAt)}</p>
                  </TableCell>
                )}
                {tab !== "completed" && (
                  <TableCell>
                    {referral.appointmentDate ? (
                      <p className="text-sm">
                        {formatDate(referral.appointmentDate)}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/safesport/physiotherapist/referrals/${referral.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    {tab === "incoming" && (
                      <Button size="sm" className="rounded-none">
                        Accept
                      </Button>
                    )}
                    {tab === "mine" && (
                      <Button size="sm" className="rounded-none">
                        Update
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Referrals</h1>
          <p className="text-sm text-muted-foreground">
            Manage physiotherapy referrals and treatment plans
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
      <div className="flex-1 p-6">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Incoming</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {incomingReferrals.length}
                </p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-blue-600">
                  {myReferrals.length}
                </p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {completedReferrals.length}
                </p>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b px-6 pt-6">
                <TabsList className="h-auto p-0 bg-transparent border-0">
                  <TabsTrigger
                    value="incoming"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#72E34D] rounded-none px-4 pb-3"
                  >
                    Incoming
                    <Badge variant="secondary" className="ml-2">
                      {filteredIncoming.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="mine"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#72E34D] rounded-none px-4 pb-3"
                  >
                    My Referrals
                    <Badge variant="secondary" className="ml-2">
                      {filteredMyReferrals.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#72E34D] rounded-none px-4 pb-3"
                  >
                    Completed
                    <Badge variant="secondary" className="ml-2">
                      {filteredCompleted.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 border-b px-6 py-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search referrals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select
                  value={urgencyFilter}
                  onValueChange={(value) => setUrgencyFilter(value || "all")}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgency</SelectItem>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tab Content */}
              <TabsContent value="incoming" className="m-0 border-0 p-0">
                {renderReferralTable(filteredIncoming, "incoming")}
              </TabsContent>

              <TabsContent value="mine" className="m-0 border-0 p-0">
                {renderReferralTable(filteredMyReferrals, "mine")}
              </TabsContent>

              <TabsContent value="completed" className="m-0 border-0 p-0">
                {renderReferralTable(filteredCompleted, "completed")}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
