import axios from "axios";
// installed types/node package to use process -  npm i --save-dev @types/node

enum USER_ACTIONS {
  ADD = "--a",
  EDIT = "--e",
  DELETE = "--d",
  GET_ALL = "--g",
  DONE = "--done",
}

const API_URL = "http://localhost:8100";

function manageTodoList() {
  let userAction = process.argv[2];
  let userContent = process.argv[3];

  switch (userAction) {
    case USER_ACTIONS.ADD:
      {
        axios.post(`${API_URL}/api/item`, {
          data: userContent,
        }, {
          headers: {"Content-Type": "application/json"}
        }).then((resp: any) => {
          console.log(resp.data);
        });
        console.log(userAction);
      }
      break;
    case USER_ACTIONS.EDIT:
      {
        console.log(userAction);
      }
      break;
    case USER_ACTIONS.GET_ALL: {
    }
  }
}

manageTodoList();
