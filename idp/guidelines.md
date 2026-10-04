# BACSE291 / BAXXX291 — Innovative Design Project: Guidelines Summary

Transcribed 2026-10-04 from two VIT Chennai documents (originals not stored in this public repo):

- Circular *Ref: VITCC/ACAD/2026-2027/05*, dated 27-07-2026, issued by the Dean-Academics
  (scanned images).
- *BACSE291 — Common Guidelines, Review Schedule and Evaluation Rubrics, AY 2026-2027,
  B.Tech CSE and its Specializations*.

If anything here conflicts with the originals, the originals win.

## 1. Course context

Second-year B.Tech project focused on problem-solving, design thinking and a functional prototype
of moderate technical complexity. Evaluated through reviews and a report (100 marks total).

**Course objectives:** apply engineering design principles to real-world problems; develop
models/prototypes with appropriate tools; test, validate and optimise designs; prepare technical
reports and presentations.

**Course outcomes:**
- **CO1** Apply engineering design methodology to practical problems, integrating creativity with
  technical feasibility.
- **CO2** Demonstrate modelling, simulation, prototyping and testing; evaluate solutions for
  performance, safety, cost-effectiveness and sustainability.
- **CO3** Demonstrate teamwork and project-management skills.
- **CO4** Communicate engineering solutions through reports and presentations.

## 2. Ground rules

- Teams of 2–3 students under one faculty guide; meet the guide regularly, **maintain progress
  records**, act on feedback.
- Real-world problem → innovative, feasible, sustainable solution through systematic design and
  implementation. Final outcome: prototype / software application / process model / design
  solution, **with testing, validation and documentation**.
- Equal participation; individual marks may be differentiated by demonstrated contribution and
  answers during reviews.
- Models at **TRL 3** (Technology Readiness Level) are encouraged.
- Publication not mandatory; significant novelty may be considered for **patent filing**.
- HoD conducts panel reviews II, IV(*) and VI. Report format is circulated by coordinators.

(*) The circular says II, IV and VI; the common-guidelines table lists IV as a guide review.
Confirm with the guide.

## 3. Review schedule

| Review | Window | Evaluator | Marks | Expected outcome |
|---|---|---|---|---|
| I | 17–21 Aug 2026 | Guide | 5 | Real-world problem, justified need, objectives, scope, expected outcomes, preliminary literature survey, methodology |
| II | 21–25 Sep 2026 | Panel (School) | 20 | ~20%: requirement analysis, system design, component selection, initial prototype/module |
| III | 12–16 Oct 2026 | Guide | 10 | ~30%: refined requirements and design, justified component/tool selection, initial prototype/module, **follow-up on Review II observations** |
| IV | 25–29 Jan 2027 † | Guide | 15 | ~50%: major modules implemented and integrated, core functionality |
| V | 8–12 Mar 2027 | Panel (School) | 25 | ~80%: all planned modules integrated, validated through testing, complete working prototype |
| VI | 29 Mar–2 Apr 2027 | External panel (Open House) | 15 | Fully functional prototype; prior feedback incorporated; technical quality, performance evaluation, innovation, societal/industrial relevance, future enhancements |
| Report | 2 Apr 2027 | Guide | 10 | Problem, literature review, methodology, implementation, testing, results, innovation, conclusions, future scope, references |

† The scanned circular prints "Jan 25 – Jan 29' 2026"; the common guidelines confirm 2027.

## 4. Evaluation rubrics

### Review I — Problem Identification and Planning (5)
| Parameter | Marks | CO |
|---|---|---|
| Problem relevance and justification | 1 | CO1 |
| Objectives, scope and expected outcomes | 1 | CO1 |
| Preliminary literature survey | 1 | CO1 |
| Proposed methodology and feasibility | 1 | CO1, CO2 |
| Work plan and team responsibilities | 1 | CO3 |

### Review II — Initial Design and Development (20)
| Parameter | Marks | CO |
|---|---|---|
| Requirement analysis and problem understanding | 3 | CO1 |
| System design and architecture | 3 | CO1, CO2 |
| Component/tool selection and technical justification | 3 | CO2 |
| Initial prototype or module development (~20%) | 3 | CO2 |
| Innovation and feasibility | 3 | CO1, CO2 |
| Project planning, teamwork and presentation | 3 | CO3, CO4 |
| Individual contribution and technical response | 2 | CO3, CO4 |

### Review III — Progress Review (10)
| Parameter | Marks | CO |
|---|---|---|
| Follow-up on Review II and progress towards 30% (updated plans, completed tasks, artefacts, demos) | 2 | CO2, CO3 |
| Requirement analysis and system design refinement | 2 | CO1, CO2 |
| Component/tool selection and technical justification | 2 | CO2 |
| Initial prototype/module development and early testing (challenges + corrective actions) | 2 | CO2 |
| Individual contribution, technical understanding and next-stage responsibility | 2 | CO3, CO4 |

### Review IV — Core Functionality and Integration (15)
| Parameter | Marks | CO |
|---|---|---|
| Progress towards 50% completion | 3 | CO2, CO3 |
| Core functionality | 3 | CO1, CO2 |
| Module integration and interface coherence | 3 | CO2 |
| Technical quality and refinement | 2 | CO1, CO2 |
| Documentation, teamwork and next-stage readiness | 2 | CO3, CO4 |
| Individual contribution and technical understanding | 2 | CO3, CO4 |

### Review V — Integrated Prototype and Validation (25)
| Parameter | Marks | CO |
|---|---|---|
| Progress towards 80% completion and integration | 5 | CO2, CO3 |
| Prototype functionality and completeness | 5 | CO1, CO2 |
| Performance, reliability and usability | 5 | CO2 |
| Testing and validation evidence (strategy, cases, results) | 4 | CO2 |
| Innovation, feasibility, relevance and team presentation | 4 | CO1, CO2, CO4 |
| Individual contribution and technical response | 2 | CO3, CO4 |

### Review VI — Open House Evaluation (15)
| Parameter | Marks | CO |
|---|---|---|
| Functional prototype and end-to-end demonstration | 3 | CO2 |
| Technical quality, integration and refinement | 3 | CO1, CO2 |
| Innovation, relevance and practical value | 3 | CO2 |
| Testing, performance and validation evidence | 2 | CO1, CO2 |
| Communication, demonstration readiness and future scope | 2 | CO3, CO4 |
| Individual technical ownership and response | 2 | CO3, CO4 |

### Report Submission (10)
| Parameter | Marks | CO |
|---|---|---|
| Problem definition and literature review | 2 | CO1 |
| Design methodology and implementation | 2 | CO1, CO2 |
| Testing, results and analysis | 2 | CO2 |
| Innovation, conclusions and future scope | 2 | CO1, CO2 |
| Organisation, format, references and technical presentation | 2 | CO4 |

## 5. How this repo maps to the rubrics

| Rubric need | Where it lives |
|---|---|
| Problem, objectives, scope | [../specs/overview.md](../specs/overview.md) |
| Requirement analysis | [../specs/requirements.md](../specs/requirements.md), [../specs/acceptance-criteria.md](../specs/acceptance-criteria.md) |
| System design / architecture / interfaces | [../design/](../design/) |
| Component/tool justification | [../design/tech-stack.md](../design/tech-stack.md), [../design/decisions/](../design/decisions/) |
| Progress %, work plan, follow-up on feedback | [../plan/roadmap.md](../plan/roadmap.md), [reviews/](reviews/) |
| Testing & validation evidence | [../specs/traceability.md](../specs/traceability.md) (+ test reports from Phase-3 on) |
| Progress records ("maintain progress records") | git history + [reviews/](reviews/) |
