// SafeSport™ Messaging Types
// Institution-based family communication system

import type { SafeSportID, OrganizationID, UserID } from "./index"

// ==================================================
// FAMILY (Institution-based communication scope)
// ==================================================

export interface Family {
  id: string
  organizationId: OrganizationID
  name: string // e.g., "Green Valley Academy"
  logo?: string
  memberCount: number
  createdAt: string
}

export interface FamilyMember {
  id: UserID
  familyId: string
  firstName: string
  lastName: string
  role: "athlete" | "guardian" | "coach" | "clinician" | "physiotherapist" | "institution" | "operations" | "sys-admin"
  avatar?: string
  team?: string
  status: "online" | "away" | "offline"
  lastSeen?: string
}

// ==================================================
// CONVERSATION
// ==================================================

export interface Conversation {
  id: string
  familyId: string
  type: "direct" | "group" | "family"
  participants: ConversationParticipant[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
  // Optional context linking
  contextType?: "athlete" | "referral" | "incident" | "screening" | "event"
  contextId?: SafeSportID
  contextLabel?: string
}

export interface ConversationParticipant {
  userId: UserID
  joinedAt: string
  lastReadAt?: string
}

// ==================================================
// MESSAGE
// ==================================================

export interface Message {
  id: string
  conversationId: string
  senderId: UserID
  senderName: string
  senderAvatar?: string
  senderRole: string
  content: string
  attachments?: Attachment[]
  replyTo?: {
    messageId: string
    senderName: string
    content: string
    isCurrentUser: boolean
  }
  status: "sending" | "sent" | "delivered" | "read" | "failed"
  createdAt: string
  updatedAt?: string
}

// ==================================================
// ATTACHMENT
// ==================================================

export interface Attachment {
  id: string
  messageId: string
  type: "image" | "document" | "video"
  fileName: string
  fileSize: number
  fileType: string // MIME type
  url: string
  thumbnailUrl?: string
  duration?: number // For videos (seconds)
  width?: number // For images/videos
  height?: number // For images/videos
  uploadStatus: "preparing" | "uploading" | "uploaded" | "failed"
  uploadProgress?: number
  createdAt: string
}

// ==================================================
// MESSAGING PERMISSIONS
// ==================================================

export interface MessagingPermissions {
  canMessageCoaches: boolean
  canMessageClinicians: boolean
  canMessagePhysiotherapists: boolean
  canMessageAthletes: boolean
  canMessageGuardians: boolean
  canMessageInstitution: boolean
  canMessageOperations: boolean
  canAccessFamily: boolean
}
