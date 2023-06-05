import {User} from "../models/User";
import Vec2 from "vec2";

export class Planet {

  private _id: number;
  private _owner: User | null;
  private _production: number;  // units per minute
  private _units: number;
  private _center: Vec2;
  private _radius: number;

  constructor(id: number, x: number, y: number, radius: number, production: number) {
    this._id = id;
    this._center = new Vec2(x, y);
    this._radius = radius;

    this._production = production;
  }

  toJSON() {
    return {
      id: this._id,
      owner: this._owner,
      production: this._production,
      units: this._units,
      x: this._center.x,
      y: this._center.y,
      radius: this._radius,
    };
  }

  get center(): Vec2 {
    return this._center;
  }

  set center(value: Vec2) {
    this._center = value;
  }

  get radius(): number {
    return this._radius;
  }

  set radius(value: number) {
    this._radius = value;
  }

  get units(): number {
    return this._units;
  }

  set units(value: number) {
    this._units = value;
  }

  get production(): number {
    return this._production;
  }

  set production(value: number) {
    this._production = value;
  }

  get owner(): User | null {
    return this._owner;
  }

  set owner(value: User | null) {
    this._owner = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }
}
