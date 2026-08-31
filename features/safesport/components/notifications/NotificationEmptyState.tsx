"use client";

import { BellIcon, SearchIcon } from "lucide-react";

interface NotificationEmptyStateProps {
  type: "empty" | "search" | "filtered";
}

export function NotificationEmptyState({ type }: NotificationEmptyStateProps) {
  const content = {
    empty: {
      icon: BellIcon,
      title: "You're all caught up",
      description: "New SafeSport activity will appear here.",
    },
    search: {
      icon: SearchIcon,
      title: "No notifications match your search",
      description: "Try adjusting your search terms.",
    },
    filtered: {
      icon: BellIcon,
      title: "No notifications in this category",
      description: "Try selecting a different filter.",
    },
  };

  const { icon: Icon, title, description } = content[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
        <Icon className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        {description}
      </p>
    </div>
  );
}
