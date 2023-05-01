type UUID = string;

enum GameState {
  Init = "init",
  Start = "start",
  End = "end",
  Pause = "pause" // Won't implement :D
}

// Game Protocol (/ws/room/{roomId})
// Client emits & server broadcasts

interface BatchSendEvent {
  id: UUID;
  ownerId: number | null;
  fromPlanetId: number;
  toPlanetId: number;
  count: number;
}

interface BatchRedirectedEvent {
  batchId: UUID;
  toPlanetId: number;
}

// Only-server emitted events
interface GameStateChangeEvent {
  state: GameState;
}

interface BatchCollisionEvent {
  batchId: UUID;
  planetId: number;
}

interface PlanetOccupiedEvent {
  planetId: number;
  newOwnerId: number;
}
