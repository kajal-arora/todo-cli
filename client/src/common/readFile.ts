import fs from "fs/promises";
import { FILE_NAME } from "../constants";

export async function getAuthToken() {
  try {
    const token = await fs.readFile(FILE_NAME, { encoding: "utf-8" });
   
    if (token) return token;
    else {
      console.error("User is unauthorised.");
      process.exit(2);
    }
  } catch (err: any) {
    console.error("error in reading auth", err);
  }
}
