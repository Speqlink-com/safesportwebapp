"use client";

import { useSearchParams, useRouter } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeSwitcher from "@/components/theme_switcher";
import { athleteNavData } from "@/features/safesport/data/athlete-nav";
import { mockAthletes } from "@/features/safesport/data/mock-data";
import { getOnboardingDataByAthleteId } from "@/features/safesport/data/onboarding-data";

// Tab Components
import { ProfileOverviewTab } from "@/features/safesport/components/profile/ProfileOverviewTab";
import { ProfilePersonalTab } from "@/features/safesport/components/profile/ProfilePersonalTab";
import { ProfileHealthTab } from "@/features/safesport/components/profile/ProfileHealthTab";
import { ProfileParticipationTab } from "@/features/safesport/components/profile/ProfileParticipationTab";
import { ProfileDocumentsTab } from "@/features/safesport/components/profile/ProfileDocumentsTab";
import { ProfileSecurityTab } from "@/features/safesport/components/profile/ProfileSecurityTab";

export default function AthleteProfilePage() {
  // Get current athlete (Brian Otieno for prototype)
  const athlete = mockAthletes[0];
  const onboardingData = getOnboardingDataByAthleteId(athlete.id);

  // Use query params for tab state
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "overview";

  const handleTabChange = (value: string) => {
    router.push(`/safesport/athlete/profile?tab=${value}`);
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
                  <BreadcrumbPage>My Profile</BreadcrumbPage>
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
              <h1 className="text-2xl font-semibold">My Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your SafeSport athlete information and account settings
              </p>
            </div>

            {/* Tabs */}
            <div className="space-y-6">
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="flex flex-col"
              >
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="health">PPE / Health</TabsTrigger>
                  <TabsTrigger value="participation">Participation</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 flex-none">
                  <ProfileOverviewTab
                    athlete={athlete}
                    onboardingData={onboardingData || null}
                  />
                </TabsContent>

                <TabsContent value="personal" className="mt-6 flex-none">
                  <ProfilePersonalTab
                    athlete={athlete}
                    onboardingData={onboardingData || null}
                  />
                </TabsContent>

                <TabsContent value="health" className="mt-6 flex-none">
                  <ProfileHealthTab
                    athlete={athlete}
                    onboardingData={onboardingData || null}
                  />
                </TabsContent>

                <TabsContent value="participation" className="mt-6 flex-none">
                  <ProfileParticipationTab athlete={athlete} />
                </TabsContent>

                <TabsContent value="documents" className="mt-6 flex-none">
                  <ProfileDocumentsTab athlete={athlete} />
                </TabsContent>

                <TabsContent value="security" className="mt-6 flex-none">
                  <ProfileSecurityTab athleteEmail="b.otieno@athlete.safesport.com" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
