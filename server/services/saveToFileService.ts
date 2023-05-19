import { SaveOperations, ToDoItem } from "./fileInterface";
import fs, { promises } from "fs";

export class SaveToFileService {
  private file: string;
  constructor(fileName: string) {
    this.file = fileName;
    this.checkIfFileExists();
    console.log('test');
  }

  // this returns all the items except the last new line
  private getItems(data: string): string[]{
    const items = data.split('/n');
    console.log('getItems', { items, length: items.length });
    // for (let i = 0; i < items.length; i ++) {
    //     const item = items[i];
    //     if (item === "\n") {
    //         items.splice(i, 1);
    //     }
    // }
    return items;
  };

  private getNextId(items: string[]): number {
    console.log('getNextId', { items });
    return items.length;
  }
  
  private createItem(id: number, payload: string): string {
    return JSON.stringify({ 
        id,
        activity: payload,
        status: 'pending',
    });
  }
  
  private checkIfFileExists() {
    console.log('checkIfFileExists', this.file);
    fs.open(this.file, "r", (err, f) => {
      if (err) {
        if (err.errno && err.errno === -2) {
          console.log("File not found, creating new...");
          fs.writeFile(this.file, "", (err) => {
            if (err) {
              throw new Error("Error while creating file");
            }
            console.log("File Creted successfully");
          });
          return;
        }
        throw new Error(err.message);
      }
    });
  }

  async getAllRecords(fileName: string) {
    console.log("entered in getall");
    try {
      const content = await promises.readFile(fileName, { encoding: "utf-8" });
      return content;
    } catch (err: unknown) {
      throw new Error((err as { message: string }).message);
    }
  }
  // todo payload
  saveRecord(payload: string): void {
    let content = this.getAllRecords(this.file);
    if (content) {
      content.then((data) => {
        if (payload) {
        let item:string;
          if (!data) {
            item =  this.createItem(
                0,
                payload,
            );
          }
          else {
            console.log('sending dat to get items', data);
            let items = this.getItems(data);
            console.log('got back items without last line', items);
            let id = this.getNextId(items);
            console.log('got new id as', id);
            item = this.createItem(
                id,
                payload,
            );
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
