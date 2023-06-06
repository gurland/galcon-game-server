import {Socket} from "./events/base";

export function getRandomFloat(leftBound: number, rightBound: number): number {
  return Math.random() * (rightBound - leftBound) + leftBound;
}

export function disconnectSocketWithError(socket: Socket, errorMessage: string): void {
  socket.emit("ErrorEvent", {message: errorMessage});
  socket.disconnect();
}

export class GameClock {
  private _frameTimeoutId: NodeJS.Timeout | null;

  private _currentTime: number;
  private _fps: number;
  private readonly _frameDuration: number;
  private readonly _frameCallback: (time: number) => void;

  constructor(fps: number, frameCallback: (time: number) => void) {
    this._currentTime = 0;
    this._fps = fps;
    this._frameDuration = 1000 / fps;
    this._frameTimeoutId = null;
    this._frameCallback = frameCallback;
  }

  public start(): void {
    if (!this._frameTimeoutId) {
      this.tick();
    }
  }

  public stop(): void {
    if (this._frameTimeoutId) {
      clearTimeout(this._frameTimeoutId);
      this._frameTimeoutId = null;
    }
  }

  private tick(): void {
    const startTime = Date.now();

    // Execute the frame callback
    this._frameCallback(this._frameDuration);

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    const delay = Math.max(0, this._frameDuration - elapsed);

    this._currentTime += this._frameDuration;
    this._frameTimeoutId = setTimeout(() => {
      this.tick();
    }, delay);
  }
}