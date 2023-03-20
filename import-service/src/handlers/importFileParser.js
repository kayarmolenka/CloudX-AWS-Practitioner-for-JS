import { S3, SQS } from "aws-sdk";
import { errorResponse, successfulResponse } from "../utils/responses";
import { ERROR_MESSAGE, HTTP_STATUSES, SUCCESS_MESSAGE } from "../constants";
import { ImportService } from "../services";

const s3 = new S3({ region: "eu-west-1", signatureVersion: "v4" });
const sqs = new SQS({ region: "eu-west-1" });

export const importFileParser = async (event) => {
  const importService = new ImportService();
  try {
    const record = event.Records[0];

    const params = {
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key,
    };

    const products = await importService.getProductsFromCSVInS3(s3, params);

    if (products) {
      await Promise.all(
        products.map((product) => importService.sendMessageToSQS(sqs, product))
      );

      await importService.moveParsedFile(s3, params);

      console.log(SUCCESS_MESSAGE.FILE_WAS_MOVED);

      return successfulResponse(products);
    }

    return errorResponse({ message: ERROR_MESSAGE.UNABLE_PARSE_FILE });
  } catch (err) {
    return errorResponse(err, HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
