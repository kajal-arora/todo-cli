export interface ToDoItem {
  id: number;
  activity: string;
  status: Status;
}

type Status = "done" | "pending";

export interface SaveOperations {
  getAllRecordsFromFile(): Promise<ToDoItem[]>;
  saveRecord(payload: string): Promise<ToDoItem | null>;
  updateRecord(payload: string, updateId: number): Promise<ToDoItem | null>;
  deleteRecord(recordId: number): Promise<number | null>;
  completeActivity(recordId: number): Promise<ToDoItem| null>;
}
