// Coach Navigation Configuration for SafeSport™

import {
  UsersIcon,
  TrophyIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  BellIcon,
  MessageSquareIcon,
} from "lucide-react";

export const coachNavData = {
  user: {
    name: "Michael Kimani",
    email: "m.kimani@coach.safesport.com",
    avatar: "/avatars/coach.jpg",
  },
  navMain: [
    {
      title: "My Team",
      url: "#",
      icon: <UsersIcon />,
      isActive: true,
      items: [
        {
          title: "Roster",
          url: "/dashboard/safesport/coach/roster",
        },
        {
          title: "Athlete Status",
          url: "/dashboard/safesport/coach/status",
        },
        {
          title: "Restrictions",
          url: "/dashboard/safesport/coach/restrictions",
        },
      ],
    },
    {
      title: "Sport",
      url: "#",
      icon: <TrophyIcon />,
      items: [
        {
          title: "Training",
          url: "/dashboard/safesport/coach/training",
        },
        {
          title: "Fixtures / Events",
          url: "/dashboard/safesport/coach/events",
        },
        {
          title: "Attendance",
          url: "/dashboard/safesport/coach/attendance",
        },
      ],
    },
    {
      title: "Readiness",
      url: "#",
      icon: <ShieldCheckIcon />,
      items: [
        {
          title: "Team Readiness",
          url: "/dashboard/safesport/coach/readiness",
        },
        {
          title: "Screening Status",
          url: "/dashboard/safesport/coach/screening",
        },
      ],
    },
    {
      title: "Safety",
      url: "#",
      icon: <AlertTriangleIcon />,
      items: [
        {
          title: "Alerts",
          url: "/dashboard/safesport/coach/alerts",
        },
        {
          title: "Incident Acknowledgements",
          url: "/dashboard/safesport/coach/incidents",
        },
      ],
    },
  ],
  communications: [
    {
      name: "Messages",
      url: "/safesport/messages",
      icon: <MessageSquareIcon />,
    },
    {
      name: "Notifications",
      url: "/safesport/notifications",
      icon: <BellIcon />,
    },
  ],
  records: [],
};
