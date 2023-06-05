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
  Init = "init",
  Start = "start",
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
