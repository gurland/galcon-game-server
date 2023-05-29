// Client emits & server broadcasts
type UUID = string;

/**
 * Represents a unit batch send event.
 * Batches are groups of units (ships) moving from one planet to another.
 * It could be both emitted by server and client.
 * @Client
 * After client emit wait until server relays it back to
 * you (as well as for other players). Server is a single source of truth!
 */
interface BatchSendEvent {
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
