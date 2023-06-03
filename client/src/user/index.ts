import axios from "axios";

enum USER_LOGIN_CMDS {
  sign_up = "signup",
  sign_in = "login",
}

async function manageUserAuthActions() {
  let userAction = process.argv[2];
  

  switch (userAction) {
    case USER_LOGIN_CMDS.sign_up:
      {
        console.log(process.argv)
      }
      break;
  }
}

export { manageUserAuthActions };
