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
import { createQuizTracker } from "./quiz/tracker.js";
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

    const tracker = createQuizTracker(lesson.concepts);
    const session = new voice.AgentSession({ stt, llm, tts, vad });
    await session.start({
      agent: new voice.Agent({
        instructions: buildPipPrompt(lesson),
        tools: createQuizTools(publisher, tracker),
      }),
      room: ctx.room,
    });

    // Pip opens with a warm greeting + first question, per its instructions.
    await session.generateReply();
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
