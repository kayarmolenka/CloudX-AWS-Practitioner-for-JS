import { errorResponse } from "../utils/responces";
import { ProductService } from "../services";

export const catalogBatchProcess = async (event) => {
  try {
    const productsService = new ProductService();

    console.log(
      `Lambda catalogBatchProcess request: ${JSON.stringify(event, 3)}`
    );

    const products = event.Records.map((record) => JSON.parse(record.body));

    await Promise.all(
      products.map((product) => productsService.createProduct({ ...product }))
    );
  } catch (error) {
    return errorResponse(error);
  }
};
