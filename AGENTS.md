# 🤖 AGENTS.MD — AI GOVERNANCE & INTEGRITY PROTOCOL
**MANDATORY OPERATING POLICY FOR ALL AI AGENTS, PLANNERS AND SUBAGENTS**

Any autonomous agent, code assistant (Antigravity, Cursor, Claude Code, Copilot, Gemini) operating on this repository MUST strictly follow the directives below.

---

## 🔒 1. LOCKED PRODUCTION FILES (DO NOT MODIFY WITHOUT EXPLICIT PERMISSION)
1. `public/assets/kawsar-exact-noise.png` (SHA-256: `7867172cbddd0172eb2fcf5803679ab8fb337eddb8397d43c918788016181409`)
2. `public/_headers` (OWASP Security & Edge Caching policy)
3. `scripts/guard.mjs` (Automated pre-build integrity verifier)
4. `LOCKED_DESIGN_SPEC.md` (Design contract and tokens)

---

## ⚡ 2. MANDATORY DEPLOYMENT RULE
- **Never stop at localhost.**
- Any code edit MUST be validated through `npm run ship` (`npm run guard` ➔ `npm run build` ➔ `wrangler pages deploy`).
- You must verify that the live production URL returns HTTP `200 OK` before completing your turn.

---

## 🛑 3. ZERO IMPROVISATION & ZERO DRIFT
- Do NOT add features, themes or sections that do not exist on `https://kawsar.design/`.
- Do NOT alter casing: `whatsApp` must always have lowercase `w`, `instagram` lowercase `i`.
- Do NOT hardcode staging URLs (`kawsar.zenvq.com`) in `app/` or `components/`. Keep the repository 100% domain-agnostic.
- Do NOT introduce duplicate semantic footer nodes. The DOM must have exactly ONE `<footer>` and ONE `© 2026 All rights reserved.` element.
- Enforce the Zero Oxford Comma policy across all documentation, commits and messages.
