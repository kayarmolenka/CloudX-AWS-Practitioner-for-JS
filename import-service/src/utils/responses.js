import { ERROR_MESSAGE, HTTP_STATUSES } from "../constants";

const defaultHeaders = {
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
};

export const errorResponse = (
  err,
  statusCode = HTTP_STATUSES.INTERNAL_SERVER_ERROR
) => ({
  statusCode,
  headers: defaultHeaders,
  body: JSON.stringify({
    message: err.message || ERROR_MESSAGE.SOMETHING_WRONG,
  }),
});

export const successfulResponse = (
  body,
  statusCode = HTTP_STATUSES.OK_200
) => ({
  statusCode,
  headers: defaultHeaders,
  body: JSON.stringify(body),
});
