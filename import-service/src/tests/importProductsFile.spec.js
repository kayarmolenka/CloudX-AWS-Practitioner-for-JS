import { importProductsFile } from "../handlers/importProductsFile";
import awsMock from "aws-sdk-mock";
import { errorResponse } from "../utils/responses";
import { ERROR_MESSAGE, HTTP_STATUSES } from "../constants";

describe("importProductsFile", () => {
  const signedUrl = "https://example.com/signed-url";
  const mockGetSignedUrl = jest.fn();
  const mockS3 = {
    getSignedUrl: mockGetSignedUrl,
  };
  const event = {
    queryStringParameters: {
      name: "test.csv",
    },
  };

  beforeEach(() => {
    awsMock.mock("S3", "putObject", () => mockS3);
  });

  afterEach(() => {
    awsMock.restore("S3");
    jest.resetAllMocks();
  });

  it("should return signed URL when called with valid parameters", async () => {
    mockGetSignedUrl.mockImplementationOnce((operation, params, callback) => {
      callback(null, signedUrl);
    });

    const result = await importProductsFile(event);

    expect(result).toEqual({
      statusCode: 200,
      body: expect.stringContaining(
        "https://import-products-file-bucket.s3.eu-west-1.amazonaws.com/uploaded/test.csv?"
      ),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
    });
  });

  it("should return 404 error when called with invalid name parameter", async () => {
    const event = {
      queryStringParameters: {
        name: null,
      },
    };

    const result = await importProductsFile(event);

    expect(mockGetSignedUrl).not.toHaveBeenCalled();
    expect(result).toEqual(
      errorResponse(
        { message: ERROR_MESSAGE.URL_NOT_FOUND },
        HTTP_STATUSES.NOT_FOUND_404
      )
    );
  });
});
