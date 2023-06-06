import {StartGameEvent} from "../../events/inter_server";
import {RoomsManager} from "../../entities/rooms_manager";
import {io} from "../../index";

export const handleStartGame = (event: StartGameEvent) => {
  const {roomId, date} = event;

  console.log(`Starting the game in a Room. ID: ${roomId} | Date: ${date}`)
  const room = RoomsManager.getRoomById(roomId);

  if (!room)
    return "This route isn't possible because of the middleware";

  // Give all users random planets
  for (const user of room.users) {
    const randomPlanet = room.map.planets.filter(
      planet => planet.owner === null
    )[0];


    randomPlanet.owner = user;
    console.log(`Gave User ${user.id} a new planet ${randomPlanet.toJSON()} | Room ID: ${roomId}`);

    const planetOccupiedEvent = randomPlanet.getOccupiedEvent(null);
    if(planetOccupiedEvent)
      io.to(roomId.toString()).emit("PlanetOccupiedEvent", planetOccupiedEvent);
  }

  room.startGame();
}
