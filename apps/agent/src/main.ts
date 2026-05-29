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
import { buildPipPrompt } from "./prompt.js";
import { createQuizTools } from "./quiz/tools.js";
import { installLlmFallback } from "./resilience.js";
import { fetchSession } from "./session-client.js";

loadEnv();

export default defineAgent({
  entry: async (ctx: JobContext): Promise<void> => {
    await ctx.connect();

    // Room name is the sessionId — read the lesson the child is studying.
    const sessionId = ctx.room.name;
    if (!sessionId) throw new Error("Room has no name (sessionId)");
    const { lesson } = await fetchSession(sessionId);

    const publisher = ctx.room.localParticipant;
    if (!publisher)
      throw new Error("Room has no local participant to publish on");

    const { stt, llm, tts } = createProviders(parseProviderConfig(process.env));
    const vad = await silero.VAD.load();

    const session = new voice.AgentSession({ stt, llm, tts, vad });
    await session.start({
      agent: new voice.Agent({
        instructions: buildPipPrompt(lesson),
        tools: createQuizTools(publisher),
      }),
      room: ctx.room,
    });

    // If the LLM goes down mid-quiz (e.g. provider rate limit), Pip speaks a
    // warm fallback instead of leaving the child in silence.
    installLlmFallback(session, (text) => session.say(text));

    // Pip opens with a warm greeting + first question, per its instructions.
    await session.generateReply();
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
