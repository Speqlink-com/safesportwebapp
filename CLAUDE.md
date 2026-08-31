# AGENTS.md — AYOT SafeSport™ Agent Onboarding

> **Read this before changing SafeSport.**
>
> This file teaches coding agents what SafeSport is, how the pieces fit together, and how to make safe implementation decisions during the prototype phase.
>
> **Detailed system specification:** `project.md`
>
> **Source documents:** `public/safesport/`
>
> The source documents define the clinical workflow, role permissions, screen inventory, API/database additions, AI governance, referral flow, eligibility states, dashboards, and implementation priorities. Read them before inventing requirements.

---

## 1. What SafeSport Is

SafeSport™ is an integrated athlete safety, health, sports-performance, injury-prevention and care-coordination platform.

It is **not** just an injury reporting app, clinician dashboard, AI movement tool, or school sports-management system.

It is intended to become a **central athlete record and workflow infrastructure**.

The core model is:

```text
                         SAFESPORT
                            │
             ┌──────────────┴──────────────┐
             │                             │
      CENTRAL ATHLETE RECORD        WORKFLOW / EVENTS
             │                             │
      ┌──────┼─────────┐          ┌────────┼─────────┐
      │      │         │          │        │         │
    Health  Sports   Documents   Care     Tasks   Notifications
      │      │         │          │
      └──────┼─────────┘          │
             │                    │
             └──────────┬─────────┘
                        │
                 ROLE-SPECIFIC VIEWS
                        │
      ┌────────┬────────┬────────┬────────┬────────┐
      │        │        │        │        │        │
  Clinician  Physio   Coach   Institution Guardian Athlete
      │        │        │        │        │        │
      └────────┴────────┴────────┴────────┴────────┘
```

### Core principle

> **One athlete identity. One longitudinal record. Many authorized relationships and workflows.**

An athlete can move from school to academy to club without starting a new SafeSport identity. Organizations, teams and care relationships change; the athlete's longitudinal record persists.

---

# 2. The Central Athlete Hub

The athlete is the center of the platform.

Conceptually:

```text
Athlete
├── Identity
├── Organizations
├── Teams
├── Sports
├── Guardians
├── Consent
├── PPE / Clinical assessments
├── Medical history
├── Physical examinations
├── Vitals
├── Musculoskeletal baseline
├── Sport-specific assessments
├── Movement screenings
├── AI movement results
├── Injuries / incidents
├── Referrals
├── Physiotherapy
├── Rehabilitation
├── Eligibility / restrictions
├── Return-to-play history
├── Certificates
├── Documents
├── Performance/baseline information
└── Timeline / activity
```

When implementing a feature, always ask:

1. What athlete/entity does this belong to?
2. What record does it create/update?
3. Who can see it?
4. Who can edit it?
5. Does it create a workflow?
6. Does it create an event/notification?
7. Should it appear in the athlete timeline?

Do not create isolated feature silos.

---

# 3. Two Flows Must Never Be Confused

## 3.1 Longitudinal athlete lifecycle

```text
Registration
   ↓
Consent
   ↓
PPE / Baseline
   ↓
Participation
   ↓
Monitoring
   ↓
Injury / Screening / Performance event
   ↓
Treatment / Referral / Rehabilitation
   ↓
Reassessment
   ↓
Eligibility / Return to participation
   ↓
Monitoring
   ↓
More data over time
```

This can repeat for years.

## 3.2 Operational care workflow

A specific incident, referral, screening or clinical problem moves through a workflow:

```text
Finding / Incident
    ↓
Clinician
    ↓
Assessment
    ↓
Referral
    ↓
Assigned professional
    ↓
Treatment / Physiotherapy / Specialist
    ↓
Outcome
    ↓
Reassessment
    ↓
Eligibility decision
    ↓
Athlete record updated
```

### Critical rule

**The athlete is not the thing moving through one linear pipeline. The specific case/referral/incident/screening moves through a workflow while the athlete remains the permanent central record.**

---

# 4. Source-of-Truth Hierarchy

Use this priority:

```text
1. Specific SafeSport source document
2. project.md
3. Existing repository implementation patterns
4. General engineering judgment
5. New product ideas — clearly marked as future/TODO
```

Source documents are under:

```text
public/safesport/
```

They cover:

- SafeSport platform concept
- PPE / PHPA clinical instrument
- PPE digital workflow, UI and API specification
- AI movement/injury intelligence
- Role permissions
- Dashboards
- Referral/eligibility workflows
- Database/API requirements
- Security/audit expectations

If a clinical or product rule is not specified, do not silently invent it.

---

# 5. Current Role Routes

The current dashboard structure is:

```text
/dashboard/safesport
├── athlete
├── clinician
├── coach
├── guardian
├── institution
├── operations
├── physiotherapist
└── sys-admin
```

These are **different interfaces to one platform**, not eight independent apps.

Shared entities, athlete records, status definitions and business logic should be reusable.

---

# 6. Roles

## Athlete

Own permitted SafeSport record, status, questionnaires, documents, injuries/rehab information and timeline.

Cannot see other athletes or protected clinician-only notes.

## Guardian

Minor's permitted status, consent, questionnaire, documents and notifications.

Cannot see unrelated athletes or confidential clinician notes.

## Clinician

Full authorized clinical workflow:

- PPE
- History
- Examination
- Vitals
- Musculoskeletal baseline
- Incidents
- Eligibility
- Referrals
- Certificates
- Reassessment

The clinician makes the medical eligibility decision.

## Physiotherapist

- Functional assessment
- Movement screening
- AI result review
- Rehabilitation
- Assigned athlete care
- Referral/care coordination

Should not automatically see unrelated sensitive clinical notes.

## Coach

- Roster
- Participation status
- Restrictions
- Operational readiness
- Relevant alerts

Must not receive full clinical history, mental-health information, full examination details, or protected clinical notes.

## Institution

- Organization-level athlete status
- Readiness
- PPE completion
- Referral completion where appropriate
- Injury trends
- Screening summaries
- Scheduling/admin

Institutional access is not equivalent to clinical access.

## Operations

- Scheduling
- Events
- Coverage
- Clinician assignments
- Tasks
- Referral operations
- Service/client administration

## System Admin

- Users
- Roles/permissions
- Configuration
- Audit
- Technical metadata
- System health/integration management

Do not assume system admin automatically sees every protected clinical record.

---

# 7. Permissions Are Part of the Product

Use:

```text
Same athlete record
       ↓
Role + authorization
       ↓
Different visible projection
```

Examples:

```text
Clinician
→ full authorized clinical record

Physiotherapist
→ assigned movement/rehab + permitted clinical context

Coach
→ participation status + restrictions + operational alerts

Institution
→ readiness/status + institutional trends

Guardian
→ permitted minor status + consent/questionnaire

Athlete
→ own permitted record/status

Operations
→ workflow/scheduling information

System Admin
→ access/configuration/audit/technical metadata
```

Production authorization must be enforced server-side. Prototype UI guards may mirror it, but never design the product around “hide it with CSS”.

---

# 8. Non-Negotiable Clinical Rules

## Medical eligibility = clinician decision

Never implement:

```text
AI high risk
   ↓
NOT CLEARED
```

Correct:

```text
AI movement-risk signal
   ↓
Human review
   ↓
Clinical interpretation
   ↓
Clinician eligibility decision
```

## AI = decision support

AI output is a risk signal/decision-support artifact, not a diagnosis or medical clearance.

## Missing data ≠ normal

Clinical findings should support:

```text
Normal
Abnormal
Not assessed
Not applicable
```

Do not infer normality from missing fields.

## Positive history ≠ diagnosis

Positive history answers open appropriate follow-up/review.

## Minimum necessary disclosure

Do not expose the full clinical record to coaches or institutions just because the data exists.

## Sensitive actions are auditable

Clinical create/update/delete/export and similar sensitive operations should be attributable.

---

# 9. PPE / PHPA Workflow

The clinical workflow is:

```text
Registration
→ Consent
→ Pre-visit history
→ Private clinician review
→ Physical examination
→ Functional baseline
→ Movement screening (optional/indicated)
→ Clinical decision
→ Referral
→ Digital certificate
→ Monitoring
```

Good UI state model:

```text
Not started
In progress
Needs review
Complete
Blocked
Not applicable
```

The source specification requires mandatory fields/consent before final eligibility.

---

# 10. Consent

Consent is a first-class workflow.

Conceptual fields:

```text
Consent type
Version
Provider
Date/time
Scope
Withdrawal state
Assent where applicable
Movement-video consent
Research/AI improvement opt-in
Electronic signature
User ID
```

Do not bundle mandatory clinical consent and optional research/model-development consent into one mandatory acceptance.

---

# 11. Pre-PPE History

Use structured responses with progressive disclosure.

Domains include:

```text
Cardiovascular
Family cardiac
Respiratory
Neurologic
Musculoskeletal
Allergy
Medication
Vision/hearing
Skin/infection
Mental health
Female athlete health where relevant
Previous restriction
```

A positive answer should expose relevant follow-up and create a review flag.

It should not automatically create a diagnosis.

---

# 12. Physical Examination

Relevant structured domains include:

```text
General
Height/weight where appropriate
Vitals
Vision
Cardiovascular
Respiratory
Neurologic
Abdomen where indicated
Skin
Musculoskeletal
Mental health where indicated
```

Prefer structured fields plus notes over one huge free-text field.

---

# 13. Musculoskeletal Baseline

Core regions:

```text
Spine
Shoulder
Elbow/Wrist/Hand
Hip
Knee
Ankle/Foot
```

Potential fields:

```text
ROM
Pain
Stability
Strength/function
Previous injury sequelae
Region-specific findings
```

Quantitative tests can be configurable by sport/age.

Do not hardcode universal performance/clearance cutoffs unless clinically approved later.

---

# 14. Sport-Specific Modules

Current source examples:

```text
Football
Rugby/contact field sports
Athletics
Basketball/volleyball
Swimming
Racquet sports
Combat sports
Gymnastics
Other/configurable
```

Example:

```text
Football
→ knee/ankle, concussion, hamstring, landing/cutting, prior lower-limb injury

Athletics
→ running load, lower-limb symptoms, stress injury history, event demands

Basketball/volleyball
→ ankle, knee, landing/jumping, shoulder
```

Build them as configurable modules rather than one giant form.

---

# 15. Movement Screening

Current drills:

```text
Jump landing
Single-leg squat
Sprint acceleration
Cutting maneuver
Kicking mechanics where relevant
```

Video targets:

```text
≥1080p
≥30fps
Approx. 3–5m
Adequate lighting
Configured required views
Valid movement-video consent
```

Flow:

```text
Select athlete
→ Select drill
→ Capture/upload
→ Quality check
→ Processing
→ AI result
→ Human review
→ Clinical interpretation
→ Report / record update
```

---

# 16. AI Movement Pipeline

The source concept describes:

```text
Video Upload
   ↓
Frame Extraction
   ↓
Pose Estimation
   ↓
Keypoint Tracking
   ↓
Biomechanical Calculations
   ↓
Risk Signal
   ↓
Physiotherapist/Clinician Validation
   ↓
Athlete Report
   ↓
Team / Institutional insights
```

The concept references MoveNet, with MediaPipe Pose as an alternative.

Example movement metrics:

```text
Knee valgus
Trunk lean
Limb symmetry index
Stabilization time
```

AI results should retain:

```text
Metric values
Quality/confidence
Model version
Processing timestamp
Raw/structured output
Reviewer
Clinical interpretation
Reviewer action
```

Reviewer actions may include:

```text
No action
Prevention
Physiotherapy
Further assessment
Other
```

---

# 17. AI Quality & Governance

Mark a screening insufficient when needed because of:

- unreliable keypoint tracking
- athlete occlusion
- inadequate camera geometry
- protocol not followed
- missing required inputs

Never silently replace missing values with zero.

Never present an unvalidated AI threshold as a medical fact.

Never automatically mark the athlete “not cleared”.

Preserve:

```text
AI output
→ reviewer
→ interpretation
→ action
```

---

# 18. Clinical Eligibility

Supported statuses:

```text
CLEARED
CLEARED WITH MONITORING
CLEARED PENDING FURTHER EVALUATION
SPORT-SPECIFIC RESTRICTION
TEMPORARILY NOT CLEARED
NOT CLEARED
```

Always display separately:

```text
Clinical Eligibility
VS
AI / Movement Risk
```

---

# 19. Red Flags

Examples include:

```text
Exertional chest pain
Exertional syncope/near-syncope
Concerning palpitations
Significant cardiac history
Concerning family cardiac history
Concerning neurologic history/current symptoms
Significant pain/instability/swelling
Uncontrolled respiratory symptoms
Anaphylaxis history
Mental-health/safeguarding concern
Acute illness/injury making participation unsafe
```

These trigger clinical review/referral pathways. They are not automatic diagnoses.

---

# 20. Referral Pipeline

Referral types include:

```text
Sports physician
Physiotherapy
Orthopaedics
Cardiology
Neurology
Respiratory
Mental health
Nutrition
Ophthalmology
Other
```

Urgency:

```text
Routine
Priority
Urgent
Emergency
```

Outcomes:

```text
Pending
Completed
Further referral
Cleared
Restricted
```

A referral should behave like a case, not a form submission:

```text
Created
→ Assigned
→ In progress
→ Outcome
→ Closed
```

---

# 21. Closed-Loop Care

The intended flow:

```text
Referral created
    ↓
Assigned
    ↓
Appointment / action
    ↓
Assessment / treatment
    ↓
Evidence / outcome
    ↓
Referral updated
    ↓
Eligibility may change
    ↓
Athlete timeline updated
```

Do not build a referral flow that ends after creation.

---

# 22. Rehabilitation

Rehabilitation remains part of the athlete's longitudinal record.

```text
Injury / finding
   ↓
Referral
   ↓
Physiotherapy
   ↓
Treatment plan
   ↓
Progress
   ↓
Reassessment
   ↓
Ready / continue rehab / refer
   ↓
Eligibility decision
```

---

# 23. Incidents

Incident capture should be fast.

Core fields:

```text
Athlete
Clinician
Sport
Location
Injury type
Severity
Treatment
Photo/evidence where appropriate
Timestamp
```

Severity examples:

```text
Minor
Moderate
Severe
Emergency
```

---

# 24. Certificates

A certificate is deliberately minimal.

Allowed output:

```text
Athlete name/ID
Institution
Sport/position
Assessment date
Eligibility
Participation restrictions
Monitoring/follow-up date
Clinician name/designation
Signature/verification
```

Do not place the full medical record on the certificate.

Do not expose raw AI metrics, detailed medical history, mental-health notes, medications, family history, or sensitive safeguarding information by default.

---

# 25. Athlete Timeline

Every important workflow should be able to leave a meaningful timeline entry.

Example:

```text
26 Aug 2026
PPE completed
Cleared with monitoring

22 Aug 2026
Physiotherapy follow-up
Knee rehabilitation session

18 Aug 2026
Movement screening
Jump landing
AI movement-risk signal: Moderate
Reviewed by physiotherapist

15 Aug 2026
Injury incident
Ankle sprain
Moderate

10 Jul 2026
Joined club
```

This is a core expression of the SafeSport “record follows the athlete” idea.

---

# 26. Dashboard Philosophy

A dashboard should answer:

> **What does this user need to know or do now?**

General structure:

```text
Header
↓
Context/greeting
↓
Key status/KPIs
↓
Action required
↓
Today / schedule
↓
Recent activity
↓
Trends / insights
```

Do not turn dashboards into collections of database tables.

---

# 27. Clinician Dashboard

Prioritize:

```text
PPE due
Incomplete encounters
Clinical review flags
Today's schedule
Pending referrals
AI reviews awaiting human review
Recent incidents
Reassessments due
```

Suggested sidebar:

```text
Dashboard

Clinical
  Athletes
  Assessments / PPE
  Incidents
  Eligibility
  Referrals
  Reassessments

Movement
  Screenings
  AI Reviews
  Baselines

Operations
  Schedule
  Events
  Tasks

Communication
  Messages
  Notifications

Records
  Reports
  Certificates
```

Do not expose every database table as a navigation link.

---

# 28. Physiotherapist Dashboard

Prioritize:

```text
Assigned athletes
Movement screenings
AI reviews
Functional baselines
Rehabilitation plans
Recovery progress
Referrals
Reassessments
```

---

# 29. Coach Dashboard

Prioritize:

```text
Roster
Participation status
Restrictions
Readiness / permitted status
Events
Operational alerts
```

Keep it operational, not clinical.

---

# 30. Institution Dashboard

Prioritize:

```text
Total athletes
Cleared
Monitoring
Pending
Restricted
PPE completion
Referral completion
Screening status
Injury trends
Readiness
Upcoming services/events
Alerts
```

---

# 31. Guardian Dashboard

Prioritize:

```text
Minor's status
Consent
Questionnaires
Upcoming actions
Permitted documents
Notifications
```

---

# 32. Athlete Dashboard

Prioritize:

```text
My SafeSport identity
Current eligibility
My sports
My permitted health information
My injuries
My rehabilitation
My screenings
My certificates
My documents
My timeline
Notifications
```

---

# 33. Operations Dashboard

Prioritize:

```text
Appointments
Clinician assignments
Events
Coverage
Pending tasks
Overdue referrals
Service status
```

---

# 34. System Admin Dashboard

Prioritize:

```text
Users
Roles
Permissions
Organizations
Configuration
Audit
Integrations
System health
```

---

# 35. Realtime Events

The product should eventually feel realtime.

Useful event names include:

```text
ATHLETE_CREATED
PPE_STARTED
PPE_COMPLETED
REVIEW_REQUIRED
AI_SCREENING_READY
AI_REVIEW_COMPLETED
INCIDENT_CREATED
REFERRAL_CREATED
REFERRAL_ASSIGNED
REFERRAL_OVERDUE
REFERRAL_COMPLETED
REASSESSMENT_DUE
ELIGIBILITY_UPDATED
CERTIFICATE_ISSUED
SCHEDULE_CREATED
SCHEDULE_CHANGED
DOCUMENT_UPLOADED
MESSAGE_RECEIVED
```

During the prototype, simulate these with shared state or a lightweight event abstraction.

Do not introduce Kafka/event brokers or distributed architecture just to demonstrate realtime UX.

---

# 36. Notifications

Separate notifications from chat.

Groups:

```text
Clinical review
Referral
Scheduling
PPE
Eligibility
Reassessment
Incident
AI review
System
Messages
```

Notifications should link to the relevant workflow.

---

# 37. Messaging / Chat

The supplied clinical/API specifications do not fully define a production chat architecture.

The prototype may reserve a collaboration layer for:

```text
Clinician ↔ Physiotherapist
Clinician ↔ Operations
Physiotherapist ↔ Clinician
Institution ↔ Operations
Authorized care-team participants
```

Keep the prototype simple:

```text
Conversation
Participants
Messages
Timestamp
Read/unread
Optional related athlete/case/referral
```

Chat is for care/workflow coordination, not social networking.

---

# 38. Offline Field Workflow

Clinician workflows may operate offline.

Prototype can simulate:

```text
Offline
  ↓
Capture data
  ↓
Saved locally
  ↓
Pending sync
  ↓
Connection restored
  ↓
Syncing
  ↓
Synced
```

Simple local storage/mock queues are enough for prototype behavior.

---

# 39. Shared Mock Data

Do not create unrelated mock data per dashboard.

Bad:

```text
Clinician page → athlete data A
Coach page → different athlete data
Physio page → different athlete data
```

Good:

```text
Shared SafeSport mock/domain data
          ↓
Role-specific projection
          ↓
Dashboard
```

The same athlete should remain the same athlete throughout the prototype.

A clinician eligibility change should be able to appear on coach/institution views where permission allows it.

---

# 40. Conceptual Entities

Keep the data model understandable.

```text
User
Role
Athlete
Guardian
Organization
Team
Sport
AthleteOrganization
AthleteTeam
Consent
PPE Assessment
PPE History
PPE Vitals
PPE Examination
MSK Baseline
Sport Assessment
Movement Screening
AI Result
Incident
Referral
Rehabilitation
Eligibility
Certificate
Event
Appointment
Document
Notification
Conversation
Message
Audit Event
```

Use the source documents for exact field names and relationships.

---

# 41. Core Relationships

```text
Athlete
 ├── Organizations
 ├── Teams
 ├── Sports
 ├── Guardians
 ├── Consents
 ├── PPE Assessments
 ├── Incidents
 ├── Movement Screenings
 ├── AI Results
 ├── Referrals
 ├── Rehabilitation
 ├── Eligibility Decisions
 ├── Certificates
 ├── Documents
 └── Timeline Events
```

PPE:

```text
PPE
 ├── Consent
 ├── History
 ├── Vitals
 ├── Examination
 ├── MSK Baseline
 ├── Movement Screening
 ├── Eligibility
 └── Referral
```

Referral:

```text
Referral
 ├── Athlete
 ├── Related PPE
 ├── Provider
 ├── Appointment
 ├── Outcome
 └── Eligibility update
```

---

# 42. Important “Record Update” Rule

For meaningful workflow actions, consider:

```text
Record update
+
Current status update
+
Timeline event
+
Notification
+
Dashboard refresh
+
Audit event
```

Not every action needs all six, but every major workflow should be checked against them.

---

# 43. API Direction

The source specification includes API surfaces around:

```text
/ppe
/athletes
/movement
/referrals
```

Prototype API behavior can be mocked.

Do not allow API complexity to block workflow construction.

The important thing is to preserve boundaries:

```text
create
read
update
review
eligibility
referral
status
```

with role-aware access.

---

# 44. Audit

Concept:

```text
Actor
Role
Action
Object type
Object ID
Timestamp
Metadata
```

Examples:

```text
Clinician viewed athlete record
Clinician changed eligibility
Physiotherapist reviewed AI result
Operations reassigned referral
Admin changed role
User exported certificate
```

---

# 45. Security & Privacy

SafeSport handles sensitive athlete/health information.

The product architecture should respect:

```text
Role-based access
Minimum-necessary disclosure
Consent
Protected clinical data
Protected movement video
Auditability
Retention/deletion policy
Secure transmission/storage
Server-side authorization
```

The prototype may simulate controls, but the UI should not imply everyone can see everything.

---

# 46. Brand/UI Direction

SafeSport visual identity:

```text
Primary lime green: #72E34D
Background: black / near-black
Secondary: white
Supporting dark green: #174D16
```

Design language:

```text
Modern SaaS
Sports technology
Clinical professionalism
High contrast
Dark surfaces
Lime accents
Clean typography
Subtle glow
Readable data hierarchy
Rounded cards
Purposeful charts
```

Avoid:

```text
Generic hospital UI
Gaming dashboard
Overly neon cyberpunk
Cluttered admin template
```

The product should feel like premium sports-health infrastructure.

---

# 47. Prototype Principle

This is a prototype.

The goal is:

> **Capture the full product vision while keeping implementation simple.**

Prefer:

```text
Clear flow
Connected mock data
Reusable components
Simple state
Visible workflow
Good UX
Believable records
```

Avoid premature:

```text
Microservices
Distributed event systems
Production ML infrastructure
Complex offline conflict resolution
Heavy abstractions
```

It is acceptable to simulate:

```text
AI processing
Realtime updates
Offline sync
Notifications
Referral assignment
Certificate generation
Chat
```

The prototype needs to communicate how the real product will work.

---

# 48. Recommended Build Order

Prototype priority:

```text
1. Shared SafeSport domain/mock data
2. Authentication + role switching
3. Athlete identity/profile
4. Athlete timeline
5. Clinician dashboard
6. PPE workflow
7. Incidents
8. Referrals
9. Eligibility
10. Certificates
11. Physiotherapy / rehabilitation
12. Movement screening
13. AI review
14. Coach/institution views
15. Operations
16. Guardian/athlete views
17. Notifications
18. Realtime simulation
19. Messaging prototype
20. Audit/activity
```

This ordering can change when the user gives explicit priorities.

---

# 49. Do Not Build Yet

Unless explicitly requested, defer:

```text
Full model-training infrastructure
Kubeflow
Complex predictive ML
Distributed event brokers
Complex production offline sync
National federation integrations
Insurance integrations
Laboratory integrations
Telemedicine integrations
Advanced billing
Complex subscription systems
Research data platform
Advanced performance optimization
```

Build the interfaces and domain boundaries now so the real systems can be added later.

---

# 50. How an Agent Should Approach a New Feature

Before coding, answer:

```text
1. Which role uses it?
2. Which athlete/entity does it belong to?
3. What triggers it?
4. What data is entered?
5. What validation is required?
6. What state does it create/update?
7. Who receives the result?
8. Who must not see it?
9. Does it create a notification?
10. Does it belong in the athlete timeline?
11. Is it auditable?
12. Which dashboard surfaces it?
```

Then build the smallest complete flow.

---

# 51. Missing Requirements

When the documents do not define something, use:

```text
TODO: requires product decision
TODO: requires clinical governance
TODO: future implementation
configurable
```

Do not fabricate:

- medical thresholds
- diagnoses
- legal permissions
- clinical judgments
- role permissions
- mandatory fields
- AI claims

Especially do not invent clinical logic.

---

# 52. Common Mistakes

### 1. AI becomes the product

Wrong:

```text
AI → risk → clearance
```

Right:

```text
Athlete record + clinical/care workflows
        +
AI as decision support
```

### 2. Separate athlete records for every organization

Wrong:

```text
School Athlete
Club Athlete
Academy Athlete
```

Right:

```text
One SafeSport Athlete
+
Organization relationships
```

### 3. Every dashboard is identical

Wrong:

```text
same data + same navigation
```

Right:

```text
same domain
+
different permissions
+
different operational needs
```

### 4. Coach gets clinical data

Wrong.

Coach receives participation-relevant information only.

### 5. Referral ends after creation

Wrong.

Referral must move toward documented outcome.

### 6. Every page has independent fake data

Wrong.

Use shared connected mock state.

### 7. Over-engineering

Do not build production infrastructure before validating product flow.

---

# 53. What the Prototype Must Demonstrate

A reviewer should be able to understand this story:

```text
Athlete
  ↓
SafeSport identity
  ↓
Consent
  ↓
PPE / baseline
  ↓
Clinical decision
  ↓
Participation
  ↓
Injury / screening
  ↓
Clinician
  ↓
Referral
  ↓
Physiotherapist
  ↓
Rehabilitation
  ↓
Reassessment
  ↓
Eligibility update
  ↓
Coach / institution sees permitted status
  ↓
Athlete timeline keeps the history
  ↓
Athlete moves to another organization
  ↓
SafeSport identity continues
```

This story is more important than having many disconnected screens.

---

# 54. Final Agent Mental Model

When coding SafeSport, do not ask only:

> “What page am I supposed to build?”

Ask:

> **“What part of the SafeSport athlete journey am I implementing, who performs it, what record does it create/update, what happens next, and who is allowed to see the result?”**

The target architecture is:

```text
SAFE SPORT
   │
   ├── Central athlete identity
   ├── Longitudinal athlete record
   ├── Clinical workflows
   ├── Sports/performance data
   ├── Care/referral workflows
   ├── AI decision support
   ├── Role-based views
   ├── Notifications
   ├── Collaboration
   └── Audit/history
```

The dashboards are **views into SafeSport**.

They are not separate products.

**Build one connected system with many authorized views.**

---

# 55. Quick Reference

```text
PRODUCT
SafeSport = central athlete safety/health/performance infrastructure

CENTER
Persistent athlete identity + longitudinal record

ROLES
Athlete
Guardian
Clinician
Physiotherapist
Coach
Institution
Operations
System Admin

CLINICAL FLOW
Registration
→ Consent
→ History
→ Examination
→ Baseline
→ Movement
→ Review
→ Eligibility
→ Referral
→ Certificate
→ Monitoring

CARE FLOW
Incident/Finding
→ Clinician
→ Referral
→ Physiotherapy/Specialist
→ Rehabilitation
→ Reassessment
→ Eligibility
→ Athlete record

AI FLOW
Video
→ Pose estimation
→ Metrics
→ AI risk signal
→ Human review
→ Clinical interpretation

NON-NEGOTIABLE
Medical eligibility = clinician decision
AI movement risk = decision support
Institutional status = minimum-necessary disclosure

PROTOTYPE
Mock data is fine
Mock realtime is fine
Mock AI is fine
Simple state is fine
Complex infrastructure is not required

READ FIRST
project.md
public/safesport/*
```

---

## Companion file

`project.md` is the full system/product specification.

`AGENTS.md` is the practical onboarding and decision-making guide for coding agents.
