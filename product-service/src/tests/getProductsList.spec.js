import { getProductsList } from "../handlers/getProductsList";
import { mockProducts } from "../mocks";

describe("getProductsList", () => {
  it("should return list of products", async () => {
    const products = await getProductsList();

    expect(products.body).toEqual(JSON.stringify(mockProducts));
  });
});
