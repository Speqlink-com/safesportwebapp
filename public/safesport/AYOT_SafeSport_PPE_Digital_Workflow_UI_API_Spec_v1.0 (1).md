AYOT SafeSport™

**DIGITAL PPE / PHPA WORKFLOW, UI & API SPECIFICATION**

Version 1.0 — Implementation Ready | 09 August 2026

Purpose: translate the AYOT SafeSport™ Pre-Participation Health & Performance Assessment into a software-build specification. This document defines screens, fields, validation, workflow, clinical decision logic, role permissions, database structures and API contracts. The clinician remains the decision-maker for medical eligibility; AI movement analysis is decision support only.

# 1\. Product position

| **Layer**            | **Function**                                         | **Primary user**          |
| -------------------- | ---------------------------------------------------- | ------------------------- |
| Clinical PPE         | Medical history, examination and eligibility         | Clinician                 |
| Functional baseline  | Musculoskeletal and sport-specific baseline          | Clinician/physiotherapist |
| AI movement screen   | Video capture, biomechanical metrics and risk signal | Physiotherapist/clinician |
| Referral & follow-up | Closed-loop care pathway                             | Clinician/operations      |
| Athlete record       | Longitudinal health, injury and clearance history    | Authorized clinical staff |
| Institutional status | Minimum-necessary participation status               | School/club administrator |
| Coach view           | Participation-relevant restrictions only             | Coach                     |

# 2\. User roles and permissions

| **Role**          | **Can view**                              | **Can create/edit**                                               | **Cannot access**                                     |
| ----------------- | ----------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------- |
| Athlete           | Own permitted record/status               | History and questionnaires; consent                               | Other athletes; clinician-only notes                  |
| Parent/guardian   | Minor's permitted consent/status views    | Consent and questionnaire where enabled                           | Other athletes; confidential clinician notes          |
| Clinician         | Full clinical record                      | PPE, examination, eligibility, referrals                          | —                                                     |
| Physiotherapist   | Assigned movement/rehab data              | Functional screen, rehab and clinician-reviewed AI interpretation | Unrelated sensitive clinical notes unless authorized  |
| Coach             | Participation status and restrictions     | Operational acknowledgements                                      | Medical history, mental-health data, full examination |
| School/club admin | Institutional readiness/status dashboards | Scheduling/admin data                                             | Clinical record                                       |
| System admin      | Technical metadata and audit logs         | User/access configuration                                         | Clinical content unless explicitly privileged         |

# 3\. End-to-end workflow

| **Step** | **Trigger**               | **System behavior**                           | **Required output** |
| -------- | ------------------------- | --------------------------------------------- | ------------------- |
| 1        | New athlete               | Create profile + athlete ID                   | Draft record        |
| 2        | Minor/consent requirement | Collect consent/assent                        | Consent record      |
| 3        | PPE due                   | Send questionnaire/task                       | History             |
| 4        | Clinician starts PPE      | Lock encounter to assigned clinician          | Encounter           |
| 5        | Positive history          | Show contextual follow-up questions           | Resolved finding    |
| 6        | Examination               | Enter structured findings/vitals              | Exam record         |
| 7        | Functional screen         | Launch baseline module                        | Functional baseline |
| 8        | AI screen, if ordered     | Capture/upload video; process; flag quality   | AI result           |
| 9        | Review                    | Clinician/physio validates findings           | Interpretation      |
| 10       | Eligibility               | Clinician selects status + restrictions       | Eligibility         |
| 11       | Referral                  | Create referral where indicated               | Referral            |
| 12       | Certificate               | Generate signed minimum-necessary certificate | Certificate         |
| 13       | Monitoring                | Track review date/triggers                    | Active status       |

# 4\. Screen inventory

| **ID** | **Screen**                   | **Primary user**           | **Priority** |
| ------ | ---------------------------- | -------------------------- | ------------ |
| S01    | Athlete Registration         | Admin/clinician            | P0           |
| S02    | Consent & Privacy            | Athlete/guardian/clinician | P0           |
| S03    | Pre-PPE Health Questionnaire | Athlete/guardian           | P0           |
| S04    | Clinician PPE Dashboard      | Clinician                  | P0           |
| S05    | History Review               | Clinician                  | P0           |
| S06    | Vitals                       | Clinician                  | P0           |
| S07    | Physical Examination         | Clinician                  | P0           |
| S08    | Musculoskeletal Baseline     | Clinician/physio           | P0           |
| S09    | Sport-Specific Module        | Clinician                  | P1           |
| S10    | Movement Screening Capture   | Physio/clinician           | P0           |
| S11    | AI Results Review            | Physio/clinician           | P0           |
| S12    | Eligibility Decision         | Clinician                  | P0           |
| S13    | Referral & Follow-up         | Clinician/ops              | P0           |
| S14    | Certificate                  | Clinician/admin            | P0           |
| S15    | Athlete Profile              | Authorized users           | P0           |
| S16    | Coach Participation View     | Coach                      | P0           |
| S17    | Institution Dashboard        | Admin                      | P1           |
| S18    | Audit Log                    | Privileged admin           | P0           |

# 5\. S01 — Athlete Registration

| **Field**         | **Type**    | **Required** | **Validation**                          |
| ----------------- | ----------- | ------------ | --------------------------------------- |
| Full name         | Text        | Yes          | 2–150 characters                        |
| Date of birth     | Date        | Yes          | Cannot be future                        |
| Sex               | Enum        | Yes          | Configured vocabulary                   |
| Institution       | Lookup      | Yes          | Active institution                      |
| Team              | Lookup/text | Yes          | Active team                             |
| Sport             | Enum        | Yes          | Configured sport list                   |
| Position/event    | Enum/text   | Conditional  | Required where applicable               |
| Guardian details  | Structured  | Conditional  | Required for minors according to policy |
| Emergency contact | Structured  | Yes          | Phone format validation                 |
| Photo             | Image       | Optional     | Consent/policy controlled               |

System automatically calculates age, age group, PPE due status and applicable sport-specific modules.

# 6\. S02 — Consent & privacy

| **Component**           | **Behavior**                                                        |
| ----------------------- | ------------------------------------------------------------------- |
| Consent version         | Store protocol/privacy version accepted                             |
| Consent status          | Obtained / Declined / Deferred / Withdrawn                          |
| Consent provider        | Athlete / parent/guardian / authorized representative               |
| Assent                  | Record where applicable                                             |
| Purpose                 | Explain PPE, digital record, movement video and data use separately |
| Video consent           | Separate consent for movement-screening video                       |
| Research/AI improvement | Separate opt-in if data may be used beyond care                     |
| Withdrawal              | Record date/time and downstream access consequences                 |
| Signature               | Electronic signature + timestamp + user ID                          |

The product must not bundle clinical consent and optional research/model-development consent into one mandatory acceptance.

# 7\. S03 — Pre-PPE questionnaire

Use structured yes/no/unknown responses with progressive disclosure. A positive response opens follow-up questions and creates a review flag; it does not automatically produce a diagnosis.

| **Domain**            | **Trigger**                                                                        | **Follow-up**                                         |
| --------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Cardiovascular        | Chest pain, exertional fainting/near-fainting, palpitations, known heart condition | Symptoms, timing, previous assessment, current status |
| Family cardiac        | Unexpected/sudden young death or inherited cardiac condition                       | Relationship, age, diagnosis if known                 |
| Respiratory           | Asthma/wheeze/exercise breathing difficulty                                        | Control, medication, recent exacerbations             |
| Neurologic            | Concussion, seizure, LOC, concerning headache/neurologic history                   | Episode count/date, symptoms, recovery                |
| Musculoskeletal       | Previous major injury/surgery/current pain or instability                          | Body region, date, treatment, current limitation      |
| Allergy               | Medication/food/environmental allergy or anaphylaxis                               | Trigger, severity, emergency medication               |
| Medication            | Current medication                                                                 | Name, dose, indication, emergency medication          |
| Mental health         | Significant distress, anxiety, mood/sleep/burnout concern                          | Private clinician follow-up                           |
| Female athlete health | Relevant menstrual/energy-availability concern                                     | Private clinician follow-up                           |
| Previous restriction  | Prior medical restriction                                                          | Reason, duration, outcome                             |

# 8\. S04–S07 — Clinician examination

| **Module**      | **Fields**                                                                                     | **Validation/behavior**                                          |
| --------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Vitals          | BP, pulse, respiratory rate where indicated, SpO₂ where indicated, temperature where indicated | Numeric ranges; outliers prompt recheck, not automatic diagnosis |
| General         | General appearance/acute illness                                                               | Normal/abnormal + note                                           |
| Cardiovascular  | Rhythm, heart sounds, murmurs, pulses, BP interpretation                                       | Abnormal finding creates clinician review task                   |
| Respiratory     | Effort, auscultation, wheeze/other finding                                                     | Structured finding + note                                        |
| Neurologic      | Mental status, gross neurologic exam, balance/coordination where indicated                     | Structured finding + note                                        |
| Vision          | Visual acuity/correction where relevant                                                        | Numeric/structured                                               |
| Skin            | Relevant lesion/infection                                                                      | Normal/abnormal + note                                           |
| Abdomen         | Where clinically indicated                                                                     | Normal/abnormal/N/A                                              |
| Musculoskeletal | Spine, shoulder, elbow/wrist/hand, hip, knee, ankle/foot                                       | Region-specific fields                                           |

# 9\. S08 — Musculoskeletal baseline

| **Region**       | **Minimum fields**                                           |
| ---------------- | ------------------------------------------------------------ |
| Spine            | Alignment, ROM, pain, neurologic symptoms                    |
| Shoulder         | ROM, strength/function, pain, instability                    |
| Elbow/wrist/hand | ROM, pain, instability, prior injury sequelae                |
| Hip              | ROM, pain, strength/function                                 |
| Knee             | ROM, pain, effusion, stability, functional symptoms          |
| Ankle/foot       | ROM, stability, pain, previous sprain, functional limitation |

Quantitative tests are configurable by sport/age. The system must not enforce universal performance cut-offs unless the clinical governance team has approved and validated them.

# 10\. S09 — Sport-specific module

| **Sport**                 | **Additional module**                                                   |
| ------------------------- | ----------------------------------------------------------------------- |
| Football                  | Knee/ankle, concussion, hamstring, landing/cutting, injury history      |
| Rugby/contact field sport | Concussion, cervical spine, shoulder, knee, trauma                      |
| Athletics                 | Running load, lower-limb symptoms, stress-injury history, event demands |
| Basketball/volleyball     | Ankle, knee, landing/jumping, shoulder                                  |
| Swimming                  | Shoulder, respiratory history, training load                            |
| Racquet sports            | Shoulder/elbow/wrist, lower-limb loading                                |
| Combat sports             | Concussion/neurologic, musculoskeletal, skin/infectious considerations  |
| Gymnastics                | Spine, wrist, shoulder, lower-limb loading                              |
| Other                     | Clinician-configured module                                             |

# 11\. S10 — Movement screening capture

| **Field**  | **Specification**                                                         |
| ---------- | ------------------------------------------------------------------------- |
| Athlete    | Locked to encounter                                                       |
| Drill      | Jump landing / single-leg squat / sprint acceleration / cutting / kicking |
| Camera     | Smartphone/tablet                                                         |
| Resolution | Target ≥1080p                                                             |
| Frame rate | Target ≥30 fps                                                            |
| Distance   | Approx. 3–5 m                                                             |
| Lighting   | Adequate; quality check before upload                                     |
| Views      | Configured frontal/sagittal requirements per drill                        |
| Consent    | Movement-video consent must be valid                                      |
| Offline    | Capture locally with encrypted temporary storage; sync when connected     |
| Quality    | System returns usable / retake required                                   |

# 12\. S11 — AI results review

| **Output**              | **Display rule**                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------- |
| Knee valgus angle       | Show measured value + confidence/quality indicator; no automatic clinical restriction |
| Trunk lean              | Show measured value + quality indicator                                               |
| Limb symmetry index     | Show value + test method/context                                                      |
| Stabilization time      | Show value + quality indicator                                                        |
| Composite AI risk       | Clearly labelled movement-risk signal, not medical clearance                          |
| Model version           | Always displayed/stored                                                               |
| Reviewer                | Required before clinical report finalization                                          |
| Clinical interpretation | Required free text/structured action                                                  |
| Action                  | No action / prevention / physiotherapy / further assessment / other                   |

# 13\. AI quality and safety rules

- Reject or mark 'insufficient quality' when keypoint tracking is unreliable, the athlete is occluded, camera geometry is inadequate, or the drill protocol is not followed.
- Do not silently substitute missing metrics with zero.
- Do not allow the AI score to automatically set 'not cleared'.
- Require human review before AI results enter the final athlete report.
- Store model version, processing timestamp, input quality, raw metrics, output and reviewer action.
- Maintain model auditability and allow results to be corrected/overridden by authorized clinicians with reason recorded.

# 14\. S12 — Eligibility decision engine

| **Status**                         | **Required fields**                   | **System behavior**                                  |
| ---------------------------------- | ------------------------------------- | ---------------------------------------------------- |
| CLEARED                            | Clinician, date, validity/review date | Certificate available; institutional status green    |
| CLEARED WITH MONITORING            | Monitoring plan + review date         | Certificate includes plan                            |
| CLEARED PENDING FURTHER EVALUATION | Required evaluation + deadline        | Referral task; status remains conditional            |
| SPORT-SPECIFIC RESTRICTION         | Allowed/restricted activities         | Coach view shows only restrictions                   |
| TEMPORARILY NOT CLEARED            | Reason category + follow-up           | Certificate not marked cleared; referral/review task |
| NOT CLEARED                        | Clinical rationale + follow-up        | Participation status restricted; escalation pathway  |

Decision engine should enforce completion of mandatory clinical fields but should not make the clinical judgment itself.

# 15\. Automated flags

| **Flag**                                       | **Severity**      | **Action**                                                                |
| ---------------------------------------------- | ----------------- | ------------------------------------------------------------------------- |
| Missing consent                                | Blocking          | Cannot proceed to protected clinical assessment where consent is required |
| Exertional cardiac symptom/history             | High              | Clinician review; referral pathway as clinically indicated                |
| Concerning neurologic history/current symptoms | High              | Clinician review/concussion or neurologic pathway                         |
| Current significant injury/pain/instability    | High              | Clinical assessment; restriction/referral as indicated                    |
| Uncontrolled respiratory symptoms              | High              | Clinical review                                                           |
| Anaphylaxis history                            | High              | Emergency action-plan review                                              |
| Mental-health/safeguarding concern             | High/Confidential | Private clinician pathway                                                 |
| AI video quality inadequate                    | Medium            | Retake; no risk score generated                                           |
| PPE incomplete                                 | Blocking          | Cannot finalize eligibility                                               |
| Referral overdue                               | Medium            | Notify assigned clinician/operations; preserve clinical confidentiality   |

# 16\. S13 — Referral and closed-loop follow-up

| **Field**           | **Type**                                              |
| ------------------- | ----------------------------------------------------- |
| Referral ID         | UUID                                                  |
| PPE ID              | UUID                                                  |
| Athlete ID          | UUID                                                  |
| Referral type       | Enum                                                  |
| Reason              | Structured + text                                     |
| Urgency             | Routine/Priority/Urgent/Emergency                     |
| Provider/facility   | Text/ID                                               |
| Date created        | Date/time                                             |
| Appointment date    | Date                                                  |
| Outcome             | Pending/Completed/Further referral/Cleared/Restricted |
| Evidence            | Document reference                                    |
| Eligibility updated | Boolean                                               |
| Closed by           | User ID + timestamp                                   |

# 17\. S14 — Certificate generation

The certificate is a deliberately small output. It should not reproduce the clinical record.

| **Displayed**              | **Not displayed by default**       |
| -------------------------- | ---------------------------------- |
| Athlete name/ID            | Detailed medical history           |
| Institution                | Mental-health notes                |
| Sport/position             | Medication list                    |
| Assessment date            | Detailed examination findings      |
| Eligibility status         | Family medical history             |
| Participation restrictions | AI raw metrics                     |
| Monitoring/follow-up date  | Clinical rationale/free-text notes |
| Clinician name/designation | Sensitive safeguarding information |

# 18\. S15–S17 — dashboards

| **View**    | **Widgets**                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------- |
| Athlete     | Current eligibility, restrictions, upcoming review, injury/rehab status, movement-screen status |
| Clinician   | PPE due, incomplete encounters, flags, referrals, reassessments                                 |
| Coach       | Roster + participation status + restrictions + emergency-relevant operational alerts only       |
| Institution | Athletes cleared/restricted/pending, PPE completion, referral completion, injury trends         |
| Operations  | Appointments, clinician assignments, overdue tasks, event coverage                              |

# 19\. S18 — audit and security

- Every clinical create/update/delete/export event records user ID, role, timestamp, action and affected record.
- Role-based access must be enforced server-side, not only in the UI.
- Sensitive clinical data and movement video require encryption in transit and at rest.
- Maintain separate access policies for clinical notes, institutional status and video.
- Use retention/deletion policies approved by AYOT clinical and data-protection governance.
- All exports should record who exported what and when.

# 20\. Database schema — implementation additions

| **Table**           | **Key fields**                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| ppe_assessments     | ppe_id UUID PK; athlete_id FK; examiner_id FK; date; status; consent_id; eligibility_id; review_date; signed_at |
| ppe_history         | history_id; ppe_id; domain; question_code; response; details; verified_by                                       |
| ppe_vitals          | vitals_id; ppe_id; height; weight; BP_sys; BP_dia; pulse; resp_rate; spo2; temperature                          |
| ppe_exam            | exam_id; ppe_id; system; finding_code; result; notes                                                            |
| ppe_msk             | msk_id; ppe_id; region; test_code; side; value; unit; result; notes                                             |
| movement_screenings | screening_id; athlete_id; ppe_id; drill; video_ref; quality; status                                             |
| ai_results          | result_id; screening_id; model_version; metrics_json; risk_output; confidence; reviewer_id; interpretation      |
| eligibility         | eligibility_id; ppe_id; status; sport_scope; restrictions; review_date; clinician_id; rationale                 |
| referrals           | referral_id; ppe_id; type; urgency; reason; provider; status; outcome                                           |
| consents            | consent_id; athlete_id; type; version; provider; timestamp; withdrawal_status                                   |
| audit_events        | event_id; actor_id; role; action; object_type; object_id; timestamp; metadata                                   |

# 21\. API specification

| **Method** | **Endpoint**                           | **Purpose**                      |
| ---------- | -------------------------------------- | -------------------------------- |
| POST       | /ppe                                   | Create PPE encounter             |
| GET        | /ppe/{ppe_id}                          | Retrieve encounter based on role |
| PATCH      | /ppe/{ppe_id}                          | Update encounter state           |
| POST       | /ppe/{ppe_id}/consent                  | Record consent                   |
| POST       | /ppe/{ppe_id}/history                  | Submit history                   |
| POST       | /ppe/{ppe_id}/vitals                   | Submit vitals                    |
| POST       | /ppe/{ppe_id}/exam                     | Submit examination               |
| POST       | /ppe/{ppe_id}/msk                      | Submit musculoskeletal baseline  |
| POST       | /ppe/{ppe_id}/movement                 | Create movement screening        |
| POST       | /movement/{screening_id}/video         | Upload movement video            |
| GET        | /movement/{screening_id}/results       | Retrieve AI results              |
| POST       | /movement/{screening_id}/review        | Record clinician/physio review   |
| POST       | /ppe/{ppe_id}/eligibility              | Record clinician eligibility     |
| POST       | /ppe/{ppe_id}/referrals                | Create referral                  |
| PATCH      | /referrals/{referral_id}               | Update referral                  |
| GET        | /athletes/{athlete_id}/eligibility     | Minimum-necessary status         |
| POST       | /ppe/{ppe_id}/certificate              | Generate certificate             |
| GET        | /athletes/{athlete_id}/clinical-record | Privileged clinical record       |

# 22\. Example eligibility API payload

{  
"ppe_id": "uuid",  
"athlete_id": "uuid",  
"status": "CLEARED_WITH_MONITORING",  
"sport_scope": "football",  
"restrictions": \[\],  
"monitoring_plan": \["ankle rehabilitation adherence"\],  
"review_date": "2026-11-09",  
"clinician_id": "uuid",  
"clinical_rationale": "Eligible with monitoring plan",  
"signed_at": "2026-08-09T12:00:00Z"  
}

# 23\. Example AI review payload

{  
"screening_id": "uuid",  
"model_version": "move-screen-v1",  
"quality": "acceptable",  
"metrics": {  
"knee_valgus_angle": 8.4,  
"trunk_lean": 13.2,  
"limb_symmetry_index": 91.0,  
"stabilization_time": 0.62  
},  
"risk_signal": "MODERATE",  
"reviewer_id": "uuid",  
"clinical_interpretation": "Targeted landing-control programme recommended",  
"action": "PREVENTION"  
}

# 24\. Business and clinical KPIs

| **Domain** | **Metric**                                                           |
| ---------- | -------------------------------------------------------------------- |
| Coverage   | Athletes with completed PPE / registered athletes                    |
| Quality    | PPE completion without missing mandatory fields                      |
| Clinical   | Positive screening rate; referral rate; referral completion rate     |
| Safety     | Restriction rate; adverse events; emergency escalations              |
| Prevention | Injury incidence per athlete exposure; repeat injury rate            |
| Recovery   | Time to clinically determined return-to-play                         |
| Digital    | AI screen completion; video retake rate; clinician review turnaround |
| Governance | Audit completion; unauthorized-access incidents; consent exceptions  |

# 25\. Build sequence

| **Sprint** | **Deliverable**                                                       |
| ---------- | --------------------------------------------------------------------- |
| Sprint 1   | Database migrations, roles/permissions, registration and consent      |
| Sprint 2   | History questionnaire + conditional follow-up engine                  |
| Sprint 3   | Vitals + physical examination + musculoskeletal baseline              |
| Sprint 4   | Eligibility workflow + certificate + audit trail                      |
| Sprint 5   | Movement capture + offline upload + quality checks                    |
| Sprint 6   | AI result ingestion + clinician review                                |
| Sprint 7   | Referral/follow-up + athlete/coach/institution views                  |
| Sprint 8   | Pilot QA, clinical validation, security testing and usability testing |

# 26\. Acceptance criteria

- An athlete cannot receive a finalized eligibility status without required consent and mandatory clinical fields.
- Positive history responses generate the appropriate follow-up workflow.
- Clinicians can document normal and abnormal findings without relying on free text alone.
- Eligibility status and AI movement risk are separate fields and displays.
- AI cannot automatically mark an athlete medically unfit.
- Every AI result records model version and human review.
- Coach/institution views do not expose the full medical record.
- Referrals can be tracked to a documented outcome.
- Certificate contains only minimum-necessary participation information.
- All sensitive actions are auditable.
- System supports offline field capture and later synchronization for mobile clinical workflows.

# 27\. Clinical governance gate before production

- Clinical lead approves the PPE instrument, eligibility categories and escalation pathways.
- AYOT confirms the professional cadres authorized to perform each component and supervision/referral arrangements under applicable Kenyan requirements.
- Data-protection/privacy review approves consent, access, retention, video handling and institutional disclosure.
- Safeguarding review approves minor confidentiality, private interview and escalation procedures.
- AI governance review confirms that movement metrics are not represented as validated injury predictions until adequately validated.
- Pilot sites test the complete workflow before production deployment.

# 28\. Relationship to AYOT SafeSport concept

The original AYOT concept already specifies an athlete EMR, pre-participation physical examinations, AI movement screening, clinician validation, injury documentation, rehabilitation and return-to-play functions. This specification connects those components into one clinical workflow and preserves the concept's intended architecture while adding the operational fields, permissions, decision states and API surfaces needed for implementation.

# 29\. Recommended product principle

**MEDICAL ELIGIBILITY = CLINICIAN DECISION.** AI MOVEMENT RISK = DECISION SUPPORT. INSTITUTIONAL STATUS = MINIMUM-NECESSARY DISCLOSURE.