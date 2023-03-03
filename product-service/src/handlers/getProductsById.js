import { ProductService } from "../services";
import { errorResponse, successfulResponse } from "../utils/responces";
import { ERROR_MESSAGE, HTTP_STATUSES } from "../constants";

export const getProductsById = async (event) => {
  const productsService = new ProductService();
  try {
    const { productId = "" } = event.pathParameters;

    if (!productId) {
      return errorResponse(
        { message: ERROR_MESSAGE.PRODUCT_NOT_FOUND },
        HTTP_STATUSES.NOT_FOUND_404
      );
    }

    const products = await productsService.getProductById(productId);

    if (products) {
      return successfulResponse(products);
    }
  } catch (error) {
    return errorResponse(error);
  }
};
