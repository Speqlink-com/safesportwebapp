"use client";

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
import ThemeSwitcher from "@/components/theme_switcher";
import { athleteNavData } from "@/features/safesport/data/athlete-nav";
import { mockAthletes } from "@/features/safesport/data/mock-data";
import { FileTextIcon, DownloadIcon, CalendarIcon, EyeIcon } from "lucide-react";

export default function AthleteReportsPage() {
  const athlete = mockAthletes[0]; // Brian Otieno

  // Mock reports data
  const reports = [
    {
      id: "REP-001",
      type: "PPE Assessment Report",
      season: "2024 Fall",
      generatedDate: "2024-08-15",
      category: "Health Assessment",
    },
    {
      id: "REP-002",
      type: "Movement Screening Report",
      season: "2024 Fall",
      generatedDate: "2024-08-10",
      category: "Performance",
    },
    {
      id: "REP-003",
      type: "Injury History Summary",
      season: "2024 Spring",
      generatedDate: "2024-05-20",
      category: "Medical",
    },
  ];

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
                  <BreadcrumbPage>Reports</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeSwitcher />
        </header>

        <div className="flex flex-1 flex-col p-6">
          <div className="mx-auto w-full max-w-[1400px]">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">My Reports</h1>
              <p className="text-sm text-muted-foreground">
                Your health assessments, screening reports, and medical documents
              </p>
            </div>

            <div className="space-y-6">
              {/* Reports Overview */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileTextIcon className="size-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Total Reports</p>
                      <p className="text-xl font-semibold">{reports.length}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <CalendarIcon className="size-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Latest Report</p>
                      <p className="text-xl font-semibold">
                        {new Date(reports[0]?.generatedDate || "").toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <DownloadIcon className="size-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p className="text-xl font-semibold">{reports.length}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Reports List */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Your Reports</h3>
                  <Button variant="outline" size="sm">
                    <DownloadIcon className="mr-2 size-4" />
                    Download All
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileTextIcon className="size-5 text-primary" />
                          <div>
                            <p className="font-medium">{report.type}</p>
                            <p className="text-sm text-muted-foreground">{report.season}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{report.category}</Badge>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="size-4" />
                        Generated: {new Date(report.generatedDate).toLocaleDateString()}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <EyeIcon className="mr-2 size-4" />
                          View Report
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <DownloadIcon className="mr-2 size-4" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Info Card */}
              <Card className="p-6">
                <h3 className="mb-2 text-lg font-semibold">About Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Reports are generated from your health assessments, screenings, and clinical evaluations. 
                  These documents provide detailed information about your health status and athletic readiness. 
                  You can view and download reports for your records or to share with your healthcare providers.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
