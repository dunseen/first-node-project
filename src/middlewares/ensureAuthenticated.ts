import { Response, Request, NextFunction } from 'express'
import { verify } from 'jsonwebtoken';
import auth from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void{
  const authHeader = request.headers.authorization;

  if(!authHeader){
    throw Error('JWT token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, auth.jwt.secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    }

    return next();

  } catch {
    throw Error('Invalid JWT token')
  }


}
