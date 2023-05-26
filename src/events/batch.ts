// Client emits & server broadcasts
type UUID = string;

interface BatchSendEvent {
  // This event is emitted both by the client and server.
  // After emit wait until server relays it back to you (as well as for other players)

  id: UUID;
  ownerId: number | null;  // Set this to null if you are a client
  fromPlanetId: number;
  toPlanetId: number;
  count: number;
}

interface BatchRedirectEvent {
  // This event is emitted both by the client and server
  // After emit wait until server relays it back to you (as well as for other players)

  batchId: UUID;
  currentX: number;
  currentY: number;
  toPlanetId: number;
}

interface BatchCollisionEvent {
  batchId: UUID;
  planetId: number;
  newPlanetUnits: number;
}
