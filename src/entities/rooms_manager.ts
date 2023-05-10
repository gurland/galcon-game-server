import {Room} from "./room";
import {User} from "../models/User";
import {RoomSettings} from "./room_settings";

interface RoomMap {
  [id: number]: Room
}

export class RoomsManager {
  private static _instance: RoomsManager;
  private _rooms: RoomMap = {};

  private constructor() {
    // Private constructor to prevent external instantiation
  }

  private getNextId(): number {
    let maxId: number = -1;

    for (const roomKey in this._rooms) {

      if (this._rooms.hasOwnProperty(roomKey)) {
        const roomId: number = parseInt(roomKey);

        if (maxId === -1 || roomId > maxId) {
          maxId = roomId;
        }
      }
    }

    return maxId + 1;
  }

  public static getManager(): RoomsManager {
    if (!RoomsManager._instance) {
      RoomsManager._instance = new RoomsManager();
    }

    return RoomsManager._instance;
  }

  public getRooms(): Room[] {
    return Object.keys(this._rooms).map(key => this._rooms[parseInt(key)]);
  }

  public getRoomById(roomId: number): Room | undefined {
    return this._rooms[roomId];
  }

  public addRoom(owner: User, settings: RoomSettings): Room {
    const newId: number = this.getNextId();
    this._rooms[newId] = new Room(newId, owner, settings);

    return this._rooms[newId];
  }
}
