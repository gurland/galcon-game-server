import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtAuthCredentials {
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      jwtAuth?: JwtAuthCredentials;
    }
  }
}

export function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader: string | undefined = req.headers.authorization;

  if (authHeader) {
    const token: string = authHeader.split(' ')[1];

    try {
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET as string);

      req.jwtAuth = {
        username: decodedToken.username
      };
    } catch (error) {
      // Handle token verification errors
      res.sendStatus(401);
      return;
    }
  }

  next();
}
