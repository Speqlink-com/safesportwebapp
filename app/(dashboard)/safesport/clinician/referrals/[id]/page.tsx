"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FileText,
  AlertCircle,
  CheckCircle2,
  Edit,
  Save,
} from "lucide-react";
import Link from "next/link";
import { mockReferrals, mockAthletes } from "@/features/safesport/data/mock-data";
import type { ReferralStatus, ReferralUrgency } from "@/features/safesport/types";

interface PageProps {
  params: {
    id: string;
  };
}

// Helper functions
function getAthleteName(athleteId: string): string {
  const athlete = mockAthletes.find((a) => a.id === athleteId);
  return athlete ? `${athlete.firstName} ${athlete.lastName}` : "Unknown";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusVariant(status: ReferralStatus) {
  switch (status) {
    case "completed":
      return "default";
    case "in_progress":
      return "secondary";
    case "assigned":
      return "outline";
    case "pending":
      return "outline";
    case "overdue":
      return "destructive";
    default:
      return "secondary";
  }
}

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

function formatReferralType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ReferralDetailPage({ params }: PageProps) {
  const referral = mockReferrals.find((r) => r.id === params.id);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(referral?.status || "pending");
  const [notes, setNotes] = useState("");

  if (!referral) {
    return (
      <div className="flex flex-1 flex-col p-6">
        <div className="max-w-[1200px] mx-auto w-full">
          <Card className="p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Referral Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The referral you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/safesport/clinician/referrals">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Referrals
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const athlete = mockAthletes.find((a) => a.id === referral.athleteId);
  const athleteName = getAthleteName(referral.athleteId);

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="space-y-6 max-w-[1200px] mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/safesport/clinician/referrals">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Referral Details
              </h1>
              <p className="text-muted-foreground">
                ID: {referral.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(status as ReferralStatus)}>
              {status.replace("_", " ").toUpperCase()}
            </Badge>
            <Badge variant={getUrgencyVariant(referral.urgency)}>
              {referral.urgency.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Athlete Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Athlete Information</h3>
              {athlete && (
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-[#72E34D] text-black text-lg font-semibold">
                      {`${athlete.firstName[0]}${athlete.lastName[0]}`}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-xl font-semibold">{athleteName}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {referral.athleteId}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Age:</span>{" "}
                        <span className="font-medium">{athlete.age}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Gender:</span>{" "}
                        <span className="font-medium capitalize">{athlete.gender}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sport:</span>{" "}
                        <span className="font-medium">{athlete.currentSport?.name || "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Team:</span>{" "}
                        <span className="font-medium">{athlete.currentTeam?.name || "—"}</span>
                      </div>
                    </div>
                    <Link href={`/safesport/clinician/${athlete.id}`}>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Full Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </Card>

            {/* Referral Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Referral Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <p className="font-medium">{formatReferralType(referral.type)}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reason</p>
                  <p className="text-sm">{referral.reason}</p>
                </div>
                {referral.providerFacility && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Provider / Facility
                      </p>
                      <p className="font-medium">{referral.providerFacility}</p>
                    </div>
                  </>
                )}
                {referral.assignedToName && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Assigned To
                      </p>
                      <p className="font-medium">{referral.assignedToName}</p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Status Update */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Update Status</h3>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Status
                    </label>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value || "pending")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Notes
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add update notes..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        // Save logic here
                        setIsEditing(false);
                      }}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Current status: <Badge variant={getStatusVariant(status as ReferralStatus)}>{status.replace("_", " ")}</Badge>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-primary p-2">
                      <FileText className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="w-px h-full bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-sm">Referral Created</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(referral.createdAt)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      By {referral.createdByName}
                    </p>
                  </div>
                </div>

                {referral.appointmentDate && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-blue-500 p-2">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      {referral.status !== "completed" && (
                        <div className="w-px h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm">Appointment Scheduled</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(referral.appointmentDate)}
                      </p>
                    </div>
                  </div>
                )}

                {referral.status === "completed" && referral.closedAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-green-500 p-2">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Completed</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(referral.closedAt)}
                      </p>
                      {referral.outcome && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Outcome: {referral.outcome}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Contact Provider
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  View Related Records
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
