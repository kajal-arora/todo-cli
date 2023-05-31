import express, { Request, Response } from "express";
import { body } from "express-validator";
import { UserService } from "../../services/user/userService";

import { rds } from '../../db/redisClient';

const router = express.Router();

const userService = new UserService(rds.client);

router.post(
  "/api/users/signup",
  [
    // if any errors are found by express-validator
    // the errors are attached to the request object
    body("email").isEmail().withMessage("Enter a valid email id"),
    body("password")
      .trim()
      .isAlphanumeric()
      .withMessage("Password should be combination of letters and numbers.")
      .isLength({ min: 4, max: 15 })
      .withMessage("Password must be between 4-15 characters."),
  ],
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    //check if user exists
    const token = await userService.signUpUser(email, password);
    if (token) {
      res.status(201).send({ token });
    } else {
      res.status(500).send({ error: 'Internal Server Error .....'});
    }
    // console.log(userJwt);
    // Store it on a cookie session object
    // Cookie session library will take this object,
    // serialize it and send it to the user's browser
    // req.session = {
    //   jwt: userJwt,
    // };
    // Once the user signs up, he/she will get the cookie
    // that would contain the JWT which will be base64 encoded
    
  }
);

export { router as signupRouter };
