import { mockProducts } from "../mocks";

export class ProductService {
  getAllProducts = async () => {
    return mockProducts;
  };

  getProductById = async (id) => {
    return mockProducts.find((product) => product.id === id);
  };
}
