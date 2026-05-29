import { QUIZ_DATA_TOPIC, type QuizMessage } from "@curio/types";

/** The slice of a LiveKit local participant we need to publish updates. */
export interface DataPublisher {
  publishData(
    data: Uint8Array,
    options?: { reliable?: boolean; topic?: string },
  ): Promise<void> | void;
}

/** Publish a structured quiz update on the reliable `quiz` data channel. */
export async function publishQuizMessage(
  publisher: DataPublisher,
  message: QuizMessage,
): Promise<void> {
  const bytes = new TextEncoder().encode(JSON.stringify(message));
  await publisher.publishData(bytes, {
    reliable: true,
    topic: QUIZ_DATA_TOPIC,
  });
}
