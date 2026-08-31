"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheckIcon, 
  VideoIcon, 
  FlaskConicalIcon, 
  BrainCircuitIcon,
  AlertCircleIcon,
  CheckCircle2Icon 
} from "lucide-react";
import type { AthleteOnboardingData } from "../../../types/onboarding";

interface ConsentStepProps {
  data: AthleteOnboardingData;
  onUpdate: (data: AthleteOnboardingData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ConsentStep({ data, onUpdate }: ConsentStepProps) {
  const [clinicalConsent, setClinicalConsent] = useState(
    data.consent?.clinicalProvided || false
  );
  const [videoConsent, setVideoConsent] = useState(
    data.consent?.videoProvided || false
  );
  const [researchOptIn, setResearchOptIn] = useState(
    data.consent?.researchOptIn || false
  );
  const [aiOptIn, setAiOptIn] = useState(
    data.consent?.aiOptIn || false
  );

  const handleClinicalConsent = (checked: boolean) => {
    setClinicalConsent(checked);
    onUpdate({
      ...data,
      consent: {
        ...(data.consent || {
          clinicalRequired: true,
          clinicalProvided: false,
          videoProvided: false,
          researchOptIn: false,
          aiOptIn: false,
          consents: [],
        }),
        clinicalProvided: checked,
        consents: checked
          ? [
              {
                id: `consent-${Date.now()}`,
                type: "clinical_assessment",
                version: "1.0",
                providedBy: data.athleteId,
                providedByRole: "athlete",
                scope: ["clinical_assessment", "medical_history"],
                providedAt: new Date().toISOString(),
              },
            ]
          : [],
      },
    });
  };

  const handleVideoConsent = (checked: boolean) => {
    setVideoConsent(checked);
    onUpdate({
      ...data,
      consent: {
        ...(data.consent || {
          clinicalRequired: true,
          clinicalProvided: false,
          videoProvided: false,
          researchOptIn: false,
          aiOptIn: false,
          consents: [],
        }),
        videoProvided: checked,
      },
    });
  };

  const handleResearchOptIn = (checked: boolean) => {
    setResearchOptIn(checked);
    onUpdate({
      ...data,
      consent: {
        ...(data.consent || {
          clinicalRequired: true,
          clinicalProvided: false,
          videoProvided: false,
          researchOptIn: false,
          aiOptIn: false,
          consents: [],
        }),
        researchOptIn: checked,
      },
    });
  };

  const handleAiOptIn = (checked: boolean) => {
    setAiOptIn(checked);
    onUpdate({
      ...data,
      consent: {
        ...(data.consent || {
          clinicalRequired: true,
          clinicalProvided: false,
          videoProvided: false,
          researchOptIn: false,
          aiOptIn: false,
          consents: [],
        }),
        aiOptIn: checked,
      },
    });
  };

  const isMinor = data.profile.isMinor;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Consent & Privacy</h2>
            <p className="text-sm text-muted-foreground">
              Before your clinical assessment, please review and provide the required consents.
            </p>
          </div>

          {isMinor && (
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
              <div className="flex gap-3">
                <AlertCircleIcon className="size-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-500 dark:text-amber-400">
                    Guardian consent required
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Since you are under 18, your guardian will also need to provide consent before your clinical assessment can proceed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* REQUIRED: Clinical Assessment Consent */}
          <Card className="border-primary/50 bg-card">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <ShieldCheckIcon className="size-6 text-primary shrink-0 mt-1" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Clinical Assessment Consent</h3>
                    <Badge variant="destructive" className="text-xs">Required</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    I consent to participate in a pre-participation physical evaluation (PPE). I understand that this assessment includes:
                  </p>
                  
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Review of my medical history and health questionnaire</li>
                    <li>Physical examination by a qualified clinician</li>
                    <li>Functional movement assessment where appropriate</li>
                    <li>Sport-specific assessments where indicated</li>
                    <li>Discussion of findings and recommendations</li>
                  </ul>

                  <p className="text-sm text-muted-foreground">
                    I understand that this assessment is designed to identify conditions that may affect my safe participation in sports. I agree to provide accurate health information and follow recommended medical advice.
                  </p>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="clinical-consent"
                      checked={clinicalConsent}
                      onCheckedChange={handleClinicalConsent}
                    />
                    <Label
                      htmlFor="clinical-consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I have read and agree to the clinical assessment consent
                    </Label>
                  </div>

                  {clinicalConsent && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <CheckCircle2Icon className="size-4" />
                      <span>Consent provided</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* OPTIONAL: Video Recording Consent */}
          <Card className="border-muted bg-card">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <VideoIcon className="size-6 text-muted-foreground shrink-0 mt-1" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Movement Screening Video Consent</h3>
                    <Badge variant="outline" className="text-xs">Optional</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    If movement screening is recommended, video recording may be used to:
                  </p>
                  
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Analyze movement patterns and biomechanics</li>
                    <li>Support AI-assisted movement analysis</li>
                    <li>Track progress over time</li>
                    <li>Facilitate specialist review if needed</li>
                  </ul>

                  <p className="text-sm text-muted-foreground">
                    Videos are stored securely and only accessible to authorized clinical staff. They are not shared publicly.
                  </p>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="video-consent"
                      checked={videoConsent}
                      onCheckedChange={handleVideoConsent}
                    />
                    <Label
                      htmlFor="video-consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I consent to video recording for movement screening
                    </Label>
                  </div>

                  {videoConsent && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <CheckCircle2Icon className="size-4" />
                      <span>Consent provided</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* OPTIONAL: Research Participation */}
          <Card className="border-muted bg-card">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <FlaskConicalIcon className="size-6 text-muted-foreground shrink-0 mt-1" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Research Participation</h3>
                    <Badge variant="outline" className="text-xs">Optional</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Help advance sports medicine research by allowing de-identified aggregate data to be used for research purposes. This includes:
                  </p>
                  
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Injury prevention research</li>
                    <li>Performance optimization studies</li>
                    <li>Biomechanical research</li>
                    <li>Population health analysis</li>
                  </ul>

                  <p className="text-sm text-muted-foreground">
                    Your personal information remains confidential. Only de-identified data is used.
                  </p>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="research-consent"
                      checked={researchOptIn}
                      onCheckedChange={handleResearchOptIn}
                    />
                    <Label
                      htmlFor="research-consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I agree to participate in research (optional)
                    </Label>
                  </div>

                  {researchOptIn && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <CheckCircle2Icon className="size-4" />
                      <span>Thank you for supporting research</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* OPTIONAL: AI Model Improvement */}
          <Card className="border-muted bg-card">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <BrainCircuitIcon className="size-6 text-muted-foreground shrink-0 mt-1" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">AI Model Improvement</h3>
                    <Badge variant="outline" className="text-xs">Optional</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Help improve AI movement screening accuracy by allowing your de-identified movement data to be used for:
                  </p>
                  
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Training and validating AI models</li>
                    <li>Improving movement analysis accuracy</li>
                    <li>Developing better injury risk detection</li>
                  </ul>

                  <p className="text-sm text-muted-foreground">
                    All data is de-identified. This is separate from clinical use and does not affect your assessment.
                  </p>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="ai-consent"
                      checked={aiOptIn}
                      onCheckedChange={handleAiOptIn}
                    />
                    <Label
                      htmlFor="ai-consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I agree to help improve AI models (optional)
                    </Label>
                  </div>

                  {aiOptIn && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <CheckCircle2Icon className="size-4" />
                      <span>Thank you for helping improve AI</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy Notice */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">
              Your health information is protected and handled according to applicable data protection regulations. 
              You can withdraw consent at any time by contacting SafeSport support. For more details, review our{" "}
              <Button variant="link" className="h-auto p-0 text-xs">Privacy Policy</Button>.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
