import {RoomState, Socket, SocketNextListener} from "../events/base";
import jwt from "jsonwebtoken";
import {AppDataSource} from "../models/data-source";
import {User} from "../models/User";
import {RoomsManager} from "../entities/rooms_manager";

export const roomConnectionJWTMiddleware = async (socket: Socket, next: SocketNextListener) => {
  if (socket.handshake.auth && socket.handshake.auth.token){
    try {
      const decodedToken: any = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET as string);
      const user = await AppDataSource.manager.findOneBy(User, { username: decodedToken.username });

      if (!user) {
        return next(new Error('Authentication error. User does not exist.'))
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error(`Authentication error: ${error}`));
    }
  }
  else {
    next(new Error('Authentication error'));
  }
}

export const roomConnectionMiddleware = (socket: Socket, next: SocketNextListener) => {
  const roomId = socket.handshake.query.roomId;

  if (typeof roomId != "string" || typeof parseInt(roomId) == "undefined") {
    console.log(roomId)
    next(new Error("No Room ID was provided! Add socket.data.roomId please."));
  }

  else {
    socket.data.roomId = parseInt(roomId);
    const room = RoomsManager.getRoomById(socket.data.roomId);

    if (!room){
      next(new Error("Specified room does not exist."));
      return;
    }

    if (room.state != RoomState.Init)
      next(new Error(`You cannot join rooms with state: ${room.state}`));
    else
      next();
  }
}
