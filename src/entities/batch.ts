import {User} from "../models/User";
import {Planet} from "./planet";
import Vec2 from "vec2";
import {BatchCollisionEvent} from "../events/server_to_client";

export class Batch {
  private _id: string;
  private _owner: User;

  private _fromPlanet: Planet;
  private _toPlanet: Planet;

  private _fromPoint: Vec2;
  private _toPoint: Vec2;

  private _normalizedVector: Vec2;
  private _currentPoint: Vec2;

  private _count: number;

  constructor(id: string, fromPlanet: Planet, toPlanet: Planet, count: number) {
    if (!fromPlanet.owner)
      throw Error("fromPlanet has no owner, so batch was not created!");

    this._id = id;

    this._owner = fromPlanet.owner;

    this._fromPlanet = fromPlanet;
    this._toPlanet = toPlanet;
    this._count = count;

    const vectorBetweenCenters = toPlanet.center.subtract(fromPlanet.center, true);
    this._normalizedVector = vectorBetweenCenters.normalize(true);

    this._fromPoint = this._getStartPoint(fromPlanet);
    this._toPoint = this._getEndPoint(this._fromPoint, toPlanet);

    this._currentPoint = this.fromPoint.clone();
  }

  public moveForward(time: number, speed: number) {
    const moveVector = this._normalizedVector.multiply(time * speed, true);
    this._currentPoint.add(moveVector);
  }

  public haveArrived() {
    const distanceToPlanetCenter = this._currentPoint.distance(this._toPlanet.center);
    return distanceToPlanetCenter <= this._toPlanet.radius;
  }

  get collisionEvent(): BatchCollisionEvent {
    return {
      batchId: this._id,
      planetId: this._toPlanet.id,
      newPlanetUnits: this._toPlanet.units
    }
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get owner(): User {
    return this._owner;
  }

  set owner(value: User) {
    this._owner = value;
  }
  get fromPlanet(): Planet {
    return this._fromPlanet;
  }

  set fromPlanet(value: Planet) {
    this._fromPlanet = value;
  }
  get toPlanet(): Planet {
    return this._toPlanet;
  }

  set toPlanet(value: Planet) {
    this._toPlanet = value;
  }
  get fromPoint(): Vec2 {
    return this._fromPoint;
  }

  set fromPoint(value: Vec2) {
    this._fromPoint = value;
  }
  get toPoint(): Vec2 {
    return this._toPoint;
  }

  set toPoint(value: Vec2) {
    this._toPoint = value;
  }

  get currentPoint(): Vec2 {
    return this._currentPoint;
  }

  set currentPoint(value: Vec2) {
    this._currentPoint = value;
  }

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
  }

  toJSON() {
    return {
      id: this._id,
      ownerId: this._owner.id,
      fromPlanetId: this._fromPlanet.id,
      toPlanetId: this._toPlanet.id,
      fromX: this._fromPoint.x,
      fromY: this._fromPoint.y,
      toX: this._toPoint.x,
      toY: this._toPoint.y,
      currentX: this._currentPoint.x,
      currentY: this._currentPoint.y,
      count: this._count
    }
  }

  private _getStartPoint(fromPlanet: Planet) {
    const centerToBorderVector = this._normalizedVector.multiply(fromPlanet.radius, true);
    return fromPlanet.center.add(centerToBorderVector, true);
  }

  private _getEndPoint(startPoint: Vec2, toPlanet: Planet) {
    const movementVectorLength = startPoint.distance(toPlanet.center) - toPlanet.radius;
    const movementVector = this._normalizedVector.multiply(movementVectorLength, true);

    return startPoint.add(movementVector, true);
  }
}


