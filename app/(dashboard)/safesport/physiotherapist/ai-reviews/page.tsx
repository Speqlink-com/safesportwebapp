"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  mockScreenings,
  getAthleteById,
} from "@/features/safesport/data/mock-data";
import type { MovementScreening } from "@/features/safesport/types";
import {
  BrainCircuitIcon,
  SearchIcon,
  FilterIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  ClockIcon,
} from "lucide-react";
import Link from "next/link";

export default function AIReviewsPage() {
  // Filter screenings that are ready for review
  const readyForReview = mockScreenings.filter(
    (s) => s.status === "ready_for_review"
  );

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "destructive";
      case "moderate":
        return "default";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return <AlertTriangleIcon className="size-4" />;
      case "moderate":
        return <AlertCircleIcon className="size-4" />;
      case "low":
        return <CheckCircle2Icon className="size-4" />;
      default:
        return null;
    }
  };

  const formatDrillName = (drill: string) => {
    return drill
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getTimeSinceProcessing = (timestamp: string) => {
    const now = new Date();
    const processed = new Date(timestamp);
    const diffMs = now.getTime() - processed.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <BrainCircuitIcon className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                AI Reviews
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Movement screenings ready for clinical interpretation
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {readyForReview.length} pending
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by athlete name or ID..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <FilterIcon className="size-4" />
          </Button>
        </div>
      </Card>

      {/* Screenings List */}
      <div className="space-y-4">
        {readyForReview.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <BrainCircuitIcon className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No screenings pending review
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                All AI-processed movement screenings have been reviewed. New
                screenings will appear here when ready for clinical
                interpretation.
              </p>
            </div>
          </Card>
        ) : (
          readyForReview.map((screening) => {
            const athlete = getAthleteById(screening.athleteId);
            if (!athlete) return null;

            return (
              <Card key={screening.id} className="p-6 hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-6">
                  {/* Athlete Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="size-12">
                      <AvatarFallback className="text-base font-semibold">
                        {athlete.firstName[0]}
                        {athlete.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {athlete.firstName} {athlete.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {athlete.id} • {athlete.age} years •{" "}
                            {athlete.gender === "male" ? "M" : "F"}
                          </p>
                        </div>
                      </div>

                      {/* Drill & Timing Info */}
                      <div className="flex items-center gap-4 mb-4">
                        <Badge variant="secondary" className="rounded-none">
                          {formatDrillName(screening.drill)}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <ClockIcon className="size-3.5" />
                          <span>
                            {screening.aiProcessing?.completedAt
                              ? getTimeSinceProcessing(
                                  screening.aiProcessing.completedAt
                                )
                              : "Processing..."}
                          </span>
                        </div>
                      </div>

                      {/* AI Result Preview */}
                      {screening.aiResult && (
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <BrainCircuitIcon className="size-4 text-primary" />
                            <span className="text-xs font-medium text-primary uppercase tracking-wide">
                              AI Analysis Preview
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Risk Level
                              </p>
                              <Badge
                                variant={getRiskBadgeVariant(
                                  screening.aiResult.riskLevel
                                )}
                                className="font-semibold"
                              >
                                {getRiskIcon(screening.aiResult.riskLevel)}
                                <span className="ml-1.5 capitalize">
                                  {screening.aiResult.riskLevel}
                                </span>
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Confidence
                              </p>
                              <p className="font-semibold">
                                {Math.round(screening.aiResult.confidence * 100)}
                                %
                              </p>
                            </div>
                            {screening.aiResult.metrics.kneeValgusAngle && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Knee Valgus
                                </p>
                                <p className="font-semibold">
                                  {screening.aiResult.metrics.kneeValgusAngle.toFixed(
                                    1
                                  )}
                                  °
                                </p>
                              </div>
                            )}
                            {screening.aiResult.metrics.limbSymmetryIndex && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Limb Symmetry
                                </p>
                                <p className="font-semibold">
                                  {(
                                    screening.aiResult.metrics
                                      .limbSymmetryIndex * 100
                                  ).toFixed(0)}
                                  %
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col items-end gap-2">
                    <Link href={`/safesport/physiotherapist/ai-reviews/${screening.id}`}>
                      <Button size="lg" className="rounded-none">
                        Review
                        <ArrowRightIcon className="ml-2 size-4" />
                      </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Performed by {screening.performedByName}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Help Card */}
      {readyForReview.length > 0 && (
        <Card className="p-6 bg-muted/50 border-dashed">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <AlertCircleIcon className="size-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Clinical Review Guidelines</h3>
              <p className="text-sm text-muted-foreground">
                AI analysis provides biomechanical metrics and risk assessment.
                Your clinical interpretation should consider the athlete's
                medical history, sport requirements, and contextual factors.
                Always validate AI findings with your clinical judgment.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
