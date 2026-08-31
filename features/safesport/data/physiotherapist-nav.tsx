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
          title: "Overview",
          url: "/safesport/physiotherapist",
        },
        {
          title: "Assigned Athletes",
          url: "/safesport/physiotherapist/athletes",
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
          url: "/safesport/physiotherapist/screenings",
        },
        {
          title: "AI Reviews",
          url: "/safesport/physiotherapist/ai-reviews",
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
          url: "/safesport/physiotherapist/rehabilitation",
        },
        {
          title: "Rehab Plans",
          url: "/safesport/physiotherapist/plans",
        },
        {
          title: "Progress Reviews",
          url: "/safesport/physiotherapist/progress",
        },
        {
          title: "Reassessments",
          url: "/safesport/physiotherapist/reassessments",
        },
      ],
    },
    {
      title: "Referrals",
      url: "/safesport/physiotherapist/referrals",
      icon: <ArrowRightLeftIcon />,
    },
  ],
  communications: [
    {
      name: "Messages",
      url: "/safesport/physiotherapist/messages",
      icon: <MessageSquareIcon />,
    },
    {
      name: "Notifications",
      url: "/safesport/physiotherapist/notifications",
      icon: <BellIcon />,
    },
  ],
  records: [
    {
      name: "Athlete Profiles",
      url: "/safesport/physiotherapist/profiles",
      icon: <UsersIcon />,
    },
    {
      name: "Reports",
      url: "/safesport/physiotherapist/reports",
      icon: <FileTextIcon />,
    },
  ],
};
