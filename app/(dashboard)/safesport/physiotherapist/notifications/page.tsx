"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/features/safesport/hooks/useNotifications";
import { NotificationItem } from "@/features/safesport/components/notifications/NotificationItem";
import { NotificationFiltersComponent } from "@/features/safesport/components/notifications/NotificationFilters";
import { NotificationEmptyState } from "@/features/safesport/components/notifications/NotificationEmptyState";
import type {
  NotificationFilters,
  SafeSportRole,
} from "@/features/safesport/types/notifications";
import { BellIcon, CheckCheckIcon, SearchIcon } from "lucide-react";

const CURRENT_ROLE: SafeSportRole = "clinician";

export default function ClinicianNotificationsPage() {
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
    <div className="flex flex-1 flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <BellIcon className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              Stay updated on important clinical events
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllAsRead}
          disabled={stats.unread === 0}
        >
          <CheckCheckIcon className="mr-2 size-4" />
          Mark All Read
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <Card className="flex h-full flex-col">
          {/* Stats & Filters Bar */}
          <div className="flex items-center justify-between gap-4 border-b p-4">
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">All: </span>
                <span className="font-semibold" suppressHydrationWarning>
                  {stats?.total}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Unread: </span>
                <span className="font-semibold text-primary" suppressHydrationWarning>
                  {stats.unread}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Important: </span>
                <span className="font-semibold text-yellow-600" suppressHydrationWarning>
                  {stats.important}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-[240px] pl-9"
                />
              </div>
              <NotificationFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                stats={stats}
              />
            </div>
          </div>

          {/* Notifications List */}
          <ScrollArea className="flex-1">
            {notifications.length === 0 ? (
              <NotificationEmptyState type={getEmptyStateType()} />
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
