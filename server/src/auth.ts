import { auth } from 'express-oauth2-jwt-bearer';
import { Request, Response, NextFunction } from 'express';

// Auth0 JWT verification middleware
export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

// Extend Express Request type to include auth
declare global {
  namespace Express {
    interface Request {
      auth?: {
        payload: {
          sub?: string;
          [key: string]: any;
        };
      };
    }
  }
}

// Optional authentication middleware - doesn't require auth but adds user if present
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next();
  }
  
  return checkJwt(req, res, next);
};

