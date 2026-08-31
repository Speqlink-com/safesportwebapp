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
import { AwardIcon, DownloadIcon, CalendarIcon } from "lucide-react";

export default function AthleteCertificatesPage() {
  const athlete = mockAthletes[0]; // Brian Otieno

  // Mock certificates data
  const certificates = [
    {
      id: "CERT-001",
      type: "PPE Clearance",
      season: "2024 Fall",
      issuedDate: "2024-08-15",
      expiryDate: "2025-06-30",
      status: "active",
    },
    {
      id: "CERT-002",
      type: "Movement Screening",
      season: "2024 Fall",
      issuedDate: "2024-08-10",
      expiryDate: "2025-06-30",
      status: "active",
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
                  <BreadcrumbPage>Certificates</BreadcrumbPage>
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
              <h1 className="text-2xl font-semibold">My Certificates</h1>
              <p className="text-sm text-muted-foreground">
                Your SafeSport clearance certificates and participation documents
              </p>
            </div>

            <div className="space-y-6">
              {/* Certificates Overview */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <AwardIcon className="size-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Active Certificates</p>
                      <p className="text-xl font-semibold">
                        {certificates.filter((c) => c.status === "active").length}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <CalendarIcon className="size-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Valid Until</p>
                      <p className="text-xl font-semibold">
                        {new Date(certificates[0]?.expiryDate || "").toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Certificates List */}
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Your Certificates</h3>
                <div className="space-y-3">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AwardIcon className="size-5 text-primary" />
                          <div>
                            <p className="font-medium">{cert.type}</p>
                            <p className="text-sm text-muted-foreground">{cert.season}</p>
                          </div>
                        </div>
                        <Badge variant={cert.status === "active" ? "default" : "secondary"}>
                          {cert.status}
                        </Badge>
                      </div>

                      <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                        <div>
                          <span className="text-muted-foreground">Issued: </span>
                          <span>{new Date(cert.issuedDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expires: </span>
                          <span>{new Date(cert.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <DownloadIcon className="mr-2 size-4" />
                          Download PDF
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Info Card */}
              <Card className="p-6">
                <h3 className="mb-2 text-lg font-semibold">About Certificates</h3>
                <p className="text-sm text-muted-foreground">
                  Certificates are issued after completing required health assessments and clearances. 
                  Your institution and team may require valid certificates for participation. 
                  Download and keep copies of your certificates for your records.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
