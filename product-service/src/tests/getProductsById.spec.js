import { getProductsById } from "../handler";
import { ERROR_MESSAGE } from "../constants";

describe("getProductsById", () => {
  it("should return product with certain id", async () => {
    const mockEvent = {
      pathParameters: { productId: "c2c847b8-12ef-4b96-9ae4-4c8cf77bbd16" },
    };

    const products = await getProductsById(mockEvent);

    expect(products.body).toEqual(
      JSON.stringify({
        id: "c2c847b8-12ef-4b96-9ae4-4c8cf77bbd16",
        description: "74898 Almo Way",
        price: "5.24",
        title: "Zhonggongmiao",
      })
    );
  });

  it("should return product not found when id is not provided", async () => {
    const mockEvent = {
      pathParameters: {},
    };

    const products = await getProductsById(mockEvent);

    expect(products.body).toEqual(
      JSON.stringify({ message: ERROR_MESSAGE.PRODUCT_NOT_FOUND })
    );
  });
});
