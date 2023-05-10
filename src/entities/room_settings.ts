export class RoomSettings {
  private _planetCount: number;
  private _speed: number;
  private _width: number = 16;
  private _height: number = 9;
  private _maxPlanetRadius: number;
  private _minPlanetProduction: number = 50;
  private _maxPlanetProduction: number = 200;

  constructor(planetCount: number, speed: number) {
    this._planetCount = planetCount;
    this._speed = speed;

    const gameRectArea = this._width * this._height;
    const maxPlanetArea = gameRectArea / this._planetCount;
    this._maxPlanetRadius = Math.sqrt(maxPlanetArea / Math.PI) / 1.3;
  }

  public toJSON(): any {
    return {
      planetCount: this._planetCount,
      speed: this._speed,
      width: this._width,
      height: this._height,
      maxPlanetRadius: this._maxPlanetRadius,
      minPlanetProduction: this._minPlanetProduction,
      maxPlanetProduction: this._maxPlanetProduction
    };
  }


  get maxPlanetProduction(): number {
    return this._maxPlanetProduction;
  }

  set maxPlanetProduction(value: number) {
    this._maxPlanetProduction = value;
  }

  get minPlanetProduction(): number {
    return this._minPlanetProduction;
  }

  set minPlanetProduction(value: number) {
    this._minPlanetProduction = value;
  }

  get maxPlanetRadius(): number {
    return this._maxPlanetRadius;
  }

  set maxPlanetRadius(value: number) {
    this._maxPlanetRadius = value;
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(value: number) {
    this._speed = value;
  }

  get planetCount(): number {
    return this._planetCount;
  }

  set planetCount(value: number) {
    this._planetCount = value;
  }
}