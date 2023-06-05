import { Planet } from "./planet";
import { RoomSettings } from "./room_settings";
import { getRandomFloat } from "../utils";

export class PlanetMap {
  private _planets: Planet[];
  private _settings: RoomSettings;

  constructor(settings: RoomSettings) {
    this._planets = [];
    this._settings = settings;
  }

  public toJSON(): any {
    return {
      planets: this._planets,
      settings: this._settings
    };
  }

  private getRandomInboundPoint(): [number, number] {
    // Get inner bounds of the rectangle so that planets wont overlap outer bounds
    const [innerLeftX, innerRightX] = [this._settings.maxPlanetRadius, this._settings.width - this._settings.maxPlanetRadius];
    const [innerLeftY, innerRightY] = [this._settings.maxPlanetRadius, this._settings.height - this._settings.maxPlanetRadius];

    const x = getRandomFloat(innerRightX, innerLeftX);
    const y = getRandomFloat(innerRightY, innerLeftY);

    return [x, y];
  }

  public static detectPlanetCollision(planet1: Planet, planet2: Planet, distanceOffset: number) {
    const distance = planet1.center.distance(planet2.center);

    return distance < planet1.radius + planet2.radius + distanceOffset;
  }

  private generatePlanet(planetId: number): Planet {
    let tries = 0;

    while (tries < 30) {
      const [x, y] = this.getRandomInboundPoint();
      const planetProduction = Math.floor(
        getRandomFloat(this._settings.minPlanetProduction, this._settings.maxPlanetProduction)
      );

      const planetRadius = planetProduction * (this._settings.maxPlanetRadius / this._settings.maxPlanetProduction);
      const newPlanet = new Planet(planetId, x, y, planetRadius, planetProduction);
      const collidedPlanets = this._planets.filter((existingPlanet) => {
        return PlanetMap.detectPlanetCollision(existingPlanet, newPlanet, this._settings.distanceOffset);
      });

      if (collidedPlanets.length === 0) {
        return newPlanet;
      }
      tries++;
    }

    return new Planet(planetId, 0, 0, 0, 0);
  }

  public static generateMap(settings: RoomSettings) {
    let map = new PlanetMap(settings);

    for (let i = 0; i < map._settings.planetCount; i++) {
      map._planets.push(
        map.generatePlanet(i)
      );
    }

    return map;
  }
}
