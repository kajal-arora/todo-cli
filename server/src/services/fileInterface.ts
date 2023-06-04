export type ToDoItem = {
  id: number;
  activity: string;
  status: Status;
};

type Status = "done" | "pending";

export interface SaveOperations {
  getData(uuid: string): Promise<ToDoItem[]>;
  saveRecord(payload: string, uuid: string): Promise<ToDoItem | null>;
  updateRecord(
    payload: string,
    updateId: number,
    uuid: string
  ): Promise<ToDoItem | null>;
  deleteRecord(recordId: number, uuid: string): Promise<number | null>;
  completeActivity(recordId: number, uuid: string): Promise<ToDoItem | null>;
}
