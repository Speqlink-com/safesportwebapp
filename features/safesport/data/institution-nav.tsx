// Institution Navigation Configuration for SafeSport™

import {
  UsersIcon,
  ShieldCheckIcon,
  CalendarIcon,
  BarChartIcon,
  BuildingIcon,
  BellIcon,
  MessageSquareIcon,
} from "lucide-react";

export const institutionNavData = {
  user: {
    name: "Admin User",
    email: "admin@greenvalley.edu",
    avatar: "/avatars/institution.jpg",
  },
  navMain: [
    {
      title: "Athletes",
      url: "#",
      icon: <UsersIcon />,
      isActive: true,
      items: [
        {
          title: "All Athletes",
          url: "/dashboard/safesport/institution/athletes",
        },
        {
          title: "Teams",
          url: "/dashboard/safesport/institution/teams",
        },
        {
          title: "Sports",
          url: "/dashboard/safesport/institution/sports",
        },
      ],
    },
    {
      title: "Health & Safety",
      url: "#",
      icon: <ShieldCheckIcon />,
      items: [
        {
          title: "Readiness",
          url: "/dashboard/safesport/institution/readiness",
        },
        {
          title: "PPE Status",
          url: "/dashboard/safesport/institution/ppe",
        },
        {
          title: "Screening Status",
          url: "/dashboard/safesport/institution/screening",
        },
        {
          title: "Injuries",
          url: "/dashboard/safesport/institution/injuries",
        },
        {
          title: "Referrals",
          url: "/dashboard/safesport/institution/referrals",
        },
      ],
    },
    {
      title: "Operations",
      url: "#",
      icon: <CalendarIcon />,
      items: [
        {
          title: "Schedule",
          url: "/dashboard/safesport/institution/schedule",
        },
        {
          title: "Events",
          url: "/dashboard/safesport/institution/events",
        },
        {
          title: "Medical Coverage",
          url: "/dashboard/safesport/institution/coverage",
        },
        {
          title: "Staff",
          url: "/dashboard/safesport/institution/staff",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: <BarChartIcon />,
      items: [
        {
          title: "Injury Trends",
          url: "/dashboard/safesport/institution/reports/injuries",
        },
        {
          title: "Readiness Reports",
          url: "/dashboard/safesport/institution/reports/readiness",
        },
        {
          title: "Screening Reports",
          url: "/dashboard/safesport/institution/reports/screening",
        },
        {
          title: "Compliance",
          url: "/dashboard/safesport/institution/reports/compliance",
        },
      ],
    },
    {
      title: "Organization",
      url: "#",
      icon: <BuildingIcon />,
      items: [
        {
          title: "Profile",
          url: "/dashboard/safesport/institution/profile",
        },
        {
          title: "Users",
          url: "/dashboard/safesport/institution/users",
        },
        {
          title: "Settings",
          url: "/dashboard/safesport/institution/settings",
        },
      ],
    },
  ],
  communications: [
    {
      name: "Notifications",
      url: "/safesport/notifications",
      icon: <BellIcon />,
    },
    {
      name: "Messages",
      url: "/safesport/messages",
      icon: <MessageSquareIcon />,
    },
  ],
  records: [],
};
