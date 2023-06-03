import { createClient, RedisClientType } from "redis";
import { REDIS_URI } from "../common/constants";

export async function getRdsClient(): Promise<RedisClientType | null> {
  let client: RedisClientType;
  try {
    client = createClient({
      url: REDIS_URI,
    });
    await client.connect();
    return client;
  } catch (err) {
    console.log("Error while creating redis client", err);
  }
  return null;
}