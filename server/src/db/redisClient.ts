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

class Redis {
  client: RedisClientType;

  constructor() {
    this.client = createClient(); // Initialize the client in the constructor
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
