import { SaveOperations, ToDoItem } from "./fileInterface";
import fs, { promises } from "fs";
import { NotFoundError } from "@karancultor/common";

export class SaveToFileService implements SaveOperations {
  private file: string;
  constructor(fileName: string) {
    this.file = fileName;
    this.checkIfFileExists();
  }

  private getNextId(items: ToDoItem[]): number {
    let lastItem = items[items.length - 1];
    try {
      return lastItem.id + 1;
    } catch (err: unknown) {
      throw new Error((err as { message: string }).message);
    }
  }

  private createItem(id: number, payload: string): ToDoItem {
    const record: ToDoItem = {
      id,
      activity: payload,
      status: "pending",
    };
    return record;
  }

  private checkIfFileExists() {
    fs.open(this.file, "r", (err, f) => {
      if (err) {
        if (err.errno && err.errno === -2) {
          console.log("File not found, creating new...");
          fs.writeFile(this.file, "[]", (err) => {
            if (err) {
              throw new Error("Error while creating file");
            }
            console.log("File created successfully");
          });
          return;
        }
        throw new Error(err.message);
      }
    });
  }

  async getAllRecordsFromFile(): Promise<ToDoItem[]> {
    try {
      const content = await promises.readFile(this.file, { encoding: "utf-8" });
      return JSON.parse(content);
    } catch (err: unknown) {
      throw new Error((err as { message: string }).message);
    }
  }

  // async getParsedRecords() {
  //   let content = await this.getAllRecordsFromFile(this.file);
  //   if (content) {
  //     let items = this.getItems(content);
  //     return items;
  //   }
  // }

  async saveRecord(payload: string): Promise<ToDoItem | null> {
    let fileRecords: ToDoItem[] = await this.getAllRecordsFromFile();
    if (fileRecords) {
      if (payload) {
        let newItem: ToDoItem;
        if (fileRecords.length === 0) {
          newItem = this.createItem(1, payload);
        } else {
          let id = this.getNextId(fileRecords);
          newItem = this.createItem(id, payload);
        }
        fileRecords.push(newItem);
        try {
          promises.writeFile(this.file, JSON.stringify(fileRecords));
          console.log("item saved successfully");
          return newItem;
        } catch (err) {
          console.log("Error while saving file");
          return null;
        }
      }
    }
    return null;
  }

  async updateRecord(
    payload: string,
    updateId: number
  ): Promise<ToDoItem | null> {
    if (!updateId || !payload) return null; // guard
    let content: ToDoItem[] = await this.getAllRecordsFromFile();
    if (content) {
      let foundIndex = content.findIndex(({ id }) => id === updateId);

      // if (foundIndex === -1) throw new CustomError(`${updateId} not found.`); // guard
      if (foundIndex === -1) throw new NotFoundError(); // guard
      content[foundIndex].activity = payload;
      try {
        promises.writeFile(this.file, JSON.stringify(content));
        console.log("Record updated successfully");
        return content[foundIndex];
      } catch (err) {
        console.error(err, "Cannot update item");
        return null;
      }
    }
    return null;
  }

  async deleteRecord(recordId: number): Promise<number | null> {
    if (!recordId) return null;
    let content: ToDoItem[] = await this.getAllRecordsFromFile();
    if (content) {
      let foundIndex = content.findIndex(({ id }) => id === recordId);
      if (foundIndex === -1) throw new NotFoundError(); // guard
      content.splice(foundIndex, 1);
      try {
        promises.writeFile(this.file, JSON.stringify(content));
        console.log("Record deleted successfully");
        return recordId;
      } catch (error) {
        console.error(error, "Cannot delete item");
        return null;
      }
    }
    return null;
  }

  async completeActivity(recordId: number): Promise<ToDoItem | null> {
    if (!recordId) return null; // guard
    let content: ToDoItem[] = await this.getAllRecordsFromFile();
    if (content) {
      let foundIndex = content.findIndex(({ id }) => id === recordId);

      // if (foundIndex === -1) throw new CustomError(`${updateId} not found.`); // guard
      if (foundIndex === -1) throw new NotFoundError(); // guard
      content[foundIndex].status = "done";
      try {
        promises.writeFile(this.file, JSON.stringify(content));
        console.log("File updated successfully as", content[foundIndex]);
        return content[foundIndex];
      } catch (error) {
        console.error(error, "Cannot update item");
        return null;
      }
    }
    return null;
  }
}

class CustomError extends Error {
  public statusCode: number = 500; // default
  constructor(error: Error | unknown, statusCode?: number) {
    super();
    if (statusCode) {
      this.statusCode = statusCode;
    }
    throw Error((error as { message: string }).message);
  }
}
