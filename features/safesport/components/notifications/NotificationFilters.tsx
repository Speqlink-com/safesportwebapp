"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NotificationFilters } from "../../types/notifications";

interface NotificationFiltersProps {
  filters: NotificationFilters;
  onFiltersChange: (filters: NotificationFilters) => void;
  stats: {
    total: number;
    unread: number;
    important: number;
  };
}

export function NotificationFiltersComponent({
  filters,
  onFiltersChange,
  stats,
}: NotificationFiltersProps) {
  const activeFilter = filters.status || "all";

  const handleFilterChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value as "all" | "unread" | "important",
    });
  };

  return (
    <Tabs value={activeFilter} onValueChange={handleFilterChange}>
      <TabsList>
        <TabsTrigger value="all" suppressHydrationWarning>
          All
          {stats?.total > 0 && (
            <span className="ml-2 text-xs text-muted-foreground">
              {stats?.total}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="unread" suppressHydrationWarning>
          Unread
          {stats.unread > 0 && (
            <span className="ml-2 text-xs text-primary font-semibold">
              {stats.unread}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="important" suppressHydrationWarning>
          Important
          {stats.important > 0 && (
            <span className="ml-2 text-xs text-muted-foreground">
              {stats.important}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
