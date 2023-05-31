import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsAsync = promisify(scrypt);

export class Password {
  static async toHash(pwd: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsAsync(pwd, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  static async comparePassword(storedPwd: string, suppliedPwd: string) {
    const [hashedPwd, salt] = storedPwd.split(".");
    const suplliedPwdBuf = (await scryptAsAsync(
      suppliedPwd,
      salt,
      64
    )) as Buffer;
    return suplliedPwdBuf.toString("hex") === hashedPwd;
  }

  static async getUUID() {
    return crypto.randomUUID();
  }
}
