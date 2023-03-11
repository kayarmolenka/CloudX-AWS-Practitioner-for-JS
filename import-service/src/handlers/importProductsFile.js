import { S3 } from "aws-sdk";
import { errorResponse, successfulResponse } from "../utils/responses";
import { ERROR_MESSAGE, HTTP_STATUSES, SUCCESS_MESSAGE } from "../constants";
import { ImportService } from "../services";

const s3 = new S3({ region: "eu-west-1", signatureVersion: "v4" });
const BUCKET = "import-products-file-bucket";

export const importProductsFile = async (event) => {
  const importService = new ImportService();
  try {
    const { name = "" } = event.queryStringParameters;

    if (!name) {
      return errorResponse(
        { message: ERROR_MESSAGE.URL_NOT_FOUND },
        HTTP_STATUSES.NOT_FOUND_404
      );
    }

    const params = {
      Bucket: BUCKET,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: "text/csv",
    };

    const signedUrl = await importService.getSignedUrl(s3, params);

    if (signedUrl) {
      console.log(SUCCESS_MESSAGE.FILE_UPLOADED);

      return successfulResponse(signedUrl);
    }
  } catch (err) {
    return errorResponse(err, HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
