import axios from "axios";
import { API_URL, FILE_NAME } from "../constants";
import fs from "fs/promises";

enum USER_LOGIN_CMDS {
  sign_up = "signup",
  sign_in = "signin",
  logout = "logout",
}

function getProcessArgValue(
  userArgs: string[],
  matchArg: "--email" | "--password"
): string | null {
  const emailArgIndex = userArgs.indexOf(matchArg);
  for (let i = emailArgIndex + 1; i < userArgs.length; i++) {
    //check if next value exists example --passsword "test" --email
    if (!userArgs[i]) {
      console.error("Please provide username and password.");
      process.exit(1);
    }
    // check if value is present in next arg or is again a parameter. Eg --email --password "test"
    else if (userArgs[i].includes("--")) {
      console.error("Please provide username and password.");
      process.exit(1);
    } else {
      return userArgs[i];
    }
  }
  return null;
}

enum ERRORS {}
/* error codes for process exit */

function getEmailAndPassword(): { email: string; password: string } {
  let email: string, password: string;

  //get args after user action
  const userValues =
    process.argv.slice(process.argv.indexOf(USER_LOGIN_CMDS.sign_up) + 1) ||
    process.argv.slice(process.argv.indexOf(USER_LOGIN_CMDS.sign_in) + 1);

  if (userValues.length === 0) {
    console.error("Email and password not present.");
    process.exit(1);
  }

  email = getProcessArgValue(userValues, "--email")!;
  password = getProcessArgValue(userValues, "--password")!;

  return { email, password };
}

async function handleSignUpUser() {
  const { email, password } = getEmailAndPassword();
  try {
    if (email && password) {
      await axios.post(
        `${API_URL}/api/user/signup`,
        {
          email,
          password,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      await handleSignInUser();
    }
  } catch (err: any) {
    console.error("Error while signing up the user", err.message);
  }
}

async function handleSignInUser() {
  const { email, password } = getEmailAndPassword();
  try {
    const response = await axios.post(
      `${API_URL}/api/user/signin`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );
    if (response.data?.token) {
      //save token in credentials file
      await fs.writeFile(FILE_NAME, response.data?.token);
      console.log("Successfully logged in.");
    }
  } catch (err: any) {
    console.log("Error while sign in the user", err.message);
  }
}

async function handleLogout() {
  await fs.writeFile(FILE_NAME, "");
}

async function manageUserAuthActions() {
  let userAction = process.argv[2];

  switch (userAction) {
    case USER_LOGIN_CMDS.sign_up:
      handleSignUpUser();
      break;
    case USER_LOGIN_CMDS.sign_in:
      handleSignInUser();
      break;
    case USER_LOGIN_CMDS.logout:
      handleLogout();
      break;
  }
}

export { manageUserAuthActions };
