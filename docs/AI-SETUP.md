# Using the AI rules in any project

The canonical instructions are in `AI-GUIDELINES.md`; they are not tied to Claude or any one tool.

## Included adapters

| Assistant or environment | Entry file |
|---|---|
| Codex / OpenAI coding agents | `AGENTS.md` |
| Claude Code | `CLAUDE.md` |
| Gemini CLI | `GEMINI.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Cursor | `.cursor/rules/kickgent-design.mdc` |
| Any other AI | Give it `AI-GUIDELINES.md` and `DESIGN.md`, or ask it to read those files first. |

## Reuse in another project

Copy `AI-GUIDELINES.md`, `DESIGN.md` and the adapter file relevant to that environment. Adjust only the design tokens and product-specific sections in `DESIGN.md`; keep the UX, accessibility and QA gates intact.

`ai-context.json` is a tool-neutral index for assistants or automation that support custom project context.
