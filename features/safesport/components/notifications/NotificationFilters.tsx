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
        <TabsTrigger value="all">
          All
          {stats.total > 0 && (
            <span className="ml-2 text-xs text-muted-foreground" suppressHydrationWarning>
              {stats.total}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="unread">
          Unread
          {stats.unread > 0 && (
            <span className="ml-2 text-xs text-primary font-semibold" suppressHydrationWarning>
              {stats.unread}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="important">
          Important
          {stats.important > 0 && (
            <span className="ml-2 text-xs text-muted-foreground" suppressHydrationWarning>
              {stats.important}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
