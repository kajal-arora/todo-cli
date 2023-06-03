import axios from "axios";

enum USER_LOGIN_CMDS {
  sign_up = "signup",
  sign_in = "login",
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

enum ERRORS {
    /* error codes for process exit */
}

function getEmailAndPassword(): { email: string, password: string } {
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

function handleSignUpUser() {
  const { email, password } = getEmailAndPassword();

  //   const { email, password } = getEmailAndPassword();
  console.log({ email, password });
}

function handleSignInUser() {}

async function manageUserAuthActions() {
  let userAction = process.argv[2];

  switch (userAction) {
    case USER_LOGIN_CMDS.sign_up:
      handleSignUpUser();
      break;
    case USER_LOGIN_CMDS.sign_in:
      handleSignInUser();
      break;
  }
}

export { manageUserAuthActions };
