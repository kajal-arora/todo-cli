// installed types/node package to use process -  npm i --save-dev @types/node
enum USER_ACTIONS {
    ADD = '--a',
    EDIT = '--e',
    DELETE = '--d',
    GET_ALL = '--g',
    DONE = '--done'
}

function manageTodoList() {
  let userAction = process.argv[2];
  let userContent = process.argv[3];
  
  switch(userAction) {
    case USER_ACTIONS.ADD: {
        console.log(userAction);
    }
    break;
    case USER_ACTIONS.EDIT: {
        console.log(userAction);
    }
  }
}

manageTodoList();