describe("playSfx", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("creates one Audio instance per effect and reuses it", async () => {
    const playMock = vi.fn(() => Promise.resolve());
    const audioCtor = vi.fn(
      class {
        public preload = "";
        public currentTime = 99;
        public url: string;

        public constructor(url: string) {
          this.url = url;
        }

        public play = playMock;
      },
    );
    vi.stubGlobal("Audio", audioCtor as unknown as typeof Audio);

    const { playSfx } = await import("./sfx");
    playSfx("cardFlipUp");
    playSfx("cardFlipUp");

    expect(audioCtor).toHaveBeenCalledTimes(1);
    expect(playMock).toHaveBeenCalledTimes(2);
    const created = audioCtor.mock.results[0]?.value as { preload: string; currentTime: number };
    expect(created.preload).toBe("auto");
    expect(created.currentTime).toBe(0);
  });

  it("swallows rejected play promises", async () => {
    const playMock = vi.fn(() => Promise.reject(new Error("blocked")));
    const audioCtor = vi.fn(
      class {
        public preload = "";
        public currentTime = 0;
        public play = playMock;
      },
    );
    vi.stubGlobal("Audio", audioCtor as unknown as typeof Audio);

    const { playSfx } = await import("./sfx");
    expect(() => playSfx("youWon")).not.toThrow();

    await Promise.resolve();
  });

  it("handles jsdom-like play implementations that return undefined", async () => {
    const playMock = vi.fn(() => undefined);
    const audioCtor = vi.fn(
      class {
        public preload = "";
        public currentTime = 0;
        public play = playMock;
      },
    );
    vi.stubGlobal("Audio", audioCtor as unknown as typeof Audio);

    const { playSfx } = await import("./sfx");
    expect(() => playSfx("resetBoard")).not.toThrow();
  });

  it("no-ops when Audio is unavailable", async () => {
    vi.stubGlobal("Audio", undefined);

    const { playSfx } = await import("./sfx");
    expect(() => playSfx("successfulMatch")).not.toThrow();
  });
});
