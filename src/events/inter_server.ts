export interface InterServerEvents {
  "StartGameEvent": (event: StartGameEvent) => void;
}

export interface StartGameEvent {
  roomId: number,
  date: Date
}
