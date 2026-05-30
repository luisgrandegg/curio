# ADR-0017: Child-safety screening of extracted concepts

- Status: Accepted
- Date: 2026-05-30
- Deciders: Curio team

## Context

Curio's first non-negotiable is a child's wellbeing. A child photographs a page
and the vision model (Gemini) extracts the concepts that become quiz material.
The model is prompted to stay age-appropriate, and `parse-lesson.ts` already
defends against malformed output — but nothing screened the _content_ of the
concepts before they were put in front of an 8–10-year-old. We never want to
fully trust a model's output on the core child-facing path.

## Decision

Add a deterministic, offline child-safety screen
(`apps/api/src/lessons/safety/concept-safety.ts`) applied in
`LessonsService.createFromImage` _after_ extraction and _before_ persistence.
Each `LessonConcept` (its `label` + `detail`) is matched against a conservative
blocklist of unsafe topics; unsafe concepts are dropped. If nothing safe
remains, the service throws a kind `422` ("try a different page!") rather than
serving an empty or unsafe quiz.

## Consequences

- Defense-in-depth: a model lapse no longer reaches the child unscreened. The
  screen is pure and 100%-covered.
- The blocklist is intentionally conservative — for this age group a false drop
  is far cheaper than a harmful question. A safe lesson could end up with fewer
  than the usual 5–8 concepts; that is an acceptable trade for safety.
- `// PROD:` the blocklist is a fast backstop, not a complete solution — back it
  with a real moderation API (and ideally screen the inbound image too). Marked
  in the source.

## Alternatives considered

- **Screen only via the prompt:** rejected — prompts are not a guarantee, and
  the safety bar here warrants a deterministic check we own.
- **Reject the whole lesson if any concept is unsafe:** rejected as too brittle;
  dropping the offending concept(s) keeps a usable, safe quiz when possible.
- **A live moderation API now:** deferred — adds a dependency/key and latency on
  the load-bearing path; the deterministic screen is the simplest safe start and
  the `// PROD:` note records the upgrade.
