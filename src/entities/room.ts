import {User} from "../models/User";
import {RoomSettings} from "./room_settings";
import {PlanetMap} from "./planet_map";
import {Chat} from "./chat"

export class Room {
  private _id: number;
  private _owner: User;
  private _users: User[];
  private _map: PlanetMap;
  private _chat: Chat;
  private _settings: RoomSettings;

  constructor(id: number, owner: User) {
    this._id = id;
    this._owner = owner;
    this._users = [];

    this._chat = new Chat();
    this._settings = new RoomSettings(10, 0.05);
    this._map = PlanetMap.generateMap(this._settings);
  }

  public toJSON(): any {
    return {
      id: this._id,
      owner: this._owner,
      users: this._users,
      map: this._map,
      chat: this._chat,
      settings: this._settings
    };
  }

  public addUser(userId: User): void {
    this._users.push(userId);
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }
  get owner(): User {
    return this._owner;
  }

  set owner(value: User) {
    this._owner = value;
  }
  get users(): User[] {
    return this._users;
  }

  set users(value: User[]) {
    this._users = value;
  }
  get map(): PlanetMap {
    return this._map;
  }

  set map(value: PlanetMap) {
    this._map = value;
  }
  get chat(): Chat {
    return this._chat;
  }

  set chat(value: Chat) {
    this._chat = value;
  }
  get settings(): RoomSettings {
    return this._settings;
  }

  set settings(value: RoomSettings) {
    this._settings = value;
  }
}