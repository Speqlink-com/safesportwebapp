"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
  if (count === 0) {
    return null;
  }

  const displayCount = count > 99 ? "99+" : count.toString();

  return (
    <Badge
      variant="default"
      className={cn(
        "ml-auto h-5 min-w-5 px-1 text-xs font-semibold",
        "bg-primary text-primary-foreground",
        className
      )}
    >
      {displayCount}
    </Badge>
  );
}
