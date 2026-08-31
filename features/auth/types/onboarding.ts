// SafeSport Onboarding Types

export type OnboardingRole = "athlete" | "guardian" | "institution";
export type InstitutionType = "school" | "club" | "academy";
export type GuardianRelationship = "parent" | "legal_guardian" | "other";

export interface AthleteOnboardingData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  institutionId: string;
  institutionName: string;
  sportId: string;
  sportName: string;
  teamId: string;
  teamName: string;
  position?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface GuardianOnboardingData {
  firstName: string;
  lastName: string;
  relationship: GuardianRelationship;
  athleteId: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface InstitutionRequestData {
  type: InstitutionType;
  name: string;
  city: string;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
}
