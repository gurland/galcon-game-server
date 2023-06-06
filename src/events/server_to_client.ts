/**
 * Server to Client events are emitted by the server.
 * Server events are SINGLE SOURCE OF TRUTH.

 * Always wait for relayed event from the server in order to ensure it was validated correctly.
 *
 * @module
 */


import {RoomState, UUID} from "./base";
import {User} from "../models/User";

/**
 * These events server emits to a client. Server events are SINGLE
 * More details on how to work with these see in base.ts documentation.
 */
export interface ServerToClientEvents {
  "ErrorEvent": (event: ErrorEvent) => void;
  "ChatMessageEvent": (event: ChatMessageEvent) => void;

  "RoomStateChangeEvent": (event: RoomStateChangeEvent) => void;
  "RoomUserJoin": (event: RoomUserJoin) => void;
  "RoomUserLeave": (event: RoomUserLeave) => void;

  "BatchSendEvent": (event: BatchSendEvent) => void;
  "BatchRedirectEvent": (event: BatchRedirectEvent) => void;
  "BatchCollisionEvent": (event: BatchCollisionEvent) => void;

  "PlanetOccupiedEvent": (event: PlanetOccupiedEvent) => void;
}


/**
 * This event is emitted in case of any error made by client (e.g. joining non-existent room).
 * The server almost always disconnects socket of the client to allow fast debugging.
 */
export interface ErrorEvent {
  message: string
}


/**
 * This event says the client that room is either in idle ("init") or in progress ("start") modes.
 * If only one player is left -- he becomes a winner and server changes the state to "end".
 */
export interface RoomStateChangeEvent {
  state: RoomState
}


/**
 * This event is broadcasted to all room members on new User join.
 */
export interface RoomUserJoin {
  user: User
}

/**
 * This event is broadcasted to all users when a User leaves.
 * If room's state was "start" server will set ownership of left user planets to no one (null)
 */
export interface RoomUserLeave {
  user: User
}

/**
 * Batches are groups of units (ships) moving from one planet to another.
 *
 * Server emits this event when client sends a valid BatchSendEvent (see client_to_server events).
 * Server also calculates start batch point (fromX, fromY) and end point (toX, toY).
 * Server will emit BatchCollisionEvent after the batch with particular UUID arrives to the end point with
 * the given speed from the room settings (obtained by RESTful API)
 *
 * A unit batch send event creates a new batch subtracting current units from the planet.
 * New planet unit count is also sent in this event.
 */
export interface BatchSendEvent {
  id: UUID;
  ownerId: number;

  fromPlanetId: number;
  toPlanetId: number;

  newFromPlanetUnits: number;

  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  currentX: number;
  currentY: number;

  count: number;
}

/**
 * Redirect batch event means that client has to change the direction of a batch from current point
 * (which is sent by server as a point (fromX, fromY)) to a new planet (indicated by (toX, toY).
 */
export interface BatchRedirectEvent {
  batchId: UUID;

  fromX: number;
  fromY: number;
  toX: number;
  toY: number;

  toPlanetId: number;
}

/**
 * This event is emitted by server when a batch arrives to a planet.
 * Server destroys batch so batch's UUID is no longer existing.
 * Server calculates collision consequences, adds new unit counter of the planet and may,
 * as well, emit a PlanetOccupiedEvent if collision caused owner change.
 *
 * Note: check server_to_client "BatchRedirectEvent" event because it has more fields
 */
export interface BatchCollisionEvent {
  batchId: UUID;
  planetId: number;
  newPlanetUnits: number;
}

/**
 * This event is emitted by server when planet owner is changed
 * (generally, after some batch collisions occurs or user disconnects).
 * If user has disconnected `newOwnerId` is set to null
 */
export interface PlanetOccupiedEvent {
  planetId: number;
  newOwnerId: number | null;
}


/**
 * New chat message event. Server would probably embed the sender name into text so don't worry about it.
 */
export interface ChatMessageEvent {
  text: string;
}
