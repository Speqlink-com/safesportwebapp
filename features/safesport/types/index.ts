// SafeSport™ Domain Types
// These types represent the core SafeSport entities and workflows

export type SafeSportID = string;
export type UserID = string;
export type OrganizationID = string;
export type TeamID = string;

// ==================================================
// ATHLETE
// ==================================================

export interface Athlete {
  id: SafeSportID;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: "male" | "female" | "other";
  photo?: string;
  
  // Current context
  currentOrganization?: Organization;
  currentTeam?: Team;
  currentSport?: Sport;
  
  // Status
  eligibilityStatus: EligibilityStatus;
  readiness: ReadinessStatus;
  nextReview?: string;
  
  // Relationships
  organizations: AthleteOrganization[];
  teams: AthleteTeam[];
  guardians?: Guardian[];
  
  // Records
  ppeAssessments: PPEAssessment[];
  incidents: Incident[];
  screenings: MovementScreening[];
  referrals: Referral[];
  eligibilityHistory: EligibilityDecision[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface AthleteOrganization {
  organizationId: OrganizationID;
  organization: Organization;
  joinedAt: string;
  status: "active" | "inactive";
}

export interface AthleteTeam {
  teamId: TeamID;
  team: Team;
  sport: Sport;
  position?: string;
  joinedAt: string;
  status: "active" | "inactive";
}

// ==================================================
// ORGANIZATION & TEAM
// ==================================================

export interface Organization {
  id: OrganizationID;
  name: string;
  type: "school" | "club" | "academy" | "professional" | "medical";
  logo?: string;
}

export interface Team {
  id: TeamID;
  name: string;
  ageGroup: string;
  sport: Sport;
  organizationId: OrganizationID;
}

export interface Sport {
  id: string;
  name: string;
  category: "football" | "rugby" | "netball" | "athletics" | "basketball" | "swimming" | "other";
}

// ==================================================
// GUARDIAN
// ==================================================

export interface Guardian {
  id: UserID;
  firstName: string;
  lastName: string;
  relationship: "parent" | "legal_guardian" | "other";
  email: string;
  phone: string;
}

// ==================================================
// ELIGIBILITY
// ==================================================

export type EligibilityStatus =
  | "cleared"
  | "cleared_with_monitoring"
  | "pending_evaluation"
  | "sport_specific_restriction"
  | "temporarily_not_cleared"
  | "not_cleared";

export type ReadinessStatus =
  | "ready"
  | "ready_with_restrictions"
  | "not_ready"
  | "under_review";

export interface EligibilityDecision {
  id: string;
  athleteId: SafeSportID;
  clinicianId: UserID;
  clinicianName: string;
  status: EligibilityStatus;
  restrictions?: string[];
  monitoringNotes?: string;
  reviewDate?: string;
  decisionDate: string;
  relatedPPE?: string;
  relatedIncident?: string;
}

// ==================================================
// PPE / PHPA
// ==================================================

export interface PPEAssessment {
  id: string;
  athleteId: SafeSportID;
  clinicianId: UserID;
  clinicianName: string;
  assessmentDate: string;
  status: PPEStatus;
  
  // Workflow stages
  consent: ConsentStatus;
  history: HistoryStatus;
  examination: ExaminationStatus;
  baseline: BaselineStatus;
  movementScreening?: "not_applicable" | "pending" | "complete";
  
  // Outcomes
  eligibilityDecision?: EligibilityDecision;
  referrals: string[]; // referral IDs
  certificate?: Certificate;
  
  // Flags
  reviewFlags: ReviewFlag[];
  
  createdAt: string;
  updatedAt: string;
}

export type PPEStatus =
  | "not_started"
  | "in_progress"
  | "needs_review"
  | "complete"
  | "blocked";

export type ConsentStatus = "pending" | "provided" | "declined";
export type HistoryStatus = "not_started" | "in_progress" | "complete";
export type ExaminationStatus = "not_started" | "in_progress" | "complete";
export type BaselineStatus = "not_started" | "in_progress" | "complete";

export interface ReviewFlag {
  type: "cardiovascular" | "neurologic" | "musculoskeletal" | "respiratory" | "mental_health" | "other";
  severity: "low" | "moderate" | "high";
  description: string;
  resolved: boolean;
}

// ==================================================
// INCIDENT
// ==================================================

export interface Incident {
  id: string;
  athleteId: SafeSportID;
  clinicianId: UserID;
  clinicianName: string;
  
  incidentDate: string;
  location: string;
  sport: Sport;
  
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  treatment?: string;
  
  photoEvidence?: string[];
  
  // Follow-up
  referralCreated: boolean;
  referralId?: string;
  
  createdAt: string;
}

export type IncidentType =
  | "acute_injury"
  | "concussion"
  | "sprain_strain"
  | "fracture"
  | "overuse"
  | "medical_emergency"
  | "other";

export type IncidentSeverity = "minor" | "moderate" | "severe" | "emergency";

// ==================================================
// MOVEMENT SCREENING & AI
// ==================================================

export interface MovementScreening {
  id: string;
  athleteId: SafeSportID;
  performedBy: UserID;
  performedByName: string;
  
  drill: MovementDrill;
  videoUrl?: string;
  videoQuality: "pending" | "pass" | "fail";
  
  status: ScreeningStatus;
  
  // AI Processing
  aiProcessing?: AIProcessing;
  aiResult?: AIResult;
  
  // Human Review
  reviewedBy?: UserID;
  reviewedByName?: string;
  reviewDate?: string;
  clinicalInterpretation?: string;
  reviewerAction?: ReviewerAction;
  
  createdAt: string;
}

export type MovementDrill =
  | "jump_landing"
  | "single_leg_squat"
  | "sprint_acceleration"
  | "cutting_maneuver"
  | "kicking_mechanics";

export type ScreeningStatus =
  | "draft"
  | "uploading"
  | "processing"
  | "quality_failed"
  | "ready_for_review"
  | "reviewed"
  | "included_in_report";

export interface AIProcessing {
  startedAt: string;
  completedAt?: string;
  status: "processing" | "complete" | "failed";
  modelVersion: string;
}

export interface AIResult {
  riskLevel: "low" | "moderate" | "high";
  confidence: number; // 0-1
  metrics: {
    kneeValgusAngle?: number;
    trunkLean?: number;
    limbSymmetryIndex?: number;
    stabilizationTime?: number;
  };
  processingTimestamp: string;
  modelVersion: string;
}

export type ReviewerAction =
  | "no_action"
  | "prevention_program"
  | "physiotherapy_referral"
  | "further_assessment"
  | "other";

// ==================================================
// REFERRAL
// ==================================================

export interface Referral {
  id: string;
  athleteId: SafeSportID;
  createdBy: UserID;
  createdByName: string;
  
  type: ReferralType;
  reason: string;
  urgency: ReferralUrgency;
  
  // Assignment
  assignedTo?: UserID;
  assignedToName?: string;
  providerFacility?: string;
  
  // Timeline
  createdAt: string;
  appointmentDate?: string;
  closedAt?: string;
  closedBy?: UserID;
  
  // Status & Outcome
  status: ReferralStatus;
  outcome?: ReferralOutcome;
  evidence?: string;
  
  // Related records
  relatedPPE?: string;
  relatedIncident?: string;
}

export type ReferralType =
  | "sports_physician"
  | "physiotherapy"
  | "orthopaedics"
  | "cardiology"
  | "neurology"
  | "respiratory"
  | "mental_health"
  | "nutrition"
  | "ophthalmology"
  | "other";

export type ReferralUrgency = "routine" | "priority" | "urgent" | "emergency";

export type ReferralStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "overdue"
  | "completed";

export type ReferralOutcome =
  | "pending"
  | "completed"
  | "further_referral"
  | "cleared"
  | "restricted";

// ==================================================
// CERTIFICATE
// ==================================================

export interface Certificate {
  id: string;
  athleteId: SafeSportID;
  athleteName: string;
  
  institution: string;
  sport: string;
  position?: string;
  
  assessmentDate: string;
  eligibilityStatus: EligibilityStatus;
  restrictions?: string[];
  monitoringNotes?: string;
  followUpDate?: string;
  
  clinicianName: string;
  clinicianDesignation: string;
  
  issuedAt: string;
}

// ==================================================
// SCHEDULE & EVENTS
// ==================================================

export interface ScheduleEvent {
  id: string;
  title: string;
  type: "ppe" | "screening" | "reassessment" | "referral" | "team_event" | "other";
  
  athleteId?: SafeSportID;
  athleteName?: string;
  
  clinicianId?: UserID;
  clinicianName?: string;
  
  startTime: string;
  endTime: string;
  location?: string;
  
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes?: string;
}

// ==================================================
// NOTIFICATION
// ==================================================

export interface Notification {
  id: string;
  userId: UserID;
  type: NotificationType;
  
  title: string;
  message: string;
  
  priority: "low" | "normal" | "high" | "urgent";
  
  // Related entity
  relatedEntityType?: "athlete" | "ppe" | "incident" | "referral" | "screening";
  relatedEntityId?: string;
  
  read: boolean;
  actionUrl?: string;
  
  createdAt: string;
}

export type NotificationType =
  | "clinical_review"
  | "referral"
  | "scheduling"
  | "ppe"
  | "eligibility"
  | "reassessment"
  | "incident"
  | "ai_review"
  | "system"
  | "message";

// ==================================================
// TIMELINE
// ==================================================

export interface TimelineEvent {
  id: string;
  athleteId: SafeSportID;
  
  type: string;
  title: string;
  description: string;
  
  timestamp: string;
  
  // Related entity
  relatedEntityType?: string;
  relatedEntityId?: string;
  
  // Actor
  actorId?: UserID;
  actorName?: string;
  actorRole?: string;
}
