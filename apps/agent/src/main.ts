import { fileURLToPath } from "node:url";
import {
  type JobContext,
  WorkerOptions,
  cli,
  defineAgent,
  voice,
} from "@livekit/agents";
import * as silero from "@livekit/agents-plugin-silero";
import { config as loadEnv } from "dotenv";
import { parseProviderConfig } from "./providers/config.js";
import { createProviders } from "./providers/factory.js";

loadEnv();

// B08 replaces this fixed greeting + placeholder instructions with the full
// Pip prompt (lesson concepts injected) and the quiz tools.
const GREETING =
  "Hi there! I'm Pip. We're going to play a quick question game about what " +
  "you learned today. Ready when you are!";

export default defineAgent({
  entry: async (ctx: JobContext): Promise<void> => {
    await ctx.connect();
    const { stt, llm, tts } = createProviders(parseProviderConfig(process.env));
    const vad = await silero.VAD.load();

    const session = new voice.AgentSession({ stt, llm, tts, vad });
    await session.start({
      agent: new voice.Agent({
        instructions: "You are Pip, a warm, patient study buddy for a child.",
      }),
      room: ctx.room,
    });

    await session.say(GREETING);
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
