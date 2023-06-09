import {Request, Response} from "express";
import {RoomsManager} from "../entities/rooms_manager";
import {RoomSettings} from "../entities/room_settings";
import {Room} from "../entities/room";
import {RoomState} from "../events/base";

// Authorization: Bearer JWT_TOKEN

// RoomSpeed =
// RoomResolution


// JWT - My user ID - My User Name

// GET /api/rooms/{roomId}
// getRooms -> Room:
// users: [1, 2, 3, 4]
// ownerId: 3
// client adds "Start game" button

const createNewRoom = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(401).json({"message": "You cant create a room"})

  const {
    settings: {
      planetCount = 10,
      width = 16,
      height = 9,
      minPlanetProduction = 50,
      maxPlanetProduction = 200,
      speed = 0.05,
      distanceOffset = 0.3
    } = {}
  } = req.body;


  const roomSettings = new RoomSettings(
      planetCount,
      width,
      height,
      minPlanetProduction,
      maxPlanetProduction,
      speed,
      distanceOffset
    );

    const newRoom: Room = RoomsManager.getManager().addRoom(req.user, roomSettings);
  return res.json(newRoom);
}


//  Refresh button
const getRooms =  async (req: Request, res: Response) => {
  return res.json(
      RoomsManager.getManager().getRooms().filter(room => room.state==RoomState.Init)
  );
}

const getRoomById =  async (req: Request, res: Response) => {
  return res.json(
      RoomsManager.getManager().getRoomById(parseInt(req.params.roomId))
  );
}


export {
  createNewRoom,
  getRooms,
  getRoomById
}
