import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {User} from "../models/User";
import {AppDataSource} from "../models/data-source";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
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
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
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

