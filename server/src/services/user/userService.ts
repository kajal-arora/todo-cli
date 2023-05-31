import { RedisClientType } from "redis";
import jwt from "jsonwebtoken";
import { Password } from "./password";

export class UserService {
  private rdsClient: RedisClientType;
  constructor(redisClient: RedisClientType) {
    if (!redisClient) throw Error ('REDIS CLIENT NOT FOUND');
    this.rdsClient = redisClient;
  }

  private createNewUser(emailId: string, pwd: string) {
    const encryptedPwd = Password.toHash(pwd);
    this.rdsClient.set(
      emailId,
      JSON.stringify({ pwd: encryptedPwd, uuid: Password.getUUID() })
    );
  }

  async signUpUser(emailId: string, pwd: string) {
    try {
      const emailIdFound = await this.rdsClient.get(emailId);
      if (emailIdFound) {
        throw new Error("Email is already registered.");
      } else {
        this.createNewUser(emailId, pwd);
        const userJWT = jwt.sign(
          {
            emailId,
          },
          process.env.JWT_KEY!
        );
        return userJWT;
        // ! to ignore typescript error because we are already taking care of the case
        // where JWT_KEY is not defined in the env vars in our start() in index.ts
      }
    } catch (err) {
      console.log("Error while signing up user", err);
    }
  }
}
