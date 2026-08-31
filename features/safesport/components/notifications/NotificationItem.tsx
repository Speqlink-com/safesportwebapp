"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SafeSportNotification } from "../../types/notifications";
import {
  ClipboardListIcon,
  ArrowRightLeftIcon,
  ActivityIcon,
  ScanIcon,
  BrainCircuitIcon,
  UserCheckIcon,
  HeartPulseIcon,
  CalendarIcon,
  AlertTriangleIcon,
  UsersIcon,
  BuildingIcon,
  UserIcon,
  SettingsIcon,
  MessageSquareIcon,
} from "lucide-react";

interface NotificationItemProps {
  notification: SafeSportNotification;
  onMarkAsRead: (id: string) => void;
}

// Category icon mapping
const categoryIcons = {
  clinical: ClipboardListIcon,
  referral: ArrowRightLeftIcon,
  assessment: ActivityIcon,
  screening: ScanIcon,
  ai_review: BrainCircuitIcon,
  eligibility: UserCheckIcon,
  rehabilitation: HeartPulseIcon,
  scheduling: CalendarIcon,
  incident: AlertTriangleIcon,
  team: UsersIcon,
  institution: BuildingIcon,
  account: UserIcon,
  system: SettingsIcon,
  message: MessageSquareIcon,
};

// Priority badge styling
const priorityStyles = {
  normal: "hidden",
  important: "border-amber-500/50 text-amber-600 dark:text-amber-400",
  urgent: "border-destructive/50 text-destructive",
};

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const router = useRouter();
  const Icon = categoryIcons[notification.category];
  
  const isUnread = notification.status === "unread";

  const handleClick = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  // Format timestamp
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifTime.toLocaleDateString();
  };

  return (
    <Card
      className={cn(
        "p-4 transition-all duration-200 cursor-pointer",
        "hover:bg-accent/50 hover:border-primary/20",
        isUnread && "bg-accent/30 border-primary/10",
        notification.actionUrl && "hover:shadow-sm"
      )}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            isUnread ? "bg-primary/10" : "bg-muted"
          )}
        >
          <Icon
            className={cn(
              "size-5",
              isUnread ? "text-primary" : "text-muted-foreground"
            )}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              {/* Unread indicator */}
              {isUnread && (
                <div className="size-2 rounded-full bg-primary shrink-0" />
              )}
              <h4
                className={cn(
                  "text-sm font-medium leading-tight",
                  isUnread && "font-semibold"
                )}
              >
                {notification.title}
              </h4>
            </div>
            
            {/* Priority badge */}
            {notification.priority !== "normal" && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs shrink-0",
                  priorityStyles[notification.priority]
                )}
              >
                {notification.priority}
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {notification.description}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{getTimeAgo(notification.createdAt)}</span>
            {notification.relatedAthleteName && (
              <>
                <span>•</span>
                <span className="truncate">{notification.relatedAthleteName}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
