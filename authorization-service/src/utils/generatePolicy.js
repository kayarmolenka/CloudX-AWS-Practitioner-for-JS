export const generatePolicy = (principalId, Effect, Resource) => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect,
        Resource,
      },
    ],
  },
});
