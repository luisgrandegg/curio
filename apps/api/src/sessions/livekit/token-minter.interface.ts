/** Mints a room token for a participant. Hides the LiveKit SDK from services. */
export interface TokenMinter {
  mint(
    roomName: string,
    identity: string,
  ): Promise<{ token: string; url: string }>;
}

/** Nest DI token for the configured {@link TokenMinter}. */
export const TOKEN_MINTER = Symbol("TOKEN_MINTER");
