import { RedisClientType } from "redis";
import jwt from "jsonwebtoken";
import { Password } from "./password";
import { JWT_KEY } from "../../common/constants";
import { getRdsClient } from "../../db/rdsClient";
import { getUserDetailsKey } from "../../db/redisKeyGen";

export class UserService {
  //   private rdsClient: RedisClientType;
  //   constructor(redisClient: RedisClientType) {
  //     if (!redisClient) throw Error("REDIS CLIENT NOT FOUND");
  //     this.rdsClient = redisClient;
  //   }

  private async createNewUser(emailId: string, pwd: string) {
    const encryptedPwd = await Password.toHash(pwd);
    console.log({ emailId });
    const rds = await getRdsClient();

    rds?.set(
      emailId,
      JSON.stringify({ pwd: encryptedPwd, uuid: await Password.getUUID() })
    );
    rds?.quit();
  }

  private async checkIfEmailExists(emailId: string) {
    const rds = await getRdsClient();
    const userKey = getUserDetailsKey(emailId);
    const emailIdDetails = await rds?.get(userKey);
    rds?.quit();
    return { emailIdDetails, userKey };
  }

  async signUpUser(emailId: string, pwd: string) {
    try {
      const { emailIdDetails, userKey } = await this.checkIfEmailExists(
        emailId
      );
      if (emailIdDetails) {
        throw new Error("Email is already registered.");
      } else {
        this.createNewUser(userKey, pwd);
        const userJWT = jwt.sign(
          {
            currentUser: { emailId },
          },
          JWT_KEY!
        );
        return userJWT;
        // ! to ignore typescript error because we are already taking care of the case
        // where JWT_KEY is not defined in the env vars in our start() in index.ts
      }
    } catch (err) {
      console.log("Error while signing up user", err);
    }
  }

  async signInUser(emailId: string, pwd: string) {
    try {
      const { emailIdDetails } = await this.checkIfEmailExists(emailId);
      if (!emailIdDetails) {
        throw new Error("Email Id is not registered.");
      }
      //verify the password
      const savedPwd = JSON.parse(emailIdDetails).pwd;
      const isPwdMatched = await Password.comparePassword(savedPwd, pwd);
      if (!isPwdMatched) {
        throw new Error("Password is incorrect");
      }
      const userJWT = jwt.sign(
        {
          currentUser: { emailId },
        },
        JWT_KEY!
      );
      return userJWT;
    } catch (err) {
      console.log("Error while signing in", err);
    }
  }
}
