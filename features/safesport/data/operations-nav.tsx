// Operations Navigation Configuration for SafeSport™

import {
  ClipboardListIcon,
  CalendarIcon,
  StethoscopeIcon,
  ArrowRightLeftIcon,
  BuildingIcon,
  BarChartIcon,
  BellIcon,
  MessageSquareIcon,
} from "lucide-react";

export const operationsNavData = {
  user: {
    name: "Sarah Mwangi",
    email: "s.mwangi@ops.safesport.com",
    avatar: "/avatars/operations.jpg",
  },
  navMain: [
    {
      title: "Operations",
      url: "#",
      icon: <ClipboardListIcon />,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard/safesport/operations",
        },
        {
          title: "Tasks",
          url: "/dashboard/safesport/operations/tasks",
        },
        {
          title: "Activity",
          url: "/dashboard/safesport/operations/activity",
        },
      ],
    },
    {
      title: "Scheduling",
      url: "#",
      icon: <CalendarIcon />,
      items: [
        {
          title: "Calendar",
          url: "/dashboard/safesport/operations/calendar",
        },
        {
          title: "Appointments",
          url: "/dashboard/safesport/operations/appointments",
        },
        {
          title: "Events",
          url: "/dashboard/safesport/operations/events",
        },
        {
          title: "Clinician Rosters",
          url: "/dashboard/safesport/operations/rosters",
        },
      ],
    },
    {
      title: "Service Delivery",
      url: "#",
      icon: <StethoscopeIcon />,
      items: [
        {
          title: "Medical Coverage",
          url: "/dashboard/safesport/operations/coverage",
        },
        {
          title: "Screening Sessions",
          url: "/dashboard/safesport/operations/screening",
        },
        {
          title: "Clinics",
          url: "/dashboard/safesport/operations/clinics",
        },
        {
          title: "Assignments",
          url: "/dashboard/safesport/operations/assignments",
        },
      ],
    },
    {
      title: "Referrals",
      url: "#",
      icon: <ArrowRightLeftIcon />,
      items: [
        {
          title: "All Referrals",
          url: "/dashboard/safesport/operations/referrals",
        },
        {
          title: "Pending",
          url: "/dashboard/safesport/operations/referrals/pending",
        },
        {
          title: "Overdue",
          url: "/dashboard/safesport/operations/referrals/overdue",
        },
        {
          title: "Completed",
          url: "/dashboard/safesport/operations/referrals/completed",
        },
      ],
    },
    {
      title: "Organizations",
      url: "#",
      icon: <BuildingIcon />,
      items: [
        {
          title: "Institutions",
          url: "/dashboard/safesport/operations/institutions",
        },
        {
          title: "Teams",
          url: "/dashboard/safesport/operations/teams",
        },
        {
          title: "Services",
          url: "/dashboard/safesport/operations/services",
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
  records: [
    {
      name: "Reports",
      url: "/dashboard/safesport/operations/reports",
      icon: <BarChartIcon />,
    },
  ],
};
