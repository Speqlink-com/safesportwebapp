// SafeSport™ Athlete Onboarding Types
// Progressive profile completion and PPE preparation

export type OnboardingStepId =
  | "profile"
  | "emergency_contact"
  | "guardian"
  | "participation"
  | "questionnaire"
  | "consent"
  | "ready";

export type OnboardingStepStatus = "not_started" | "in_progress" | "complete" | "not_applicable";

export type OnboardingState =
  | "not_started"
  | "in_progress"
  | "profile_incomplete"
  | "questionnaire_incomplete"
  | "consent_required"
  | "ready_for_ppe"
  | "ppe_scheduled"
  | "ppe_in_progress"
  | "ppe_complete";

// ==================================================
// PROFILE COMPLETION
// ==================================================

export interface ProfileSection {
  id: string;
  name: string;
  status: OnboardingStepStatus;
  fields: string[];
  completedFields: string[];
}

export interface OnboardingProgress {
  overall: number; // 0-100 percentage
  sections: {
    profile: OnboardingStepStatus;
    emergency: OnboardingStepStatus;
    guardian: OnboardingStepStatus;
    participation: OnboardingStepStatus;
    questionnaire: OnboardingStepStatus;
    consent: OnboardingStepStatus;
  };
  nextStep?: OnboardingStepId;
  isComplete: boolean;
}

// ==================================================
// BASIC PROFILE
// ==================================================

export interface AthleteProfile {
  // From signup - already captured
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  
  // Additional profile fields
  sex?: "male" | "female" | "other";
  photo?: string;
  
  // Calculated
  age?: number;
  isMinor?: boolean;
}

// ==================================================
// EMERGENCY CONTACT
// ==================================================

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  alternativePhone?: string;
}

// ==================================================
// GUARDIAN
// ==================================================

export interface GuardianInfo {
  guardianId?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  relationship: "parent" | "legal_guardian" | "other";
  isLinked: boolean;
  consentProvided?: boolean;
}

// ==================================================
// PARTICIPATION
// ==================================================

export interface ParticipationDetails {
  institutionId: string;
  institutionName: string;
  teamId?: string;
  teamName?: string;
  sportId: string;
  sportName: string;
  position?: string;
  event?: string;
  primarySport: boolean;
}

// ==================================================
// PRE-PPE HEALTH QUESTIONNAIRE
// ==================================================

export type QuestionnaireResponse = "yes" | "no" | "unknown";

export interface QuestionnaireQuestion {
  id: string;
  domain: QuestionnaireDomain;
  question: string;
  response?: QuestionnaireResponse;
  followUp?: QuestionnaireFollowUp;
  sensitive?: boolean;
  preferPrivate?: boolean;
}

export type QuestionnaireDomain =
  | "cardiovascular"
  | "family_cardiac"
  | "respiratory"
  | "neurologic"
  | "musculoskeletal"
  | "general_medical"
  | "allergy"
  | "medication"
  | "vision_hearing"
  | "skin_infection"
  | "mental_health"
  | "female_athlete"
  | "previous_restriction";

export interface QuestionnaireFollowUp {
  condition?: string;
  bodyRegion?: string;
  dateOnset?: string;
  symptoms?: string;
  treatment?: string;
  investigations?: string;
  specialist?: string;
  currentStatus?: string;
  medication?: string;
  rehabilitation?: string;
  previousDecision?: string;
  details?: string;
}

export interface HealthQuestionnaire {
  cardiovascular: QuestionnaireQuestion[];
  familyCardiac: QuestionnaireQuestion[];
  respiratory: QuestionnaireQuestion[];
  neurologic: QuestionnaireQuestion[];
  musculoskeletal: QuestionnaireQuestion[];
  generalMedical: QuestionnaireQuestion[];
  allergy: QuestionnaireQuestion[];
  medication: QuestionnaireQuestion[];
  visionHearing: QuestionnaireQuestion[];
  skinInfection: QuestionnaireQuestion[];
  mentalHealth: QuestionnaireQuestion[];
  femaleAthlete: QuestionnaireQuestion[];
  previousRestriction: QuestionnaireQuestion[];
  completedAt?: string;
  reviewFlags: ReviewFlag[];
}

export interface ReviewFlag {
  domain: QuestionnaireDomain;
  severity: "low" | "moderate" | "high";
  description: string;
  requiresFollowUp: boolean;
}

// ==================================================
// CONSENT
// ==================================================

export interface ConsentRecord {
  id: string;
  type: ConsentType;
  version: string;
  providedBy: string; // athleteId or guardianId
  providedByRole: "athlete" | "guardian";
  scope: string[];
  providedAt: string;
  signature?: string;
  withdrawn?: boolean;
  withdrawnAt?: string;
}

export type ConsentType =
  | "clinical_assessment"
  | "video_consent"
  | "research_participation"
  | "ai_model_improvement"
  | "data_sharing";

export interface ConsentStatus {
  clinicalRequired: boolean;
  clinicalProvided: boolean;
  videoProvided: boolean;
  researchOptIn: boolean;
  aiOptIn: boolean;
  consents: ConsentRecord[];
}

// ==================================================
// ONBOARDING DATA
// ==================================================

export interface AthleteOnboardingData {
  athleteId: string;
  state: OnboardingState;
  progress: OnboardingProgress;
  
  profile: AthleteProfile;
  emergencyContact?: EmergencyContact;
  guardian?: GuardianInfo;
  participation: ParticipationDetails;
  questionnaire?: HealthQuestionnaire;
  consent?: ConsentStatus;
  
  startedAt: string;
  lastUpdatedAt: string;
  readyForPPEAt?: string;
}

// ==================================================
// PPE READINESS
// ==================================================

export interface PPEReadiness {
  athleteId: string;
  athleteName: string;
  isReady: boolean;
  readyAt?: string;
  blockers: string[];
  status: "not_ready" | "ready" | "scheduled" | "in_progress" | "complete";
  scheduledDate?: string;
  clinicianId?: string;
  clinicianName?: string;
}
