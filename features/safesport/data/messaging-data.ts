// SafeSport™ Messaging Mock Data
// Realistic institution-based family communication data

import type {
  Family,
  FamilyMember,
  Conversation,
  Message,
} from "../types/messaging";
import type { UserID } from "../types";

// ==================================================
// FAMILIES (Institution-based communication groups)
// ==================================================

export const mockFamilies: Family[] = [
  {
    id: "family-001",
    organizationId: "org-001",
    name: "Green Valley Academy",
    logo: "/avatars/greenvalley.jpg",
    memberCount: 8,
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "family-002",
    organizationId: "org-002",
    name: "Alliance High School",
    logo: "/avatars/alliance.jpg",
    memberCount: 5,
    createdAt: "2023-09-01T08:00:00Z",
  },
  {
    id: "family-003",
    organizationId: "org-003",
    name: "Gor Mahia FC",
    logo: "/avatars/gormahia.jpg",
    memberCount: 6,
    createdAt: "2022-01-10T08:00:00Z",
  },
];

// ==================================================
// FAMILY MEMBERS
// ==================================================

export const mockFamilyMembers: FamilyMember[] = [
  // Green Valley Academy Family
  {
    id: "user-001",
    familyId: "family-001",
    firstName: "Brian",
    lastName: "Otieno",
    role: "athlete",
    avatar: "/avatars/brian.jpg",
    team: "U18 Football",
    status: "online",
  },
  {
    id: "user-002",
    familyId: "family-001",
    firstName: "Jane",
    lastName: "Otieno",
    role: "guardian",
    status: "away",
    lastSeen: "2026-08-30T10:15:00Z",
  },
  {
    id: "user-003",
    familyId: "family-001",
    firstName: "Peter",
    lastName: "Kamau",
    role: "coach",
    team: "U18 Football",
    status: "online",
  },
  {
    id: "user-004",
    familyId: "family-001",
    firstName: "Sarah",
    lastName: "Njeri",
    role: "clinician",
    status: "online",
  },
  {
    id: "user-005",
    familyId: "family-001",
    firstName: "Mary",
    lastName: "Wanjiku",
    role: "physiotherapist",
    status: "online",
  },
  {
    id: "user-006",
    familyId: "family-001",
    firstName: "John",
    lastName: "Doe",
    role: "institution",
    status: "offline",
    lastSeen: "2026-08-29T17:30:00Z",
  },
  {
    id: "user-007",
    familyId: "family-001",
    firstName: "David",
    lastName: "Kimani",
    role: "athlete",
    team: "U16 Football",
    status: "away",
    lastSeen: "2026-08-30T09:45:00Z",
  },
  {
    id: "user-008",
    familyId: "family-001",
    firstName: "Grace",
    lastName: "Mwangi",
    role: "operations",
    status: "online",
  },
];

// ==================================================
// CONVERSATIONS
// ==================================================

export const mockConversations: Conversation[] = [
  {
    id: "conv-001",
    familyId: "family-001",
    type: "direct",
    participants: [
      {
        userId: "user-003",
        joinedAt: "2026-08-28T09:00:00Z",
        lastReadAt: "2026-08-30T10:45:00Z",
      },
      {
        userId: "user-004",
        joinedAt: "2026-08-28T09:00:00Z",
        lastReadAt: "2026-08-30T10:30:00Z",
      },
    ],
    lastMessage: {
      id: "msg-004",
      conversationId: "conv-001",
      senderId: "user-004",
      senderName: "Dr. Sarah Njeri",
      senderRole: "Clinician",
      content:
        "Appreciated. Let me know if you notice anything unusual during the match.",
      status: "read",
      createdAt: "2026-08-30T10:30:00Z",
    },
    unreadCount: 0,
    createdAt: "2026-08-28T09:00:00Z",
    updatedAt: "2026-08-30T10:30:00Z",
  },
  {
    id: "conv-002",
    familyId: "family-001",
    type: "direct",
    participants: [
      {
        userId: "user-004",
        joinedAt: "2026-08-27T10:00:00Z",
        lastReadAt: "2026-08-30T11:00:00Z",
      },
      {
        userId: "user-005",
        joinedAt: "2026-08-27T10:00:00Z",
        lastReadAt: "2026-08-30T10:50:00Z",
      },
    ],
    lastMessage: {
      id: "msg-007",
      conversationId: "conv-002",
      senderId: "user-004",
      senderName: "Dr. Sarah Njeri",
      senderRole: "Clinician",
      content:
        "Thursday at 2:00 PM works for me. I'll coordinate with Brian and his guardian.",
      status: "read",
      createdAt: "2026-08-30T10:50:00Z",
    },
    unreadCount: 0,
    createdAt: "2026-08-27T10:00:00Z",
    updatedAt: "2026-08-30T10:50:00Z",
    contextType: "referral",
    contextId: "ref-001",
    contextLabel: "Knee Referral - Brian Otieno",
  },
  {
    id: "conv-003",
    familyId: "family-001",
    type: "direct",
    participants: [
      {
        userId: "user-001",
        joinedAt: "2026-08-29T14:00:00Z",
        lastReadAt: "2026-08-30T08:00:00Z",
      },
      {
        userId: "user-003",
        joinedAt: "2026-08-29T14:00:00Z",
        lastReadAt: "2026-08-30T10:45:00Z",
      },
    ],
    lastMessage: {
      id: "msg-011",
      conversationId: "conv-003",
      senderId: "user-003",
      senderName: "Peter Kamau",
      senderRole: "Coach",
      content: "See you on the pitch! ⚽",
      status: "delivered",
      createdAt: "2026-08-30T10:46:00Z",
    },
    unreadCount: 2,
    createdAt: "2026-08-29T14:00:00Z",
    updatedAt: "2026-08-30T10:45:00Z",
  },
  {
    id: "conv-004",
    familyId: "family-001",
    type: "direct",
    participants: [
      {
        userId: "user-002",
        joinedAt: "2026-08-26T11:00:00Z",
        lastReadAt: "2026-08-29T16:00:00Z",
      },
      {
        userId: "user-006",
        joinedAt: "2026-08-26T11:00:00Z",
        lastReadAt: "2026-08-30T09:00:00Z",
      },
    ],
    lastMessage: {
      id: "msg-013",
      conversationId: "conv-004",
      senderId: "user-006",
      senderName: "John Doe",
      senderRole: "Institution",
      content:
        "Good afternoon Mrs. Otieno. Brian's medical clearance is up to date and he's registered for the tournament. All documentation has been submitted.",
      status: "read",
      createdAt: "2026-08-30T09:00:00Z",
    },
    unreadCount: 1,
    createdAt: "2026-08-26T11:00:00Z",
    updatedAt: "2026-08-30T09:00:00Z",
  },
  {
    id: "conv-005",
    familyId: "family-001",
    type: "direct",
    participants: [
      {
        userId: "user-001",
        joinedAt: "2026-08-29T08:00:00Z",
        lastReadAt: "2026-08-30T11:30:00Z",
      },
      {
        userId: "user-004",
        joinedAt: "2026-08-29T08:00:00Z",
        lastReadAt: "2026-08-30T12:00:00Z",
      },
    ],
    lastMessage: {
      id: "msg-020",
      conversationId: "conv-005",
      senderId: "user-001",
      senderName: "Brian Otieno",
      senderRole: "Athlete",
      content:
        "Thank you Dr. Njeri! I'll make sure to do the stretches before training.",
      status: "read",
      createdAt: "2026-08-30T11:30:00Z",
    },
    unreadCount: 0,
    createdAt: "2026-08-29T08:00:00Z",
    updatedAt: "2026-08-30T11:30:00Z",
    contextType: "screening",
    contextId: "scr-001",
    contextLabel: "Health Screening - Brian Otieno",
  },
  {
    id: "family-group",
    familyId: "family-001",
    type: "group",
    participants: [
      {
        userId: "user-001",
        joinedAt: "2024-01-10T08:00:00Z",
        lastReadAt: "2026-08-30T11:00:00Z",
      },
      {
        userId: "user-002",
        joinedAt: "2024-01-10T08:00:00Z",
        lastReadAt: "2026-08-30T10:00:00Z",
      },
      {
        userId: "user-003",
        joinedAt: "2024-01-10T08:00:00Z",
        lastReadAt: "2026-08-30T12:00:00Z",
      },
      {
        userId: "user-004",
        joinedAt: "2024-01-10T08:00:00Z",
        lastReadAt: "2026-08-30T12:00:00Z",
      },
      {
        userId: "user-005",
        joinedAt: "2024-01-10T08:00:00Z",
        lastReadAt: "2026-08-30T11:30:00Z",
      },
      {
        userId: "user-006",
        joinedAt: "2024-01-10T08:00:00Z",
        lastReadAt: "2026-08-29T17:30:00Z",
      },
      {
        userId: "user-007",
        joinedAt: "2024-01-10T08:00:00Z",
        lastReadAt: "2026-08-30T09:45:00Z",
      },
      {
        userId: "user-008",
        joinedAt: "2024-01-10T08:00:00Z",
        lastReadAt: "2026-08-30T11:45:00Z",
      },
    ],
    lastMessage: {
      id: "msg-group-005",
      conversationId: "family-group",
      senderId: "user-008",
      senderName: "Grace Mwangi",
      senderRole: "Operations",
      content:
        "Reminder: Tournament registration closes this Friday. Please ensure all documentation is submitted.",
      status: "delivered",
      createdAt: "2026-08-30T11:45:00Z",
    },
    unreadCount: 3,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2026-08-30T11:45:00Z",
  },
];

// ==================================================
// MESSAGES
// ==================================================

export const mockMessages: Record<string, Message[]> = {
  "conv-001": [
    {
      id: "msg-001",
      conversationId: "conv-001",
      senderId: "user-003",
      senderName: "Peter Kamau",
      senderRole: "Coach",
      content:
        "Good evening Dr. Njeri. I wanted to check on Brian's status for tomorrow's match.",
      status: "read",
      createdAt: "2026-08-30T09:15:00Z",
    },
    {
      id: "msg-002",
      conversationId: "conv-001",
      senderId: "user-004",
      senderName: "Dr. Sarah Njeri",
      senderRole: "Clinician",
      content:
        "Evening Coach. Brian's screening results look good. He's cleared for participation with the usual monitoring protocols.",
      status: "read",
      createdAt: "2026-08-30T09:22:00Z",
    },
    {
      id: "msg-003",
      conversationId: "conv-001",
      senderId: "user-003",
      senderName: "Peter Kamau",
      senderRole: "Coach",
      content:
        "Perfect, thank you! I'll make sure he follows the warm-up routine we discussed.",
      status: "read",
      createdAt: "2026-08-30T09:25:00Z",
    },
    {
      id: "msg-004",
      conversationId: "conv-001",
      senderId: "user-004",
      senderName: "Dr. Sarah Njeri",
      senderRole: "Clinician",
      content:
        "Appreciated. Let me know if you notice anything unusual during the match.",
      status: "read",
      createdAt: "2026-08-30T10:30:00Z",
    },
  ],
  "conv-002": [
    {
      id: "msg-005",
      conversationId: "conv-002",
      senderId: "user-004",
      senderName: "Dr. Sarah Njeri",
      senderRole: "Clinician",
      content:
        "Hi Mary, I've completed the initial assessment for Brian's knee. The referral is ready for your review.",
      attachments: [
        {
          id: "att-001",
          messageId: "msg-005",
          type: "document",
          fileName: "athlete-report.pdf",
          fileSize: 2400000,
          fileType: "application/pdf",
          url: "/mock/athlete-report.pdf",
          uploadStatus: "uploaded",
          createdAt: "2026-08-30T10:00:00Z",
        },
      ],
      status: "read",
      createdAt: "2026-08-30T10:00:00Z",
    },
    {
      id: "msg-006",
      conversationId: "conv-002",
      senderId: "user-005",
      senderName: "Mary Wanjiku",
      senderRole: "Physiotherapist",
      content:
        "Thank you Dr. Njeri. I've reviewed the assessment. Can we schedule a session for Thursday afternoon?",
      status: "read",
      createdAt: "2026-08-30T10:35:00Z",
    },
    {
      id: "msg-007",
      conversationId: "conv-002",
      senderId: "user-004",
      senderName: "Dr. Sarah Njeri",
      senderRole: "Clinician",
      content:
        "Thursday at 2:00 PM works for me. I'll coordinate with Brian and his guardian.",
      status: "read",
      createdAt: "2026-08-30T10:50:00Z",
    },
  ],
  "conv-003": [
    {
      id: "msg-008",
      conversationId: "conv-003",
      senderId: "user-001",
      senderName: "Brian Otieno",
      senderRole: "Athlete",
      content:
        "Hi Coach! Just confirming - practice is at 3:00 PM today, right?",
      status: "read",
      createdAt: "2026-08-30T08:00:00Z",
    },
    {
      id: "msg-009",
      conversationId: "conv-003",
      senderId: "user-003",
      senderName: "Peter Kamau",
      senderRole: "Coach",
      content:
        "Hi Brian! Yes, 3:00 PM sharp. Don't forget your water bottle and shin guards.",
      status: "read",
      createdAt: "2026-08-30T08:15:00Z",
    },
    {
      id: "msg-010",
      conversationId: "conv-003",
      senderId: "user-003",
      senderName: "Peter Kamau",
      senderRole: "Coach",
      content:
        "Also, we're focusing on set pieces today. Make sure you've reviewed last week's video.",
      status: "delivered",
      createdAt: "2026-08-30T10:45:00Z",
    },
    {
      id: "msg-011",
      conversationId: "conv-003",
      senderId: "user-003",
      senderName: "Peter Kamau",
      senderRole: "Coach",
      content: "See you on the pitch! ⚽",
      status: "delivered",
      createdAt: "2026-08-30T10:46:00Z",
    },
  ],
  "conv-004": [
    {
      id: "msg-012",
      conversationId: "conv-004",
      senderId: "user-002",
      senderName: "Jane Otieno",
      senderRole: "Guardian",
      content:
        "Good afternoon. I wanted to confirm Brian's participation status for the upcoming tournament.",
      status: "read",
      createdAt: "2026-08-29T16:00:00Z",
    },
    {
      id: "msg-013",
      conversationId: "conv-004",
      senderId: "user-006",
      senderName: "John Doe",
      senderRole: "Institution",
      content:
        "Good afternoon Mrs. Otieno. Brian's medical clearance is up to date and he's registered for the tournament. All documentation has been submitted.",
      status: "read",
      createdAt: "2026-08-30T09:00:00Z",
    },
  ],
  "conv-005": [
    {
      id: "msg-014",
      conversationId: "conv-005",
      senderId: "user-004",
      senderName: "Dr. Sarah Njeri",
      senderRole: "Clinician",
      content:
        "Hi Brian, I've reviewed your latest health screening results. Everything looks good!",
      status: "read",
      createdAt: "2026-08-29T08:15:00Z",
    },
    {
      id: "msg-015",
      conversationId: "conv-005",
      senderId: "user-001",
      senderName: "Brian Otieno",
      senderRole: "Athlete",
      senderAvatar: "/avatars/brian.jpg",
      content: "That's great news! Thank you Dr. Njeri 😊",
      status: "read",
      createdAt: "2026-08-29T08:20:00Z",
    },
    {
      id: "msg-016",
      conversationId: "conv-005",
      senderId: "user-004",
      senderName: "Dr. Sarah Njeri",
      senderRole: "Clinician",
      content: "Here's your movement screening form for reference:",
      attachments: [
        {
          id: "att-002",
          messageId: "msg-016",
          type: "document",
          fileName: "movement-screening-brian-2026.pdf",
          fileSize: 1850000,
          fileType: "application/pdf",
          url: "/mock/movement-screening.pdf",
          uploadStatus: "uploaded",
          createdAt: "2026-08-30T10:00:00Z",
        },
      ],
      status: "read",
      createdAt: "2026-08-30T10:00:00Z",
    },
    {
      id: "msg-017",
      conversationId: "conv-005",
      senderId: "user-001",
      senderName: "Brian Otieno",
      senderRole: "Athlete",
      senderAvatar: "/avatars/brian.jpg",
      content:
        "Will do! Coach Peter has been helping me with them during practice.",
      status: "read",
      createdAt: "2026-08-30T10:15:00Z",
    },
    {
      id: "msg-018",
      conversationId: "conv-005",
      senderId: "user-004",
      senderName: "Dr. Sarah Njeri",
      senderRole: "Clinician",
      content:
        "Perfect! Let me know if you experience any discomfort during training.",
      status: "read",
      createdAt: "2026-08-30T11:00:00Z",
    },
    {
      id: "msg-019",
      conversationId: "conv-005",
      senderId: "user-001",
      senderName: "Brian Otieno",
      senderRole: "Athlete",
      senderAvatar: "/avatars/brian.jpg",
      content:
        "Thank you Dr. Njeri! I'll make sure to do the stretches before training.",
      status: "read",
      createdAt: "2026-08-30T11:30:00Z",
    },
    {
      id: "msg-020",
      conversationId: "conv-005",
      senderId: "user-001",
      senderName: "Brian Otieno",
      senderRole: "Athlete",
      senderAvatar: "/avatars/brian.jpg",
      content: "",
      attachments: [
        {
          id: "att-003",
          messageId: "msg-020",
          type: "image",
          fileName: "warm-up-routine.jpg",
          fileSize: 2400000,
          fileType: "image/jpeg",
          url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
          uploadStatus: "uploaded",
          createdAt: "2026-08-30T11:45:00Z",
        },
      ],
      status: "read",
      createdAt: "2026-08-30T11:45:00Z",
    },
  ],
  "family-group": [
    {
      id: "msg-group-001",
      conversationId: "family-group",
      senderId: "user-006",
      senderName: "John Doe",
      senderRole: "Institution",
      content:
        "Good evening everyone! Just a reminder that our SafeSport training session is scheduled for next Monday at 3 PM.",
      status: "read",
      createdAt: "2026-08-28T08:00:00Z",
    },
    {
      id: "msg-group-002",
      conversationId: "family-group",
      senderId: "user-003",
      senderName: "Peter Kamau",
      senderRole: "Coach",
      content:
        "Thanks for the reminder! I'll adjust training schedule to ensure all athletes can attend.",
      status: "read",
      createdAt: "2026-08-28T08:30:00Z",
    },
    {
      id: "msg-group-003",
      conversationId: "family-group",
      senderId: "user-004",
      senderName: "Dr. Sarah Njeri",
      senderRole: "Clinician",
      content:
        "I've completed health screenings for Brian and David. Both are cleared for full participation.",
      status: "read",
      createdAt: "2026-08-29T10:00:00Z",
    },
    {
      id: "msg-group-004",
      conversationId: "family-group",
      senderId: "user-002",
      senderName: "Jane Otieno",
      senderRole: "Guardian",
      content: "Thank you Dr. Njeri! Brian mentioned the screening went well.",
      status: "read",
      createdAt: "2026-08-29T11:15:00Z",
    },
    {
      id: "msg-group-005",
      conversationId: "family-group",
      senderId: "user-008",
      senderName: "Grace Mwangi",
      senderRole: "Operations",
      content:
        "Reminder: Tournament registration closes this Friday. Please ensure all documentation is submitted.",
      status: "delivered",
      createdAt: "2026-08-30T11:45:00Z",
    },
  ],
};

// ==================================================
// HELPER FUNCTIONS
// ==================================================

export function getConversationParticipants(
  conversationId: string,
): FamilyMember[] {
  const conversation = mockConversations.find((c) => c.id === conversationId);
  if (!conversation) return [];

  return conversation.participants
    .map((p) => mockFamilyMembers.find((m) => m.id === p.userId))
    .filter((m): m is FamilyMember => m !== undefined);
}

export function getConversationMessages(conversationId: string): Message[] {
  return mockMessages[conversationId] || [];
}

export function getUserConversations(
  userId: UserID,
  familyId?: string,
): Conversation[] {
  return mockConversations.filter((conv) => {
    const isParticipant = conv.participants.some((p) => p.userId === userId);
    const inFamily = familyId ? conv.familyId === familyId : true;
    return isParticipant && inFamily;
  });
}

export function getFamilyMembers(familyId: string): FamilyMember[] {
  return mockFamilyMembers.filter((m) => m.familyId === familyId);
}

export function searchFamilyMembers(
  familyId: string,
  query: string,
): FamilyMember[] {
  const members = getFamilyMembers(familyId);
  const lowerQuery = query.toLowerCase();

  return members.filter(
    (m) =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(lowerQuery) ||
      m.role.toLowerCase().includes(lowerQuery) ||
      m.team?.toLowerCase().includes(lowerQuery),
  );
}
