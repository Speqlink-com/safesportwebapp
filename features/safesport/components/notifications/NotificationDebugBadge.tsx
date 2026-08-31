"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { NotificationStore } from "../../hooks/useNotifications";
import type { SafeSportRole } from "../../types/notifications";

interface NotificationDebugBadgeProps {
  role: SafeSportRole;
  className?: string;
}

/**
 * Dev helper component to show notification counts per role
 * Remove or hide in production
 */
export function NotificationDebugBadge({ role, className }: NotificationDebugBadgeProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const roleNotifications = NotificationStore.getByRole(role);
      setCount(roleNotifications.length);
    };

    updateCount();
    const unsubscribe = NotificationStore.subscribe(updateCount);
    return () => {
      unsubscribe();
    };
  }, [role]);

  if (count === 0) {
    return null;
  }

  return (
    <Badge variant="outline" className={className}>
      {count} notifications loaded
    </Badge>
  );
}
