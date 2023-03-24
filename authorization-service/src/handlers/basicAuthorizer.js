import { determineEffect, errorResponse, generatePolicy } from "../utils";

export const basicAuthorizer = async (event, context, callback) => {
  try {
    console.log(`Lambda basicAuthorizer request: ${JSON.stringify(event, 3)}`);

    const authorizationHeader = event.authorizationToken;
    const credentials = authorizationHeader.split(" ")[1];
    const plainCredentials = Buffer.from(credentials, "base64")
      .toString()
      .split(":");
    const username = plainCredentials[0];
    const password = plainCredentials[1];

    console.log(`Username: ${username}, Password: ${password}`);

    const policy = generatePolicy(
      "user",
      determineEffect(password, username),
      event.methodArn
    );
    console.log(`Policy: ${policy}`);

    callback(null, policy);
  } catch (error) {
    callback(error);
    return errorResponse(error);
  }
};
