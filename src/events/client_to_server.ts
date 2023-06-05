/**
 * Client to Server events are emitted by the client. Check index documentation for the guide on
 * how to establish a correct connection to socket.io server.
 *
 * Some events are only valid to send in "start" RoomState (check base docs for more info about states)
 *
 * @module
 */

import {RoomState, UUID} from "./base";


/**
 * These events client could emit to a socket.io socket.
 * More details on how to work with these see in base.ts documentation.
 */
export interface ClientToServerEvents {
  "ChatMessageEvent": (event: ChatMessageEvent) => void;

  "BatchSendEvent": (event: BatchSendEvent) => void;
  "BatchRedirectEvent": (event: BatchRedirectEvent) => void;
  "RoomStateChangeEvent": (event: RoomStateChangeEvent) => void;
}


/**
 * Send this only when user issues a game start command so server relays this event
 * (see server_to_client events) and makes this game to be in progress.
 * You may only send "start" state.
 */
export interface RoomStateChangeEvent {
  state: RoomState.Start
}

/**
 * Batches are groups of units (ships) moving from one planet to another.
 *
 * A unit batch send event creates a new batch subtracting current units from the planet.
 * After client emit wait until server relays it back to you
 * (as well as for other players). Server is a single source of truth!
 *
 * Note: check server_to_client "BatchSendEvent" event because it has more fields
 */
export interface BatchSendEvent {
  id: UUID;
  fromPlanetId: number;
  toPlanetId: number;
  count: number;
}

/**
 * Redirect event is sent by client when user selects a batch and redirects it to another planet.
 * Wait until server relays it back to you (as well as for other players) and display changes!
 *
 * Note: check server_to_client "BatchRedirectEvent" event because it has more fields
 */
export interface BatchRedirectEvent {
  batchId: UUID;
  toPlanetId: number;
}

/**
 * New chat message event. Server relays it to all room members.
 */
export interface ChatMessageEvent {
  text: string;
}

