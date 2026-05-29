import type { ReadAloudResponse } from "@curio/types";
import type { TtsProvider } from "./tts-provider.interface.js";

/** The single call the provider needs from Cartesia — SDK/HTTP lives behind it. */
export type CartesiaSynthesize = (input: {
  text: string;
  speed: number;
}) => Promise<ReadAloudResponse>;

/** Cartesia-backed {@link TtsProvider}; all Cartesia specifics are in `synth`. */
export class CartesiaTtsProvider implements TtsProvider {
  constructor(private readonly synth: CartesiaSynthesize) {}

  synthesize(text: string, speed: number): Promise<ReadAloudResponse> {
    return this.synth({ text, speed });
  }
}
