"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  XCircle,
  PlayIcon,
  ArrowLeft,
  Save,
  BrainCircuit,
  Activity,
  User,
  Calendar,
  FileText,
  TrendingUp,
} from "lucide-react";
import { mockAthletes } from "@/features/safesport/data/mock-data";
import type { Athlete, MovementScreening, ReviewerAction } from "@/features/safesport/types";
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
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Helper to format drill name
function formatDrillName(drill: string): string {
  return drill
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Get risk level color classes
function getRiskColor(level: string) {
  switch (level) {
    case "low":
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200";
    case "moderate":
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200";
    case "high":
      return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

// Get status icon
function getStatusIcon(status: string) {
  switch (status) {
    case "reviewed":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "ready_for_review":
      return <AlertCircle className="h-5 w-5 text-blue-600" />;
    case "processing":
      return <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />;
    case "uploading":
      return <Loader2 className="h-5 w-5 animate-spin text-gray-600" />;
    case "quality_failed":
      return <XCircle className="h-5 w-5 text-red-600" />;
    case "draft":
      return <PlayIcon className="h-5 w-5 text-gray-400" />;
    default:
      return <PlayIcon className="h-5 w-5 text-gray-400" />;
  }
}

export default function ScreeningDetailPage() {
  const params = useParams();
  const router = useRouter();
  const screeningId = params.id as string;

  // Find the screening
  const screening = useMemo(() => {
    for (const athlete of mockAthletes) {
      const found = athlete.screenings.find((s) => s.id === screeningId);
      if (found) {
        return { ...found, athlete };
      }
    }
    return null;
  }, [screeningId]);

  // Form state for clinical review
  const [clinicalInterpretation, setClinicalInterpretation] = useState(
    screening?.clinicalInterpretation || ""
  );
  const [reviewerAction, setReviewerAction] = useState<ReviewerAction | "">(
    screening?.reviewerAction || ""
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!screening) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Screening Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The screening you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/safesport/clinician/screenings">
            <Button>Back to Screenings</Button>
          </Link>
        </div>
      </div>
    );
  }

  const athlete = screening.athlete;

  const handleSaveReview = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    // In real app, this would save to backend and redirect
    alert("Review saved successfully!");
    router.push("/safesport/clinician/screenings");
  };

  const isReviewComplete = clinicalInterpretation.trim() !== "" && reviewerAction !== "";
  const canEdit = screening.status === "ready_for_review" || screening.status === "reviewed";

  return (
    <div>
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/safesport/clinician/screenings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Movement Screening Review</h1>
              <p className="text-sm text-muted-foreground">
                {formatDrillName(screening.drill)} • {screening.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(screening.status)}
            <Badge
              variant={
                screening.status === "reviewed"
                  ? "default"
                  : screening.status === "ready_for_review"
                  ? "secondary"
                  : "outline"
              }
            >
              {screening.status.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Left Column - Video & AI Analysis */}
          <div className="space-y-6">
            {/* Video Player */}
            <Card>
              <div className="border-b bg-muted/30 px-6 py-3">
                <p className="text-sm font-medium">Movement Video</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-lg border bg-black">
                  {screening.videoUrl ? (
                    <video
                      src={screening.videoUrl}
                      controls
                      className="size-full object-contain"
                      poster="/placeholder-video.jpg"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <PlayIcon className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Recorded: {formatDate(screening.createdAt)}
                    </span>
                  </div>
                  <Badge variant={screening.videoQuality === "pass" ? "default" : "destructive"}>
                    Quality: {screening.videoQuality}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* AI Analysis Results */}
            {screening.aiResult && (
              <Card>
                <div className="border-b bg-muted/30 px-6 py-3 flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">AI Movement Analysis</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Risk Level Overview */}
                  <div className={`rounded-lg border-2 p-4 ${getRiskColor(screening.aiResult.riskLevel)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium mb-1">Risk Assessment</p>
                        <p className="text-2xl font-bold uppercase">
                          {screening.aiResult.riskLevel}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium mb-1">Confidence</p>
                        <p className="text-2xl font-bold">
                          {Math.round(screening.aiResult.confidence * 100)}%
                        </p>
                      </div>
                    </div>
                    <p className="text-xs opacity-75">
                      Model: {screening.aiResult.modelVersion} • Processed:{" "}
                      {formatDate(screening.aiResult.processingTimestamp)}
                    </p>
                  </div>

                  {/* Biomechanical Metrics */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Biomechanical Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {screening.aiResult.metrics.kneeValgusAngle !== undefined && (
                        <Card className="p-4">
                          <p className="text-xs text-muted-foreground mb-1">Knee Valgus Angle</p>
                          <p className="text-2xl font-bold">
                            {screening.aiResult.metrics.kneeValgusAngle}°
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {screening.aiResult.metrics.kneeValgusAngle < 10
                              ? "Normal range"
                              : screening.aiResult.metrics.kneeValgusAngle < 15
                              ? "Slight concern"
                              : "Elevated risk"}
                          </p>
                        </Card>
                      )}

                      {screening.aiResult.metrics.trunkLean !== undefined && (
                        <Card className="p-4">
                          <p className="text-xs text-muted-foreground mb-1">Trunk Lean</p>
                          <p className="text-2xl font-bold">
                            {screening.aiResult.metrics.trunkLean}°
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {screening.aiResult.metrics.trunkLean < 10
                              ? "Good control"
                              : screening.aiResult.metrics.trunkLean < 20
                              ? "Moderate"
                              : "Needs attention"}
                          </p>
                        </Card>
                      )}

                      {screening.aiResult.metrics.limbSymmetryIndex !== undefined && (
                        <Card className="p-4">
                          <p className="text-xs text-muted-foreground mb-1">Limb Symmetry</p>
                          <p className="text-2xl font-bold">
                            {(screening.aiResult.metrics.limbSymmetryIndex * 100).toFixed(0)}%
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {screening.aiResult.metrics.limbSymmetryIndex > 0.9
                              ? "Excellent balance"
                              : screening.aiResult.metrics.limbSymmetryIndex > 0.8
                              ? "Good balance"
                              : "Asymmetry detected"}
                          </p>
                        </Card>
                      )}

                      {screening.aiResult.metrics.stabilizationTime !== undefined && (
                        <Card className="p-4">
                          <p className="text-xs text-muted-foreground mb-1">Stabilization Time</p>
                          <p className="text-2xl font-bold">
                            {screening.aiResult.metrics.stabilizationTime.toFixed(1)}s
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {screening.aiResult.metrics.stabilizationTime < 1.5
                              ? "Quick recovery"
                              : screening.aiResult.metrics.stabilizationTime < 2.5
                              ? "Average"
                              : "Delayed"}
                          </p>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* AI Processing Info */}
                  {screening.aiProcessing && (
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-xs text-muted-foreground mb-2">Processing Details</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Started:</span>{" "}
                          {formatDate(screening.aiProcessing.startedAt)}
                        </div>
                        {screening.aiProcessing.completedAt && (
                          <div>
                            <span className="text-muted-foreground">Completed:</span>{" "}
                            {formatDate(screening.aiProcessing.completedAt)}
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Status:</span>{" "}
                          {screening.aiProcessing.status}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Model:</span>{" "}
                          {screening.aiProcessing.modelVersion}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Processing Status */}
            {screening.status === "processing" && !screening.aiResult && (
              <Card>
                <div className="p-12 text-center">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">AI Analysis in Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    The AI model is analyzing the movement video. This usually takes 5-10 minutes.
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Athlete Info & Clinical Review */}
          <div className="space-y-6">
            {/* Athlete Information */}
            {athlete && (
              <Card>
                <div className="border-b bg-muted/30 px-6 py-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <p className="text-sm font-medium">Athlete Information</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      {athlete.photo && <AvatarImage src={athlete.photo} />}
                      <AvatarFallback className="text-lg">
                        {athlete.firstName[0]}
                        {athlete.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {athlete.firstName} {athlete.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{athlete.id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{athlete.age} years</Badge>
                        <Badge variant="outline">{athlete.gender}</Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Organization:</span>
                      <span className="font-medium">{athlete.currentOrganization?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Team:</span>
                      <span className="font-medium">{athlete.currentTeam?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sport:</span>
                      <span className="font-medium">{athlete.currentSport?.name}</span>
                    </div>
                    {athlete.teams[0]?.position && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Position:</span>
                        <span className="font-medium">{athlete.teams[0].position}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Eligibility:</span>
                      <Badge
                        variant={
                          athlete.eligibilityStatus === "cleared"
                            ? "default"
                            : athlete.eligibilityStatus === "cleared_with_monitoring"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {athlete.eligibilityStatus.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Readiness:</span>
                      <Badge
                        variant={
                          athlete.readiness === "ready" ? "default" : "secondary"
                        }
                      >
                        {athlete.readiness.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                      </Badge>
                    </div>
                  </div>

                  <Link href={`/safesport/clinician/athletes/${athlete.id}`} className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      View Full Profile
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Screening Details */}
            <Card>
              <div className="border-b bg-muted/30 px-6 py-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <p className="text-sm font-medium">Screening Details</p>
              </div>
              <div className="p-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Screening ID:</span>
                  <span className="font-medium">{screening.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Drill Type:</span>
                  <span className="font-medium">{formatDrillName(screening.drill)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Performed By:</span>
                  <span className="font-medium">{screening.performedByName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Recorded:</span>
                  <span className="font-medium">{formatDate(screening.createdAt)}</span>
                </div>
                {screening.reviewedByName && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reviewed By:</span>
                      <span className="font-medium">{screening.reviewedByName}</span>
                    </div>
                    {screening.reviewDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Review Date:</span>
                        <span className="font-medium">{formatDate(screening.reviewDate)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>

            {/* Clinical Review Form */}
            {canEdit && (
              <Card>
                <div className="border-b bg-primary/10 px-6 py-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Clinical Review</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Clinical Interpretation</label>
                    <Textarea
                      placeholder="Provide your clinical interpretation of the movement pattern, noting any concerns or positive findings..."
                      value={clinicalInterpretation}
                      onChange={(e) => setClinicalInterpretation(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Document your professional assessment of the movement quality and any
                      biomechanical concerns.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recommended Action</label>
                    <Select
                      value={reviewerAction}
                      onValueChange={(value) => setReviewerAction(value as ReviewerAction)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select action..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_action">No Action Required</SelectItem>
                        <SelectItem value="prevention_program">
                          Injury Prevention Program
                        </SelectItem>
                        <SelectItem value="physiotherapy_referral">
                          Refer to Physiotherapy
                        </SelectItem>
                        <SelectItem value="further_assessment">
                          Further Assessment Needed
                        </SelectItem>
                        <SelectItem value="other">Other (specify in notes)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Select the most appropriate action based on your clinical findings.
                    </p>
                  </div>

                  <Button
                    onClick={handleSaveReview}
                    disabled={!isReviewComplete || isSaving}
                    className="w-full rounded-none"
                    size="lg"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Review...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Review
                      </>
                    )}
                  </Button>

                  {!isReviewComplete && (
                    <p className="text-xs text-center text-muted-foreground">
                      Please complete both interpretation and action to save review
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Existing Review Display */}
            {screening.status === "reviewed" && screening.clinicalInterpretation && (
              <Card>
                <div className="border-b bg-green-50 dark:bg-green-950/30 px-6 py-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Review Completed
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Clinical Interpretation</p>
                    <p className="text-sm text-muted-foreground">
                      {screening.clinicalInterpretation}
                    </p>
                  </div>

                  {screening.reviewerAction && (
                    <div>
                      <p className="text-sm font-medium mb-2">Recommended Action</p>
                      <Badge variant="secondary">
                        {screening.reviewerAction.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                      </Badge>
                    </div>
                  )}

                  {screening.reviewedByName && screening.reviewDate && (
                    <div className="pt-3 border-t text-xs text-muted-foreground">
                      Reviewed by {screening.reviewedByName} on {formatDate(screening.reviewDate)}
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
