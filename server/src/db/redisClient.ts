// import { RedisClientType, createClient } from "redis";

// class Redis {
//   client: RedisClientType;

//   async create(url: string) {
//     this.client = createClient({ url });
//   }

//   async connect() {
//         await this.client.connect();
//         console.log("Rds connection established");
//   }
// }

// export const rds = new Redis();

import { RedisClientType, createClient } from "redis";
import { REDIS_HOST, REDIS_PORT } from "../common/constants";
//not getting use currently
class Redis {
  client: RedisClientType;

  constructor() {
    this.client = createClient({
      socket: {
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT!)
      }
    }); // Initialize the client in the constructor
    this.client.on("error", (err) => console.error("Error on creating redis client", err));
  }

  async connect() {
    await this.client.connect();
    console.log("Redis connection established");
  }
}

const rdsPromise = new Promise<Redis>((resolve, reject) => {
  const rds = new Redis();
  rds.connect()
    .then(() => {
      resolve(rds); // Resolve the promise with the initialized Redis instance
    })
    .catch(reject);
});

export const rds = rdsPromise;
