import { ALLOW, DENY } from "../constants";

export const determineEffect = (password, username) => {
  const localCredentials = process.env[username];
  console.log(`Local Credentials: ${localCredentials}`);
  console.log(`Password: ${password}`);

  return !localCredentials || localCredentials !== password ? DENY : ALLOW;
};
