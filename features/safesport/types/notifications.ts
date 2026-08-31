// SafeSport™ Notification Types
// Shared notification system for all SafeSport roles

export type NotificationID = string;
export type UserID = string;
export type SafeSportID = string;

// ==================================================
// NOTIFICATION CATEGORIES
// ==================================================

export type NotificationCategory =
  | "clinical"
  | "referral"
  | "assessment"
  | "screening"
  | "ai_review"
  | "eligibility"
  | "rehabilitation"
  | "scheduling"
  | "incident"
  | "team"
  | "institution"
  | "account"
  | "system"
  | "message";

// ==================================================
// NOTIFICATION PRIORITY
// ==================================================

export type NotificationPriority = "normal" | "important" | "urgent";

// ==================================================
// NOTIFICATION STATUS
// ==================================================

export type NotificationStatus = "unread" | "read";

// ==================================================
// SAFESPORT ROLES
// ==================================================

export type SafeSportRole =
  | "athlete"
  | "guardian"
  | "clinician"
  | "physiotherapist"
  | "coach"
  | "institution"
  | "operations"
  | "sys_admin";

// ==================================================
// NOTIFICATION
// ==================================================

export interface SafeSportNotification {
  id: NotificationID;
  
  // Target
  userId: UserID;
  role: SafeSportRole;
  
  // Content
  category: NotificationCategory;
  title: string;
  description: string;
  
  // Priority & Status
  priority: NotificationPriority;
  status: NotificationStatus;
  
  // Related Entity
  relatedEntityType?: "athlete" | "ppe" | "incident" | "referral" | "screening" | "event" | "message";
  relatedEntityId?: string;
  relatedAthleteId?: SafeSportID;
  relatedAthleteName?: string;
  
  // Navigation
  actionUrl?: string;
  
  // Metadata
  createdAt: string;
  readAt?: string;
}

// ==================================================
// NOTIFICATION FILTERS
// ==================================================

export interface NotificationFilters {
  status?: "all" | "unread" | "important";
  category?: NotificationCategory;
  search?: string;
}

// ==================================================
// NOTIFICATION STATS
// ==================================================

export interface NotificationStats {
  total: number;
  unread: number;
  important: number;
  urgent: number;
}

// ==================================================
// NOTIFICATION EVENT
// ==================================================

export type NotificationEventType =
  | "PPE_COMPLETED"
  | "PPE_DUE"
  | "CLINICAL_REVIEW_REQUIRED"
  | "AI_REVIEW_READY"
  | "AI_REVIEW_COMPLETED"
  | "INCIDENT_CREATED"
  | "REFERRAL_CREATED"
  | "REFERRAL_ASSIGNED"
  | "REFERRAL_OVERDUE"
  | "REFERRAL_COMPLETED"
  | "REASSESSMENT_DUE"
  | "ELIGIBILITY_UPDATED"
  | "CERTIFICATE_ISSUED"
  | "SCREENING_SCHEDULED"
  | "SCREENING_READY"
  | "REHABILITATION_UPDATE"
  | "SCHEDULE_CHANGED"
  | "EVENT_REMINDER"
  | "APPOINTMENT_CHANGED"
  | "PARTICIPATION_STATUS_CHANGED"
  | "RESTRICTION_UPDATED"
  | "MESSAGE_RECEIVED"
  | "CONSENT_REQUIRED"
  | "QUESTIONNAIRE_REQUIRED"
  | "SYSTEM_ALERT"
  | "USER_INVITATION";

export interface NotificationEvent {
  type: NotificationEventType;
  userId: UserID;
  role: SafeSportRole;
  data: Record<string, unknown>;
  timestamp: string;
}
