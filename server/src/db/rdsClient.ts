import { createClient, RedisClientType } from "redis";
import { REDIS_HOST, REDIS_PORT, REDIS_PW } from "../common/constants";

export async function getRdsClient(): Promise<RedisClientType | null> {
  let client: RedisClientType;
  try {
    client = createClient({
      socket: {
        host: REDIS_HOST, 
        port: parseInt(REDIS_PORT!),
      },
      // password: REDIS_PWD,
    });
    client.on("error", (err) =>
      console.error("Error on creating redis client", err)
    );
    await client.connect();
    return client;
  } catch (err) {
    console.log("Error while creating redis client", err);
  }
  return null;
}
