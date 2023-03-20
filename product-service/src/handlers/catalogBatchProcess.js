import { errorResponse } from "../utils/responces";
import { NotificationService, ProductService } from "../services";
import { SNS } from "aws-sdk";

const sns = new SNS({ region: "eu-west-1" });

export const catalogBatchProcess = async (event) => {
  try {
    const productsService = new ProductService();
    const notificationService = new NotificationService();

    console.log(
      `Lambda catalogBatchProcess request: ${JSON.stringify(event, 3)}`
    );

    const products = event.Records.map((record) => JSON.parse(record.body));

    await Promise.all(
      products.map((product) => productsService.createProduct({ ...product }))
    );

    await Promise.all(
      products.map((product) =>
        notificationService.sendEmailNotification(sns, product, {
          price: { DataType: "Number", StringValue: String(product.price) },
        })
      )
    );
  } catch (error) {
    return errorResponse(error);
  }
};
