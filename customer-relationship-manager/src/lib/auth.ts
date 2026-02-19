import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const JWT_SECRET: string = process.env.JWT_SECRET;

export interface JWTPayload{
    id:string;
    role:"USER"|"ADMIN";
}
export function generateToken(payload: JWTPayload) :string{
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d",algorithm:"HS256"});
}

export function verifyToken(token: string):JWTPayload{
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
