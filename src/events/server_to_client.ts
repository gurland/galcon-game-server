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
  "ChatMessageEvent": (event: ChatMessageEvent) => void;

  "RoomUserJoin": (event: RoomUserJoin) => void;
  "RoomUserLeave": (event: RoomUserLeave) => void;
  "BatchSendEvent": (event: BatchSendEvent) => void;
  "BatchRedirectEvent": (event: BatchRedirectEvent) => void;
  "ErrorEvent": (error: {"message": string}) => void;
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
 * When the room enters a new state this event is fired.
 * See RoomState states documentation for all states descriptions.
 */
export interface RoomStateChangeEvent {
  state: RoomState
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
