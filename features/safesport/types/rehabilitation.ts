// Rehabilitation Types for SafeSport™ Physiotherapy Module

import type { SafeSportID, UserID } from "./index";

// Rehabilitation Status
export type RehabilitationStatus =
  | "active"
  | "on_track"
  | "needs_attention"
  | "review_due"
  | "reassessment_due"
  | "paused"
  | "completed";

// Reassessment Trigger Types (from SafeSport documentation)
export type ReassessmentTrigger =
  | "new_significant_injury"
  | "hospitalization"
  | "new_chronic_diagnosis"
  | "medication_change"
  | "cardiovascular_symptoms"
  | "neurologic_symptoms"
  | "prolonged_absence"
  | "rehabilitation_completion"
  | "sport_level_change"
  | "clinician_defined";

// Session Status
export type SessionStatus = "scheduled" | "completed" | "cancelled" | "missed";

// Progress Review Status
export type ProgressReviewStatus = "pending" | "in_progress" | "completed";

// Rehabilitation Plan
export interface RehabilitationPlan {
  id: string;
  athleteId: SafeSportID;
  athleteName: string;
  
  // Plan details
  focus: string; // e.g., "Lower-limb rehabilitation"
  relatedInjury?: string;
  relatedFinding?: string;
  relatedReferralId?: string;
  relatedScreeningId?: string;
  
  // Status and progress
  status: RehabilitationStatus;
  progress: number; // 0-100
  
  // Timeline
  startDate: string;
  targetCompletionDate?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  nextReassessmentDate?: string;
  completedDate?: string;
  
  // Assignment
  assignedPhysiotherapistId: UserID;
  assignedPhysiotherapistName: string;
  
  // Sessions
  totalSessions: number;
  completedSessions: number;
  
  // Goals/milestones
  goals?: string[];
  currentMilestone?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Rehabilitation Session
export interface RehabilitationSession {
  id: string;
  planId: string;
  athleteId: SafeSportID;
  
  // Session details
  scheduledDate: string;
  completedDate?: string;
  status: SessionStatus;
  
  // Progress
  progressNote?: string;
  sessionNumber: number;
  
  // Next action
  nextAction?: string;
  
  // Metadata
  conductedBy: UserID;
  conductedByName: string;
  createdAt: string;
  updatedAt: string;
}

// Progress Review
export interface ProgressReview {
  id: string;
  planId: string;
  athleteId: SafeSportID;
  
  // Review details
  reviewDate: string;
  previousReviewDate?: string;
  status: ProgressReviewStatus;
  
  // Progress assessment
  progressSummary: string;
  functionalFindings?: string;
  currentProgress: number; // 0-100
  previousProgress?: number;
  
  // Next steps
  nextStep: string;
  recommendedAction?: string;
  
  // Reviewer
  reviewedBy: UserID;
  reviewedByName: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Reassessment
export interface Reassessment {
  id: string;
  planId: string;
  athleteId: SafeSportID;
  athleteName: string;
  
  // Reassessment details
  scheduledDate: string;
  completedDate?: string;
  status: "scheduled" | "overdue" | "in_progress" | "completed";
  
  // Reason and context
  trigger: ReassessmentTrigger;
  reason: string;
  relatedPlanFocus: string;
  
  // Assessment
  previousStatus?: RehabilitationStatus;
  currentPlanStatus: RehabilitationStatus;
  functionalFindings?: string;
  movementFindings?: string;
  
  // Next steps
  nextReviewDate?: string;
  recommendation?: string;
  
  // Assignment
  assignedTo: UserID;
  assignedToName: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Rehabilitation Activity Event
export interface RehabilitationActivity {
  id: string;
  planId: string;
  athleteId: SafeSportID;
  
  // Event details
  type:
    | "plan_created"
    | "session_completed"
    | "progress_review"
    | "status_updated"
    | "reassessment_scheduled"
    | "plan_paused"
    | "plan_resumed"
    | "plan_completed";
  
  description: string;
  timestamp: string;
  
  // Actor
  performedBy?: UserID;
  performedByName?: string;
}

// Needs Attention Item
export interface NeedsAttentionItem {
  id: string;
  athleteId: SafeSportID;
  athleteName: string;
  planId: string;
  
  // Attention details
  reason: string;
  category: "reassessment_due" | "no_progress_update" | "referral_followup" | "status_change" | "overdue";
  priority: "high" | "medium" | "low";
  dueDate?: string;
  daysOverdue?: number;
  
  // Action
  actionRequired: string;
  
  // Metadata
  createdAt: string;
}
