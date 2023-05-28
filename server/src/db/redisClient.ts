import { RedisClientType, createClient } from "redis";

class RedisClient {
  redisClient: RedisClientType;
  constructor(url: string) {
    console.log({url})
    this.redisClient = createClient({
      url,
    });
    this.connectWithRedis();
  }

  async connectWithRedis() {
    await this.redisClient.connect();
    console.log("Rds connection established");
  }
}
export const redisClient = (url: string) => new RedisClient(url).redisClient;
