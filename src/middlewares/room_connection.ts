import {Socket, SocketNextListener} from "../events/base";
import jwt from "jsonwebtoken";
import {AppDataSource} from "../models/data-source";
import {User} from "../models/User";
import {disconnectSocketWithError} from "../utils";

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

export const roomConnectionIDMiddleware = (socket: Socket, next: SocketNextListener) => {
  const roomId = socket.handshake.query.roomId;

  if (typeof roomId != "string" || typeof parseInt(roomId) == "undefined") {
    console.log(roomId)
    next(new Error("No Room ID was provided! Add socket.data.roomId please."));
  }

  else {
    socket.data.roomId = parseInt(roomId);
    next();
  }
}
