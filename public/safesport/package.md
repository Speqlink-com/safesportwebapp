AYOT SafeSport™

**PRE-PARTICIPATION HEALTH & PERFORMANCE ASSESSMENT (PHPA)**

Clinical Instrument & Digital Workflow — Version 1.0 | 09 August 2026

Purpose: operationalize the pre-participation component of the AYOT SafeSport platform as a structured clinical assessment, medical-eligibility decision, baseline functional assessment and referral pathway. The clinician makes the medical eligibility decision; AI movement analysis is an adjunct and does not independently clear or exclude an athlete.

# 1\. Clinical design principles

- Use a standardized history plus system-based physical examination.
- Complete the assessment in a confidential clinical setting; allow private athlete discussion for sensitive information.
- Record findings as normal, abnormal, not assessed, or not applicable; do not infer normality from missing data.
- Separate Clinical Eligibility Status from AI/Movement Risk Status.
- Positive findings trigger clinical review/referral rather than automatic exclusion unless the examining clinician determines restriction is necessary.
- Use minimum-necessary disclosure to schools/coaches; the full medical record remains in the protected clinical record.
- AI movement thresholds in the current concept are development/research variables until prospectively validated and should not be used alone for medical clearance.

# 2\. Workflow

| **Stage**                    | **Digital action**                                                            | **Output**                |
| ---------------------------- | ----------------------------------------------------------------------------- | ------------------------- |
| 1\. Registration             | Create athlete profile; verify identity and guardian details where applicable | Athlete ID                |
| 2\. Consent                  | Record athlete/parent or guardian consent and privacy acknowledgement         | Consent status            |
| 3\. Pre-visit history        | Athlete/guardian completes health history                                     | Structured history        |
| 4\. Private clinician review | Clinician reviews history and sensitive issues privately with athlete         | Validated history         |
| 5\. Physical examination     | Record vitals and system-based examination                                    | Clinical findings         |
| 6\. Functional baseline      | Musculoskeletal/functional assessment; sport-specific modules                 | Baseline findings         |
| 7\. Movement screening       | Optional/indicated AYOT video screening                                       | Movement profile          |
| 8\. Clinical decision        | Clinician determines eligibility and restrictions                             | Eligibility status        |
| 9\. Referral                 | Create referral/follow-up if needed                                           | Closed-loop referral      |
| 10\. Digital certificate     | Generate minimum-necessary eligibility output                                 | Participation certificate |
| 11\. Monitoring              | Track injury, rehabilitation and reassessment                                 | Longitudinal record       |

# 3\. Athlete registration

| **Field**             | **Required**         | **Format**               |
| --------------------- | -------------------- | ------------------------ |
| Athlete ID            | Yes                  | Auto-generated UUID      |
| Full name             | Yes                  | Text                     |
| Date of birth         | Yes                  | Date                     |
| Age                   | Auto                 | Calculated               |
| Sex                   | Yes                  | Structured field         |
| School/club/academy   | Yes                  | Institution ID           |
| Team                  | Yes                  | Text/ID                  |
| Sport                 | Yes                  | Controlled vocabulary    |
| Position/event        | Yes where applicable | Controlled vocabulary    |
| Guardian name/contact | For minors           | Text/phone               |
| Emergency contact     | Yes                  | Name/phone/relation      |
| PPE date              | Yes                  | Date/time                |
| Examiner              | Yes                  | Clinician ID/designation |

# 4\. Consent, confidentiality and safeguarding

- Confirm informed consent/assent appropriate to age and applicable Kenyan requirements.
- Record who provided consent, date/time, consent scope, and withdrawal status.
- Explain that medical information is confidential and that schools/coaches receive only participation-relevant information unless a lawful/ethical exception applies.
- Provide a private opportunity for the athlete to disclose concerns that may not be shared in front of a parent/guardian.
- Safeguarding concerns must follow the organization's approved safeguarding and mandatory-reporting procedures.

| **Field**                         | **Options**                          |
| --------------------------------- | ------------------------------------ |
| Consent                           | Obtained / Declined / Deferred       |
| Guardian present                  | Yes / No / Not applicable            |
| Private athlete interview offered | Yes / No                             |
| Private interview completed       | Yes / No / Not required              |
| Safeguarding concern              | No / Yes—follow safeguarding pathway |

# 5\. Medical history — athlete/guardian questionnaire

| **Domain**            | **Question**                                                                                                  | **Response**                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Cardiovascular        | Has the athlete ever had chest pain, pressure or discomfort with exercise?                                    | Yes/No/Unknown                     |
| Cardiovascular        | Has the athlete ever fainted or nearly fainted, especially during exercise?                                   | Yes/No/Unknown                     |
| Cardiovascular        | Has the athlete experienced unexplained racing/pounding/irregular heartbeat?                                  | Yes/No/Unknown                     |
| Cardiovascular        | Has the athlete been told they have a heart problem, murmur, high blood pressure or abnormal cardiac test?    | Yes/No/Unknown                     |
| Family cardiovascular | Has a close family member died unexpectedly or suddenly at a young age?                                       | Yes/No/Unknown                     |
| Family cardiovascular | Is there a family history of cardiomyopathy, inherited arrhythmia or other significant heart disease?         | Yes/No/Unknown                     |
| Respiratory           | Asthma, exercise-related breathing difficulty, wheeze or use of an inhaler?                                   | Yes/No/Unknown                     |
| Neurologic            | Previous concussion, seizure, unexplained loss of consciousness, significant headache or neurologic disorder? | Yes/No/Unknown                     |
| Musculoskeletal       | Previous fracture, dislocation, ligament injury, major sprain, muscle/tendon injury or surgery?               | Yes/No                             |
| Musculoskeletal       | Current pain, swelling, instability, weakness or limitation affecting sport?                                  | Yes/No                             |
| General medical       | Chronic illness, hospitalization or major surgery?                                                            | Yes/No                             |
| Allergy               | Medication, food or environmental allergy; anaphylaxis history?                                               | Yes/No                             |
| Medication            | Regular or as-needed medication, including emergency medication?                                              | Yes/No                             |
| Vision/hearing        | Vision/hearing problem affecting participation?                                                               | Yes/No                             |
| Skin/infection        | Skin condition or recurrent infection relevant to sport/contact participation?                                | Yes/No                             |
| Mental health         | Current significant stress, anxiety, low mood, sleep problem, burnout concern or sport-related distress?      | Yes/No/Prefer to discuss privately |
| Female athlete health | Menstrual or energy-availability concerns identified during confidential clinical assessment, where relevant? | Yes/No/Prefer to discuss privately |
| Previous restriction  | Has the athlete ever been restricted from sport by a health professional?                                     | Yes/No                             |

# 6\. Detailed history follow-up

- For every positive response, capture: condition/injury, date/onset, symptoms, treatment, investigations, specialist involved, current status, medication, rehabilitation, and prior return-to-play decision.
- Record previous concussion as a dedicated condition with number of episodes, most recent episode, recovery status and current symptoms.
- Record previous injuries individually rather than as free text alone.
- Record allergies and emergency medication prominently on the clinician view.

# 7\. Physical examination

| **Domain**      | **Required observations / measurements**                                                       | **Result**                         |
| --------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------- |
| General         | General appearance; alertness; acute illness/injury                                            | Normal / Abnormal / N/A            |
| Height/weight   | Height; weight; BMI only where clinically appropriate                                          | Numeric + clinician interpretation |
| Vital signs     | BP; pulse; respiratory rate where indicated; SpO₂ where indicated; temperature where indicated | Numeric                            |
| Vision          | Visual acuity and corrective lenses where relevant                                             | Result                             |
| Cardiovascular  | Heart rate/rhythm; heart sounds; murmurs; peripheral pulses; BP                                | Normal / Abnormal + notes          |
| Respiratory     | Work of breathing; auscultation; wheeze/other findings                                         | Normal / Abnormal + notes          |
| Neurologic      | Mental status; gross neurologic assessment; coordination/balance where indicated               | Normal / Abnormal + notes          |
| Abdomen         | General examination where clinically indicated                                                 | Normal / Abnormal / N/A            |
| Skin            | Relevant lesions/infection/conditions affecting participation                                  | Normal / Abnormal / N/A            |
| Musculoskeletal | Spine, shoulder, elbow/wrist/hand, hip, knee, ankle/foot                                       | Normal / Abnormal + notes          |
| Mental health   | Clinical observation and private discussion where indicated                                    | No concern / Concern / Referral    |

# 8\. Musculoskeletal baseline

| **Region**       | **Assess**                                                               |
| ---------------- | ------------------------------------------------------------------------ |
| Spine            | Alignment/posture; range of motion; pain; neurologic symptoms            |
| Shoulder         | Range of motion; strength/function; pain; instability where relevant     |
| Elbow/wrist/hand | Range of motion; pain; instability; previous injury sequelae             |
| Hip              | Range of motion; pain; strength/function                                 |
| Knee             | Range of motion; pain; effusion; stability; functional symptoms          |
| Ankle/foot       | Range of motion; stability; pain; previous sprain; functional limitation |

Optional quantitative functional tests should be selected by sport/age and clinician capability. Results are baseline measures, not automatic clearance thresholds.

# 9\. AYOT functional movement screening

| **Test**            | **Capture**                                         | **Clinical use**                    |
| ------------------- | --------------------------------------------------- | ----------------------------------- |
| Jump landing        | Frontal + sagittal video; standardized instructions | Landing strategy / control baseline |
| Single-leg squat    | Frontal + sagittal video                            | Lower-limb control baseline         |
| Sprint acceleration | Standardized video where feasible                   | Running mechanics baseline          |
| Cutting maneuver    | Sport-specific standardized maneuver                | Change-of-direction mechanics       |
| Kicking mechanics   | For relevant sports                                 | Sport-specific movement baseline    |

Video requirements from the concept: minimum 1080p, ≥30 fps, approximately 3–5 m camera distance, adequate lighting. These are operational specifications, not validated diagnostic criteria.

# 10\. AI movement analysis — governance

- Store raw movement metrics separately from clinical eligibility.
- AI output must be labelled as decision support / risk signal, not diagnosis.
- Clinician/physiotherapist reviews the output before it becomes part of the athlete report.
- Do not automatically convert knee-valgus, trunk-lean, LSI or stabilization values into medical restriction.
- Track model version, confidence/quality checks, missing frames and reviewer decision.
- Maintain an auditable record of AI output, clinician interpretation and any action taken.

# 11\. Sport-specific module

| **Sport group**            | **Priority additional review**                                                        |
| -------------------------- | ------------------------------------------------------------------------------------- |
| Football                   | Knee/ankle; concussion; hamstring; landing/cutting; previous lower-limb injury        |
| Rugby/contact field sports | Concussion; cervical spine; shoulder; knee; trauma history                            |
| Athletics                  | Running load; lower-limb symptoms; stress-injury history; event-specific demands      |
| Basketball/volleyball      | Ankle; knee; landing/jumping; shoulder                                                |
| Swimming                   | Shoulder; respiratory history; training load                                          |
| Racquet sports             | Shoulder/elbow/wrist; lower-limb loading                                              |
| Combat sports              | Concussion/neurologic history; musculoskeletal injury; skin/infectious considerations |
| Gymnastics                 | Spine; wrist; shoulder; lower-limb loading                                            |
| Other                      | Clinician selects relevant sport-specific module                                      |

# 12\. Clinical eligibility decision

| **Status**                         | **Definition**                                                            | **Platform action**                    |
| ---------------------------------- | ------------------------------------------------------------------------- | -------------------------------------- |
| CLEARED                            | Medically eligible for unrestricted participation                         | Issue eligibility certificate          |
| CLEARED WITH MONITORING            | Eligible with specified monitoring/prevention measures                    | Record plan + review date              |
| CLEARED PENDING FURTHER EVALUATION | Participation decision contingent on specified evaluation                 | Create referral/follow-up task         |
| SPORT-SPECIFIC RESTRICTION         | Eligible for selected activities but restricted from specified activities | Display exact restrictions             |
| TEMPORARILY NOT CLEARED            | Not currently medically eligible pending evaluation/treatment             | Referral + reassessment required       |
| NOT CLEARED                        | Clinician determines participation is not medically appropriate           | Document rationale + follow-up pathway |

# 13\. Red-flag / escalation logic

These are clinician escalation triggers, not automated diagnoses. A positive trigger requires clinical review and appropriate referral/testing.

- Exertional chest pain, exertional syncope/near-syncope, concerning palpitations, known significant cardiac disease, concerning family history or abnormal cardiovascular examination → clinician cardiovascular pathway.
- Unresolved concussion symptoms, seizure history or concerning neurologic findings → neurologic/concussion pathway.
- Current significant musculoskeletal pain, instability, swelling, functional limitation or suspected acute injury → sports medicine/physiotherapy pathway.
- Uncontrolled respiratory symptoms or exercise-limiting breathing problems → respiratory pathway.
- Significant allergy/anaphylaxis history → emergency action plan review.
- Significant mental-health or safeguarding concern → confidential clinical/safeguarding pathway.
- Any acute illness or injury that makes immediate participation unsafe → temporary restriction until clinically assessed.

# 14\. Referral module

| **Field**           | **Values**                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Referral type       | Sports physician / Physiotherapy / Orthopaedics / Cardiology / Neurology / Respiratory / Mental health / Nutrition / Ophthalmology / Other |
| Reason              | Structured finding + free-text detail                                                                                                      |
| Urgency             | Routine / Priority / Urgent / Emergency                                                                                                    |
| Receiving provider  | Name/facility                                                                                                                              |
| Referral date       | Date                                                                                                                                       |
| Appointment date    | Date                                                                                                                                       |
| Outcome             | Pending / Completed / Further referral / Cleared / Restricted                                                                              |
| Evidence attached   | Yes/No                                                                                                                                     |
| Eligibility updated | Yes/No                                                                                                                                     |

# 15\. Athlete Safety Status vs AI Risk Status

| **Clinical eligibility** | **AI/movement status** | **Interpretation**                                                                                      |
| ------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------- |
| Cleared                  | Low                    | Eligible; routine prevention                                                                            |
| Cleared                  | Moderate/Elevated      | Eligible; targeted prevention/monitoring                                                                |
| Cleared                  | High                   | Eligible only if clinician agrees; targeted assessment/intervention; do not label 'unfit' from AI alone |
| Restricted/Pending       | Any                    | Clinical decision takes precedence                                                                      |
| Not Cleared              | Any                    | No participation until clinician determines next step                                                   |

# 16\. Digital certificate — minimum disclosure

AYOT SafeSport™ Athlete Medical Eligibility Certificate

| **Field**            | **Value**                                |
| -------------------- | ---------------------------------------- |
| Athlete              | Name/ID                                  |
| Institution          | School/club/academy                      |
| Sport                | Sport + position/event                   |
| Assessment date      | Date                                     |
| Eligibility          | One approved status                      |
| Restrictions         | Only participation-relevant restrictions |
| Monitoring/follow-up | Date or requirement                      |
| Clinician            | Name + professional designation          |
| Authentication       | Digital signature / verification ID      |

Do not expose the full history, examination findings, mental-health details, medication list or unrelated clinical notes on the institutional/coach view unless disclosure is clinically, legally or ethically justified.

# 17\. Reassessment triggers

- New significant injury or concussion
- Hospitalization or major illness
- New chronic diagnosis or significant medication change
- New cardiovascular/neurologic symptoms
- Return after prolonged absence where clinical review is indicated
- Completion of rehabilitation
- Change in sport/level where additional assessment is clinically appropriate
- Clinician-defined review date

# 18\. Core database additions

| **Table**        | **Core fields**                                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ppe_assessments  | ppe_id, athlete_id, date, examiner_id, consent_status, history_status, exam_status, eligibility_status, restrictions, followup_date, signed_at |
| ppe_history      | ppe_id, domain, question_code, response, onset_date, details, verified_by                                                                      |
| ppe_vitals       | ppe_id, height, weight, BP_sys, BP_dia, pulse, resp_rate, spo2, temperature                                                                    |
| ppe_examination  | ppe_id, system, finding_code, result, notes                                                                                                    |
| ppe_msk_baseline | ppe_id, body_region, test_code, side, result, units, notes                                                                                     |
| ppe_referrals    | referral_id, ppe_id, type, reason, urgency, provider, status, outcome                                                                          |
| eligibility      | eligibility_id, ppe_id, status, sport_scope, restrictions, rationale, clinician_id, valid_from, review_date                                    |
| ai_screenings    | screening_id, athlete_id, model_version, drill, quality_score, metrics, risk_output, reviewer_id, clinical_interpretation                      |
| consents         | consent_id, athlete_id, consent_type, version, obtained_by, timestamp, withdrawal_status                                                       |

# 19\. API endpoints to add

| **Endpoint**                               | **Purpose**                                       |
| ------------------------------------------ | ------------------------------------------------- |
| POST /ppe                                  | Create PPE encounter                              |
| GET /ppe/{ppe_id}                          | Retrieve PPE record according to role permissions |
| POST /ppe/{ppe_id}/history                 | Save structured history                           |
| POST /ppe/{ppe_id}/examination             | Save examination findings                         |
| POST /ppe/{ppe_id}/vitals                  | Save vitals                                       |
| POST /ppe/{ppe_id}/eligibility             | Record clinician eligibility decision             |
| POST /ppe/{ppe_id}/referrals               | Create referral                                   |
| PATCH /referrals/{referral_id}             | Update referral outcome                           |
| GET /athletes/{athlete_id}/eligibility     | Return minimum-necessary participation status     |
| GET /athletes/{athlete_id}/clinical-record | Restricted clinical record                        |
| POST /ppe/{ppe_id}/certificate             | Generate signed certificate                       |

# 20\. MVP implementation priority

| **Priority** | **Build now**                                                                                                                   | **Defer**                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| P0           | Registration, consent, history, vitals, system exam, musculoskeletal baseline, eligibility, referrals, certificate, audit trail | Advanced AI prediction            |
| P1           | Sport-specific modules, rehabilitation linkage, reassessment triggers, institutional dashboard                                  | Complex predictive models         |
| P2           | Validated movement-risk models, longitudinal analytics, model calibration, research dashboards                                  | Performance optimization features |

# 21\. Clinical governance requirements

- Nominate a clinical lead responsible for the PPE protocol and eligibility policy.
- Define which professional cadres may conduct each component and the required supervision/referral arrangements under Kenyan professional rules.
- Create SOPs for emergencies, safeguarding, concussion, cardiac red flags, referral and data disclosure.
- Audit positive screens, referrals, completion of referrals, restrictions and adverse events.
- Validate the PPE workflow prospectively before using aggregated data to claim injury-prevention effectiveness.
- Maintain model governance for AI: versioning, validation, bias/performance monitoring, human review and incident reporting.

# 22\. Implementation note

This instrument operationalizes the PPE component of the uploaded AYOT SafeSport concept and technical specification. It deliberately retains the concept's movement-screening drills and digital EMR architecture while separating medical eligibility from AI risk scoring. Before clinical deployment, AYOT should have the protocol reviewed and approved by its designated clinical governance lead and aligned with applicable Kenyan professional, safeguarding, consent and data-protection requirements.

# 23\. Evidence basis used for design

The design was cross-checked against current publicly available guidance from the American Academy of Pediatrics and American Heart Association. The AAP describes PPE as a structured health-and-safety evaluation with history, system-based examination and medical-eligibility determination, and recommends private review of sensitive history. The AHA recommends targeted cardiovascular personal/family history and physical examination for young competitive athletes and emphasizes referral/follow-up when screening raises concern. These sources are used as design references, not as substitutes for Kenyan clinical/regulatory approval.