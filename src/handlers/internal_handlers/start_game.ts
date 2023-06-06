import {StartGameEvent} from "../../events/inter_server";
import {RoomsManager} from "../../entities/rooms_manager";
import {io} from "../../index";

export const handleStartGame = (event: StartGameEvent) => {
  const {roomId, date} = event;

  console.log(`Starting the game in a Room. ID: ${roomId} | Date: ${date}`)
  const room = RoomsManager.getRoomById(roomId);

  // Give all users random planets
  for (const user of room!.users) {
    while (true) {
      const randomPlanetIndex = Math.floor(Math.random() * room!.map.planets.length);
      const randomPlanet = room!.map.planets[randomPlanetIndex];

      if (randomPlanet.owner !== null)
        continue

      randomPlanet.owner = user;
      io.to(roomId.toString()).emit("PlanetOccupiedEvent", randomPlanet.getOccupiedEvent(null)!);

      console.log(`Gave User ${user.id} a new planet ${randomPlanet.toJSON()} | Room ID: ${roomId}`)

      break;
    }
  }

  room!.startGame();
}
