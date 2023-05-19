export interface ToDoItem {
  id: number;
  activity: string;
  status: "done" | "pending";
}

export interface SaveOperations {
  getAllRecords(): ToDoItem[];
  saveRecord(rec: ToDoItem): void;
  updateRecord(rec: ToDoItem, recordId: number): void;
  deleteRecord(recordId: number): void;
  getRecordByID(recordId: number): ToDoItem;
}
