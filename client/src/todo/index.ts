import axios from "axios";
import { getAuthToken } from "../common/readFile";
import { API_URL } from "../constants";

enum USER_ACTIONS {
  ADD = "--a",
  EDIT = "--e",
  DELETE = "--d",
  GET_ALL = "--g",
  MARK_COMPLETE = "--complete",
}

const headers = async () => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${await getAuthToken()}`,
  };
};

async function manageTodoList() {
  let userAction = process.argv[2];
  let userContent = process.argv[3];

  switch (userAction) {
    case USER_ACTIONS.ADD:
      axios
        .post(
          `${API_URL}/api/item`,
          {
            data: userContent,
          },
          {
            headers: await headers(),
          }
        )
        .then((resp: any) => {
          console.log("Item added successfully");
        })
        .catch((e) => console.log("Error while addoing item", e.message));
      break;

    case USER_ACTIONS.EDIT:
      let idToBeUpdated = process.argv[4];
      axios
        .put(
          `${API_URL}/api/item/${idToBeUpdated}`,
          {
            data: userContent,
          },
          {
            headers: await headers(),
          }
        )
        .then((res) => {
          console.log("Item updated successfully");
        })
        .catch((err) => console.log("Item not found", err.message));

      break;

    case USER_ACTIONS.GET_ALL: {
      axios
        .get(`${API_URL}/api/items`, {
          headers: await headers(),
        })
        .then((res) => {
          console.log("List of items \n", res.data);
        })
        .catch((err) => console.log(err.message));
      break;
    }

    case USER_ACTIONS.DELETE: {
      let idToBeUpdated = process.argv[3];
      axios
        .delete(`${API_URL}/api/item/${idToBeUpdated}`, {
          headers: await headers(),
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((e) => console.log(e.message));
      break;
    }

    case USER_ACTIONS.MARK_COMPLETE: {
      let idToBeUpdated = process.argv[3];
      axios
        .put(
          `${API_URL}/api/item/complete/${idToBeUpdated}`,
          {},
          { headers: await headers() }
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((e) => console.log(e.message));
      break;
    }
  }
}

export { manageTodoList };
