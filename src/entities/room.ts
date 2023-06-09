import {User} from "../models/User";
import {RoomSettings} from "./room_settings";
import {PlanetMap} from "./planet_map";
import {Chat} from "./chat"
import {Batch} from "./batch";
import {BatchSendEvent} from "../events/client_to_server";
import {RoomState, UUID} from "../events/base";
import {GameClock} from "../utils";
import {io} from "../app";

export class Room {
  private _id: number;
  private _owner: User;
  private _users: User[];
  private _map: PlanetMap;
  private _chat: Chat;
  private _settings: RoomSettings;
  private _state: RoomState;

  private _batches: Batch[];
  private _gameClock: GameClock;

  constructor(id: number, owner: User, settings: RoomSettings) {
    this._id = id;
    this._owner = owner;
    this._users = [];
    this._state = RoomState.Init;

    this._chat = new Chat();
    this._settings = settings;
    this._map = PlanetMap.generateMap(settings);
    this._batches = [];

    this._gameClock = new GameClock(30, this.gameTickCallback.bind(this));
  }

  private _updateBatchesTick(tickTime: number) {
    const timeInSeconds = tickTime / 1000;

    for (const batch of this._batches) {
      batch.moveForward(timeInSeconds, this._settings.speed);
    }
  }

  private get _collidedBatches() {
    return this._batches.filter(
      batch => batch.haveArrived()
    )
  }

  private get _notCollidedBatches() {
    return this._batches.filter(
      batch => !batch.haveArrived()
    )
  }

  private _handleBatchCollisions() {
    const roomSockets = io.to(this._id.toString());

    for (const batch of this._collidedBatches) {
      const oldOwner = batch.toPlanet.owner;

      // Mutate planet on batch collision
      batch.toPlanet.collide(batch)

      roomSockets.emit("BatchCollisionEvent", batch.collisionEvent)

      const planetOccupiedEvent = batch.toPlanet.getOccupiedEvent(oldOwner)
      if (planetOccupiedEvent)
        roomSockets.emit("PlanetOccupiedEvent", planetOccupiedEvent)
    }

    // Remove all collided batches from the room after all events were fired
    this._batches = this._notCollidedBatches;
  }

  private _handleGameEnd() {
    const roomSockets = io.to(this._id.toString());
    const ownerIds = new Set();

    this._map.planets
      .filter(planet=>planet.owner !== null).forEach(planet=> {
        if (planet.owner)
          ownerIds.add(planet.owner.id);
    })

    // console.log(ownerIds);

    if (ownerIds.size === 1) {
      const winnerCandidateId = [...ownerIds.values()][0] as number;

      const otherPlayersBatchesAliveIds = new Set(
        this._batches.filter(
          batch => batch.owner.id !== winnerCandidateId
        )
      );
      
      if (otherPlayersBatchesAliveIds.size > 0) 
        return

      const winner = this.getUserById(winnerCandidateId);

      this.state = RoomState.End;
      io.to(this._id.toString()).emit("RoomStateChangeEvent", {
        state: RoomState.End,
        winner: winner
      });

      this._gameClock.stop();

      roomSockets.emit("ChatMessageEvent", {
        text: `Server: Game ended! Winner is ${winner?.username}`
      })

      console.log(`Winner was found! Game is ended. Room ID: ${this._id} | Winner: ${winner?.username}`);
    }
  }

  private _cleanupRemovedUserPlanets() {
    for (const planet of this._map.planets) {
      if (planet.owner && !this.getUserById(planet.owner.id)) {
        planet.owner = null;
        io.to(this._id.toString()).emit("PlanetOccupiedEvent", {
          planetId: planet.id,
          newOwnerId: null
        })
      }
    }
  }

  public gameTickCallback(tickTime: number) {
    this._map.produceUnits(tickTime);
    this._cleanupRemovedUserPlanets();
    this._updateBatchesTick(tickTime);
    this._handleBatchCollisions();
    this._handleGameEnd();
  }

  public toJSON() {
    return {
      id: this._id,
      owner: this._owner,
      state: this._state,
      users: this._users,
      map: this._map,
      chatMessages: this._chat,
      settings: this._settings,
      batches: this._batches
    };
  }

  public startGame(): void {
    this._gameClock.start();
  }

  public addUser(user: User): void {
    this._users.push(user);
  }

  public getBatchById(batchId: UUID) {
    // Used for redirect batch
    for (const batch of this._batches) {
      if (batch.id == batchId) return batch
    }
  }

  public addBatch(user: User, batchSendEvent: BatchSendEvent): Batch {
    const fromPlanet = this._map.getPlanetById(batchSendEvent.fromPlanetId);
    const toPlanet = this._map.getPlanetById(batchSendEvent.toPlanetId);

    if (fromPlanet.owner?.id != user.id)
      throw Error("You are not an owner of the planet to send batch from there!");

    if (batchSendEvent.count > fromPlanet.units)
      throw Error("Specified planet has not enough units!");

    const newBatch = new Batch(batchSendEvent.id, fromPlanet, toPlanet, batchSendEvent.count);
    this._batches.push(newBatch);

    return newBatch;
  }

  public removeUserById(userId: number): void {
    const roomSockets = io.to(this._id.toString());
    const user = this.getUserById(userId);

    if (!user) return

    this.map.getPlanetsByOwnerId(userId).forEach(planet => {
      console.log(`Trying to destroy planet of user. Planet and user:`, planet, userId)
      planet.owner = null;
      const planetOccupiedEvent = planet.getOccupiedEvent(user);
      console.log(`planetoccupied`, planetOccupiedEvent)

      if (planetOccupiedEvent)
        roomSockets.emit("PlanetOccupiedEvent", planetOccupiedEvent);
    })

    // TODO: Add complete user defeat
    for (let i = 0; i < this._users.length; i++) {
      if (this._users[i].id == userId){
        this._users.splice(i, 1)
      }
    }
  }

  public getUserById(userId: number): User | undefined {
    for (const user of this._users) {
      if (user.id == userId) return user
    }
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

  get state(): RoomState {
    return this._state;
  }

  set state(value: RoomState) {
    this._state = value;
  }
}
