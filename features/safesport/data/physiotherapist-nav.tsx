// Physiotherapist Navigation Configuration for SafeSport™

import {
  ClipboardListIcon,
  TrendingUpIcon,
  HeartPulseIcon,
  ArrowRightLeftIcon,
  UsersIcon,
  FileTextIcon,
  BellIcon,
  MessageSquareIcon,
} from "lucide-react";

export const physiotherapistNavData = {
  user: {
    name: "James Ochieng",
    email: "j.ochieng@safesport.com",
    avatar: "/avatars/physio.jpg",
  },
  navMain: [
    {
      title: "My Work",
      url: "#",
      icon: <ClipboardListIcon />,
      isActive: true,
      items: [
        {
          title: "Assigned Athletes",
          url: "/dashboard/safesport/physiotherapist/athletes",
        },
        {
          title: "Today's Sessions",
          url: "/dashboard/safesport/physiotherapist/sessions",
        },
        {
          title: "Tasks",
          url: "/dashboard/safesport/physiotherapist/tasks",
        },
      ],
    },
    {
      title: "Movement",
      url: "#",
      icon: <TrendingUpIcon />,
      items: [
        {
          title: "Screenings",
          url: "/dashboard/safesport/physiotherapist/screenings",
        },
        {
          title: "AI Reviews",
          url: "/dashboard/safesport/physiotherapist/ai-reviews",
        },
        {
          title: "Functional Baselines",
          url: "/dashboard/safesport/physiotherapist/baselines",
        },
      ],
    },
    {
      title: "Rehabilitation",
      url: "#",
      icon: <HeartPulseIcon />,
      items: [
        {
          title: "Active Rehab",
          url: "/dashboard/safesport/physiotherapist/rehabilitation",
        },
        {
          title: "Rehab Plans",
          url: "/dashboard/safesport/physiotherapist/plans",
        },
        {
          title: "Progress Reviews",
          url: "/dashboard/safesport/physiotherapist/progress",
        },
        {
          title: "Reassessments",
          url: "/dashboard/safesport/physiotherapist/reassessments",
        },
      ],
    },
    {
      title: "Referrals",
      url: "#",
      icon: <ArrowRightLeftIcon />,
      items: [
        {
          title: "Incoming Referrals",
          url: "/dashboard/safesport/physiotherapist/referrals/incoming",
        },
        {
          title: "My Referrals",
          url: "/dashboard/safesport/physiotherapist/referrals/mine",
        },
        {
          title: "Completed",
          url: "/dashboard/safesport/physiotherapist/referrals/completed",
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
  records: [
    {
      name: "Athlete Profiles",
      url: "/dashboard/safesport/physiotherapist/profiles",
      icon: <UsersIcon />,
    },
    {
      name: "Reports",
      url: "/dashboard/safesport/physiotherapist/reports",
      icon: <FileTextIcon />,
    },
  ],
};
