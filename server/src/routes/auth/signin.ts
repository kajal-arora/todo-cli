import express, { Request, Response } from "express";
import { body } from "express-validator";
import { UserService } from "../../services/user/userService";

const router = express.Router();
let userService = new UserService();

router.post(
  "/api/user/signin",
  body("email").isEmail().withMessage("Enter a valid email id"),
  body("password")
    .trim()
    .isAlphanumeric()
    .withMessage("Password should be combination of letters and numbers.")
    .isLength({ min: 4, max: 15 })
    .withMessage("Password must be between 4-15 characters."),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await userService.signInUser(email, password);
    if (token) {
      res.status(200).send({ token });
    } else {
      res.status(500).send({ error: "Internal Server Error ....." });
    }
  }
);

export { router as signInRouter };
