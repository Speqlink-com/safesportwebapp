"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ActivityIcon } from "lucide-react";
import { initializeNotifications } from "@/features/safesport/utils/initializeNotifications";

interface SafeSportSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navData: {
    user: {
      name: string;
      email: string;
      avatar: string;
    };
    navMain: Array<{
      title: string;
      url: string;
      icon?: React.ReactNode;
      isActive?: boolean;
      items?: Array<{
        title: string;
        url: string;
      }>;
    }>;
    communications?: Array<{
      name: string;
      url: string;
      icon: React.ReactNode;
      badge?: React.ReactNode;
    }>;
    records?: Array<{
      name: string;
      url: string;
      icon: React.ReactNode;
    }>;
  };
}

export function SafeSportSidebar({ navData, ...props }: SafeSportSidebarProps) {
  // Auto-initialize notifications on mount
  React.useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-sidebar-menu-button">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ActivityIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">SafeSport™</span>
                <span className="truncate text-xs">Clinical Platform</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />

        {navData.communications && (
          <SidebarGroup>
            <SidebarGroupLabel>Communication</SidebarGroupLabel>
            <SidebarMenu>
              {navData.communications.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    render={<a href={item.url} />}
                    tooltip={item.name}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    {item.badge}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {navData.records && (
          <SidebarGroup>
            <SidebarGroupLabel>Records</SidebarGroupLabel>
            <SidebarMenu>
              {navData.records.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    render={<a href={item.url} />}
                    tooltip={item.name}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
