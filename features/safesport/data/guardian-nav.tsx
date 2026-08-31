// Guardian Navigation Configuration for SafeSport™

import {
  UsersIcon,
  HeartPulseIcon,
  FileSignatureIcon,
  FileTextIcon,
  AwardIcon,
  BellIcon,
  MessageSquareIcon,
} from "lucide-react";

export const guardianNavData = {
  user: {
    name: "Mary Otieno",
    email: "m.otieno@guardian.safesport.com",
    avatar: "/avatars/guardian.jpg",
  },
  navMain: [
    {
      title: "Athletes",
      url: "#",
      icon: <UsersIcon />,
      isActive: true,
      items: [
        {
          title: "My Children",
          url: "/dashboard/safesport/guardian/athletes",
        },
      ],
    },
    {
      title: "Health & Safety",
      url: "#",
      icon: <HeartPulseIcon />,
      items: [
        {
          title: "Health Status",
          url: "/dashboard/safesport/guardian/health",
        },
        {
          title: "Assessments",
          url: "/dashboard/safesport/guardian/assessments",
        },
        {
          title: "Injuries",
          url: "/dashboard/safesport/guardian/injuries",
        },
        {
          title: "Rehabilitation",
          url: "/dashboard/safesport/guardian/rehabilitation",
        },
        {
          title: "Eligibility",
          url: "/dashboard/safesport/guardian/eligibility",
        },
      ],
    },
    {
      title: "Consent",
      url: "#",
      icon: <FileSignatureIcon />,
      items: [
        {
          title: "Consent Forms",
          url: "/dashboard/safesport/guardian/consent",
        },
        {
          title: "Questionnaires",
          url: "/dashboard/safesport/guardian/questionnaires",
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
      name: "Certificates",
      url: "/dashboard/safesport/guardian/certificates",
      icon: <AwardIcon />,
    },
    {
      name: "Documents",
      url: "/dashboard/safesport/guardian/documents",
      icon: <FileTextIcon />,
    },
  ],
};
