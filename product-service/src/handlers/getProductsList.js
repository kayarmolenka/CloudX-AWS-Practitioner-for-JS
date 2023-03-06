import { ProductService } from "../services";
import { errorResponse, successfulResponse } from "../utils/responces";
import { logger } from "../config";

export const getProductsList = async (event, context) => {
  const productsService = new ProductService();
  try {
    logger.info(`Lambda getProductsList request: ${event}`);

    console.log(`Lambda getProductsList request: ${JSON.stringify(event, 3)}`);

    console.log(
      `Lambda getProductsList context: ${JSON.stringify(context, 3)}`
    );

    const products = await productsService.getAllProducts();

    if (products) {
      return successfulResponse(products);
    }
  } catch (error) {
    return errorResponse(error);
  }
};
