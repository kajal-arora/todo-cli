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

  private async createNewUser(emailId: string, pwd: string): Promise<string> {
    const encryptedPwd = await Password.toHash(pwd);
    const rds = await getRdsClient();
    const uuid = await Password.getUUID();
    // rds?.set(emailId, JSON.stringify({ pwd: encryptedPwd, uuid }));
    rds?.hSet(emailId, { pwd: encryptedPwd, uuid });
    rds?.quit();
    return uuid;
  }

  private async checkIfEmailExists(emailId: string) {
    const rds = await getRdsClient();
    const userKey = getUserDetailsKey(emailId); //get details linked with email id
    // const emailIdDetails = await rds?.get(userKey);
    const emailIdDetails = await rds?.hGetAll(userKey);
    console.log(emailIdDetails);
    rds?.quit();
    return { emailIdDetails, userKey };
  }

  async signUpUser(emailId: string, pwd: string) {
    try {
      const { emailIdDetails, userKey } = await this.checkIfEmailExists(
        emailId
      );
      // if(emailIdDetails)
      if (emailIdDetails && Object.keys(emailIdDetails).length != 0) {
        throw new Error(`${userKey} Email is already registered.`);
      } else {
        console.log("entered on signup else")
        const uuid = await this.createNewUser(userKey, pwd);
        const userJWT = jwt.sign({ emailId, uuid }, JWT_KEY!);
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
      const { emailIdDetails, userKey } = await this.checkIfEmailExists(
        emailId
      );
      if (!emailIdDetails) {
        throw new Error(`${userKey} Email Id is not registered.`);
      }
      //verify the password
      // const parsedUserDetails = JSON.parse(emailIdDetails);
      const parsedUserDetails = emailIdDetails;
      const isPwdMatched = await Password.comparePassword(
        parsedUserDetails.pwd,
        pwd
      );
      if (!isPwdMatched) {
        throw new Error("Password is incorrect");
      }
      const userJWT = jwt.sign(
        {
          emailId,
          uuid: parsedUserDetails.uuid,
        },
        JWT_KEY!
      );
      return userJWT;
    } catch (err) {
      console.log("Error while signing in", err);
    }
  }
}
