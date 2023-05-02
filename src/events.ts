import { Server } from "socket.io";

type UUID = string;

enum RoomState {
  Init = "init",
  Start = "start",
  End = "end"
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

interface BatchRedirectEvent {
  batchId: UUID;
  toPlanetId: number;
}

// Only-server emitted events
interface RoomStateChangeEvent {
  state: RoomState
}

interface BatchCollisionEvent {
  batchId: UUID;
  planetId: number;
}

interface PlanetOccupiedEvent {
  planetId: number;
  newOwnerId: number;
}

export interface ServerToClientEvents {
  "BatchSendEvent": (event: BatchSendEvent) => void;
  "BatchRedirectEvent": (event: BatchRedirectEvent) => void;
  "RoomStateChangeEvent": (event: GameStateChangeEvent) => void;
  "BatchCollisionEvent": (event: GameStateChangeEvent) => void;
  "PlanetOccupiedEvent": (event: GameStateChangeEvent) => void;
}

export interface ClientToServerEvents {
    "BatchSendEvent": (event: BatchSendEvent) => void;
    "BatchRedirectEvent": (event: BatchRedirectEvent) => void;
}

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents
>();
