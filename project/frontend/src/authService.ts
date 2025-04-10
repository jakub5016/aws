import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  type InitiateAuthCommandInput,
  type SignUpCommandInput,
  type ConfirmSignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

const crypto = require("crypto");
const clientSecret = process.env.REACT_APP_CLIENT_SECRET
const clientID = process.env.REACT_APP_CLIENT_ID

export const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});

function getSecretHash(username) {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(`${username}${clientID}`)
    .digest("base64");
}

export const signIn = async (username: string, password: string) => {
  const params: InitiateAuthCommandInput = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.REACT_APP_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: clientSecret ? getSecretHash(username) : ""
    },
  };
  try {
    const command = new InitiateAuthCommand(params);
    const { AuthenticationResult } = await cognitoClient.send(command);
    if (AuthenticationResult) {
      sessionStorage.setItem("idToken", AuthenticationResult.IdToken || "");
      sessionStorage.setItem(
        "accessToken",
        AuthenticationResult.AccessToken || "",
      );
      sessionStorage.setItem(
        "refreshToken",
        AuthenticationResult.RefreshToken || "",
      );
      sessionStorage.setItem(
        "username",
        username,
      );
      return AuthenticationResult;
    }
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  const params: SignUpCommandInput = {
    ClientId: process.env.REACT_APP_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
    SecretHash : clientSecret ? getSecretHash(email) : ""
  };
  try {
    const command = new SignUpCommand(params);
    const response = await cognitoClient.send(command);
    console.log("Sign up success: ", response);
    return response;
  } catch (error) {
    console.error("Error signing up: ", error);
    throw error;
  }
};

export const confirmSignUp = async (username: string, code: string) => {
  const params: ConfirmSignUpCommandInput = {
    ClientId: process.env.REACT_APP_CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
    SecretHash : clientSecret ? getSecretHash(username) : ""
  };
  try {
    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);
    console.log("User confirmed successfully");
    return true;
  } catch (error) {
    console.error("Error confirming sign up: ", error);
    throw error;
  }
};
