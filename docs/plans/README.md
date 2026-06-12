# Action Plans

Phased remediation plans for the improvements register. Ordered **low → high
risk** within each phase; later phases may depend on earlier ones.

**Created:** 2026-06-12

## Phases

| Phase | Focus | Risk | Doc |
| --- | --- | --- | --- |
| **1** | Security quick fixes | Low–medium | [phase-1-security.md](./phase-1-security.md) |
| **2** | Schema sync + features | Medium | [phase-2-sync-and-features.md](./phase-2-sync-and-features.md) |
| **3** | Quality, testing, CI | Low | [phase-3-quality.md](./phase-3-quality.md) |

## How to use

1. Pick a phase.
2. Work through checklist items in order.
3. Mark items done in the phase doc (or via PR references).
4. Update [improvements/README.md](../improvements/README.md) snapshot when a
   priority is fully resolved.

## Estimated effort

| Phase | Effort | Outcome |
| --- | --- | --- |
| 1 | 1–2 days | Production-safe auth |
| 2 | 3–5 days | Feature parity with game stack |
| 3 | 2–3 days | Sustainable maintenance |
