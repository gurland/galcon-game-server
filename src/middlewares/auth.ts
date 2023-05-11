import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {User} from "../models/User";
import {AppDataSource} from "../models/data-source";
import { Socket, SocketNextListener } from "../events/base";

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No Authorization header provided!' });
  }

  const token: string = authHeader.split(' ')[1];

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await AppDataSource.manager.findOneBy(User, { username: decodedToken.username });

    if (!user) {
      return res.status(401).json({ message: 'User does not exist!' });
    }

    req.user = user;
    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(401).json({ message: `Wrong JWT token! ${error}` });
  }
};

export const socketIOJwtAuthMiddleware = async (socket: Socket, next: SocketNextListener) => {
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
