import { ERROR_MESSAGE } from "../constants";
import csvParser from "csv-parser";

export class ImportService {
  getSignedUrl = async (s3, params) => {
    try {
      const signedUrl = await s3.getSignedUrl("putObject", params);

      console.log(`SignedUrl: ${signedUrl}`);

      return signedUrl;
    } catch (error) {
      throw new Error(`${error}: ${ERROR_MESSAGE.UNABLE_UPLOAD_FILE}`);
    }
  };

  getProductsFromCSVInS3 = async (s3, params) => {
    try {
      const products = [];
      const s3Stream = s3.getObject(params).createReadStream();

      return new Promise((resolve, reject) => {
        s3Stream
          .pipe(csvParser({ separator: ";" }))
          .on("data", console.log)
          .on("end", () => {
            console.log("Stream has ended");
            console.table(products);
            resolve(products);
          })
          .on("error", (error) => {
            console.log(`error from csvParser: ${error}`);
            reject(error);
          });
      });
    } catch (error) {
      throw new Error(`${error}: ${ERROR_MESSAGE.UNABLE_READ_FILE}`);
    }
  };

  moveParsedFile = async (s3, params) => {
    try {
      await s3
        .copyObject({
          Bucket: params.Bucket,
          CopySource: `${params.Bucket}/${params.Key}`,
          Key: params.Key.replace("uploaded", "parsed"),
        })
        .promise();

      await s3
        .deleteObject({
          Bucket: params.Bucket,
          Key: params.Key,
        })
        .promise();

      return true;
    } catch (error) {
      throw new Error(`${error}: ${ERROR_MESSAGE.UNABLE_MOVE_FILE}`);
    }
  };

  sendMessageToSQS = async (sqs, product) => {
    const sentMessage = await sqs
      .sendMessage({
        QueueUrl: process.env.SQS_URL,
        MessageBody: JSON.stringify(product),
      })
      .promise();

    console.log(`SentMessage: ${sentMessage}`);

    return sentMessage;
  };
}
