# CLAUDE.md — working agreements for DRNDT Studio (holding page)

These rules override anything else for **incremental UI tweaks** (copy, CSS, SVG, layout nudges).

## UI tweak workflow — keep it fast

1. Make the edit(s) in as **few tool calls as possible** — batch several edits into one call instead of one call per change.
2. Run `node scripts/check.mjs` **once** after the edits. That is the entire verification for a tweak. Done.
3. Do **NOT** run `shoot.mjs`, `layout-audit.mjs`, `contrast-audit.mjs`, Lighthouse, or multi-viewport screenshot loops for a tweak. Those run only when the user explicitly asks, or before a deploy.
4. Never `Read` an image file (`*.png`, `*.jpg`, `*.webp`, anything in `shots/` or `reference/`). Audits print text results — trust them. If you want a visual check, ask the user to look at their own preview pane (`node scripts/serve.mjs` → http://127.0.0.1:8787). Reading screenshots back as images bloats the context and slows every following step.
5. Do not re-read files you already read this session; do not grep for things already known.
6. Reply in ≤ 5 lines. No long summaries.

Full verification suites (see §12/§14 of `version auckland/instruction.md`) apply to **milestones and deploys only**, not to tweaks.

## Environment gotchas

- **Mac sleep kills turns:** if the computer sleeps mid-task, the API stream suspends and each stall burns ~17 min before retrying ("StreamSuspended / computer was asleep" in the logs). While actively working with the user, the machine must stay awake — remind the user to run `caffeinate -diums` in a terminal (or disable sleep in System Settings) for the session.
- **No cold `npx -y` downloads per run** (`wrangler`, `modern-web-guidance`, …) — they add minutes each time. Use the local installs under `scripts/node_modules` (`cd scripts && npx wrangler …`).
- Preview server: `node scripts/serve.mjs` → http://127.0.0.1:8787. After editing `public/index.html`, run `node scripts/make-404.mjs` so the 404 stays in sync.
