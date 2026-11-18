# Darwin EvoDNA — Falsifiable computational-genome research protocol

**Document:** DARWIN-PREREG-DRAFT-v0.2  
**Prepared:** 2026-11-18  
**Status:** Version-controlled *internal pre-registration draft*; it has **not** been registered with OSF or any external registry and does not imply confirmatory evidence.  
**Research domain:** Artificial Life, evolutionary computation, emergent symbolic protocols, speech representation, reproducible AI systems.

## 1. Scientific thesis and precise claim boundaries

The phrase **"CVNSS4.0 as computational DNA"** is an architectural analogy. It is testable only after we define:
1. genotype (heritable Base27 symbol sequence);
2. developmental interpreter (deterministically translates genotype into an executable phenotype);
3. phenotype (a program, finite-state agent, communication policy or architecture);
4. variation (mutations, crossover, recombination);
5. environment and fitness (evaluation independent of the genotype author);
6. selection, adaptation, lineage, and held-out validation.

The current Darwin implementation has (1), (2) through the minimal 3-state automaton in `src/development.mjs`, (3) a tiny executable deterministic policy, (4), and (5–6) toy objectives in `src/core.mjs`. **Crucial limitation:** the current evolution fitness evaluates the 24-symbol genome *directly*, and **does not evaluate the automaton phenotype**. The two modules are separately testable, but **the full genotype → phenotype → environment → reproductive selection feedback loop has not yet been integrated**. That is an explicit milestone, not an achieved result.

### Mathematical encoding

The symbol set has 27 members; `i∈{0,...,26}` maps uniquely to
`i−13 = 9*t2 + 3*t1 + t0`, with each balanced trit `t∈{−1,0,+1}`.
This is a simple bijection `27=3^3`; it **does not** establish greater intelligence, power efficiency, information density per physical bit, or compression compared with binary systems. Semantic information is not inherent in an integer label.

### Natural speech, text seed, and genuine genomic semantics

- Voice path (implemented): microphone PCM → fixed-window frequency scoring → **lossy 27-state acoustic fingerprint**. No ASR or semantic interpretation.
- Text path (implemented): Unicode → audited CVNSS4.0 v5.0.0 converter → seeded hash → Base27 genome. Hashing destroys lexical/compositional interpretability. The string is *initialization data*, not a cryptographic key.
- DNA interpretation (partial): Base27 genome → finite-state automaton phenotype; execution on synthetic observations.
- Future genuine meaning test: different paraphrases describing the same task should induce *functionally equivalent* phenotypes under blind evaluations, not merely reproducible hashes.
- Future direct speech bridge: genuine independent ASR + audio tokenizer baselines and out-of-distribution speech samples. Do not claim speech-to-action or neural codec equivalence from the present waveform fingerprint.

## 2. Research questions and null hypotheses

| RQ | Null hypothesis H0 | Alternative hypothesis H1 | Main outcome | Failure / disconfirmation |
| --- | --- | --- | --- | --- |
| RQ1 Initial genome utility | A CVNSS-derived 24-symbol genome provides no held-out benefit over unseeded and random-initialized evolutionary searches under matched evaluation budgets. | CVNSS-derived initialization yields a reproducible positive paired held-out benefit on specified tasks. | Paired held-out score difference and uncertainty | Advantage vanishes on blind task family, is inside uncertainty, or negative |
| RQ2 Developmental expressivity | Ternary genotype decoding into an executable phenotype does not improve adaptability/compactness compared with matched binary or other discrete genotypes. | The constrained developmental genotype improves verified performance per resource unit. | Phenotype task success, complexity, energy and representation cost | No robust benefits at fixed computational and memory budgets |
| RQ3 Speech-to-genome invariance | Distinct speech realizations of the same intent do not yield more functional agreement than unrelated utterances. | After phonetic/semantic grounding, same-intent utterances yield more equivalent functioning phenotypes. | Functional equivalence accuracy on unseen speakers/noise/accents | Same-intent results indistinguishable from random / much worse OOD |
| RQ4 Open-ended and cultural learning | Multiple agent generations only overfit training rewards and do not transfer grounded communication or skills. | Skills/protocols generalize across new partners, environments and tasks with bounded forgetting. | New-partner transfer, composition score, catastrophic forgetting | Success disappears for unseen partners or independent environments |
| RQ5 Expensive scientific evaluation | Guided evolution offers no gain per true evaluator call over strong random/Bayesian/quality-diversity baselines. | Cost-aware selection reduces the evaluator budget needed for verified solutions. | Independent evaluator calls to a defined quality threshold | Surrogate score grows but independent scientific outcome fails |

Claims concerning *xenobots* are **out of scope for current browser verification**; all biological extrapolations require physically valid, independently calibrated simulations, authorized collaborators and dedicated governance.

## 3. Primary computational experiment: fixed-budget seed ablation

**Implementation:** `src/ablation.mjs`, `scripts/run-ablation.mjs`, `tests/ablation.test.mjs`.

Conditions, *identical evolutionary algorithm and evaluation budget*:
- **C0 unseeded:** ordinary random population.
- **C1 random-seed:** a randomly generated 24-symbol genotype initializes 70% of the population.
- **C2 unicode-seed:** seeded hash of normalized Vietnamese Unicode text; same 70% initial share.
- **C3 cvnss-seed:** audited CVNSS4.0 conversion followed by seeded hash; same 70% initial share.
- **C4 cvnss-shuffled-control:** same text with reversed word order, converted through CVNSS4.0 and hashed. This is a **surface-order control**, not a full semantic-mismatch control.

Default preregistration-draft benchmark: 20 paired trials, population=28, generations=35, mutation=.13, random seed=2026, same predefined prompt list of eight sentences. Each trial runs C0–C4 with its paired trial random seed; each arm receives **980 evolutionary candidate evaluations per trial**. The algorithm internally generates extra random scores for a *display-only random diagnostic*, which are **not included in the algorithm’s reported evaluation count**. They are not an independent fair-search baseline and must be excluded from cost-comparison claims. This accounting caveat needs engineering correction before a confirmatory paper.

**Primary metric:** final held-out synthetic score, not final training score. The current 'hold-out' is a deterministic *perturbation of the synthetic target within the same task family*; it is **not real external data**.

**Descriptive inferential method:** paired difference in held-out score per trial; report mean difference and a deterministic 1,000-replicate percentile bootstrap interval across paired trials. No general-population inferential claims are warranted because prompts are a fixed reused list and the task family is synthetic. Baseline selection, multiple-comparison corrections and external hold-out tasks should be frozen in a formal registered protocol *before* empirical confirmatory testing.

**Illustrative gate for subsequent research** (not an inferential test of current results): continue to a blinded external-task study only if C3 consistently outperforms both C0 and C1 with a practically meaningful paired improvement, uncertainty interval above zero, and no negative robustness/efficiency regression. A 0.02 held-out fitness delta is an example engineering effect threshold, **not a justified universal minimum effect**; calibrate with external domain benchmarks before formal registration.

### Exact CLI commands

```bash
npm test
node scripts/run-ablation.mjs --mode alife --trials 20 --population 28 --generations 35 --mutation 0.13 --seed 2026 --out results/alife-ablation.json
node scripts/run-ablation.mjs --mode culture --trials 20 --out results/culture-ablation.json
```

The JSON contains complete rows, per-condition summaries, paired-bootstrap intervals, configuration and limitations. Record git commit SHA, Node.js version, converter version, trial seeds, evaluation budget and artifact checksum. Do not interpret a seed hash as carrying Vietnamese meaning.

## 4. Developmental genotype to phenotype

The 24 Base27 tokens contain 72 balanced trits. `developAgent()` decodes part of these into a 3-state × 3-observation instruction table; `executeAgent()` applies the table to a sequence of discrete observations. The output includes deterministic state transitions, actions, messages and synthetic energy.

This minimal interpreter establishes **functional interpretation** and **computational heredity as a representation**, but it is not learning or autonomously generating an LLM. The remaining step is to replace the direct genome target-matching fitness with an evaluator that **runs the phenotype** in unseen tasks; then selection changes meaningful behavior instead of arbitrary symbol targets.

## 5. Next five-niche experiment stages

### EC / Artificial Life
Implement a resource-limited 2D environment; genotype generates behavioral policy; measure survival, generalization and diversity. Compare equal-budget mutation, crossover, random search, NEAT-like and MAP-Elites approaches. Explicitly distinguish artificial organism simulation from biological life.

### AI for Science / Xenobot-like search
The current "science" score is only geometry-based toy fitness. Define a separate validated physics/surrogate benchmark, scientific reference data, uncertainty, sim-to-real errors and cost per *true* evaluation. Never infer cellular self-replication, biological steering or clinical action from a toy proxy.

### Open-endedness / LLM-guided evolution
Build server-side proposal service (keys never in static Pages), structured typed-IR candidate format, static verification, hardened execution sandbox, hidden test evaluator, novelty archive and rollback. Report candidate generation, training-token cost, failure rates, and held-out algorithmic outcomes. Mere code novelty is not open-ended capability growth.

### Cultural evolution / Social learning
Implement sender–receiver referential games over grounded observations, unseen-agent transfer and compositionality tests, not the present codebook-uniqueness proxy. Maintain a protected stream of observations to prevent recursively generated synthetic data from being accepted as uncontested truth.

### Population-based evolutionary reasoning
Test concept drift and reward hacking by separating editable training feedback from a hidden independent evaluator, logging adaptation lag and worst-case fitness. Report negative results, distribution shift and evaluator overhead.

## 6. Evidence ladder and publication plan

| Evidence level | What can be asserted | Current status |
| --- | --- | --- |
| E0: mathematical | Base27 ↔ 3 trits bijection | Proven by exhaustive 27-value tests |
| E1: engineering | Deterministic converter, seed, evolution simulator and tiny phenotype interpreter | Implemented with automated tests |
| E2: synthetic | Paired ablation differences on toy task family | Executable experiment, condition-specific results only |
| E3: grounded benchmark | Improvement with independent environment/audio/agent tasks at matched cost | Not yet established |
| E4: scientific generalization | Stable emergent language, self-evolving LLM, or physical biological relevance | Not demonstrated |

### Publication-grade manuscripts (conditional, not guaranteed)

1. **Methods / reproducibility paper:** *A Falsifiable Base-27 Computational-Genome Benchmark for Evolutionary Search with CVNSS4.0-Derived Initialization*. Requires independent benchmark datasets, fair baselines and a frozen statistical protocol. A negative-result paper is valid.
2. **Artificial life / emergent communication:** *Developmental Ternary Genotypes for Grounded Agent Communication*. Requires genuine multi-agent grounded transfer, not merely distinct code symbols.
3. **AI for science:** *Cost-Aware Evolutionary Symbolic Search under Expensive Scientific Evaluation*. Requires validated physics/surrogate data and rigorous comparisons with Bayesian optimization.

Q1/Scopus status is **not** determined by a repository, manuscript title or simulated score. Venue fit, originality, external validity, reporting and peer review decide publishability.

## 7. Provenance, audit and research governance

- External CVNSS4.0 converter version 5.0.0-audit-safe is tracked in `vendor/`. Cite the original writing-system contributors (Kiều Trường Lâm and Trần Tư Bình) distinctly from the Darwin implementation.
- Every report must include output type: **mathematical / executable simulation / measured experimental result / scientific hypothesis**.
- Keep held-out sets sealed. Do not modify claimed confirmatory hypotheses after viewing outcomes. Version alterations as new exploratory studies.
- Publish synthetic data generators and full seed lists; never delete negative examples.
- Do not store human speech recordings without explicit permission and a retention policy. Browser microphone processing is local in the current code.
- Do not permit LLM-suggested code to execute outside a restricted sandbox with explicit resource ceilings and independent safety gates.

## Scientific literature

- Stanley & Miikkulainen (2002), NEAT: https://doi.org/10.1162/106365602320169811
- Mouret & Clune (2015), MAP-Elites: https://arxiv.org/abs/1504.04909
- FunSearch (2024): https://www.nature.com/articles/s41586-023-06924-6
- AlphaEvolve (2025): https://arxiv.org/abs/2506.13131
- Darwin Gödel Machine (2025): https://arxiv.org/abs/2505.22954
- Emergent language/social learning (2024): https://www.nature.com/articles/s41467-024-51887-5
- Synthetic data model collapse (2024): https://www.nature.com/articles/s41586-024-07566-y
- Xenobot cellular platform (2021): https://doi.org/10.1126/scirobotics.abf1571
