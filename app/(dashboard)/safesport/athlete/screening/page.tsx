"use client";

import { useState } from "react";
import { SafeSportSidebar } from "@/components/safesport-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ThemeSwitcher from "@/components/theme_switcher";
import { athleteNavData } from "@/features/safesport/data/athlete-nav";
import { mockAthletes } from "@/features/safesport/data/mock-data";
import {
  PlayIcon,
  CheckCircle2Icon,
  LoaderIcon,
  CalendarIcon,
  UserIcon,
} from "lucide-react";

export default function AthleteScreeningPage() {
  const athlete = mockAthletes[0];
  const screenings = athlete.screenings;

  const [selectedScreening, setSelectedScreening] = useState(screenings[0]);
  const [filter, setFilter] = useState<"all" | "reviewed" | "processing">("all");
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredScreenings = screenings.filter((s) => {
    if (filter === "all") return true;
    if (filter === "reviewed") return s.status === "reviewed";
    if (filter === "processing") return s.status === "processing";
    return true;
  });

  const getDrillDisplayName = (drill: string) => {
    return drill
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getRiskColor = (level: string) => {
    if (level === "low") return "text-green-600 dark:text-green-400";
    if (level === "moderate") return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <SidebarProvider>
      <SafeSportSidebar navData={athleteNavData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/safesport/athlete">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>My Screening</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeSwitcher />
        </header>

        <div className="flex min-w-0 flex-1 flex-col p-6">
          <div className="mx-auto w-full max-w-[1600px] space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-semibold">My Screening</h1>
              <p className="text-sm text-muted-foreground">
                Review your movement screening history
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "reviewed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("reviewed")}
              >
                Reviewed
              </Button>
              <Button
                variant={filter === "processing" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("processing")}
              >
                Processing
              </Button>
            </div>

            <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
              {/* Current video */}
              {selectedScreening && (
                <Card className="min-w-0 overflow-hidden">
                <div className="border-b bg-muted/30 px-6 py-3">
                  <p className="text-sm font-medium">Latest Screening</p>
                </div>
                <div className="grid gap-6 p-6 md:grid-cols-[1fr,380px]">
                  {/* Video Section */}
                  <div className="space-y-4">
                    <div className="relative aspect-video overflow-hidden rounded-lg border bg-black">
                      <video
                        src={selectedScreening.videoUrl}
                        controls
                        className="size-full object-contain"
                        poster="/placeholder-video.jpg"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Duration: 00:42</span>
                      <Button variant="ghost" size="sm" onClick={() => setDetailOpen(true)}>
                        View full analysis →
                      </Button>
                    </div>
                  </div>

                  {/* Information Panel */}
                  <div className="space-y-6">
                    {/* Title & Date */}
                    <div>
                      <h2 className="text-xl font-semibold">
                        {getDrillDisplayName(selectedScreening.drill)}
                      </h2>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="size-4" />
                        {new Date(selectedScreening.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <Badge
                        variant={selectedScreening.status === "reviewed" ? "default" : "secondary"}
                        className="text-sm"
                      >
                        {selectedScreening.status === "processing" ? (
                          <>
                            <LoaderIcon className="mr-1 size-3 animate-spin" />
                            Processing
                          </>
                        ) : (
                          <>
                            <CheckCircle2Icon className="mr-1 size-3" />
                            Reviewed
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* AI Movement Analysis */}
                    {selectedScreening.aiResult && (
                      <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                        <p className="mb-2 text-sm font-medium">AI movement-risk signal</p>
                        <div className="mb-3 flex items-center gap-2">
                          <div
                            className={`size-2 rounded-full ${
                              selectedScreening.aiResult.riskLevel === "low"
                                ? "bg-green-500"
                                : selectedScreening.aiResult.riskLevel === "moderate"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span
                            className={`font-semibold capitalize ${getRiskColor(
                              selectedScreening.aiResult.riskLevel
                            )}`}
                          >
                            {selectedScreening.aiResult.riskLevel}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Confidence: {Math.round(selectedScreening.aiResult.confidence * 100)}%
                        </p>
                      </div>
                    )}

                    {/* Compact Metadata */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Video quality</span>
                        <div className="flex items-center gap-1">
                          <CheckCircle2Icon className="size-4 text-primary" />
                          <span className="font-medium capitalize">
                            {selectedScreening.videoQuality}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">AI analysis</span>
                        <div className="flex items-center gap-1">
                          {selectedScreening.aiProcessing?.status === "complete" ? (
                            <>
                              <CheckCircle2Icon className="size-4 text-primary" />
                              <span className="font-medium">Complete</span>
                            </>
                          ) : (
                            <>
                              <LoaderIcon className="size-4 animate-spin text-primary" />
                              <span className="font-medium">Processing</span>
                            </>
                          )}
                        </div>
                      </div>

                      {selectedScreening.reviewedByName && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Reviewed by</span>
                          <div className="flex items-center gap-1">
                            <UserIcon className="size-4" />
                            <span className="font-medium">
                              {selectedScreening.reviewedByName}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Clinical Review */}
                    {selectedScreening.clinicalInterpretation && (
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                          Clinical review
                        </p>
                        <p className="text-sm">{selectedScreening.clinicalInterpretation}</p>
                      </div>
                    )}

                  </div>
                </div>
                </Card>
              )}

            {/* Recent videos */}
            <Card className="flex min-h-0 flex-col overflow-hidden xl:max-h-[calc(100vh-12rem)]">
              <div className="border-b px-4 py-4">
                <h3 className="font-semibold">Recent videos</h3>
                <p className="text-xs text-muted-foreground">Choose a screening to review</p>
              </div>
              <div className="max-h-[28rem] space-y-2 overflow-y-auto p-2 xl:max-h-none">
                {filteredScreenings.map((screening) => (
                    <button
                      key={screening.id}
                      onClick={() => setSelectedScreening(screening)}
                      className={`flex w-full gap-3 rounded-lg border p-2 text-left transition-colors hover:bg-muted/60 ${
                        selectedScreening.id === screening.id
                          ? "border-primary bg-primary/5"
                          : "border-transparent"
                      }`}
                    >
                      {/* Video Thumbnail */}
                      <div className="relative w-32 shrink-0 overflow-hidden rounded-md bg-black">
                        <video
                          src={screening.videoUrl}
                          className="aspect-video size-full object-cover"
                          poster="/placeholder-video.jpg"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="flex size-8 items-center justify-center rounded-full bg-white/90">
                            <PlayIcon className="size-4 text-black" />
                          </div>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="min-w-0 flex-1 py-1">
                        <p className="truncate text-sm font-medium">
                          {getDrillDisplayName(screening.drill)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(screening.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <div className="mt-2">
                          {screening.aiResult ? (
                            <Badge variant="outline" className="text-xs capitalize">
                              {screening.aiResult.riskLevel}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Processing
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                ))}
              </div>
            </Card>
            </div>

          </div>
        </div>
      </SidebarInset>

      {/* Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{getDrillDisplayName(selectedScreening?.drill || "")}</SheetTitle>
            <SheetDescription>
              {selectedScreening &&
                new Date(selectedScreening.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Video */}
            <div className="aspect-video overflow-hidden rounded-lg border bg-black">
              <video
                src={selectedScreening?.videoUrl}
                controls
                className="size-full object-contain"
              />
            </div>

            {/* AI Movement Analysis */}
            {selectedScreening?.aiResult && (
              <div className="space-y-4">
                <div>
                  <h4 className="mb-3 font-semibold">AI Movement Analysis</h4>
                  <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className={`size-3 rounded-full ${
                          selectedScreening.aiResult.riskLevel === "low"
                            ? "bg-green-500"
                            : selectedScreening.aiResult.riskLevel === "moderate"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span
                        className={`font-semibold capitalize ${getRiskColor(
                          selectedScreening.aiResult.riskLevel
                        )}`}
                      >
                        {selectedScreening.aiResult.riskLevel} signal
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {Math.round(selectedScreening.aiResult.confidence * 100)}%
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                {selectedScreening.aiResult.metrics && (
                  <div>
                    <h4 className="mb-3 font-semibold">Metrics</h4>
                    <div className="space-y-2 text-sm">
                      {selectedScreening.aiResult.metrics.kneeValgusAngle && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Knee valgus angle</span>
                          <span className="font-medium">
                            {selectedScreening.aiResult.metrics.kneeValgusAngle}°
                          </span>
                        </div>
                      )}
                      {selectedScreening.aiResult.metrics.trunkLean && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Trunk lean</span>
                          <span className="font-medium">
                            {selectedScreening.aiResult.metrics.trunkLean}°
                          </span>
                        </div>
                      )}
                      {selectedScreening.aiResult.metrics.limbSymmetryIndex && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Limb symmetry index</span>
                          <span className="font-medium">
                            {(selectedScreening.aiResult.metrics.limbSymmetryIndex * 100).toFixed(
                              0
                            )}
                            %
                          </span>
                        </div>
                      )}
                      {selectedScreening.aiResult.metrics.stabilizationTime && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stabilization time</span>
                          <span className="font-medium">
                            {selectedScreening.aiResult.metrics.stabilizationTime}s
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Clinical Review */}
            {selectedScreening?.clinicalInterpretation && (
              <div>
                <h4 className="mb-3 font-semibold">Clinical Review</h4>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="mb-3 text-sm">{selectedScreening.clinicalInterpretation}</p>
                  {selectedScreening.reviewedByName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserIcon className="size-4" />
                      <span>Reviewed by {selectedScreening.reviewedByName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  );
}
