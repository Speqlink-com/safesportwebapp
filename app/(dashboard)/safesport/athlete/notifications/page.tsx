"use client";

import { useState } from "react";
import { SafeSportSidebar } from "@/components/safesport-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeSwitcher from "@/components/theme_switcher";
import { athleteNavData } from "@/features/safesport/data/athlete-nav";
import { useNotifications } from "@/features/safesport/hooks/useNotifications";
import { NotificationItem } from "@/features/safesport/components/notifications/NotificationItem";
import { NotificationFiltersComponent } from "@/features/safesport/components/notifications/NotificationFilters";
import { NotificationEmptyState } from "@/features/safesport/components/notifications/NotificationEmptyState";
import type {
  NotificationFilters,
  SafeSportRole,
} from "@/features/safesport/types/notifications";
import { BellIcon, CheckCheckIcon, SearchIcon } from "lucide-react";

// For prototype: using clinician role - in production this would come from auth context
const CURRENT_ROLE: SafeSportRole = "clinician";

export default function NotificationsPage() {
  const [filters, setFilters] = useState<NotificationFilters>({
    status: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { notifications, stats, markAsRead, markAllAsRead } = useNotifications(
    CURRENT_ROLE,
    {
      ...filters,
      search: searchQuery,
    },
  );

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const getEmptyStateType = () => {
    if (searchQuery.trim()) return "search";
    if (filters.status !== "all") return "filtered";
    return "empty";
  };

  return (
    <SidebarProvider>
      <SafeSportSidebar navData={athleteNavData} />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Notifications</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeSwitcher />
        </header>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <BellIcon className="size-6" />
                <h1 className="text-2xl font-semibold">Notifications</h1>
                {stats.unread > 0 && (
                  <span
                    className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground"
                    suppressHydrationWarning
                  >
                    {stats.unread} unread
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Stay updated with your SafeSport activity
              </p>
            </div>

            {stats.unread > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="gap-2"
                suppressHydrationWarning
              >
                <CheckCheckIcon className="size-4" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Filters and Search */}
          <Card className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <NotificationFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                stats={stats}
              />

              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notifications..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Notifications List */}
          <div className="flex-1">
            {notifications.length === 0 ? (
              <Card className="border-dashed">
                <NotificationEmptyState type={getEmptyStateType()} />
              </Card>
            ) : (
              <ScrollArea className="h-[calc(100vh-17rem)]">
                <div className="space-y-3 pr-4">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
