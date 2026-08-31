"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mockScreenings,
  getAthleteById,
} from "@/features/safesport/data/mock-data";
import type { MovementScreening, ReviewerAction } from "@/features/safesport/types";
import {
  BrainCircuitIcon,
  UserIcon,
  ArrowLeftIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  VideoIcon,
  ActivityIcon,
  ClockIcon,
  SaveIcon,
  CheckIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function AIReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const screeningId = params.id as string;

  // Find the screening
  const screening = mockScreenings.find((s) => s.id === screeningId);
  const athlete = screening ? getAthleteById(screening.athleteId) : null;

  // State for clinician review
  const [clinicalInterpretation, setClinicalInterpretation] = useState(
    screening?.clinicalInterpretation || ""
  );
  const [reviewerAction, setReviewerAction] = useState<ReviewerAction | "">(
    screening?.reviewerAction || ""
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!screening || !athlete) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <Card className="p-12 max-w-md text-center">
          <AlertTriangleIcon className="size-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Screening Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            The screening you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/safesport/physiotherapist/ai-reviews">
            <Button>Return to AI Reviews</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    // In real implementation, this would save to backend
    console.log("Saved draft:", { clinicalInterpretation, reviewerAction });
  };

  const handleCompleteReview = async () => {
    if (!clinicalInterpretation || !reviewerAction) {
      alert("Please provide clinical interpretation and select an action before completing the review.");
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    
    // In real implementation, this would update the screening status to "reviewed"
    console.log("Completed review:", { clinicalInterpretation, reviewerAction });
    
    // Navigate back to list
    router.push("/safesport/physiotherapist/ai-reviews");
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return <AlertTriangleIcon className="size-5 text-destructive" />;
      case "moderate":
        return <AlertCircleIcon className="size-5 text-yellow-600" />;
      case "low":
        return <CheckCircle2Icon className="size-5 text-green-600" />;
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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/safesport/physiotherapist/ai-reviews">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              AI Review - {formatDrillName(screening.drill)}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Screening ID: {screening.id}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-base px-4 py-2">
          {screening.status.replace(/_/g, " ")}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Athlete Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="size-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Athlete Information</h2>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="text-xl font-semibold">
                  {athlete.firstName[0]}
                  {athlete.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">
                  {athlete.firstName} {athlete.lastName}
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">ID:</span>{" "}
                    <span className="font-medium">{athlete.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age:</span>{" "}
                    <span className="font-medium">{athlete.age} years</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gender:</span>{" "}
                    <span className="font-medium capitalize">{athlete.gender}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sport:</span>{" "}
                    <span className="font-medium">{athlete.currentSport?.name || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Analysis Section - Clearly Labeled */}
          <Card className="p-6 border-primary/30 bg-primary/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-primary/20 p-2">
                <BrainCircuitIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-primary">
                  AI-Generated Analysis
                </h2>
                <p className="text-xs text-muted-foreground">
                  Automated biomechanical assessment - Requires clinical validation
                </p>
              </div>
              <Badge variant="outline" className="border-primary/50">
                {screening.aiProcessing?.modelVersion}
              </Badge>
            </div>

            <Separator className="mb-4" />

            {screening.aiResult && (
              <div className="space-y-6">
                {/* Risk Assessment */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Risk Assessment
                  </Label>
                  <div className="flex items-center gap-3">
                    {getRiskIcon(screening.aiResult.riskLevel)}
                    <div className="flex-1">
                      <Badge
                        variant={
                          screening.aiResult.riskLevel === "high"
                            ? "destructive"
                            : screening.aiResult.riskLevel === "moderate"
                            ? "default"
                            : "outline"
                        }
                        className="text-base px-3 py-1"
                      >
                        {screening.aiResult.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {Math.round(screening.aiResult.confidence * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>
                </div>

                {/* Biomechanical Metrics */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Biomechanical Metrics
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {screening.aiResult.metrics.kneeValgusAngle !== undefined && (
                      <div className="rounded-lg border bg-background p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Knee Valgus Angle
                        </p>
                        <p className="text-2xl font-bold">
                          {screening.aiResult.metrics.kneeValgusAngle.toFixed(1)}°
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Normal: &lt;10° | Elevated: &gt;15°
                        </p>
                      </div>
                    )}
                    {screening.aiResult.metrics.trunkLean !== undefined && (
                      <div className="rounded-lg border bg-background p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Trunk Lean
                        </p>
                        <p className="text-2xl font-bold">
                          {screening.aiResult.metrics.trunkLean.toFixed(1)}°
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Normal: &lt;15° | Excessive: &gt;20°
                        </p>
                      </div>
                    )}
                    {screening.aiResult.metrics.limbSymmetryIndex !== undefined && (
                      <div className="rounded-lg border bg-background p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Limb Symmetry Index
                        </p>
                        <p className="text-2xl font-bold">
                          {(
                            screening.aiResult.metrics.limbSymmetryIndex * 100
                          ).toFixed(0)}
                          %
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Target: &gt;90% | Concern: &lt;85%
                        </p>
                      </div>
                    )}
                    {screening.aiResult.metrics.stabilizationTime !== undefined && (
                      <div className="rounded-lg border bg-background p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Stabilization Time
                        </p>
                        <p className="text-2xl font-bold">
                          {screening.aiResult.metrics.stabilizationTime.toFixed(1)}s
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Normal: &lt;2s | Delayed: &gt;3s
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Processing Info */}
                <div className="rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>
                      Processed: {formatTimestamp(screening.aiResult.processingTimestamp)}
                    </span>
                    <span>Model: {screening.aiResult.modelVersion}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Clinical Interpretation Section - Human Input */}
          <Card className="p-6 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-blue-500/20 p-2">
                <UserIcon className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Clinical Interpretation
                </h2>
                <p className="text-xs text-muted-foreground">
                  Your professional assessment and clinical decision
                </p>
              </div>
            </div>

            <Separator className="mb-6" />

            <div className="space-y-6">
              {/* Clinical Notes */}
              <div>
                <Label htmlFor="interpretation" className="text-sm font-medium mb-2 block">
                  Clinical Notes & Interpretation *
                </Label>
                <Textarea
                  id="interpretation"
                  placeholder="Enter your clinical interpretation of the AI findings, considering the athlete's medical history, sport requirements, and any contextual factors..."
                  value={clinicalInterpretation}
                  onChange={(e) => setClinicalInterpretation(e.target.value)}
                  className="min-h-[150px] bg-background"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Document your assessment including agreement/disagreement with AI
                  findings and clinical rationale
                </p>
              </div>

              {/* Clinical Action */}
              <div>
                <Label htmlFor="action" className="text-sm font-medium mb-2 block">
                  Clinical Decision *
                </Label>
                <Select
                  value={reviewerAction}
                  onValueChange={(value) => setReviewerAction(value as ReviewerAction)}
                >
                  <SelectTrigger id="action" className="bg-background">
                    <SelectValue placeholder="Select recommended action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_action">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">No Action Required</span>
                        <span className="text-xs text-muted-foreground">
                          Findings within normal limits, continue regular training
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="prevention_program">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Prevention Program</span>
                        <span className="text-xs text-muted-foreground">
                          Recommend targeted injury prevention exercises
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="physiotherapy_referral">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Physiotherapy Referral</span>
                        <span className="text-xs text-muted-foreground">
                          Refer to physiotherapist for assessment and treatment
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="further_assessment">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Further Assessment</span>
                        <span className="text-xs text-muted-foreground">
                          Requires additional clinical examination or testing
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Other Action</span>
                        <span className="text-xs text-muted-foreground">
                          Alternative intervention (specify in notes)
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Video Preview */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <VideoIcon className="size-5 text-muted-foreground" />
              <h3 className="font-semibold">Screening Video</h3>
            </div>
            <div className="aspect-video rounded-lg bg-muted flex items-center justify-center mb-3">
              <VideoIcon className="size-12 text-muted-foreground" />
            </div>
            <Button variant="outline" className="w-full" size="sm">
              Play Video
            </Button>
            <div className="mt-3 text-xs text-muted-foreground">
              <div className="flex justify-between mb-1">
                <span>Quality:</span>
                <Badge variant="outline" className="text-xs">
                  {screening.videoQuality}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Drill:</span>
                <span className="font-medium">{formatDrillName(screening.drill)}</span>
              </div>
            </div>
          </Card>

          {/* Screening Info */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ActivityIcon className="size-5 text-muted-foreground" />
              <h3 className="font-semibold">Screening Details</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Performed By</p>
                <p className="font-medium">{screening.performedByName}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Created</p>
                <p className="font-medium">{formatTimestamp(screening.createdAt)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">AI Processing</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      screening.aiProcessing?.status === "complete"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {screening.aiProcessing?.status}
                  </Badge>
                  {screening.aiProcessing?.completedAt && (
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(screening.aiProcessing.completedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <div className="space-y-3">
              <Button
                onClick={handleCompleteReview}
                disabled={!clinicalInterpretation || !reviewerAction || isSaving}
                className="w-full"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <ClockIcon className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="mr-2 size-4" />
                    Complete Review
                  </>
                )}
              </Button>
              <Button
                onClick={handleSaveDraft}
                disabled={isSaving}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <SaveIcon className="mr-2 size-4" />
                Save Draft
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                size="sm"
                onClick={() => router.push("/safesport/physiotherapist/ai-reviews")}
              >
                Cancel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              * Required fields must be completed before submitting
            </p>
          </Card>

          {/* Help */}
          <Card className="p-4 bg-muted/50">
            <div className="flex items-start gap-3">
              <AlertCircleIcon className="size-4 text-muted-foreground mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Clinical Review Note</p>
                <p>
                  AI metrics are advisory only. Your clinical judgment should
                  always take precedence. Consider the full clinical picture before
                  making decisions.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
