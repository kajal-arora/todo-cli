import { SaveOperations, ToDoItem } from "./fileInterface";
import fs, { promises } from "fs";

export class SaveToFileService {
  private file: string;
  constructor(fileName: string) {
    this.file = fileName;
    this.checkIfFileExists();
  }

  // this returns all the items except the last new line
  private getItems(data: string): string[] {
    const items = data.split("\n");
    items.pop();
    return items;
  }

  private getNextId(items: string[]): number {
    let lastItem = items[items.length - 1];
    try {
      return JSON.parse(lastItem).id + 1;
    } catch (err: unknown) {
      throw new Error((err as { message: string }).message);
    }
  }

  private createItem(id: number, payload: string): string {
    return (
      JSON.stringify({
        id,
        activity: payload,
        status: "pending",
      }) + "\n"
    );
  }

  private checkIfFileExists() {
    fs.open(this.file, "r", (err, f) => {
      if (err) {
        if (err.errno && err.errno === -2) {
          console.log("File not found, creating new...");
          fs.writeFile(this.file, "", (err) => {
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

  async getAllRecords(fileName: string) {
    try {
      const content = await promises.readFile(fileName, { encoding: "utf-8" });
      return content;
    } catch (err: unknown) {
      throw new Error((err as { message: string }).message);
    }
  }

  saveRecord(payload: string): void {
    let content = this.getAllRecords(this.file);
    if (content) {
      content.then((data) => {
        console.log(data);
        if (payload) {
          let item: string;
          if (!data) {
            item = this.createItem(1, payload);
          } else {
            let items = this.getItems(data);
            let id = this.getNextId(items);
            item = this.createItem(id, payload);
          }
          fs.appendFile(this.file, item, (err) => {
            if (err) {
              throw new Error("Error while creating file");
            }
            console.log("adding", item);
          });
        }
      });
    }
  }
}
