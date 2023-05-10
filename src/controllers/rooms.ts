import express, { Express, Request, Response } from "express";
import {RoomsManager} from "../entities/rooms_manager";
import {Room} from "../entities/room";

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
  const newRoom: Room = RoomsManager.getManager().addRoom(req.user!);
  return res.json(newRoom);
}


//  Refresh button
const getRooms =  async (req: Request, res: Response) => {
  return res.json(
      RoomsManager.getManager().getRooms()
  );
}

export {
  createNewRoom,
  getRooms
}
