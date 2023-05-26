import {User} from "../models/User";

export interface PlanetOccupiedEvent {
  planetId: number;
  newOwner: User;
}
