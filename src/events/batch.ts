// Game Protocol (/ws/room/)
// Client emits & server broadcasts
type UUID = string;

interface BatchSendEvent {
  id: UUID;
  ownerId: number | null;
  fromPlanetId: number;
  toPlanetId: number;
  count: number;
}

// x3, y3
interface BatchRedirectEvent {
  batchId: UUID;
  toPlanetId: number;
}

interface BatchCollisionEvent {
  batchId: UUID;
  planetId: number;
}
