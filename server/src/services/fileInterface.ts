import { RedisClientType } from "redis";

export interface ToDoItem {
  id: number;
  activity: string;
  status: Status;
}

type Status = "done" | "pending";

export interface SaveOperations {
  getData(redisClient: RedisClientType): Promise<ToDoItem[]>;
  saveRecord(payload: string,redisClient: RedisClientType): Promise<ToDoItem | null>;
  updateRecord(payload: string, updateId: number, redisClient:RedisClientType): Promise<ToDoItem | null>;
  deleteRecord(recordId: number, redisClient:RedisClientType): Promise<number | null>;
  completeActivity(recordId: number, redisClient:RedisClientType): Promise<ToDoItem| null>;
}
