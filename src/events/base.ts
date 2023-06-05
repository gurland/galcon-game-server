import { ExtendedError } from "socket.io/dist/namespace";
import { 
  Socket as SocketIOSocket, 
  Server as SocketIOServer
} from "socket.io";
import {User} from "../models/User";
import {ClientToServerEvents} from "./client_to_server";
import {ServerToClientEvents} from "./server_to_client";
import {InterServerEvents} from "./inter_server";


/**
 * Batches are created by the client, so they assign UUID to them.
 * Server accepts these UUIDs as unique batch identifiers and uses without any change.
 */
export type UUID = string;

/**
 * Dummy documentation for now
 */
export enum RoomState {
  /**
   * Init state means the room was only created and it's current logical state is "lobby".
   * So server waits until user come, they may use chat or start the game.
   * */
  Init = "init",
  /**
   * Start state means that the game is in progress, so all game events, such as batch and planet events
   * are being handled properly. In order to change the state to "End" only one player should own planets
   * */
  Start = "start",
  /** End game state means that no more events will occur except chat ones. Winner is determined! */
  End = "end"
}

/** @ignore */
export interface SocketData {
  user: User;
  roomId: number;
}

/** @ignore */
export class Socket extends SocketIOSocket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> {}


/** @ignore */
export class Server extends SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> {}

/** @ignore */
export type SocketNextListener = (err?: ExtendedError | undefined) => void;
