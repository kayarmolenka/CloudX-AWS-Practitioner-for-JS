import { ProductService } from "../services";
import { logger } from "../config";
import { errorResponse, successfulResponse } from "../utils/responces";
import { ERROR_MESSAGE, HTTP_STATUSES } from "../constants";

export const createProduct = async (event, context) => {
  const productsService = new ProductService();
  try {
    logger.info(
      `Lambda createProduct executing: ${JSON.stringify(event.body)}`
    );

    const { title = "", description = "", price = "" } = JSON.parse(event.body);

    console.log(`Lambda createProduct request: ${JSON.stringify(event, 3)}`);

    console.log(`Lambda createProduct context: ${JSON.stringify(context, 3)}`);

    if (!title || !description || !price) {
      return errorResponse(
        { message: ERROR_MESSAGE.BAD_REQUEST },
        HTTP_STATUSES.BAD_REQUEST_400
      );
    }

    const product = await productsService.createProduct({
      title,
      description,
      price,
    });

    if (product) {
      return successfulResponse(product);
    }
  } catch (error) {
    return errorResponse(error);
  }
};
