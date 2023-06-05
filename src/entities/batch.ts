import {User} from "../models/User";
import {RoomSettings} from "./room_settings";
import {Planet} from "./planet";
import Vec2 from "vec2";

export class Batch {
  private _id: string;
  private _owner: User;

  private _fromPlanet: Planet;
  private _toPlanet: Planet;

  private _fromPoint: Vec2;
  private _toPoint: Vec2;

  private _count: number;

  constructor(id: string, fromPlanet: Planet, toPlanet: Planet, count: number) {
    this._id = id;

    this._owner = fromPlanet.owner!;

    this._fromPlanet = fromPlanet;
    this._toPlanet = toPlanet;
    this._count = count;

    [this._fromPoint, this._toPoint] = this.getBunchMovementPoints(fromPlanet, toPlanet);
  }

  toJSON(): BatchSendEvent {
    return {
      id: this._id,
      ownerId: this._owner.id,
      fromPlanetId: this._fromPlanet.id,
      toPlanetId: this._toPlanet.id,
      count: this._count
    }
  }

  getBunchMovementPoints(fromPlanet: Planet, toPlanet: Planet) {
    const vectorBetweenCenters = toPlanet.center.subtract(fromPlanet.center, true);

    const normalizedVector = vectorBetweenCenters.normalize(true);
    const centerToBorderVector = normalizedVector.multiply(fromPlanet.radius, true);

    const startPoint = fromPlanet.center.add(centerToBorderVector, true);
    const movementVectorLength = fromPlanet.center.distance(toPlanet.center);
    const movementVector = normalizedVector.multiply(movementVectorLength, true);

    const endPoint = startPoint.add(movementVector, true);
    return [startPoint, endPoint];
  }
}


