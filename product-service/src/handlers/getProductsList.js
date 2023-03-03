import { ProductService } from "../services";
import { errorResponse, successfulResponse } from "../utils/responces";
import { logger } from "../config";

export const getProductsList = async (event) => {
  const productsService = new ProductService();
  try {
    logger.info(`Lambda getProductsList request: ${event}`);
    const products = await productsService.getAllProducts();

    if (products) {
      return successfulResponse(products);
    }
  } catch (error) {
    return errorResponse(error);
  }
};
