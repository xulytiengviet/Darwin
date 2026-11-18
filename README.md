# Darwin EvoDNA — CVNSS4.0 + Base27 + Ternary Seed

**Version 0.2: falsifiable computational-genome hypothesis.** [Interactive site (if Pages deployed)](https://xulytiengviet.github.io/Darwin/) · [Internal preregistration draft](docs/PREREGISTRATION.md) · [Full research specification](docs/RESEARCH.md).

**Status:** Research prototype / simulation only. Not a trained LLM, not a speech recognizer, not a validated xenobot simulator.

Darwin EvoDNA studies how a symbolic seed derived from text or digital speech features could initialize a heritable *computational genome* for evolutionary search, artificial life, communication, and constrained model design.

## What is scientifically new in v0.2?

"CVNSS4.0 as computational DNA" is a **testable architectural analogy**, not evidence that a symbolic code can spontaneously produce an LLM. The research separates:
- **E0 mathematical identity:** 27 symbols ↔ 3 balanced ternary trits (bijection).
- **E1 executable engineering:** text/voice-derived seeds, mutation, selection, and a small genotype-to-phenotype finite-state interpreter.
- **E2 synthetic results:** controlled ablations and paired uncertainty estimates on toy task families.
- **E3 grounded independent validation:** not completed.
- **E4 autonomous LLM, emergent language, living xenobot control:** not established.

**Null hypothesis (H0):** under matched evaluation budgets, a CVNSS4.0-derived seed does **not** improve independent task performance over random and unseeded controls. **Alternative (H1):** robust measurable improvement under a protocol frozen before analysis. A hashing stage does **not** retain Vietnamese semantics; a negative result is valid.

Run the reproducible ablation in Node.js:

\`\`\`bash
npm test
npm run ablation
# or generate full machine-readable data:
node scripts/run-ablation.mjs --mode alife --trials 20 --out results/seed-ablation.json
\`\`\`

The benchmark runs five arms: unseeded, random-seed, Unicode-hash seed, audited CVNSS4.0-hash seed, and CVNSS shuffled-word control. Results are artificial and **are not confirmation of a publishable scientific claim**. The \`src/development.mjs\` automaton is executable but the current fitness evaluator operates on the raw genome, not on automaton behavior: completing this feedback loop is the next important research milestone.

## Five research tracks
1. Evolutionary Computation and Artificial Life (EC / ALife).
2. AI for Science: **in-silico**, non-biological xenobot-inspired swarm/particle proxy.
3. Open-ended search, continual learning, LLM-guided code evolution (LLM integration is only a proposed adapter, **not implemented as an autonomous agent**).
4. Cultural evolution and social learning / emergent communication.
5. Population-based reasoning under non-stationarity, evaluation cost and Goodhart-like reward hacking.

## Critical distinctions
- Actual CVNSS4.0 conversion uses the included audited converter in the browser. The browser text path uses the vendored **CVNSS4.0 v5.0.0-audit-safe converter** from [xulytiengviet/CVNSS4.0](https://github.com/xulytiengviet/CVNSS4.0), then hashes the CVNSS4.0 output into a 24-symbol genome. The pure adapter retains a clearly marked Unicode fallback if the converter is unavailable. This hashing stage is not a reversible codec.
- The audio path quantizes **digital acoustic features** into 27 symbolic states. It is **not ASR, semantic understanding, or reversible waveform coding**.
- The 27 symbols are mapped bijectively to balanced triples of trits; this identity alone provides no proof of better ML performance or compression.
- A seed key is **not a cryptographic secret or a biological genome**. A developmental interpreter, environment, fitness and learning processes are essential.
- Xenobot tab is a **toy mathematical proxy**. It does not model living frog cells, experimental biology, morphogenesis, medical efficacy, or real-world steering by language.
- Forecast bands reflect **repeated simulated random seeds** under the same assumptions, not predictions of real-world success.
- All browser experiments run locally with no API keys and no network transmission of microphone samples.

## Quick start
Open `index.html` via a local web server for full module support and microphone features:

```bash
python -m http.server 8080
# visit http://localhost:8080
```

Live GitHub Pages can serve the same static files from the repository root when Pages is enabled in repository settings.

Run deterministic smoke tests (Node.js 20+):
```bash
npm test
```

## Repository
- `index.html` — research dashboard and accessible controls.
- `assets/style.css` — responsive UI.
- `assets/app.js` — UI logic, browser microphone capture and SVG chart.
- `src/core.mjs` — seeded evolution, Base27/trits, acoustic fingerprint and synthetic Monte Carlo simulator.
- `src/development.mjs` — miniature typed developmental interpreter: genome to deterministic finite-state phenotype.
- `src/ablation.mjs` — paired controlled seed-source experiment and bootstrap uncertainty.
- `scripts/run-ablation.mjs` — reproducible JSON dataset generation.
- `src/cvnss-adapter.mjs` — provenance-preserving adapter and optional fallback.
- `vendor/cvnss-converter.js` — upstream v5.0.0-audit-safe CVNSS4.0 implementation; original code [source](https://github.com/xulytiengviet/CVNSS4.0/blob/main/assets/cvnss-converter.js).
- `tests/core.test.mjs` — test round-trips, determinism and signal conversion.
- `docs/RESEARCH.md` — architecture, five deep niches, hypotheses and falsification.
- `docs/PREFEASIBILITY.md` — milestones, risks, costs, forecast interpretation and stage gates.
- `docs/PREREGISTRATION.md` — H0/H1, outcomes, ablations, falsification rules and evidence ladder.
- `docs/PAGES.md` — GitHub Pages publishing/checks and settings limitations.

## Research standards
Run independent held-out tests, repeated random seeds, matched compute budgets and ablations: random 27-symbol seed vs Unicode hash seed vs genuine CVNSS4.0 seed when adapter exists; binary vs ternary genotype; with and without learning / evolution. Report all negative outcomes. For high-impact tasks, use sandboxed deterministic evaluation and independent safety gates.

## Credits

The original CVNSS4.0 writing system is attributed to Kiều Trường Lâm and Trần Tư Bình; the public audit-safe converter and website are maintained at xulytiengviet/CVNSS4.0. The evolutionary interpretation here is a separate computational research hypothesis.

## License
MIT (see `LICENSE`). This research software does not claim endorsement by cited authors or institutions.
