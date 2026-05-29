# Provider abstraction (agent)

The "Pip" worker talks to speech/LLM vendors through a small, config-driven
seam so they're swappable without touching agent logic:

- **`types.ts`** — `ProviderConfig` (what to use) and `ProviderBundle`
  (`{ stt, llm, tts }` of `@livekit/agents` interfaces).
- **`config.ts`** — `parseProviderConfig(env)` reads `STT_PROVIDER` /
  `LLM_PROVIDER` / `TTS_PROVIDER` (+ `*_MODEL` / `TTS_VOICE`), defaulting to
  **Deepgram + Gemini + Cartesia**.
- **`factory.ts`** — `createProviders(config)` switches per provider and
  constructs the plugin instances. The default branch calls `assertNever`, so
  adding a provider that isn't handled is a **compile-time** error.

We deliberately use the **cascaded STT → LLM → TTS** pipeline (not Gemini
Realtime) per `MVP.md` — the realtime path has known issues on the Node SDK.

The provider unions list only the vendors we ship plugins for. **To add one:**
install its `@livekit/agents-plugin-*`, add a `case`, and extend the union in
`types.ts`.

## Next step: hexagonal ports/adapters (not done here)

Today the bundle is the LiveKit plugin types directly. The production move is to
define our **own** `SpeechToText` / `LanguageModel` / `TextToSpeech` ports and
wrap the LiveKit plugins as adapters, so the domain depends on our interfaces
rather than a vendor SDK. We deferred that to keep the MVP simple; the factory
already gives us the single seam where those adapters would slot in.
