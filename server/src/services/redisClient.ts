import { RedisClientType, createClient } from "redis";

class RedisClient{
    redisClient: RedisClientType;
    constructor(url: string) {
        console.log('TODO: use conn string');
        this.redisClient = createClient();
        this.connectWithRedis();
    }

    async connectWithRedis() {
        console.log("Rds class connect");
        await this.redisClient.connect();
    }
}
export const redisClient = (url: string) => new RedisClient(url).redisClient;
// export default new RedisClient().redisClient;
