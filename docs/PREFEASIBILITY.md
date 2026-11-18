# Darwin EvoDNA — Preliminary feasibility assessment

**Version:** 0.1 | **Assessment date:** 2026-11-18
**Decision level:** Pre-feasibility; NOT a validated technical forecast or investment appraisal.

## Stage-gated plan

| Stage | Illustrative duration | Deliverables | Go / no-go evidence |
|---|---|---|---|
| S0: representation audit | Weeks 1–3 | 27-symbol specification, full trit round trips, authentic CVNSS4.0 adapter contract, acoustic collision/stability tests | Determinism, explicit provenance, defined information loss |
| S1: evolutionary baseline | Weeks 4–8 | Reproducible baselines, 5 task families, independent held-out evaluations, test reports | Improvement relative to matched-budget baselines |
| S2: agent communication and expensive search | Weeks 9–16 | Multi-agent referential games, surrogate search, cost-aware evaluation, uncertainty calibration | Positive held-out transfer and good cost-effectiveness |
| S3: LLM-guided evolutionary programs | Weeks 17–24 | Optional audited server-side LLM proposer, typed sandbox, CI and rollback, adversarial eval | Improvement beyond no-LLM and LLM-only controls |
| S4: external validation | After stage review | Physics-backed simulator, external science collaborators and publication | Independent validation and governance approvals |

All durations are **planning assumptions**, not promised delivery dates.

## Evaluation-volume forecast under fixed assumptions

Default interactive run = 36 individuals × 45 generations = 1,620 synthetic candidate fitness evaluations. A 24-replicate Monte Carlo = 38,880 evaluations, ignoring rendering and population-diversity overhead.

Pure serial evaluator timing sensitivity:

| Cost/evaluation | One 1,620-evaluation run | 24-run envelope |
|---|---:|---:|
| 0.01 s | 16.2 s | 388.8 s (6.48 min) |
| 0.1 s | 162 s (2.7 min) | 3,888 s (64.8 min) |
| 1 s | 1,620 s (27 min) | 38,880 s (10.8 h) |

The browser's current toy fitness functions are much cheaper than these hypothetical expensive evaluations; the table shows *sensitivity to evaluator cost*, not measured performance. Parallelism, batching, caching and surrogate screening change practical runtime. LLM cost requires actual token, price and context budgets.

## Probabilistic outlook interpretation

The dashboard's 10th–90th percentile band is computed from 24 pseudo-random **simulated** experiment runs, with the same task family, seed construction and scoring code. It describes in-model run-to-run variation. It is **not** a probability of success for real LLM generation, original audio understanding or living-cell control.

Expected utility is unknown until validated task data and evaluator cost are measured. Do not interpret numerical fitness such as 0.82 as an 82% biological or AI success rate.

## Priorities (qualitative, expert judgment)

| Track | Software PoC | External validity | Cost exposure | Stage |
|---|---|---|---|---|
| EC / ALife | High | Medium–low until grounded | Low | Start first |
| AI for science / xenobot | High for toy proxy | Very low for wet lab without calibration | Very high | Stop at in-silico until collaboration |
| Open-ended / LLM evolution | Medium–high | Task-dependent | Medium–high | After deterministic harness |
| Cultural evolution | High for multi-agent simulator | Medium for communication, lower for grounded semantics | Medium | In parallel after S1 |
| Universal reasoning / drift | High | Depends on adversarial tests | Medium | Integrate throughout |

## Critical risks and mitigation

- **Seed semantics illusion:** hash-derived symbols may be indistinguishable from random. Use entropy/collision tests and independent functional outcomes.
- **Lossy acoustic fingerprint:** microphone waveform → spectral bucket is non-invertible, noise-sensitive and not ASR. Compare stability under speaker, loudness, accent and microphone shifts; benchmark actual SSL/codec features.
- **Selection bias / Goodhart:** blind test sets, evaluator rotation, independent failures; report generalization gaps.
- **Model collapse:** protect a corpus of independent observations; monitor diversity and rare-tail coverage.
- **Sim-to-real failure:** explicitly prohibit inference from abstract xenobot proxy to cell biology; require domain-validated experimental design.
- **Recursive self-modification:** no unreviewed self-edit in browser; sandboxed backend, resource ceilings, human approval and version-control rollback.
- **Hardware claims:** 27=3³ offers no guarantee of energy gains; measure on actual FPGA/ASIC where relevant.
- **Scientific novelty:** evolutionary algorithms, neuroevolution and emergent communication are established fields. The contribution must be empirical and falsifiable, not a renaming.

## Before any Q1-level submission

- Freeze protocol, source SHA and independent evaluation sets.
- At least three strong baselines plus seed and representation ablations.
- Confidence intervals or uncertainty bootstrap across independent runs.
- Explain how the tasks ground symbols in genuine external signals/actions.
- Release code, configs and data generation scripts; describe negative results.
- Avoid unverified claims of autonomous LLM birth, biological life, or novel physical ternary acceleration.

## Practical deployment

Static files at repository root can be published on GitHub Pages (Settings → Pages → Deploy from a branch → main / root), if the repository owner enables it. Browser microphone APIs require a secure context, usually HTTPS or localhost, and user permission.

No third-party API key belongs in GitHub Pages source code. For future DeepSeek/LLM proposal services, use a user-controlled backend with environment secrets, rate limits, access control, explicit cost accounting and a restricted evaluator sandbox.
