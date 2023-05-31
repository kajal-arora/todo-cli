import { RedisClientType, createClient } from "redis";

class Redis {
  client: RedisClientType;
//   constructor(url: string) {
//     try {
//       this.redisClient = createClient({
//         url,
//       });
//       this.connectWithRedis();
//     } catch (err) {
//       console.log("Error while creating redis client");
//     }
//   }

  async create(url: string) {
    this.client = createClient({ url });
  }

  async connect() {
        await this.client.connect();
        console.log("Rds connection established");
  }
}
// export const redisClient = (url: string) => new RedisClient(url).redisClient;
export const rds = new Redis();