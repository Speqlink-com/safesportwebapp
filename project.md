# SafeSport™ — Project Specification & Agent Guide

> **Purpose:** This document is the working product/architecture guide for the AYOT SafeSport™ prototype.
>
> **Important:** The files placed in `public/safesport/` are the primary source documents for clinical workflow, screens, permissions, AI movement screening, APIs, and database requirements. Agents should read those documents before making assumptions.
>
> **Prototype principle:** Capture the complete product vision and the important workflows, but keep implementation simple. Prefer clear flows, mock data, straightforward state transitions, reusable components, and an obvious user experience over premature enterprise complexity.

---

## 1. What SafeSport Is

SafeSport is not simply a sports injury application and it is not primarily an AI application.

SafeSport is intended to become a **central athlete safety, health, sports-performance, and longitudinal record platform**.

The central idea is:

```text
                         SAFESPORT
                             │
                 ┌───────────┴───────────┐
                 │                       │
        CENTRAL ATHLETE RECORD      WORKFLOW ENGINE
                 │                       │
                 │                 ┌─────┼─────┐
                 │                 │     │     │
                 │              Referral Rehab Events
                 │
        ┌────────┼────────┬────────┬────────┬────────┐
        │        │        │        │        │        │
      School    Club   Clinician  Physio   Coach  Guardian
        │        │        │        │        │        │
        └────────┴────────┴────────┴────────┴────────┘
```

An athlete should have one persistent SafeSport identity and a longitudinal record that can continue through different schools, academies, clubs, teams, sports environments, and stages of life.

For example:

```text
Athlete A
   │
   ├── Primary School
   │    ├── Sports participation
   │    ├── Baseline
   │    └── Health records
   │
   ├── Secondary School
   │    ├── New sports data
   │    ├── Injuries
   │    └── Performance
   │
   ├── Football Academy
   │    ├── Screening
   │    ├── Rehabilitation
   │    └── Readiness
   │
   ├── Professional Club
   │    ├── Existing history
   │    ├── Previous injuries
   │    └── Current eligibility
   │
   └── SafeSport
        └── Persistent longitudinal athlete record
```

The current specifications explicitly define an athlete record containing longitudinal health, injury, rehabilitation, screening, readiness and clearance information. They also define role-specific access to that information.

The broader product vision may eventually include a richer lifelong athlete/learner record, including achievements and other structured sports/education history. That is a product-direction concept, not yet a fully specified implementation requirement in the clinical documents. Do not invent detailed CBC/education schemas unless they are later specified.

---

# 2. Source Documents

Place the supplied SafeSport documents under:

```text
public/
└── safesport/
    ├── AYOT_SafeSport_PPE_Clinical_Instrument_v1.0.pdf
    ├── AYOT_SafeSport_PPE_Digital_Workflow_UI_API_Spec_v1.0.pdf
    └── AYOT_SafeSport_Platform_Concept.pdf
```

Agents should treat these files as the specification source.

They cover:

- SafeSport product concept
- Athlete EMR / longitudinal record
- Clinical PPE / PHPA workflow
- Consent and privacy
- Medical history
- Physical examination
- Musculoskeletal baseline
- Sport-specific assessment
- Movement screening
- AI result review
- Clinical eligibility
- Referrals and closed-loop follow-up
- Digital certificates
- Clinician workflow
- Coach/institution views
- Operations
- Mobile/offline field workflows
- Database structures
- APIs
- Security, permissions and auditing
- AI roadmap

The documents are more authoritative than mock UI assumptions.

---

# 3. Product Philosophy

## 3.1 One athlete, one core record

Do not create isolated athlete records per school or club.

Organizations and teams are relationships around an athlete.

The athlete should remain the central entity.

```text
Athlete
 ├── Organizations
 ├── Teams
 ├── Sports
 ├── PPE assessments
 ├── Consents
 ├── Injuries
 ├── Screenings
 ├── AI results
 ├── Referrals
 ├── Rehabilitation
 ├── Eligibility
 ├── Certificates
 ├── Performance/baseline data
 └── Documents
```

## 3.2 Workflows change; history remains

A referral, screening, injury, or PPE encounter is a workflow/event.

Once completed, the important resulting information becomes part of the athlete's longitudinal record.

The record should show both:

- **Current state**
- **Historical timeline**

## 3.3 Roles see different projections of the same data

Do not duplicate business logic for every dashboard.

The same athlete data is projected differently according to user role and permissions.

For example:

```text
Clinician        → full protected clinical view
Physiotherapist  → assigned movement/rehab + permitted clinical context
Coach            → participation status + restrictions + operational alerts
Institution      → institutional readiness/status and trends
Guardian         → permitted minor status/consent/questionnaire
Athlete          → own permitted record/status
Operations       → scheduling, assignments, workflow management
System Admin     → access/configuration/audit/technical metadata
```

---

# 4. SafeSport Core Mental Model

There are two major kinds of flows.

## 4.1 Longitudinal athlete lifecycle

```text
Registration
    ↓
Consent
    ↓
Baseline / PPE
    ↓
Participation
    ↓
Monitoring
    ↓
Injury / assessment / performance event
    ↓
Treatment / referral / rehabilitation
    ↓
Reassessment
    ↓
Eligibility / return to participation
    ↓
Monitoring again
    ↓
More data added to the same athlete record
```

This is not a one-time process.

It repeats over the athlete's career.

## 4.2 Operational care pipeline

A specific case/problem moves through an operational workflow:

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
Treatment / Physiotherapy / Specialist care
       ↓
Evidence / outcome
       ↓
Reassessment
       ↓
Eligibility decision
       ↓
Athlete record updated
       ↓
Authorized users notified
```

**Important:** The athlete is not the thing moving through a single pipeline. A specific clinical case, referral, incident or screening is what moves through the workflow. The athlete remains the persistent hub.

---

# 5. Core Product Modules

The prototype should visibly represent these major modules:

```text
1. Athlete Identity & Record
2. Organizations / Institutions
3. Teams / Sports
4. Consent & Privacy
5. PPE / PHPA
6. Clinical History
7. Physical Examination
8. Musculoskeletal Baseline
9. Sport-Specific Assessment
10. Movement Screening
11. AI Movement Analysis
12. Injuries / Incidents
13. Referrals
14. Physiotherapy / Rehabilitation
15. Eligibility / Return-to-Play
16. Certificates
17. Scheduling / Events
18. Documents / Reports
19. Notifications
20. Messaging / Chat
21. Audit / Activity
22. Administration
```

Not all modules need deep backend implementation in the prototype.

Every module should have a clear place in the product architecture and a believable UI flow.

---

# 6. User Roles / Dashboards

Current route structure:

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

Keep this role-oriented structure.

Each role is a different operational view of the same SafeSport system.

---

# 7. Clinician Dashboard

The clinician dashboard is the primary clinical work surface.

The clinician should be able to:

- See today's work
- See PPE due
- See incomplete encounters
- See review flags
- Search and lookup athletes
- Open full authorized athlete clinical records
- Start/continue PPE
- Review medical history
- Record vitals
- Perform physical examination
- Record musculoskeletal baseline
- Review sport-specific modules
- Order/perform movement screening where appropriate
- Review AI movement results
- Make the eligibility decision
- Create referrals
- Track referral follow-up
- Generate certificates
- Record monitoring/reassessment
- Review incidents
- Access schedules/events
- See notifications
- Communicate with other authorized staff
- Work offline where the prototype simulates field workflows

### Suggested clinician sidebar

```text
Dashboard

Clinical
  Athletes
  PPE / Assessments
  Incidents
  Eligibility
  Referrals
  Reassessments

Movement & Performance
  Screenings
  AI Reviews
  Baselines

Operations
  Schedule
  Events
  Tasks

Communication
  Notifications
  Messages

Records
  Reports
  Certificates
```

Do not overload the sidebar with every database entity. Use grouped navigation.

---

# 8. Physiotherapist Dashboard

Primary responsibility:

- Assigned athletes
- Functional movement assessments
- Movement screening
- AI result review
- Rehabilitation plans
- Recovery progress
- Referral outcomes
- Reassessment support
- Clinician communication

The physiotherapist should not automatically see unrelated confidential clinical information.

The specification explicitly limits physiotherapist access to assigned movement/rehab data and permitted clinical context.

---

# 9. Coach Dashboard

The coach view is intentionally simplified.

The coach should see:

- Team roster
- Participation status
- Restrictions
- Readiness / operational status where permitted
- Relevant emergency operational alerts
- Upcoming team activities
- Team-level screening/readiness summaries where appropriate
- Acknowledge operational notices
- Authorized communication

Do not expose:

- Full medical history
- Confidential clinician notes
- Mental-health notes
- Detailed examination
- Sensitive medication/clinical information

Coach UI should feel operational and fast, not clinical.

---

# 10. Guardian Dashboard

Focus on:

- Minor's permitted status
- Consent
- Questionnaires
- Upcoming relevant actions
- Participation status
- Authorized documents
- Notifications
- Communication

Do not expose confidential clinician-only content.

---

# 11. Athlete Dashboard

The athlete should eventually be able to access their permitted SafeSport identity and record.

Suggested areas:

```text
Overview
My Health
My Sports
My Assessments
My Injuries
My Rehabilitation
My Eligibility
My Certificates
My Documents
My Activity
Notifications
Messages
```

The prototype can use a simplified version but should make the longitudinal-record idea visible.

---

# 12. Institution Dashboard

Institution users need an organization-level view.

Core widgets:

- Total athletes
- Cleared
- Cleared with monitoring
- Pending
- Restricted
- PPE completion
- Referral completion
- Injury trends
- Screening status
- Athlete readiness
- Upcoming visits/events
- Institutional alerts
- Reports

Institution users should not automatically see protected clinical records.

The institution view is a **status/readiness/operations projection**, not the clinical chart.

---

# 13. Operations Dashboard

Operations coordinates service delivery.

Core areas:

- Calendar
- Appointments
- Events
- Clinician assignments
- Coverage
- Pending tasks
- Overdue referrals
- Facility/provider information
- Service status
- Scheduling conflicts
- Operational notifications
- Basic client/institution management
- Billing/service information where implemented

The original concept explicitly includes event bookings, clinic scheduling, staff assignment and equipment checklists.

---

# 14. System Admin Dashboard

System admin is primarily about system control.

Suggested areas:

```text
Overview
Users
Roles & Permissions
Organizations
Teams / Sports
System Configuration
Workflow Configuration
Audit Logs
Security
Integrations
System Health
```

System admin should not automatically receive unrestricted clinical content.

The specification distinguishes technical metadata/audit access from clinical content.

---

# 15. Athlete Master Record

This is one of the most important screens in SafeSport.

Suggested structure:

```text
Athlete Header
--------------------------------
Photo
Name
SafeSport ID
Age / age group
Current organization
Team
Sport
Current eligibility
Current readiness
Next review
--------------------------------

Overview

Timeline

Health
  PPE
  Medical History
  Examination
  Vitals
  Allergies
  Medication

Sports
  Sports
  Teams
  Position/Event
  Baseline
  Performance

Movement
  Screenings
  AI Results
  Movement History

Injuries
  Incidents
  Treatment
  Referrals
  Rehabilitation
  Return-to-play

Eligibility
  Current status
  Historical decisions
  Restrictions
  Review dates

Documents
  Certificates
  Reports
  Attachments
```

The athlete profile should visually communicate:

> “This is the athlete's SafeSport record across time.”

A timeline is strongly recommended.

---

# 16. PPE / PHPA Clinical Pipeline

The official workflow is:

```text
1. Registration
2. Consent
3. Pre-visit history
4. Private clinician review
5. Physical examination
6. Functional baseline
7. Movement screening (optional/indicated)
8. Clinical decision
9. Referral
10. Digital certificate
11. Monitoring
```

This pipeline should be visible in the UI as a progress/stepper.

Example:

```text
Registration → Consent → History → Exam → Baseline
      → Movement → Review → Eligibility → Referral
      → Certificate → Monitoring
```

Each step has a status:

```text
Not started
In progress
Complete
Needs review
Blocked
Skipped / Not applicable
```

Do not automatically declare clinical “normal” because data is missing.

The clinical instrument explicitly says findings should be recorded as:

```text
Normal
Abnormal
Not assessed
Not applicable
```

---

# 17. Consent Pipeline

Consent is a first-class workflow.

Track:

- Consent type
- Version
- Who provided consent
- Date/time
- Scope
- Withdrawal
- Assent when applicable
- Video consent separately
- Research/AI improvement opt-in separately when applicable
- Electronic signature
- User ID

Do not bundle optional research/model-development consent into mandatory clinical consent.

Missing required consent should block the protected clinical workflow where applicable.

---

# 18. Pre-PPE History

Use structured questions.

Domains include:

- Cardiovascular
- Family cardiac history
- Respiratory
- Neurologic
- Musculoskeletal
- Allergy
- Medication
- Vision/hearing
- Skin/infection
- Mental health
- Female athlete health where relevant
- Previous restriction

Positive answers create contextual follow-up questions and review flags.

A positive answer is **not automatically a diagnosis**.

Example:

```text
Question
“Previous major injury?”

Answer → YES

System opens:
- Injury/condition
- Date/onset
- Treatment
- Investigations
- Specialist
- Current status
- Rehabilitation
- Previous return-to-play decision
```

---

# 19. Clinical Examination

Clinical examination should be structured.

Core domains include:

- General
- Height/weight where clinically appropriate
- Vitals
- Vision
- Cardiovascular
- Respiratory
- Neurologic
- Abdomen where clinically indicated
- Skin
- Musculoskeletal
- Mental health where indicated

Use structured findings plus notes.

Do not build giant free-text-only forms.

---

# 20. Musculoskeletal Baseline

Regions:

```text
Spine
Shoulder
Elbow / Wrist / Hand
Hip
Knee
Ankle / Foot
```

Capture appropriate:

- Range of motion
- Pain
- Stability
- Strength/function
- Previous injury sequelae
- Region-specific observations

Quantitative tests should be configurable by sport/age and should not be treated as universal clearance thresholds unless later clinically approved and validated.

---

# 21. Sport-Specific Modules

The specification provides examples:

### Football

- Knee/ankle
- Concussion
- Hamstring
- Landing/cutting
- Previous lower-limb injury

### Rugby/contact sports

- Concussion
- Cervical spine
- Shoulder
- Knee
- Trauma history

### Athletics

- Running load
- Lower-limb symptoms
- Stress-injury history
- Event demands

### Basketball/volleyball

- Ankle
- Knee
- Landing/jumping
- Shoulder

### Swimming

- Shoulder
- Respiratory history
- Training load

### Racquet sports

- Shoulder
- Elbow/wrist
- Lower-limb loading

### Combat sports

- Concussion/neurologic
- Musculoskeletal
- Skin/infectious considerations

### Gymnastics

- Spine
- Wrist
- Shoulder
- Lower-limb loading

Make the prototype modular so adding sports later is easy.

---

# 22. Movement Screening Pipeline

Movement screening is an adjunct capability.

Current concept protocols include:

- Jump landing
- Single-leg squat
- Sprint acceleration
- Cutting maneuver
- Kicking mechanics where relevant

Video guidance:

- Target ≥1080p
- Target ≥30 fps
- Approx. 3–5 m camera distance
- Adequate lighting
- Required view(s) depending on drill
- Valid movement-video consent

Prototype flow:

```text
Select Athlete
    ↓
Select Drill
    ↓
Camera / Upload
    ↓
Quality Check
    ↓
Upload
    ↓
Processing
    ↓
AI Results
    ↓
Human Review
    ↓
Clinical Interpretation
    ↓
Report / Record Update
```

---

# 23. Offline Mobile Clinical Workflow

The concept specifies field/offline behavior.

Prototype can simulate this without implementing complex synchronization infrastructure.

Desired user experience:

```text
No connection
   ↓
Clinician captures data
   ↓
“Saved locally”
   ↓
Pending sync = 4
   ↓
Connection restored
   ↓
“Syncing...”
   ↓
“Synced”
```

Prototype implementation can use local mock state or local browser storage.

Do not build distributed synchronization algorithms unless required later.

---

# 24. AI Movement Analysis

The AI engine is NOT the authority for medical clearance.

The correct relationship is:

```text
Movement Video
      ↓
Pose Estimation
      ↓
Biomechanical Metrics
      ↓
AI Risk Signal
      ↓
Human Review
      ↓
Clinical Interpretation
```

Current concept examples include:

- Knee valgus angle
- Trunk lean
- Limb symmetry index
- Stabilization time

The AI result must show context such as:

- Value
- Quality/confidence
- Model version
- Processing timestamp
- Reviewer
- Clinical interpretation
- Reviewer action

Possible reviewer actions:

```text
No action
Prevention
Physiotherapy
Further assessment
Other
```

### Critical rule

Never implement:

```text
AI = HIGH RISK
        ↓
NOT CLEARED
```

That is incorrect.

Instead:

```text
AI = HIGH RISK SIGNAL
        ↓
Human review
        ↓
Clinician decision
```

The documents explicitly state that AI must not automatically mark an athlete medically unfit.

---

# 25. Clinical Eligibility

Eligibility statuses defined in the clinical specification include:

```text
CLEARED
CLEARED WITH MONITORING
CLEARED PENDING FURTHER EVALUATION
SPORT-SPECIFIC RESTRICTION
TEMPORARILY NOT CLEARED
NOT CLEARED
```

The UI should make the distinction between:

```text
Clinical Eligibility
        VS
AI / Movement Risk
```

very obvious.

Never merge them into one “risk score.”

Eligibility is a clinician decision.

---

# 26. Red Flags / Escalation

Examples include:

- Exertional chest pain
- Exertional syncope/near-syncope
- Concerning palpitations
- Significant cardiac history
- Concerning family cardiac history
- Concerning neurologic history/current symptoms
- Significant musculoskeletal pain/instability
- Uncontrolled respiratory symptoms
- Anaphylaxis history
- Mental-health/safeguarding concern
- Acute illness/injury making participation unsafe

These are escalation triggers for clinical review.

Do not implement automated diagnosis.

Prototype UI can show:

```text
HIGH PRIORITY — REVIEW REQUIRED

Reason:
Concerning neurologic history

Action:
Open clinical review
```

---

# 27. Referral Pipeline

Referral is a first-class workflow.

Supported referral types include:

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

Referral fields:

```text
Referral ID
Athlete
PPE
Type
Reason
Urgency
Provider/facility
Created date
Appointment date
Status
Outcome
Evidence
Eligibility updated
Closed by
Closed date/time
```

Urgency:

```text
Routine
Priority
Urgent
Emergency
```

Outcome:

```text
Pending
Completed
Further referral
Cleared
Restricted
```

This should feel like a tracked case, not merely a form submission.

---

# 28. Closed-Loop Referral

The important principle:

```text
Referral created
      ↓
Assigned
      ↓
Appointment
      ↓
Assessment/treatment
      ↓
Evidence/outcome
      ↓
Referral updated
      ↓
Eligibility may be updated
      ↓
Athlete timeline updated
```

A referral should not disappear after creation.

Show:

- Who owns it
- Current status
- Due/appointment date
- Last activity
- Outcome
- Next action

Overdue referrals should create an operational/review notification.

---

# 29. Rehabilitation Pipeline

The full concept supports:

- Physiotherapy
- Rehabilitation
- Recovery
- Return-to-play
- Reassessment

Prototype flow:

```text
Injury / Referral
      ↓
Physiotherapy
      ↓
Treatment / Plan
      ↓
Progress
      ↓
Reassessment
      ↓
Ready / Continue Rehab / Refer
      ↓
Clinician Eligibility Decision
```

A rehabilitation record belongs to the athlete timeline.

---

# 30. Incidents / Injuries

Clinicians should be able to quickly record field incidents.

Core information includes:

```text
Athlete
Clinician
Sport
Location
Injury type
Severity
Treatment
Photo/evidence
Timestamp
```

Severity examples:

```text
Minor
Moderate
Severe
Emergency
```

The original clinician mobile workflow explicitly includes injury reporting with notes, photo attachment and signature capture.

The prototype should make incident capture fast.

---

# 31. Certificates

The digital certificate is intentionally small.

Display:

- Athlete name/ID
- Institution
- Sport/position
- Assessment date
- Eligibility status
- Participation restrictions
- Monitoring/follow-up date
- Clinician name/designation
- Signature/verification

Do NOT put the full clinical record on the certificate.

Do NOT expose:

- Detailed medical history
- Mental-health notes
- Medication list
- Family medical history
- Detailed examination
- Raw AI metrics
- Sensitive safeguarding notes

---

# 32. Athlete Timeline

The timeline is critical to the “central athlete hub” vision.

Example:

```text
2026-08-26
PPE completed
Cleared with monitoring

2026-08-22
Physiotherapy follow-up
Knee rehabilitation — session 4

2026-08-18
Movement screening
Jump landing
AI movement-risk signal: Moderate
Reviewed by physiotherapist

2026-08-15
Injury incident
Right ankle sprain
Moderate

2026-07-10
Joined Green Valley Football Club
```

Future records can extend this timeline over many institutions and years.

---

# 33. Documents & Reports

Documents can include:

- PPE reports
- Eligibility certificates
- Movement screening reports
- Injury reports
- Referral evidence
- Rehabilitation documents
- Performance reports
- Other authorized athlete records

Prototype can use mock files and metadata rather than building full document storage.

---

# 34. Realtime Event Model

SafeSport should feel alive.

Use a lightweight realtime/event abstraction in the prototype.

Example event types:

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

Prototype implementation may use:

- local state
- mocked event stream
- lightweight websocket/SSE simulation
- simple polling if necessary

The user experience is more important than building infrastructure too early.

---

# 35. Notifications

Notifications should be treated separately from chat.

Types:

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

Examples:

```text
“PPE for Brian Otieno requires review.”

“Referral for knee assessment is due tomorrow.”

“New movement-screening result is ready for review.”

“Your assigned event starts at 09:00.”

“Physiotherapist completed rehabilitation review.”
```

Notifications should link directly to the relevant record/workflow.

---

# 36. Realtime Chat / Messaging

The original specification does not define a complete chat architecture, but the broader product prototype should reserve space for realtime communication.

The goal is role-to-role collaboration, not social networking.

Useful conversations:

```text
Clinician ↔ Physiotherapist
Clinician ↔ Operations
Physiotherapist ↔ Clinician
Institution ↔ Operations
Authorized care team members
```

Chat should support:

```text
Conversation
Participants
Messages
Timestamp
Read/unread state
Related athlete/case
Related referral/task
Attachments where appropriate
```

For the prototype, keep it simple.

Example:

```text
Conversation
“David Kimani — Knee Referral”

Clinician:
“Please review the functional baseline.”

Physiotherapist:
“Received. I’ll assess him this afternoon.”

System:
“Referral updated → In progress”
```

This demonstrates the workflow connection.

---

# 37. Data Model — Conceptual

Do not over-engineer the database yet.

Think in entities:

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
Musculoskeletal Baseline
Sport Assessment
Movement Screening
AI Result
Incident
Referral
Rehabilitation
Eligibility
Certificate
Appointment/Event
Document
Notification
Conversation
Message
Audit Event
```

The clinical specification provides more exact database field suggestions in the source files.

Agents should consult those before inventing fields.

---

# 38. Important Relationship Model

The central relationships are:

```text
Athlete
  ├── belongs/participates in Organizations
  ├── belongs to Teams over time
  ├── participates in Sports
  ├── has Guardians where applicable
  ├── has Consents
  ├── has PPE Assessments
  ├── has Incidents
  ├── has Movement Screenings
  ├── has AI Results
  ├── has Referrals
  ├── has Rehabilitation
  ├── has Eligibility Decisions
  ├── has Certificates
  ├── has Documents
  └── has Timeline Events
```

Care/workflow relationships:

```text
PPE
  ├── History
  ├── Vitals
  ├── Examination
  ├── MSK Baseline
  ├── Movement Screening
  ├── Eligibility
  └── Referral

Referral
  ├── Athlete
  ├── Related PPE
  ├── Assigned/Receiving Provider
  ├── Appointment
  ├── Outcome
  └── Eligibility update
```

---

# 39. Data Visibility Model

This is a core SafeSport design rule.

Use a minimum-necessary disclosure model.

### Clinician

Can see:

- Full authorized clinical record
- PPE
- Examination
- History
- Referrals
- Eligibility
- Clinical notes
- Relevant movement results

### Physiotherapist

Can see:

- Assigned athlete movement data
- Rehabilitation information
- Functional baseline
- Clinician-reviewed AI interpretation
- Necessary clinical context

Should not automatically see unrelated sensitive clinical notes.

### Coach

Can see:

- Participation status
- Restrictions
- Operational alerts
- Relevant team information

Not the detailed medical record.

### Institution

Can see:

- Readiness/status
- Cleared/restricted/pending
- PPE completion
- Referral completion where appropriate
- Injury trends/aggregates

Not full clinical notes.

### Athlete/Guardian

Can see permitted personal/minor information according to role.

### System Admin

Can access technical metadata, user/access configuration and audit functions according to privileges.

**Authorization must be enforced in the backend/server layer, not merely hidden in the UI.**

For the prototype, demonstrate this clearly in frontend route guards and mock authorization, but keep the architecture ready for server-side enforcement.

---

# 40. Audit Trail

Sensitive operations must be auditable.

Record conceptually:

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
Clinician updated eligibility
Physiotherapist reviewed AI result
Operations reassigned referral
Admin changed user role
User exported certificate
```

Do not treat the audit log as optional decoration.

It is part of the product architecture.

---

# 41. Security & Privacy Principles

The source specification requires:

- Role-based permissions
- Server-side access control
- Encryption in transit and at rest
- Separate policies for clinical notes, institutional status and movement video
- Consent tracking
- Retention/deletion policies
- Auditable sensitive actions
- Minimum-necessary institutional disclosure
- Confidential handling of safeguarding/mental-health information

The prototype may simulate these controls, but UI and architecture must not imply that every role can see everything.

---

# 42. Navigation Philosophy

Avoid giant sidebars.

Navigation should answer:

> “What does this user need to do today?”

Not:

> “What database tables exist?”

Example clinician navigation:

```text
Dashboard
────────────────
Clinical
  Athletes
  Assessments
  Incidents
  Referrals
  Reassessments

Movement
  Screenings
  AI Reviews

Operations
  Schedule
  Events
  Tasks

Communication
  Messages
  Notifications
```

A detail page may contain tabs for related information rather than adding another sidebar item.

---

# 43. Dashboard Design Philosophy

Each dashboard should contain:

```text
Header
   ↓
Context / greeting
   ↓
Critical KPIs
   ↓
Today / Action Required
   ↓
Operational workflow
   ↓
Recent activity
   ↓
Trends / insights
```

Prioritize actionable information.

For example, a clinician should immediately see:

```text
PPE due today
Incomplete assessments
High-priority review flags
Today's appointments
Pending referrals
AI reviews awaiting human interpretation
Recent incidents
```

Do not fill the screen with decorative charts.

---

# 44. Status System

Use clear semantic statuses.

### Eligibility

```text
Cleared
Cleared with monitoring
Pending evaluation
Sport-specific restriction
Temporarily not cleared
Not cleared
```

### Referral

```text
Pending
Assigned
In progress
Overdue
Completed
Further referral
```

### PPE

```text
Not started
In progress
Needs review
Complete
Blocked
```

### AI Screening

```text
Draft
Uploading
Processing
Quality failed
Ready for review
Reviewed
Included in report
```

### Sync

```text
Offline
Pending
Syncing
Synced
Sync failed
```

---

# 45. UI Visual Direction

SafeSport branding:

```text
Primary lime green: #72E34D
Background: black / near-black
White: #FFFFFF
Dark green support tone: #174D16
```

Use:

- Dark modern SaaS surfaces
- Lime accent
- High contrast
- Rounded cards
- Subtle borders
- Soft glow only where useful
- Clean typography
- Dense but readable data tables
- Clear status chips
- Minimal visual noise

The product should feel like:

```text
AI technology
+
sports performance
+
clinical professionalism
+
premium SaaS
```

Do not make the UI look like a generic hospital system.

Do not make it look like a gaming dashboard.

It is a professional sports-health infrastructure platform.

---

# 46. Prototype Implementation Rules

This project is a **prototype**, but it must communicate the full intended system.

That means:

## Build now

- Role-based dashboard routes
- Shared mock data model
- Athlete master profile
- Timeline
- Clinician PPE flow
- Athlete lookup
- Incidents
- Referrals
- Movement screening flow
- AI review flow
- Eligibility
- Certificates
- Physiotherapy/recovery concepts
- Institution/coach status views
- Operations scheduling
- Notifications
- Basic chat prototype
- Audit/activity UI
- Offline/sync simulation
- Responsive layouts

## Simplify

Use:

- Mock data
- Local state
- Simple stores
- Placeholder APIs where necessary
- Fake processing states
- Seeded records
- Simulated realtime events
- Simulated AI output

## Defer

Do not prematurely build:

- Complex ML infrastructure
- Model training pipelines
- Kubeflow
- Distributed processing
- Production synchronization engines
- Complex event-sourcing systems
- Full telemedicine integration
- Full insurance integrations
- Complex billing systems
- Nationwide federation integrations
- Advanced predictive analytics

The source documents themselves identify advanced validated prediction, model calibration, longitudinal analytics and research dashboards as later priorities.

---

# 47. Prototype Data Should Still Feel Real

Use believable linked mock data.

Example:

```text
Athlete:
Brian Otieno
SafeSport ID: ATH-00124
Sport: Football
Team: U18
Organization: Green Valley Academy

PPE:
Completed
Eligibility:
Cleared with Monitoring

Movement Screening:
Jump Landing
AI movement signal:
Moderate

Referral:
Physiotherapy
Status:
In Progress

Rehabilitation:
Session 4 of 6
Next review:
29 Aug 2026
```

The same athlete should appear consistently across:

- clinician
- physiotherapist
- coach
- institution
- guardian
- athlete profile

Do not generate unrelated fake records on every page.

---

# 48. Prototype Seed Data

Create a small connected scenario.

Suggested:

```text
Organizations
  Green Valley Academy
  Nairobi Football Club
  SafeSport Medical Services

Teams
  Green Valley U16 Football
  Green Valley U18 Football
  Nairobi FC U18

Athletes
  Brian Otieno
  Kevin Mutua
  Ian Kamau
  Trey Mwangi
  David Kimani

Users
  Clinician
  Physiotherapist
  Coach
  Institution Admin
  Operations Officer
  Guardian
  Athlete
  System Admin
```

Create linked:

- PPE records
- incidents
- referrals
- screenings
- AI results
- rehab sessions
- eligibility decisions
- schedules
- notifications
- messages

This allows agents to demonstrate cross-dashboard continuity.

---

# 49. Important User Journeys

The prototype should make these journeys demonstrable.

## Journey A — New athlete

```text
Register athlete
  ↓
Create SafeSport ID
  ↓
Consent
  ↓
Health questionnaire
  ↓
PPE
  ↓
Eligibility
  ↓
Certificate
  ↓
Athlete record created/updated
```

## Journey B — Injury at training

```text
Coach / Event
  ↓
Injury happens
  ↓
Clinician opens athlete
  ↓
Incident recorded
  ↓
Assessment
  ↓
Referral
  ↓
Physiotherapist
  ↓
Rehabilitation
  ↓
Reassessment
  ↓
Clinician eligibility update
  ↓
Coach sees permitted status
```

## Journey C — Movement screening

```text
Clinician/Physio
  ↓
Select athlete
  ↓
Select drill
  ↓
Capture/upload video
  ↓
Quality check
  ↓
AI processing
  ↓
AI results
  ↓
Physio/clinician review
  ↓
Clinical interpretation
  ↓
Athlete timeline update
```

## Journey D — Athlete changes organization

```text
Athlete already has SafeSport ID
  ↓
Joins new club
  ↓
New organization relationship created
  ↓
Authorized new users receive permitted record/status
  ↓
Historical data remains attached to athlete
  ↓
New club adds new events/data
```

This journey is central to the SafeSport long-term vision.

---

# 50. Functional Event Example

When a clinician completes an eligibility decision:

```text
Clinician saves eligibility
       ↓
Validate required PPE fields
       ↓
Persist eligibility
       ↓
Create audit event
       ↓
Update athlete current status
       ↓
Generate certificate if applicable
       ↓
Create notification(s)
       ↓
Update relevant dashboards
       ↓
Add timeline event
```

A prototype can simulate this with one shared service/helper rather than implementing an enterprise workflow engine.

---

# 51. “One Source of Truth” Rule

Avoid creating page-specific fake versions of important state.

Bad:

```text
clinician/page.tsx
  const athlete = {...}

coach/page.tsx
  const athlete = {...different data...}

institution/page.tsx
  const athlete = {...another data...}
```

Better:

```text
shared safeSport data
        ↓
role-specific projection
        ↓
dashboard
```

Use shared mock repositories/services/stores for the prototype.

The athlete should remain the same athlete everywhere.

---

# 52. Routing Principle

Current structure:

```text
/dashboard/safesport/
```

Role groups:

```text
/dashboard/safesport/athlete
/dashboard/safesport/clinician
/dashboard/safesport/coach
/dashboard/safesport/guardian
/dashboard/safesport/institution
/dashboard/safesport/operations
/dashboard/safesport/physiotherapist
/dashboard/safesport/sys-admin
```

Shared record routes can be nested under a common SafeSport area if convenient.

Example:

```text
/dashboard/safesport/athletes/[id]
```

or role-specific access points that open the same shared record component.

Do not duplicate athlete profile implementation eight times.

---

# 53. Components Worth Reusing

Create reusable building blocks for:

```text
SafeSportSidebar
SafeSportTopbar
AthleteHeader
AthleteStatus
EligibilityBadge
RiskBadge
ReferralStatus
PPEProgress
Timeline
ActivityFeed
NotificationList
ClinicalFlag
MetricCard
DataTable
AthleteSearch
QuickActionCard
CertificatePreview
ScreeningCard
AIReviewCard
ReferralCard
ScheduleCard
ChatPanel
SyncIndicator
OfflineBanner
AuditLog
```

Use composition rather than huge dashboard components.

---

# 54. Forms Should Follow the Workflow

Avoid one gigantic “edit athlete” form.

Prefer:

```text
Registration
Consent
History
Examination
Baseline
Movement
Eligibility
Referral
Certificate
```

This mirrors the real workflow and keeps prototype development manageable.

Use progressive disclosure where the source documents specify it.

For example:

```text
“No”
```

should not open unnecessary clinical follow-up.

```text
“Yes”
```

should reveal the relevant follow-up fields.

---

# 55. Clinical Safety UI Rules

The UI must communicate clinical governance clearly.

Never say:

```text
AI says athlete is unfit.
```

Prefer:

```text
AI movement-risk signal
Moderate

Human review required
```

Never automatically convert AI metrics into eligibility.

Prefer:

```text
Clinical eligibility
Cleared with monitoring

AI movement-risk signal
Moderate

Reviewed by
Physiotherapist
```

Keep clinical status and AI status separate everywhere.

---

# 56. What “Realtime” Means in the Prototype

Realtime should be visible as behavior.

Example:

```text
Clinician creates referral
          ↓
Physio dashboard updates
          ↓
Notification appears
          ↓
Referral status becomes assigned
```

Or:

```text
Physiotherapist completes AI review
          ↓
Clinician dashboard notification
          ↓
Athlete timeline updates
```

This can be simulated through shared client-side state.

The prototype does not need production-grade infrastructure to demonstrate the concept.

---

# 57. What “Central Athlete Hub” Means

The central hub is NOT merely the athlete profile page.

It is the underlying data relationship.

The mental model is:

```text
                         ATHLETE
                           │
       ┌───────────────────┼────────────────────┐
       │                   │                    │
     Health              Sport              Operations
       │                   │                    │
 PPE / History       Teams / Baseline      Events / Tasks
 Exam / Vitals       Screening             Schedule
 Injury              Performance            Referrals
 Rehab               AI signals
 Eligibility
       │                   │                    │
       └───────────────────┼────────────────────┘
                           │
                        TIMELINE
                           │
                      SAFE SPORT ID
```

Every meaningful workflow should eventually leave an auditable trace on that athlete.

---

# 58. Future Expansion Areas

These are intentionally reserved for later:

- More sophisticated AI injury prediction
- Longitudinal risk analytics
- Performance optimization
- Training load analytics
- Telemedicine integrations
- Insurance integrations
- Laboratory integrations
- National sports federation integrations
- Broader athlete achievements
- Education/arts/learner continuity
- More advanced mobile/offline synchronization
- Advanced reporting
- Research/model-development dashboards

The original concept describes a roadmap from biomechanics screening toward injury prediction and eventually personalized athlete performance optimization.

Do not implement these as complex systems now; make the architecture easy to extend.

---

# 59. Agent Rules

Every coding agent working on SafeSport should follow these rules.

### Rule 1 — Read the SafeSport docs

Before implementing a clinical workflow, inspect:

```text
public/safesport/
```

### Rule 2 — Do not invent clinical rules

If a clinical rule is not specified, do not fabricate it as fact.

Use:

```text
TODO / configurable / requires clinical governance
```

where appropriate.

### Rule 3 — Preserve the central athlete model

New features should normally relate back to:

```text
athlete_id
```

### Rule 4 — Keep role permissions explicit

Ask:

```text
Who creates this?
Who can view it?
Who can edit it?
Who must not see it?
```

### Rule 5 — Keep workflows connected

When a user completes an action, update:

```text
Record
Timeline
Status
Notifications
Relevant dashboard
Audit event
```

as appropriate.

### Rule 6 — Prefer simple prototype architecture

Do not introduce unnecessary:

- microservices
- event brokers
- distributed queues
- complex state machines
- heavy abstractions

unless the prototype genuinely needs them.

### Rule 7 — Build for flow

A functional simple workflow is better than a beautiful dead end.

### Rule 8 — Use realistic connected mock data

The same athlete should appear consistently throughout the application.

### Rule 9 — Do not hide important functionality

The prototype should make the intended product vision visible.

### Rule 10 — Do not expose protected data merely because it exists in mock data

Role-specific views must still respect the intended information boundary.

---

# 60. Definition of “Good” for This Prototype

A good SafeSport prototype should allow someone to understand the entire system by clicking through it.

They should be able to see:

```text
I am an athlete
    ↓
I have a SafeSport identity
    ↓
My record follows me
    ↓
I join a school/club
    ↓
I undergo PPE
    ↓
My clinical record is protected
    ↓
I participate in sport
    ↓
An injury occurs
    ↓
A clinician records it
    ↓
A referral is created
    ↓
A physiotherapist takes over the care task
    ↓
Rehabilitation happens
    ↓
A reassessment occurs
    ↓
A clinician makes the eligibility decision
    ↓
My certificate/status updates
    ↓
My coach sees only what they need
    ↓
My institution sees organizational status
    ↓
My athlete record keeps the history
    ↓
I move to another club
    ↓
My SafeSport identity continues
```

That story is more important than having 100 disconnected screens.

---

# 61. Prototype Completion Checklist

A prototype iteration is strong when:

- [ ] Role-based dashboards exist
- [ ] Shared athlete data exists
- [ ] Athlete detail page exists
- [ ] Athlete timeline exists
- [ ] Clinician PPE workflow exists
- [ ] Consent is represented
- [ ] Clinical eligibility is separate from AI risk
- [ ] Incidents can be recorded
- [ ] Referrals can be created and tracked
- [ ] Physiotherapy/rehabilitation is represented
- [ ] Screening workflow exists
- [ ] AI review workflow exists
- [ ] Certificates are represented
- [ ] Coach sees restricted information
- [ ] Institution sees status/trends
- [ ] Guardian sees permitted information
- [ ] Operations sees scheduling/workflow
- [ ] Notifications work
- [ ] Basic messaging works
- [ ] Offline/sync state is demonstrated
- [ ] Audit activity is represented
- [ ] Shared mock data connects all dashboards
- [ ] The UI communicates the central SafeSport athlete-hub concept

---

# 62. Final Architectural Summary

SafeSport should be understood as:

```text
                         SAFE SPORT
                              │
                  ┌───────────┴───────────┐
                  │                       │
          CENTRAL ATHLETE DATA       WORKFLOW / EVENTS
                  │                       │
        ┌─────────┼─────────┐      ┌─────┼──────────┐
        │         │         │      │     │          │
      Health    Sports   Documents  Care  Tasks   Notifications
        │         │         │      │
        └─────────┼─────────┘      │
                  │                │
             ATHLETE TIMELINE      │
                  │                │
                  └────────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
         Clinician      Physio        Operations
             │             │             │
         ┌───┴───┐      ┌──┴───┐      ┌─┴──────┐
         │ PPE   │      │Rehab │      │Schedule│
         │ Exam  │      │Screen│      │Events  │
         │ Injury│      │ AI   │      │Tasks   │
         │ Refer │      │Review│      │Alerts  │
         └───┬───┘      └──┬───┘      └─┬──────┘
             │             │             │
             └─────────────┼─────────────┘
                           │
                    SHARED ATHLETE
                        RECORD
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
       Coach           Institution        Guardian
         │                 │                 │
   Participation       Readiness         Permitted
   Restrictions        Trends            Status
   Alerts              Reports           Consent
```

### The central principle

> **SafeSport is the persistent athlete data and workflow layer. Dashboards are role-specific views into that shared system.**

AI is a capability inside SafeSport.

Clinical care is a capability inside SafeSport.

Physiotherapy is a capability inside SafeSport.

Scheduling is a capability inside SafeSport.

Notifications and chat are coordination layers around SafeSport.

The **athlete record remains the center**.

The prototype should therefore prioritize:

**continuity → workflow → shared data → role permissions → visible state changes → polished UI**

over unnecessary backend complexity.

---

## Reference to source specifications

The implementation-ready PPE/UI/API specification defines the product layers, role permissions, end-to-end workflow, screen inventory, AI review rules, eligibility engine, referral workflow, dashboards, audit requirements and API/database additions.

The clinical instrument defines the clinical assessment, structured history, examination, movement screening, eligibility categories, referral pathways, escalation logic and minimum-disclosure certificate.

The original platform concept defines the broader SafeSport product as an integrated athlete health, injury prevention, sports medicine, performance and institutional safety platform, including the clinician mobile app, athlete record, AI movement screening, dashboards, rehabilitation and service operations.

Use the files in `public/safesport/` for exact source details and field-level requirements.
