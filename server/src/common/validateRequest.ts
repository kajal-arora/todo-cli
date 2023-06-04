import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "./constants";

type UserPayload = {
  emailId: string;
  uuid: string;
};

// this is how we get into an existing inbuilt
// type definition and make modifications to it
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authToken = req.headers?.authorization;
    console.log("Entered in validate", authToken);
    if (!authToken) {
      return next();
    }
    const token = authToken.split(" ")[1];
    const payload = jwt.verify(token, JWT_KEY!) as UserPayload;
    req.currentUser = payload;
    next();
  } catch (err) {
    res.status(401).send({
      error: "Unauthenticated user",
    });
  }
};
