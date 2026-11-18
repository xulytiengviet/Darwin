# Darwin EvoDNA — CVNSS4.0 + Base27 + Ternary Seed

**Status:** Research prototype / simulation only. Not a trained LLM, not a speech recognizer, not a validated xenobot simulator.

Darwin EvoDNA studies how a symbolic seed derived from text or digital speech features could initialize a heritable *computational genome* for evolutionary search, artificial life, communication, and constrained model design.

## Five research tracks
1. Evolutionary Computation and Artificial Life (EC / ALife).
2. AI for Science: **in-silico**, non-biological xenobot-inspired swarm/particle proxy.
3. Open-ended search, continual learning, LLM-guided code evolution (LLM integration is only a proposed adapter, **not implemented as an autonomous agent**).
4. Cultural evolution and social learning / emergent communication.
5. Population-based reasoning under non-stationarity, evaluation cost and Goodhart-like reward hacking.

## Critical distinctions
- Actual CVNSS4.0 conversion needs an audited converter. The built-in text path is a Unicode-derived **seed hash fallback**, not a CVNSS4.0 codec.
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
- `src/core.mjs` — no-dependency seeded evolution, Base27/trits, waveform feature tokenizer and Monte Carlo simulator.
- `src/cvnss-adapter.mjs` — explicit extension point for audited CVNSS4.0 conversion.
- `tests/core.test.mjs` — test round-trips, determinism and signal conversion.
- `docs/RESEARCH.md` — architecture, five deep niches, hypotheses and falsification.
- `docs/PREFEASIBILITY.md` — milestones, risks, costs, forecast interpretation and stage gates.

## Research standards
Run independent held-out tests, repeated random seeds, matched compute budgets and ablations: random 27-symbol seed vs Unicode hash seed vs genuine CVNSS4.0 seed when adapter exists; binary vs ternary genotype; with and without learning / evolution. Report all negative outcomes. For high-impact tasks, use sandboxed deterministic evaluation and independent safety gates.

## License
MIT (see `LICENSE`). This research software does not claim endorsement by cited authors or institutions.
