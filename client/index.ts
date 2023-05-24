import axios from "axios";
// installed types/node package to use process -  npm i --save-dev @types/node

enum USER_ACTIONS {
  ADD = "--a",
  EDIT = "--e",
  DELETE = "--d",
  GET_ALL = "--g",
  MARK_COMPLETE = "--complete",
}

const API_URL = "http://localhost:8100";

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
              headers: { "Content-Type": "application/json" },
            }
          )
          .then((resp: any) => {
            console.log("Item added successfully");
          });
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
              headers: { "Content-Type": "application/json" },
            }
          )
          .then((res) => {
            console.log("Item updated successfully");
          })
          .catch((err) => console.log("Item not found", err));

        console.log(userAction);
        break;


    case USER_ACTIONS.GET_ALL: {
      axios.get(`${API_URL}/api/items`).then((res) => {
        console.log("List of items \n", res.data);
      });
      break;
    }

    case USER_ACTIONS.DELETE: {
      let idToBeUpdated = process.argv[3];
      axios
        .delete(`${API_URL}/api/item/${idToBeUpdated}`)
        .then((res) => {
          console.log(res.data);
        })
        .catch((e) => console.log(e));
        break;
    }

    case USER_ACTIONS.MARK_COMPLETE: {
      let idToBeUpdated = process.argv[3];
      axios
        .put(`${API_URL}/api/item/complete/${idToBeUpdated}`)
        .then((res) => {
          console.log(res.data);
        })
        .catch((e) => console.log(e));
        break;
    }
  }
}

manageTodoList();
